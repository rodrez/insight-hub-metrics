import { DataService, SampleDataQuantities } from './DataService';
import { Project, Collaborator, Team } from '../types';
import { SitRep } from '../types/sitrep';
import { SPI } from '../types/spi';
import { Objective } from '../types/objective';
import { DatabaseConnectionService } from './db/DatabaseConnectionService';
import { DatabaseTransactionService } from './db/DatabaseTransactionService';
import { DB_CONFIG } from './stores';
import { SampleDataService } from './sampleData/SampleDataService';

export class IndexedDBService implements DataService {
  private connectionService: DatabaseConnectionService;
  private transactionService: DatabaseTransactionService;
  private sampleDataService: SampleDataService;

  constructor() {
    this.connectionService = new DatabaseConnectionService();
    this.transactionService = new DatabaseTransactionService(null);
    this.sampleDataService = new SampleDataService();
  }

  async init(): Promise<void> {
    await this.connectionService.init();
    this.transactionService = new DatabaseTransactionService(this.connectionService.getDatabase());
  }

  async getAllProjects(): Promise<Project[]> {
    return this.transactionService.performTransaction('projects', 'readonly', store => store.getAll());
  }

  async getProject(id: string): Promise<Project | undefined> {
    return this.transactionService.performTransaction('projects', 'readonly', store => store.get(id));
  }

  async addProject(project: Project): Promise<void> {
    return this.transactionService.performTransaction('projects', 'readwrite', store => store.put(project));
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<void> {
    const project = await this.getProject(id);
    if (!project) throw new Error('Project not found');
    await this.addProject({ ...project, ...updates });
  }

  async getAllCollaborators(): Promise<Collaborator[]> {
    return this.transactionService.performTransaction('collaborators', 'readonly', store => store.getAll());
  }

  async getCollaborator(id: string): Promise<Collaborator | undefined> {
    return this.transactionService.performTransaction('collaborators', 'readonly', store => store.get(id));
  }

  async addCollaborator(collaborator: Collaborator): Promise<void> {
    await this.transactionService.performTransaction('collaborators', 'readwrite', store => store.put(collaborator));
  }

  async getAllSitReps(): Promise<SitRep[]> {
    return this.transactionService.performTransaction('sitreps', 'readonly', store => store.getAll());
  }

  async addSitRep(sitrep: SitRep): Promise<void> {
    await this.transactionService.performTransaction('sitreps', 'readwrite', store => store.put(sitrep));
  }

  async getAllSPIs(): Promise<SPI[]> {
    return this.transactionService.performTransaction('spis', 'readonly', store => store.getAll());
  }

  async getSPI(id: string): Promise<SPI | undefined> {
    return this.transactionService.performTransaction('spis', 'readonly', store => store.get(id));
  }

  async addSPI(spi: SPI): Promise<void> {
    await this.transactionService.performTransaction('spis', 'readwrite', store => store.put(spi));
  }

  async updateSPI(id: string, updates: Partial<SPI>): Promise<void> {
    const spi = await this.getSPI(id);
    if (!spi) throw new Error('SPI not found');
    await this.addSPI({ ...spi, ...updates });
  }

  async deleteSPI(id: string): Promise<void> {
    await this.transactionService.performTransaction('spis', 'readwrite', store => store.delete(id));
  }

  async getAllObjectives(): Promise<Objective[]> {
    return this.transactionService.performTransaction('objectives', 'readonly', store => store.getAll());
  }

  async addObjective(objective: Objective): Promise<void> {
    await this.transactionService.performTransaction('objectives', 'readwrite', store => store.put(objective));
  }

  async updateObjective(id: string, updates: Partial<Objective>): Promise<void> {
    const objective = await this.getObjective(id);
    if (!objective) throw new Error('Objective not found');
    await this.addObjective({ ...objective, ...updates });
  }

  private async getObjective(id: string): Promise<Objective | undefined> {
    return this.transactionService.performTransaction('objectives', 'readonly', store => store.get(id));
  }

  async getAllTeams(): Promise<Team[]> {
    return this.transactionService.performTransaction('teams', 'readonly', store => store.getAll());
  }

  async getAllSMEPartners(): Promise<Collaborator[]> {
    return this.transactionService.performTransaction('smePartners', 'readonly', store => store.getAll());
  }

  async getSMEPartner(id: string): Promise<Collaborator | undefined> {
    return this.transactionService.performTransaction('smePartners', 'readonly', store => store.get(id));
  }

  async addSMEPartner(partner: Collaborator): Promise<void> {
    await this.transactionService.performTransaction('smePartners', 'readwrite', store => store.put(partner));
  }

  async populateSampleData(quantities: SampleDataQuantities): Promise<void> {
    try {
      const {
        fortune30Partners,
        internalPartners,
        smePartners,
        projects,
        spis,
        objectives,
        sitreps
      } = await this.sampleDataService.generateSampleData(quantities);

      // Add all data in sequence
      for (const partner of fortune30Partners) {
        await this.addCollaborator(partner);
      }

      for (const partner of internalPartners) {
        await this.addCollaborator(partner);
      }

      for (const partner of smePartners) {
        await this.addSMEPartner(partner);
      }

      for (const project of projects) {
        await this.addProject(project);
      }

      for (const spi of spis) {
        await this.addSPI(spi);
      }

      for (const objective of objectives) {
        await this.addObjective(objective);
      }

      for (const sitrep of sitreps) {
        await this.addSitRep(sitrep);
      }
    } catch (error) {
      console.error('Error populating sample data:', error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    this.connectionService.close();
    const request = indexedDB.deleteDatabase(DB_CONFIG.name);
    
    await new Promise<void>((resolve, reject) => {
      request.onerror = () => reject(new Error('Failed to clear database'));
      request.onsuccess = () => resolve();
    });
  }

  async exportData(): Promise<void> {
    const data = {
      projects: await this.getAllProjects(),
      collaborators: await this.getAllCollaborators(),
      objectives: await this.getAllObjectives(),
      sitreps: await this.getAllSitReps(),
      spis: await this.getAllSPIs()
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
}
