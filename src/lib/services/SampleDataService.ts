import { Project } from '../types';
import { Collaborator } from '../types/collaboration';
import { DataService } from './DataService';
import { generateFortune30Partners } from './data/fortune30Partners';
import { generateSampleData } from './data/sampleDataGenerator';

export class SampleDataService implements DataService {
  private db: DataService;

  constructor(db: DataService) {
    this.db = db;
  }

  async init(): Promise<void> {
    await this.db.init();
  }

  async populateSampleData(): Promise<{ projects: Project[] }> {
    const { projects, internalPartners } = generateSampleData();

    // Add collaborators
    for (const collaborator of [...generateFortune30Partners(), ...internalPartners]) {
      await this.db.addCollaborator(collaborator);
    }

    // Add projects with Fortune 30 collaborators
    for (const project of projects) {
      await this.db.addProject(project);
    }

    return { projects };
  }

  async getAllProjects(): Promise<Project[]> {
    return this.db.getAllProjects();
  }

  async getProject(id: string): Promise<Project | undefined> {
    return this.db.getProject(id);
  }

  async addProject(project: Project): Promise<void> {
    return this.db.addProject(project);
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<void> {
    return this.db.updateProject(id, updates);
  }

  async getAllCollaborators(): Promise<Collaborator[]> {
    return this.db.getAllCollaborators();
  }

  async getCollaborator(id: string): Promise<Collaborator | undefined> {
    return this.db.getCollaborator(id);
  }

  async addCollaborator(collaborator: Collaborator): Promise<void> {
    return this.db.addCollaborator(collaborator);
  }

  async exportData(): Promise<void> {
    return this.db.exportData();
  }

  async clear(): Promise<void> {
    return this.db.clear();
  }
}
