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
    console.log('Initializing SampleDataService...');
    await this.db.init();
    console.log('SampleDataService initialized successfully');
  }

  async populateSampleData(): Promise<{ projects: Project[] }> {
    console.log('Starting sample data generation in SampleDataService...');
    const { projects, internalPartners } = generateSampleData();
    console.log(`Generated ${projects.length} projects and ${internalPartners.length} internal partners`);

    try {
      // Clear existing data first
      await this.clear();
      
      // Add collaborators
      console.log('Adding Fortune 30 partners...');
      const fortune30Partners = generateFortune30Partners();
      for (const collaborator of fortune30Partners) {
        await this.db.addCollaborator(collaborator);
      }

      console.log('Adding internal partners...');
      for (const collaborator of internalPartners) {
        await this.db.addCollaborator(collaborator);
      }

      // Add projects
      console.log('Adding projects...');
      for (const project of projects) {
        await this.db.addProject(project);
      }

      console.log('Sample data population completed successfully');
      return { projects };
    } catch (error) {
      console.error('Error in SampleDataService.populateSampleData:', error);
      throw error;
    }
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
    console.log('Clearing database in SampleDataService...');
    return this.db.clear();
  }
}