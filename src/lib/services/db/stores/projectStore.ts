import { Project } from "@/lib/types";

export class ProjectStore {
  constructor(private db: IDBDatabase) {}

  async getAllProjects(): Promise<Project[]> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction('projects', 'readonly');
      const store = transaction.objectStore('projects');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getProject(id: string): Promise<Project | undefined> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction('projects', 'readonly');
      const store = transaction.objectStore('projects');
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async addProject(project: Project): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction('projects', 'readwrite');
      const store = transaction.objectStore('projects');
      const request = store.put(project);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<void> {
    const project = await this.getProject(id);
    if (!project) {
      throw new Error('Project not found');
    }

    return this.addProject({ ...project, ...updates });
  }
}