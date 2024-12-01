import { DataService, ExportedData } from './DataService';
import { Project, Collaborator } from '../types';
import { SPI } from '../types/spi';
import { Objective } from '../types/objective';
import { SitRep } from '../types/sitrep';
import { BaseIndexedDBService } from './db/base/BaseIndexedDBService';
import { ProjectService } from './db/ProjectService';
import { CollaboratorService } from './db/CollaboratorService';
import { SitRepService } from './db/SitRepService';
import { SPIService } from './db/SPIService';
import { SMEService } from './db/SMEService';
import { SPIOperations } from './db/SPIOperations';
import { DataExportService } from './db/operations/DataExportService';
import { DatabaseClearingService } from './db/operations/DatabaseClearingService';
import { ServiceInitializationManager } from './db/initialization/ServiceInitializationManager';
import { InitializationQueue } from './db/initialization/InitializationQueue';

export class IndexedDBService extends BaseIndexedDBService implements DataService {
  private static instance: IndexedDBService | null = null;
  private projectService: ProjectService;
  private collaboratorService: CollaboratorService;
  private sitRepService: SitRepService;
  private spiService: SPIService;
  private smeService: SMEService;
  private spiOperations: SPIOperations;
  private dataExportService: DataExportService;
  private databaseClearingService: DatabaseClearingService;
  private initManager: ServiceInitializationManager;
  private initQueue: InitializationQueue;

  private constructor() {
    super();
    this.projectService = new ProjectService();
    this.collaboratorService = new CollaboratorService();
    this.sitRepService = new SitRepService();
    this.spiService = new SPIService();
    this.smeService = new SMEService();
    this.spiOperations = new SPIOperations();
    this.initManager = ServiceInitializationManager.getInstance();
    this.dataExportService = new DataExportService(this);
    this.databaseClearingService = new DatabaseClearingService(this.getDatabase(), this.initManager);
    this.initQueue = new InitializationQueue();
  }

  public static getInstance(): IndexedDBService {
    if (!IndexedDBService.instance) {
      IndexedDBService.instance = new IndexedDBService();
    }
    return IndexedDBService.instance;
  }

  public async init(): Promise<void> {
    try {
      await super.init();
      await this.initializeServices();
    } catch (error) {
      console.error('Failed to initialize IndexedDB Service:', error);
      throw error;
    }
  }

  private async initializeServices(): Promise<void> {
    const db = this.getDatabase();
    if (!db) throw new Error('Database not initialized');

    this.projectService.setDatabase(db);
    this.collaboratorService.setDatabase(db);
    this.sitRepService.setDatabase(db);
    this.spiService.setDatabase(db);
    this.smeService.setDatabase(db);
    this.spiOperations.setDatabase(db);
  }

  // Implement required DataService methods
  async getAllProjects(): Promise<Project[]> {
    return this.projectService.getAllProjects();
  }

  async getProject(id: string): Promise<Project | null> {
    return this.projectService.getProject(id);
  }

  async addProject(project: Project): Promise<void> {
    return this.projectService.addProject(project);
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<void> {
    return this.projectService.updateProject(id, updates);
  }

  async getAllCollaborators(): Promise<Collaborator[]> {
    return this.collaboratorService.getAllCollaborators();
  }

  async getCollaborator(id: string): Promise<Collaborator | null> {
    return this.collaboratorService.getCollaborator(id);
  }

  async addCollaborator(collaborator: Collaborator): Promise<void> {
    return this.collaboratorService.addCollaborator(collaborator);
  }

  async updateCollaborator(id: string, updates: Partial<Collaborator>): Promise<void> {
    return this.collaboratorService.updateCollaborator(id, updates);
  }

  async getAllSitReps(): Promise<SitRep[]> {
    return this.sitRepService.getAllSitReps();
  }

  async addSitRep(sitrep: SitRep): Promise<void> {
    return this.sitRepService.addSitRep(sitrep);
  }

  async updateSitRep(id: string, updates: Partial<SitRep>): Promise<void> {
    return this.sitRepService.updateSitRep(id, updates);
  }

  async getAllSPIs(): Promise<SPI[]> {
    return this.spiService.getAllSPIs();
  }

  async getSPI(id: string): Promise<SPI | null> {
    return this.spiService.getSPI(id);
  }

  async addSPI(spi: SPI): Promise<void> {
    return this.spiService.addSPI(spi);
  }

  async updateSPI(id: string, updates: Partial<SPI>): Promise<void> {
    return this.spiService.updateSPI(id, updates);
  }

  async deleteSPI(id: string): Promise<void> {
    return this.spiOperations.deleteSPI(id);
  }

  async getAllObjectives(): Promise<Objective[]> {
    return this.spiService.getAllObjectives();
  }

  async addObjective(objective: Objective): Promise<void> {
    return this.spiService.addObjective(objective);
  }

  async updateObjective(id: string, updates: Partial<Objective>): Promise<void> {
    return this.spiService.updateObjective(id, updates);
  }

  async deleteObjective(id: string): Promise<void> {
    return this.spiService.deleteObjective(id);
  }

  async clear(): Promise<void> {
    return this.databaseClearingService.clearDatabase();
  }

  async exportData(): Promise<ExportedData> {
    return this.dataExportService.exportData();
  }

  async getAllSMEPartners(): Promise<Collaborator[]> {
    return this.smeService.getAllSMEPartners();
  }

  async getSMEPartner(id: string): Promise<Collaborator | undefined> {
    return this.smeService.getSMEPartner(id);
  }

  async addSMEPartner(partner: Collaborator): Promise<void> {
    return this.smeService.addSMEPartner(partner);
  }
}