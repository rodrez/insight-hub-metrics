import { DatabaseStateManager } from '../initialization/DatabaseStateManager';
import { Project, Collaborator, Team } from '@/lib/types';
import { SitRep } from '@/lib/types/sitrep';
import { SPI } from '@/lib/types/spi';
import { Objective } from '@/lib/types/objective';

export class DatabaseMethods {
  constructor(private stateManager: DatabaseStateManager) {}

  // Project methods
  async getAllProjects(): Promise<Project[]> {
    const db = this.stateManager.getDatabase();
    if (!db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['projects'], 'readonly');
      const store = transaction.objectStore('projects');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(new Error('Failed to fetch projects'));
    });
  }

  async getProject(id: string): Promise<Project | undefined> {
    const db = this.stateManager.getDatabase();
    if (!db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['projects'], 'readonly');
      const store = transaction.objectStore('projects');
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(new Error('Failed to fetch project'));
    });
  }

  async addProject(project: Project): Promise<void> {
    const db = this.stateManager.getDatabase();
    if (!db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['projects'], 'readwrite');
      const store = transaction.objectStore('projects');
      const request = store.put(project);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('Failed to add project'));
    });
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<void> {
    const db = this.stateManager.getDatabase();
    if (!db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['projects'], 'readwrite');
      const store = transaction.objectStore('projects');
      const request = store.get(id);

      request.onsuccess = () => {
        const project = request.result;
        if (!project) {
          return reject(new Error('Project not found'));
        }

        const updatedProject = { ...project, ...updates };
        const updateRequest = store.put(updatedProject);

        updateRequest.onsuccess = () => resolve();
        updateRequest.onerror = () => reject(new Error('Failed to update project'));
      };

      request.onerror = () => reject(new Error('Failed to fetch project'));
    });
  }

  async getAllCollaborators(): Promise<Collaborator[]> {
    const db = this.stateManager.getDatabase();
    if (!db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['collaborators'], 'readonly');
      const store = transaction.objectStore('collaborators');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(new Error('Failed to fetch collaborators'));
    });
  }

  async getCollaborator(id: string): Promise<Collaborator | undefined> {
    const db = this.stateManager.getDatabase();
    if (!db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['collaborators'], 'readonly');
      const store = transaction.objectStore('collaborators');
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(new Error('Failed to fetch collaborator'));
    });
  }

  async addCollaborator(collaborator: Collaborator): Promise<void> {
    const db = this.stateManager.getDatabase();
    if (!db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['collaborators'], 'readwrite');
      const store = transaction.objectStore('collaborators');
      const request = store.put(collaborator);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('Failed to add collaborator'));
    });
  }

  async updateCollaborator(id: string, updates: Partial<Collaborator>): Promise<void> {
    const db = this.stateManager.getDatabase();
    if (!db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['collaborators'], 'readwrite');
      const store = transaction.objectStore('collaborators');
      const request = store.get(id);

      request.onsuccess = () => {
        const collaborator = request.result;
        if (!collaborator) {
          return reject(new Error('Collaborator not found'));
        }

        const updatedCollaborator = { ...collaborator, ...updates };
        const updateRequest = store.put(updatedCollaborator);

        updateRequest.onsuccess = () => resolve();
        updateRequest.onerror = () => reject(new Error('Failed to update collaborator'));
      };

      request.onerror = () => reject(new Error('Failed to fetch collaborator'));
    });
  }

  // SitRep methods
  async getAllSitReps(): Promise<SitRep[]> {
    const db = this.stateManager.getDatabase();
    if (!db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['sitreps'], 'readonly');
      const store = transaction.objectStore('sitreps');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(new Error('Failed to fetch sitreps'));
    });
  }

  async addSitRep(sitrep: SitRep): Promise<void> {
    const db = this.stateManager.getDatabase();
    if (!db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['sitreps'], 'readwrite');
      const store = transaction.objectStore('sitreps');
      const request = store.put(sitrep);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('Failed to add sitrep'));
    });
  }

  // SPI methods
  async getAllSPIs(): Promise<SPI[]> {
    const db = this.stateManager.getDatabase();
    if (!db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['spis'], 'readonly');
      const store = transaction.objectStore('spis');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(new Error('Failed to fetch SPIs'));
    });
  }

  async addSPI(spi: SPI): Promise<void> {
    const db = this.stateManager.getDatabase();
    if (!db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['spis'], 'readwrite');
      const store = transaction.objectStore('spis');
      const request = store.put(spi);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('Failed to add SPI'));
    });
  }

  // Objective methods
  async getAllObjectives(): Promise<Objective[]> {
    const db = this.stateManager.getDatabase();
    if (!db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['objectives'], 'readonly');
      const store = transaction.objectStore('objectives');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(new Error('Failed to fetch objectives'));
    });
  }

  async addObjective(objective: Objective): Promise<void> {
    const db = this.stateManager.getDatabase();
    if (!db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['objectives'], 'readwrite');
      const store = transaction.objectStore('objectives');
      const request = store.put(objective);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('Failed to add objective'));
    });
  }
}
