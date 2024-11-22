import { Project } from '../types';
import { Collaborator } from '../types/collaboration';
import { DataService } from './DataService';

const DB_NAME = 'projectManagementDB';
const DB_VERSION = 1;

export class IndexedDBService implements DataService {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        if (!db.objectStoreNames.contains('projects')) {
          db.createObjectStore('projects', { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains('collaborators')) {
          db.createObjectStore('collaborators', { keyPath: 'id' });
        }
      };
    });
  }

  private async performTransaction<T>(
    storeName: string,
    mode: IDBTransactionMode,
    operation: (store: IDBObjectStore) => T | Promise<T>
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(storeName, mode);
      const store = transaction.objectStore(storeName);

      try {
        const result = operation(store);
        if (result instanceof Promise) {
          result.then(resolve).catch(reject);
        } else {
          transaction.oncomplete = () => resolve(result);
        }
        transaction.onerror = () => reject(transaction.error);
      } catch (error) {
        reject(error);
      }
    });
  }

  async getAllProjects(): Promise<Project[]> {
    return this.performTransaction('projects', 'readonly', store => {
      return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    });
  }

  async getProject(id: string): Promise<Project | undefined> {
    return this.performTransaction('projects', 'readonly', store => {
      return new Promise((resolve, reject) => {
        const request = store.get(id);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    });
  }

  async addProject(project: Project): Promise<void> {
    return this.performTransaction('projects', 'readwrite', store => {
      store.add(project);
    });
  }

  async getAllCollaborators(): Promise<Collaborator[]> {
    return this.performTransaction('collaborators', 'readonly', store => {
      return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    });
  }

  async getCollaborator(id: string): Promise<Collaborator | undefined> {
    return this.performTransaction('collaborators', 'readonly', store => {
      return new Promise((resolve, reject) => {
        const request = store.get(id);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    });
  }

  async addCollaborator(collaborator: Collaborator): Promise<void> {
    return this.performTransaction('collaborators', 'readwrite', store => {
      store.add(collaborator);
    });
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
    return new Promise<void>((resolve, reject) => {
      const request = indexedDB.deleteDatabase(DB_NAME);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = null;
        resolve();
      };
    });
  }
}