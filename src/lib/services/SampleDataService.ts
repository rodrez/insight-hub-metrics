import { Project } from '../types';
import { Collaborator } from '../types/collaboration';
import { DataService } from './DataService';
import { sampleFortune30, getSampleInternalPartners } from '@/components/data/SampleData';
import { generateSampleData } from './data/sampleDataGenerator';
import { generateSampleSPIs, generateSampleSitReps } from './data/spiSitrepGenerator';
import { SitRep } from '../types/sitrep';
import { SPI } from '../types/spi';

export class SampleDataService implements DataService {
  private db: DataService;

  constructor(db: DataService) {
    this.db = db;
  }

  async init(): Promise<void> {
    console.log('Initializing SampleDataService...');
    try {
      await this.db.init();
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  }

  async populateSampleData(): Promise<{ projects: Project[] }> {
    console.log('Starting sample data population...');
    
    try {
      // Get internal partners first
      const internalPartners = await getSampleInternalPartners();
      console.log(`Generated ${internalPartners.length} internal partners`);
      
      // Generate sample data with the resolved internal partners
      const { projects } = generateSampleData(internalPartners);
      console.log(`Generated ${projects.length} projects with internal partners`);

      // Generate SPIs and SitReps
      const spis = generateSampleSPIs();
      const sitreps = generateSampleSitReps(spis.map(spi => spi.id));
      
      // Update SPIs with sitrepIds
      sitreps.forEach(sitrep => {
        const spi = spis.find(s => s.id === sitrep.spiId);
        if (spi) {
          spi.sitrepIds.push(sitrep.id);
        }
      });

      // Clear existing data
      console.log('Clearing existing data...');
      await this.clear();
      await this.init(); // Reinitialize after clear

      // Add internal partners first since they're referenced by projects
      console.log('Adding internal partners...');
      for (const collaborator of internalPartners) {
        try {
          console.log(`Adding internal collaborator: ${collaborator.name}`);
          await this.db.addCollaborator(collaborator);
        } catch (error) {
          console.error(`Failed to add internal collaborator ${collaborator.name}:`, error);
          throw error;
        }
      }

      // Add Fortune 30 partners
      console.log('Adding Fortune 30 partners...');
      for (const collaborator of sampleFortune30) {
        try {
          console.log(`Adding Fortune 30 collaborator: ${collaborator.name}`);
          await this.db.addCollaborator(collaborator);
        } catch (error) {
          console.error(`Failed to add Fortune 30 collaborator ${collaborator.name}:`, error);
          throw error;
        }
      }

      // Add projects
      console.log('Adding projects...');
      for (const project of projects) {
        try {
          console.log(`Adding project: ${project.name}`);
          await this.db.addProject(project);
        } catch (error) {
          console.error(`Failed to add project ${project.name}:`, error);
          throw error;
        }
      }

      // Add SPIs
      console.log('Adding SPIs...');
      for (const spi of spis) {
        try {
          console.log(`Adding SPI: ${spi.name}`);
          await this.db.addSPI(spi);
        } catch (error) {
          console.error(`Failed to add SPI ${spi.name}:`, error);
          throw error;
        }
      }

      // Add SitReps
      console.log('Adding SitReps...');
      for (const sitrep of sitreps) {
        try {
          console.log(`Adding SitRep for SPI: ${sitrep.spiId}`);
          await this.db.addSitRep(sitrep);
        } catch (error) {
          console.error(`Failed to add SitRep for SPI ${sitrep.spiId}:`, error);
          throw error;
        }
      }

      console.log('Sample data population completed successfully');
      return { projects };
    } catch (error) {
      console.error('Failed to populate sample data:', error);
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

  async getAllSitReps(): Promise<SitRep[]> {
    return this.db.getAllSitReps();
  }

  async addSitRep(sitrep: SitRep): Promise<void> {
    return this.db.addSitRep(sitrep);
  }

  async getAllSPIs(): Promise<SPI[]> {
    return this.db.getAllSPIs();
  }

  async getSPI(id: string): Promise<SPI | undefined> {
    return this.db.getSPI(id);
  }

  async addSPI(spi: SPI): Promise<void> {
    return this.db.addSPI(spi);
  }

  async updateSPI(id: string, updates: Partial<SPI>): Promise<void> {
    return this.db.updateSPI(id, updates);
  }

  async exportData(): Promise<void> {
    return this.db.exportData();
  }

  async clear(): Promise<void> {
    console.log('Clearing database in SampleDataService...');
    try {
      await this.db.clear();
      console.log('Database cleared successfully');
    } catch (error) {
      console.error('Failed to clear database:', error);
      throw error;
    }
  }
}