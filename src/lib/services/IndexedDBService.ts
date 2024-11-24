import { Project } from '../types';
import { Collaborator } from '../types/collaboration';
import { DataService } from './DataService';
import { DB_CONFIG, createStores } from './db/stores';
import { TransactionManager } from './db/transactionManager';
import { generateSampleData } from './data/sampleDataGenerator';

export class IndexedDBService implements DataService {
  private db: IDBDatabase | null = null;
  private transactionManager: TransactionManager | null = null;

  async init(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const request = indexedDB.open(DB_CONFIG.name, DB_CONFIG.version);

      request.onerror = () => {
        console.error('Database initialization error:', request.error);
        reject(request.error);
      };
      
      request.onsuccess = () => {
        console.log('IndexedDB initialized successfully');
        this.db = request.result;
        this.transactionManager = new TransactionManager(this.db);
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        createStores(db);
      };
    });
  }

  private ensureInitialized() {
    if (!this.db || !this.transactionManager) {
      throw new Error('Database not initialized');
    }
  }

  async getAllProjects(): Promise<Project[]> {
    this.ensureInitialized();
    return this.transactionManager!.performTransaction('projects', 'readonly', store => store.getAll());
  }

  async getProject(id: string): Promise<Project | undefined> {
    this.ensureInitialized();
    return this.transactionManager!.performTransaction('projects', 'readonly', store => store.get(id));
  }

  async addProject(project: Project): Promise<void> {
    this.ensureInitialized();
    await this.transactionManager!.performTransaction('projects', 'readwrite', store => store.add(project));
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<void> {
    this.ensureInitialized();
    const existingProject = await this.getProject(id);
    if (!existingProject) {
      throw new Error('Project not found');
    }
    await this.transactionManager!.performTransaction('projects', 'readwrite', 
      store => store.put({ ...existingProject, ...updates }));
  }

  async getAllCollaborators(): Promise<Collaborator[]> {
    this.ensureInitialized();
    return this.transactionManager!.performTransaction('collaborators', 'readonly', store => store.getAll());
  }

  async getCollaborator(id: string): Promise<Collaborator | undefined> {
    this.ensureInitialized();
    return this.transactionManager!.performTransaction('collaborators', 'readonly', store => store.get(id));
  }

  async addCollaborator(collaborator: Collaborator): Promise<void> {
    this.ensureInitialized();
    await this.transactionManager!.performTransaction('collaborators', 'readwrite', 
      store => store.add(collaborator));
  }

  async populateSampleData(): Promise<{ projects: Project[] }> {
    this.ensureInitialized();
    const { projects, internalPartners } = generateSampleData();
    
    // Add collaborators in a batch operation
    console.log('Adding collaborators in batch...');
    await this.transactionManager!.batchOperation(internalPartners, 'collaborators', 
      (store, collaborator) => store.add(collaborator));
    
    // Add projects in a batch operation
    console.log('Adding projects in batch...');
    await this.transactionManager!.batchOperation(projects, 'projects',
      (store, project) => store.add(project));
    
    return { projects };
  }

  async exportData(): Promise<void> {
    const projects = await this.getAllProjects();
    const collaborators = await this.getAllCollaborators();
    const data = {
      projects,
      collaborators,
      exportDate: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `project-data-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  async clear(): Promise<void> {
    if (this.db) {
      this.db.close();
    }
    return new Promise<void>((resolve, reject) => {
      const request = indexedDB.deleteDatabase(DB_CONFIG.name);
      request.onerror = () => {
        console.error('Error clearing database:', request.error);
        reject(request.error);
      };
      request.onsuccess = () => {
        console.log('Database cleared successfully');
        this.db = null;
        this.transactionManager = null;
        resolve();
      };
    });
  }
}