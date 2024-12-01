import { DataService } from './DataService';
import { Project, Collaborator, Team } from '../types';
import { SPI } from '../types/spi';
import { Objective } from '../types/objective';
import { SitRep } from '../types/sitrep';
import { DataQuantities } from '../types/data';
import { ProjectService } from './db/ProjectService';
import { CollaboratorService } from './db/CollaboratorService';
import { SitRepService } from './db/SitRepService';
import { SPIService } from './db/SPIService';
import { BaseIndexedDBService } from './db/base/BaseIndexedDBService';
import { SampleDataService } from './data/SampleDataService';
import { toast } from "@/components/ui/use-toast";

export class IndexedDBService extends BaseIndexedDBService implements DataService {
  private static instance: IndexedDBService | null = null;
  private initializationPromise: Promise<void> | null = null;
  private projectService: ProjectService;
  private collaboratorService: CollaboratorService;
  private sitRepService: SitRepService;
  private spiService: SPIService;
  private sampleDataService: SampleDataService;
  private initialized: boolean = false;
  private activeTransactions: Set<IDBTransaction> = new Set();

  private constructor() {
    super();
    this.projectService = new ProjectService();
    this.collaboratorService = new CollaboratorService();
    this.sitRepService = new SitRepService();
    this.spiService = new SPIService();
    this.sampleDataService = new SampleDataService();
  }

  public static getInstance(): IndexedDBService {
    if (!IndexedDBService.instance) {
      IndexedDBService.instance = new IndexedDBService();
    }
    return IndexedDBService.instance;
  }

  public isInitialized(): boolean {
    return this.initialized;
  }

  private async cleanupTransactions(): Promise<void> {
    console.log('Cleaning up transactions...');
    for (const transaction of this.activeTransactions) {
      try {
        if (transaction.error) {
          console.warn('Transaction error detected:', transaction.error);
        }
        if (!transaction.objectStoreNames) {
          transaction.abort();
        }
      } catch (error) {
        console.warn('Error during transaction cleanup:', error);
      }
    }
    this.activeTransactions.clear();
  }

  public async init(): Promise<void> {
    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    if (this.isInitialized()) {
      return Promise.resolve();
    }

    this.initializationPromise = this.performInitialization();

    try {
      await this.initializationPromise;
      this.initialized = true;
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Database initialization failed:', error);
      throw error;
    } finally {
      this.initializationPromise = null;
    }
  }

  private async performInitialization(): Promise<void> {
    try {
      await this.cleanupTransactions();
      await super.init();
      
      // Initialize all services with the current database instance
      const db = this.getDatabase();
      this.projectService.setDatabase(db);
      this.collaboratorService.setDatabase(db);
      this.sitRepService.setDatabase(db);
      this.spiService.setDatabase(db);

      // Services are now initialized through setDatabase, no need to call init()
    } catch (error) {
      console.error('Database initialization failed:', error);
      toast({
        title: "Error",
        description: "Failed to initialize database. Please refresh the page.",
        variant: "destructive",
      });
      throw error;
    }
  }

  // Project methods
  getAllProjects = () => this.projectService.getAllProjects();
  getProject = (id: string) => this.projectService.getProject(id);
  addProject = (project: Project) => this.projectService.addProject(project);
  updateProject = (id: string, updates: Partial<Project>) => this.projectService.updateProject(id, updates);

  // Collaborator methods
  getAllCollaborators = () => this.collaboratorService.getAllCollaborators();
  getCollaborator = (id: string) => this.collaboratorService.getCollaborator(id);
  addCollaborator = (collaborator: Collaborator) => this.collaboratorService.addCollaborator(collaborator);
  updateCollaborator = (id: string, updates: Partial<Collaborator>) => this.collaboratorService.updateCollaborator(id, updates);

  // SitRep methods
  getAllSitReps = () => this.sitRepService.getAllSitReps();
  addSitRep = (sitrep: SitRep) => this.sitRepService.addSitRep(sitrep);
  updateSitRep = (id: string, updates: Partial<SitRep>) => this.sitRepService.updateSitRep(id, updates);

  // SPI methods
  getAllSPIs = () => this.spiService.getAllSPIs();
  getSPI = (id: string) => this.spiService.getSPI(id);
  addSPI = (spi: SPI) => this.spiService.addSPI(spi);
  updateSPI = (id: string, updates: Partial<SPI>) => this.spiService.updateSPI(id, updates);
  deleteSPI = (id: string) => this.spiService.deleteSPI(id);

  // Objective methods
  getAllObjectives = () => this.spiService.getAllObjectives();
  addObjective = (objective: Objective) => this.spiService.addObjective(objective);
  updateObjective = (id: string, updates: Partial<Objective>) => this.spiService.updateObjective(id, updates);
  deleteObjective = (id: string) => this.spiService.deleteObjective(id);

  // Team methods
  async getAllTeams(): Promise<Team[]> {
    return [];
  }

  async clear(): Promise<void> {
    await this.cleanupTransactions();
    const stores = ['projects', 'collaborators', 'sitreps', 'spis', 'objectives', 'smePartners'];
    for (const storeName of stores) {
      const transaction = this.getDatabase()?.transaction(storeName, 'readwrite');
      if (transaction) {
        this.activeTransactions.add(transaction);
        const objectStore = transaction.objectStore(storeName);
        await objectStore.clear();
        this.activeTransactions.delete(transaction);
      }
    }
  }

  // SME Partner methods
  getAllSMEPartners = () => this.collaboratorService.getAllSMEPartners();
  getSMEPartner = (id: string) => this.collaboratorService.getSMEPartner(id);
  addSMEPartner = (partner: Collaborator) => this.collaboratorService.addSMEPartner(partner);
}
