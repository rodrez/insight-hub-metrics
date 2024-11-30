import { Project, Collaborator, Team } from '../types';
import { SitRep } from '../types/sitrep';
import { SPI } from '../types/spi';
import { Objective } from '../types/objective';
import { DataService } from './DataService';
import { DataQuantities } from '../types/data';
import { DatabaseTransactionService } from './db/DatabaseTransactionService';
import { DatabaseConnectionService } from './db/DatabaseConnectionService';
import { SampleDataService } from './data/SampleDataService';

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

  async clear(): Promise<void> {
    const db = this.connectionService.getDatabase();
    if (!db) throw new Error('Database not initialized');

    const stores = Array.from(db.objectStoreNames);
    await Promise.all(stores.map(storeName =>
      this.transactionService.performTransaction(storeName, 'readwrite', store => store.clear())
    ));
  }

  async getAllProjects(): Promise<Project[]> {
    return this.transactionService.performTransaction('projects', 'readonly', store => store.getAll());
  }

  async getProject(id: string): Promise<Project | undefined> {
    return this.transactionService.performTransaction('projects', 'readonly', store => store.get(id));
  }

  async addProject(project: Project): Promise<void> {
    await this.transactionService.performTransaction('projects', 'readwrite', store => store.put(project));
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

  async updateCollaborator(id: string, updates: Partial<Collaborator>): Promise<void> {
    const collaborator = await this.getCollaborator(id);
    if (!collaborator) throw new Error('Collaborator not found');
    await this.transactionService.performTransaction('collaborators', 'readwrite', store => 
      store.put({ ...collaborator, ...updates }));
  }

  async getAllSitReps(): Promise<SitRep[]> {
    return this.transactionService.performTransaction('sitreps', 'readonly', store => store.getAll());
  }

  async addSitRep(sitrep: SitRep): Promise<void> {
    await this.transactionService.performTransaction('sitreps', 'readwrite', store => store.put(sitrep));
  }

  async updateSitRep(id: string, updates: Partial<SitRep>): Promise<void> {
    const sitrep = await this.transactionService.performTransaction('sitreps', 'readonly', store => store.get(id));
    if (!sitrep) throw new Error('SitRep not found');
    await this.transactionService.performTransaction('sitreps', 'readwrite', store => 
      store.put({ ...sitrep, ...updates }));
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
    const objective = await this.transactionService.performTransaction('objectives', 'readonly', store => store.get(id));
    if (!objective) throw new Error('Objective not found');
    await this.transactionService.performTransaction('objectives', 'readwrite', store => 
      store.put({ ...objective, ...updates }));
  }

  async deleteObjective(id: string): Promise<void> {
    await this.transactionService.performTransaction('objectives', 'readwrite', store => store.delete(id));
  }

  async exportData(): Promise<void> {
    // Implementation for data export
    console.log('Data export not implemented');
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

  async populateSampleData(quantities: DataQuantities): Promise<void> {
    const sampleData = await this.sampleDataService.generateSampleData(quantities);
    
    // Add all data in sequence
    for (const partner of sampleData.fortune30Partners) {
      await this.addCollaborator(partner);
    }

    for (const partner of sampleData.internalPartners) {
      await this.addCollaborator(partner);
    }

    for (const partner of sampleData.smePartners) {
      await this.addSMEPartner(partner);
    }

    for (const project of sampleData.projects) {
      await this.addProject(project);
    }

    for (const spi of sampleData.spis) {
      await this.addSPI(spi);
    }

    for (const objective of sampleData.objectives) {
      await this.addObjective(objective);
    }

    for (const sitrep of sampleData.sitreps) {
      await this.addSitRep(sitrep);
    }
  }
}
