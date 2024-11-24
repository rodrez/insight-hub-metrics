import { Project } from '../types';
import { Collaborator } from '../types/collaboration';
import { DataService } from './DataService';
import { generateSampleData } from './data/sampleDataGenerator';

const DB_NAME = 'projectManagementDB';
const DB_VERSION = 1;

export class IndexedDBService implements DataService {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        console.error('Database initialization error:', request.error);
        reject(request.error);
      };
      
      request.onsuccess = () => {
        console.log('IndexedDB initialized successfully');
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        if (!db.objectStoreNames.contains('projects')) {
          console.log('Creating projects store');
          db.createObjectStore('projects', { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains('collaborators')) {
          console.log('Creating collaborators store');
          db.createObjectStore('collaborators', { keyPath: 'id' });
        }
      };
    });
  }

  private async performTransaction<T>(
    storeName: string,
    mode: IDBTransactionMode,
    operation: (store: IDBObjectStore) => IDBRequest | Promise<T>
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        console.error('Database not initialized');
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(storeName, mode);
      const store = transaction.objectStore(storeName);

      transaction.onerror = () => {
        console.error(`Transaction error on ${storeName}:`, transaction.error);
        reject(transaction.error);
      };

      try {
        const request = operation(store);
        
        if (request instanceof Promise) {
          request.then(resolve).catch(reject);
        } else {
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => {
            console.error(`Operation error on ${storeName}:`, request.error);
            reject(request.error);
          };
        }
      } catch (error) {
        console.error(`Error in ${storeName} operation:`, error);
        reject(error);
      }
    });
  }

  async getAllProjects(): Promise<Project[]> {
    console.log('Getting all projects');
    return this.performTransaction('projects', 'readonly', store => {
      return store.getAll();
    });
  }

  async getProject(id: string): Promise<Project | undefined> {
    console.log(`Getting project: ${id}`);
    return this.performTransaction('projects', 'readonly', store => {
      return store.get(id);
    });
  }

  async addProject(project: Project): Promise<void> {
    console.log(`Adding project: ${project.id}`);
    await this.performTransaction('projects', 'readwrite', store => {
      return store.add(project);
    });
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<void> {
    console.log(`Updating project: ${id}`);
    await this.performTransaction('projects', 'readwrite', async store => {
      const existingProject = await this.getProject(id);
      if (!existingProject) {
        throw new Error('Project not found');
      }
      return store.put({ ...existingProject, ...updates });
    });
  }

  async getAllCollaborators(): Promise<Collaborator[]> {
    console.log('Getting all collaborators');
    return this.performTransaction('collaborators', 'readonly', store => {
      return store.getAll();
    });
  }

  async getCollaborator(id: string): Promise<Collaborator | undefined> {
    console.log(`Getting collaborator: ${id}`);
    return this.performTransaction('collaborators', 'readonly', store => {
      return store.get(id);
    });
  }

  async addCollaborator(collaborator: Collaborator): Promise<void> {
    console.log(`Adding collaborator: ${collaborator.id}`);
    await this.performTransaction('collaborators', 'readwrite', store => {
      return store.add(collaborator);
    });
  }

  async exportData(): Promise<void> {
    console.log('Exporting data');
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
    console.log('Clearing database');
    return new Promise<void>((resolve, reject) => {
      if (this.db) {
        this.db.close();
      }
      const request = indexedDB.deleteDatabase(DB_NAME);
      request.onerror = () => {
        console.error('Error clearing database:', request.error);
        reject(request.error);
      };
      request.onsuccess = () => {
        console.log('Database cleared successfully');
        this.db = null;
        resolve();
      };
    });
  }

  async populateSampleData(): Promise<{ projects: Project[] }> {
    console.log('Populating sample data');
    const { projects, internalPartners } = generateSampleData();
    
    // Use a single transaction for all operations
    const transaction = this.db?.transaction(['projects', 'collaborators'], 'readwrite');
    if (!transaction) {
      throw new Error('Failed to create transaction');
    }

    try {
      const projectStore = transaction.objectStore('projects');
      const collaboratorStore = transaction.objectStore('collaborators');

      // Add all projects
      for (const project of projects) {
        await new Promise((resolve, reject) => {
          const request = projectStore.add(project);
          request.onsuccess = () => resolve(undefined);
          request.onerror = () => reject(request.error);
        });
      }

      // Add all collaborators
      for (const collaborator of internalPartners) {
        await new Promise((resolve, reject) => {
          const request = collaboratorStore.add(collaborator);
          request.onsuccess = () => resolve(undefined);
          request.onerror = () => reject(request.error);
        });
      }

      return { projects };
    } catch (error) {
      console.error('Error in populateSampleData:', error);
      throw error;
    }
  }
}