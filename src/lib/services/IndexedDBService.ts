import { Project, Collaborator } from '../types';
import { DataService, SampleDataQuantities } from './DataService';
import { DB_CONFIG, createStores } from './db/stores';
import { connectionManager } from './db/connectionManager';
import { DatabaseCleaner } from './db/databaseCleaner';
import { ProjectStore } from './db/stores/projectStore';
import { SMEStore } from './db/stores/smeStore';
import { CollaboratorService } from './db/CollaboratorService';
import { SitRepService } from './db/SitRepService';
import { SPIService } from './db/SPIService';
import { BaseDBService } from './db/base/BaseDBService';

export class IndexedDBService extends BaseDBService implements DataService {
  private projectStore: ProjectStore | null = null;
  private smeStore: SMEStore | null = null;
  private collaboratorService: CollaboratorService;
  private sitRepService: SitRepService;
  private spiService: SPIService;

  constructor() {
    super();
    this.collaboratorService = new CollaboratorService();
    this.sitRepService = new SitRepService();
    this.spiService = new SPIService();
  }

  async init(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const request = indexedDB.open(DB_CONFIG.name, DB_CONFIG.version);

      request.onerror = () => {
        const error = request.error?.message || 'Unknown error during initialization';
        console.error('Database initialization error:', error);
        reject(new Error(error));
      };
      
      request.onsuccess = () => {
        console.log('IndexedDB initialized successfully');
        this.db = request.result;
        this.collaboratorService.db = this.db;
        this.sitRepService.db = this.db;
        this.spiService.db = this.db;
        connectionManager.addConnection(this.db);
        this.projectStore = new ProjectStore(this.db);
        this.smeStore = new SMEStore(this.db);
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        createStores(db);
      };
    });
  }

  async clear(): Promise<void> {
    if (this.db) {
      connectionManager.closeAllConnections();
      this.db = null;
      this.projectStore = null;
      this.smeStore = null;
    }
    await DatabaseCleaner.clearDatabase();
  }

  // Project methods
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

  // Delegate to CollaboratorService
  async getAllCollaborators(): Promise<Collaborator[]> {
    return this.collaboratorService.getAllCollaborators();
  }

  async getCollaborator(id: string): Promise<Collaborator | undefined> {
    return this.collaboratorService.getCollaborator(id);
  }

  async addCollaborator(collaborator: Collaborator): Promise<void> {
    return this.collaboratorService.addCollaborator(collaborator);
  }

  // Delegate to SitRepService
  async getAllSitReps() {
    return this.sitRepService.getAllSitReps();
  }

  async addSitRep(sitrep) {
    return this.sitRepService.addSitRep(sitrep);
  }

  // Delegate to SPIService
  async getAllSPIs() {
    return this.spiService.getAllSPIs();
  }

  async getSPI(id: string) {
    return this.spiService.getSPI(id);
  }

  async addSPI(spi) {
    return this.spiService.addSPI(spi);
  }

  async updateSPI(id: string, updates) {
    return this.spiService.updateSPI(id, updates);
  }

  async populateSampleData(quantities: SampleDataQuantities): Promise<void> {
    this.ensureInitialized();
    const { projects, smePartners } = await generateSampleData([]);
    
    // Add all projects
    for (const project of projects) {
      await this.addProject(project);
    }

    // Add all SME partners
    for (const partner of smePartners) {
      await this.addSMEPartner(partner);
    }
  }

  async getAllSMEPartners(): Promise<Collaborator[]> {
    this.ensureInitialized();
    return this.smeStore!.getAllSMEPartners();
  }

  async getSMEPartner(id: string): Promise<Collaborator | undefined> {
    this.ensureInitialized();
    return this.smeStore!.getSMEPartner(id);
  }

  async addSMEPartner(partner: Collaborator): Promise<void> {
    this.ensureInitialized();
    return this.smeStore!.addSMEPartner(partner);
  }
}
