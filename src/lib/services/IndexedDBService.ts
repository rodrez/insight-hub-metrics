import { Project, Collaborator } from '../types';
import { SitRep } from '../types/sitrep';
import { SPI } from '../types/spi';
import { Objective } from '../types/objective';
import { DataQuantities } from '../types/data';
import { Team } from '../types/team';
import { DatabaseTransactionService } from './db/DatabaseTransactionService';
import { DatabaseClearingService } from './db/DatabaseClearingService';
import { DataService } from './DataService';
import { SampleDataService } from './data/SampleDataService';
import { BaseIndexedDBService } from './db/base/BaseIndexedDBService';
import { DatabaseOperations } from './db/operations/DatabaseOperations';

export class IndexedDBService extends BaseIndexedDBService implements DataService {
  private sampleDataService: SampleDataService;
  private databaseOperations: DatabaseOperations;

  constructor() {
    super();
    this.sampleDataService = new SampleDataService();
    this.databaseOperations = new DatabaseOperations(new DatabaseTransactionService(super.getDatabase()));
  }

  async init(): Promise<void> {
    await this.initializeServices();
    this.databaseOperations = new DatabaseOperations(new DatabaseTransactionService(super.getDatabase()));
  }

  async clear(): Promise<void> {
    if (!super.getDatabase()) throw new Error('Database not initialized');
    await this.databaseOperations.clearAllData();
  }

  async getAllTeams(): Promise<Team[]> {
    return this.transactionService.performTransaction('teams', 'readonly', store => store.getAll());
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
    await this.transactionService.performTransaction('collaborators', 'readwrite', store => store.put({ ...collaborator, ...updates }));
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

  async getAllSMEPartners(): Promise<Collaborator[]> {
    return this.databaseOperations.getSMEOperations().getAllSMEPartners();
  }

  async getSMEPartner(id: string): Promise<Collaborator | undefined> {
    return this.databaseOperations.getSMEOperations().getSMEPartner(id);
  }

  async addSMEPartner(partner: Collaborator): Promise<void> {
    await this.databaseOperations.getSMEOperations().addSMEPartner(partner);
  }

  async populateSampleData(quantities: DataQuantities): Promise<void> {
    console.log('Starting sample data population...');
    const sampleData = await this.sampleDataService.generateSampleData(quantities);
    
    try {
      // Clear existing data first
      await this.clear();
      
      // Add all data in sequence
      const addPromises = [];

      // Add Fortune 30 and internal partners to collaborators store
      for (const partner of [...sampleData.fortune30Partners, ...sampleData.internalPartners]) {
        addPromises.push(this.addCollaborator(partner));
      }

      // Add SME partners to their dedicated store
      for (const partner of sampleData.smePartners) {
        addPromises.push(this.addSMEPartner({
          ...partner,
          type: 'sme'
        }));
      }

      // Add other data
      for (const project of sampleData.projects) {
        addPromises.push(this.addProject(project));
      }

      for (const spi of sampleData.spis) {
        addPromises.push(this.addSPI(spi));
      }

      for (const objective of sampleData.objectives) {
        addPromises.push(this.addObjective(objective));
      }

      for (const sitrep of sampleData.sitreps) {
        addPromises.push(this.addSitRep(sitrep));
      }

      // Wait for all data to be added
      await Promise.all(addPromises);
      console.log('Data population completed successfully');
    } catch (error) {
      console.error('Error during data population:', error);
      throw error;
    }
  }
}
