import { Project } from '../../types';
import { BaseDBService } from './base/BaseDBService';
import { ProjectStore } from './stores/projectStore';

export class ProjectService extends BaseDBService {
  private projectStore: ProjectStore | null = null;

  constructor(db: IDBDatabase | null) {
    super();
    if (db) {
      this.db = db;
      this.projectStore = new ProjectStore(db);
    }
  }

  setDatabase(db: IDBDatabase) {
    this.db = db;
    this.projectStore = new ProjectStore(db);
  }

  async getAllProjects(): Promise<Project[]> {
    this.ensureInitialized();
    return this.projectStore!.getAllProjects();
  }

  async getProject(id: string): Promise<Project | undefined> {
    this.ensureInitialized();
    return this.projectStore!.getProject(id);
  }

  async addProject(project: Project): Promise<void> {
    this.ensureInitialized();
    return this.projectStore!.addProject(project);
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<void> {
    this.ensureInitialized();
    return this.projectStore!.updateProject(id, updates);
  }
}