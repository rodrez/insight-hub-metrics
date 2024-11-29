import { DataService, SampleDataQuantities } from './DataService';
import { Project, Collaborator } from '../types';
import { SitRep } from '../types/sitrep';
import { SPI } from '../types/spi';
import { Objective } from '../types/objective';
import { DatabaseTransactionService } from './db/DatabaseTransactionService';
import { SampleDataService } from './sampleData/SampleDataService';

export class IndexedDBService implements DataService {
  private transactionService: DatabaseTransactionService;
  private sampleDataService: SampleDataService;

  constructor() {
    this.transactionService = new DatabaseTransactionService(null);
    this.sampleDataService = new SampleDataService();
  }

  async init(): Promise<void> {
    await this.transactionService.performTransaction('projects', 'readwrite', store => {
      // Transaction logic to create the project store
      return store;
    });
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

  async updateSitRep(id: string, updates: Partial<SitRep>): Promise<void> {
    const existingSitRep = await this.transactionService.performTransaction<SitRep>(
      'sitreps',
      'readonly',
      store => store.get(id)
    );

    if (!existingSitRep) {
      throw new Error('SitRep not found');
    }

    const updatedSitRep = { ...existingSitRep, ...updates } as SitRep;
    await this.transactionService.performTransaction(
      'sitreps',
      'readwrite',
      store => store.put(updatedSitRep)
    );
  }

  async populateSampleData(quantities: SampleDataQuantities): Promise<void> {
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
  }

  async getAllCollaborators(): Promise<Collaborator[]> {
    return this.transactionService.performTransaction('collaborators', 'readonly', store => store.getAll());
  }

  async addCollaborator(collaborator: Collaborator): Promise<void> {
    return this.transactionService.performTransaction('collaborators', 'readwrite', store => store.put(collaborator));
  }

  async addSMEPartner(partner: Collaborator): Promise<void> {
    return this.transactionService.performTransaction('smePartners', 'readwrite', store => store.put(partner));
  }

  async addSPI(spi: SPI): Promise<void> {
    return this.transactionService.performTransaction('spis', 'readwrite', store => store.put(spi));
  }

  async addObjective(objective: Objective): Promise<void> {
    return this.transactionService.performTransaction('objectives', 'readwrite', store => store.put(objective));
  }

  async addSitRep(sitrep: SitRep): Promise<void> {
    return this.transactionService.performTransaction('sitreps', 'readwrite', store => store.put(sitrep));
  }
}
