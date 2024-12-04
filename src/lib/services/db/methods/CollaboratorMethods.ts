import { Collaborator } from '@/lib/types';
import { DatabaseStateManager } from '../initialization/DatabaseStateManager';

export class CollaboratorMethods {
  constructor(private stateManager: DatabaseStateManager) {}

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

    const collaborator = await this.getCollaborator(id);
    if (!collaborator) throw new Error('Collaborator not found');

    const updatedCollaborator = { ...collaborator, ...updates };
    await this.addCollaborator(updatedCollaborator);
  }

  async deleteCollaborator(id: string): Promise<void> {
    const db = this.stateManager.getDatabase();
    if (!db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['collaborators'], 'readwrite');
      const store = transaction.objectStore('collaborators');
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('Failed to delete collaborator'));
    });
  }
}