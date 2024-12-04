import { Project } from '@/lib/types';
import { DatabaseStateManager } from '../initialization/DatabaseStateManager';

export class ProjectMethods {
  constructor(private stateManager: DatabaseStateManager) {}

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

    const project = await this.getProject(id);
    if (!project) throw new Error('Project not found');

    const updatedProject = { ...project, ...updates };
    await this.addProject(updatedProject);
  }

  async deleteProject(id: string): Promise<void> {
    const db = this.stateManager.getDatabase();
    if (!db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['projects'], 'readwrite');
      const store = transaction.objectStore('projects');
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('Failed to delete project'));
    });
  }
}