import { DataService } from './DataService';
import { Project, Collaborator, Team } from '../types';
import { SitRep } from '../types/sitrep';
import { SPI } from '../types/spi';
import { Objective } from '../types/objective';
import { DataQuantities } from '../types/data';
import { ProjectService } from './db/ProjectService';
import { CollaboratorService } from './db/CollaboratorService';
import { SitRepService } from './db/SitRepService';
import { SPIService } from './db/SPIService';
import { BaseIndexedDBService } from './db/base/BaseIndexedDBService';
import { SampleDataService } from './data/SampleDataService';
import { ServiceInitializationManager } from './db/initialization/ServiceInitializationManager';
import { DataExportService } from './db/operations/DataExportService';
import { DatabaseClearingService } from './db/operations/DatabaseClearingService';
import { InitializationQueue } from './db/initialization/InitializationQueue';

export class IndexedDBService extends BaseIndexedDBService implements DataService {
  private static instance: IndexedDBService | null = null;
  private projectService: ProjectService;
  private collaboratorService: CollaboratorService;
  private sitRepService: SitRepService;
  private spiService: SPIService;
  private sampleDataService: SampleDataService;
  private dataExportService: DataExportService;
  private databaseClearingService: DatabaseClearingService;
  private initManager: ServiceInitializationManager;
  private initQueue: InitializationQueue;
  private isInitializing: boolean = false;

  private constructor() {
    super();
    this.projectService = new ProjectService();
    this.collaboratorService = new CollaboratorService();
    this.sitRepService = new SitRepService();
    this.spiService = new SPIService();
    this.sampleDataService = new SampleDataService();
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
    if (this.isInitializing) {
      console.log('Initialization already in progress, queuing request...');
      return this.initQueue.waitForInitialization();
    }

    if (this.initManager.isServiceInitialized('IndexedDB')) {
      console.log('Service already initialized');
      return;
    }

    this.isInitializing = true;
    this.initQueue.startInitialization();

    try {
      await this.initManager.initializeService('IndexedDB', async () => {
        await super.init();
        const db = this.getDatabase();
        
        this.projectService.setDatabase(db);
        this.collaboratorService.setDatabase(db);
        this.sitRepService.setDatabase(db);
        this.spiService.setDatabase(db);
      });

      console.log('IndexedDB Service initialized successfully');
      this.initQueue.completeInitialization();
    } catch (error) {
      console.error('Failed to initialize IndexedDB Service:', error);
      this.initQueue.failInitialization(error);
      throw error;
    } finally {
      this.isInitializing = false;
    }
  }

  private async ensureInitialized(): Promise<void> {
    if (!this.initManager.isServiceInitialized('IndexedDB')) {
      console.log('Service not initialized, initializing...');
      await this.init();
    }
  }

  async getAllProjects(): Promise<Project[]> {
    await this.ensureInitialized();
    return this.projectService.getAllProjects();
  }

  async getProject(id: string): Promise<Project | null> {
    await thisensureInitialized();
    return this.projectService.getProject(id);
  }

  async addProject(project: Project): Promise<void> {
    await this.ensureInitialized();
    return this.projectService.addProject(project);
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<void> {
    await this.ensureInitialized();
    return this.projectService.updateProject(id, updates);
  }

  async getAllCollaborators(): Promise<Collaborator[]> {
    await this.ensureInitialized();
    return this.collaboratorService.getAllCollaborators();
  }

  async getCollaborator(id: string): Promise<Collaborator | null> {
    await this.ensureInitialized();
    return this.collaboratorService.getCollaborator(id);
  }

  async addCollaborator(collaborator: Collaborator): Promise<void> {
    await this.ensureInitialized();
    return this.collaboratorService.addCollaborator(collaborator);
  }

  async updateCollaborator(id: string, updates: Partial<Collaborator>): Promise<void> {
    await this.ensureInitialized();
    return this.collaboratorService.updateCollaborator(id, updates);
  }

  async getAllSitReps(): Promise<SitRep[]> {
    await this.ensureInitialized();
    return this.sitRepService.getAllSitReps();
  }

  async addSitRep(sitrep: SitRep): Promise<void> {
    await this.ensureInitialized();
    return this.sitRepService.addSitRep(sitrep);
  }

  async updateSitRep(id: string, updates: Partial<SitRep>): Promise<void> {
    await this.ensureInitialized();
    return this.sitRepService.updateSitRep(id, updates);
  }

  async getAllSPIs(): Promise<SPI[]> {
    await this.ensureInitialized();
    return this.spiService.getAllSPIs();
  }

  async getSPI(id: string): Promise<SPI | null> {
    await this.ensureInitialized();
    return this.spiService.getSPI(id);
  }

  async addSPI(spi: SPI): Promise<void> {
    await this.ensureInitialized();
    return this.spiService.addSPI(spi);
  }

  async updateSPI(id: string, updates: Partial<SPI>): Promise<void> {
    await this.ensureInitialized();
    return this.spiService.updateSPI(id, updates);
  }

  async getAllObjectives(): Promise<Objective[]> {
    await this.ensureInitialized();
    return this.spiService.getAllObjectives();
  }

  async addObjective(objective: Objective): Promise<void> {
    await this.ensureInitialized();
    return this.spiService.addObjective(objective);
  }

  async updateObjective(id: string, updates: Partial<Objective>): Promise<void> {
    await this.ensureInitialized();
    return this.spiService.updateObjective(id, updates);
  }

  async deleteObjective(id: string): Promise<void> {
    await this.ensureInitialized();
    return this.spiService.deleteObjective(id);
  }

  async getAllTeams(): Promise<Team[]> {
    await this.ensureInitialized();
    const db = this.getDatabase();
    if (!db) throw new Error('Database not initialized');
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['teams'], 'readonly');
      const store = transaction.objectStore('teams');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(new Error('Failed to fetch teams'));
    });
  }

  async clear(): Promise<void> {
    await this.ensureInitialized();
    return this.databaseClearingService.clearDatabase();
  }

  async populateSampleData(quantities: DataQuantities): Promise<void> {
    await this.ensureInitialized();
    try {
      await this.clear();
      await this.sampleDataService.generateSampleData(quantities);
    } catch (error) {
      throw error;
    }
  }
}
