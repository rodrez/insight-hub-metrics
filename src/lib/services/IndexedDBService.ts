import { Project } from '../types';
import { Collaborator } from '../types/collaboration';
import { DataService } from './DataService';
import { DB_CONFIG, createStores } from './db/stores';
import { TransactionManager } from './db/transactionManager';
import { generateSampleData } from './data/sampleDataGenerator';
import { connectionManager } from './db/connectionManager';
import { DatabaseCleaner } from './db/databaseCleaner';

export class IndexedDBService implements DataService {
  private db: IDBDatabase | null = null;
  private transactionManager: TransactionManager | null = null;

  async init(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const request = indexedDB.open(DB_CONFIG.name, DB_CONFIG.version);

      request.onerror = () => {
        const error = request.error?.message || 'Unknown error during initialization';
        console.error('Database initialization error:', error);
        reject(new Error(error));
      };
      
      request.onsuccess = () => {
        console.log('IndexedDB initialized successfully');
        this.db = request.result;
        connectionManager.addConnection(this.db);
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

  async clear(): Promise<void> {
    console.log('Starting database clear...');
    
    if (this.db) {
      connectionManager.closeAllConnections();
      this.db = null;
      this.transactionManager = null;
    }

    await DatabaseCleaner.clearDatabase(DB_CONFIG.name);
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
    try {
      await this.transactionManager!.performTransaction('projects', 'readwrite', store => {
        const request = store.add(project);
        return request;
      });
      console.log(`Project ${project.id} added successfully`);
    } catch (error) {
      console.error(`Error adding project ${project.id}:`, error);
      throw error;
    }
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
    const collaborators = await this.transactionManager!.performTransaction('collaborators', 'readonly', store => store.getAll());
    const projects = await this.getAllProjects();
    
    // Update collaborator projects with full project data
    return collaborators.map(collaborator => ({
      ...collaborator,
      projects: collaborator.projects.map(colProj => {
        const fullProject = projects.find(p => p.id === colProj.id);
        return {
          ...colProj,
          nabc: fullProject?.nabc,
          status: fullProject?.status
        };
      })
    }));
  }

  async getCollaborator(id: string): Promise<Collaborator | undefined> {
    this.ensureInitialized();
    const collaborator = await this.transactionManager!.performTransaction('collaborators', 'readonly', store => store.get(id));
    if (!collaborator) return undefined;
    
    const projects = await this.getAllProjects();
    return {
      ...collaborator,
      projects: collaborator.projects.map(colProj => {
        const fullProject = projects.find(p => p.id === colProj.id);
        return {
          ...colProj,
          nabc: fullProject?.nabc,
          status: fullProject?.status
        };
      })
    };
  }

  async addCollaborator(collaborator: Collaborator): Promise<void> {
    this.ensureInitialized();
    try {
      await this.transactionManager!.performTransaction('collaborators', 'readwrite', store => {
        const request = store.add({ ...collaborator });
        return request;
      });
      console.log(`Collaborator ${collaborator.name} added successfully`);
    } catch (error) {
      console.error(`Error adding collaborator ${collaborator.name}:`, error);
      throw error;
    }
  }

  async populateSampleData(): Promise<{ projects: Project[] }> {
    this.ensureInitialized();
    const { projects, internalPartners } = generateSampleData();
    
    try {
      // Add collaborators one by one to better track errors
      console.log('Adding collaborators...');
      for (const collaborator of internalPartners) {
        try {
          console.log(`Adding internal collaborator: ${collaborator.name}`);
          await this.addCollaborator(collaborator);
        } catch (error) {
          console.error(`Failed to add collaborator ${collaborator.name}:`, error);
          throw error;
        }
      }
      
      // Add projects one by one to better track errors
      console.log('Adding projects...');
      for (const project of projects) {
        try {
          console.log(`Adding project: ${project.name}`);
          await this.addProject(project);
        } catch (error) {
          console.error(`Failed to add project ${project.name}:`, error);
          throw error;
        }
      }
      
      return { projects };
    } catch (error) {
      console.error('Sample data population error:', error);
      throw error;
    }
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
}