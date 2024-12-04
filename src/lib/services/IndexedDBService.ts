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
import { DatabaseTransactionService } from './DatabaseTransactionService';
import { DatabaseError } from '../utils/errorHandling';
import { withRetry } from '../utils/retryUtils';
import { toast } from "@/components/ui/use-toast";

export class IndexedDBService implements DataService {
  private static instance: IndexedDBService | null = null;
  private projectService: ProjectService;
  private collaboratorService: CollaboratorService;
  private sitRepService: SitRepService;
  private spiService: SPIService;
  private sampleDataService: SampleDataService;
  private dataExportService: DataExportService;
  private databaseClearingService: DatabaseClearingService;
  private initManager: ServiceInitializationManager;
  protected database: IDBDatabase | null = null;
  private initPromise: Promise<void> | null = null;

  private constructor() {
    this.projectService = new ProjectService();
    this.collaboratorService = new CollaboratorService();
    this.sitRepService = new SitRepService();
    this.spiService = new SPIService();
    this.sampleDataService = new SampleDataService();
    this.initManager = ServiceInitializationManager.getInstance();
    this.dataExportService = new DataExportService(this);
    this.databaseClearingService = new DatabaseClearingService(this.getDatabase(), this.initManager);
  }

  public static getInstance(): IndexedDBService {
    if (!IndexedDBService.instance) {
      IndexedDBService.instance = new IndexedDBService();
    }
    return IndexedDBService.instance;
  }

  public async init(): Promise<void> {
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = this.initializeDatabase();
    return this.initPromise;
  }

  private async initializeDatabase(): Promise<void> {
    try {
      await withRetry(
        async () => {
          console.log('Initializing IndexedDB service...');
          const transactionService = new DatabaseTransactionService(this.database);
          
          if (!this.database) {
            throw new DatabaseError('Database initialization failed - database is null');
          }
          
          console.log('Database connection established');
        },
        {
          maxRetries: 3,
          initialDelay: 1000,
          onRetry: (attempt, error) => {
            console.warn(`Retry attempt ${attempt} for database initialization:`, error);
            toast({
              title: "Database Connection Retry",
              description: `Retrying connection (attempt ${attempt}/3)...`,
            });
          }
        }
      );
      
      toast({
        title: "Database Ready",
        description: "Database connection established and ready for use",
      });
    } catch (error) {
      console.error('Error initializing service:', error);
      toast({
        title: "Database Error",
        description: "Failed to initialize database after multiple retries. Please refresh the page.",
        variant: "destructive",
      });
      this.initPromise = null;
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

  // Initiative methods
  getAllInitiatives = () => this.spiService.getAllInitiatives();
  updateInitiative = (id: string, initiative: any) => this.spiService.updateInitiative(id, initiative);
  deleteInitiative = (id: string) => this.spiService.deleteInitiative(id);

  // Team methods
  async getAllTeams(): Promise<Team[]> {
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

  // SME Partner methods
  getAllSMEPartners = () => this.collaboratorService.getAllSMEPartners();
  getSMEPartner = (id: string) => this.collaboratorService.getSMEPartner(id);
  addSMEPartner = (partner: Collaborator) => this.collaboratorService.addSMEPartner(partner);
  updateSMEPartner = (id: string, updates: Partial<Collaborator>) => this.collaboratorService.updateSMEPartner(id, updates);

  // Data operations
  exportData = async () => {
    try {
      const data = {
        projects: await this.getAllProjects(),
        collaborators: await this.getAllCollaborators(),
        sitreps: await this.getAllSitReps(),
        spis: await this.getAllSPIs(),
        objectives: await this.getAllObjectives(),
        smePartners: await this.getAllSMEPartners()
      };

      if (Object.values(data).every(arr => !arr?.length)) {
        throw new Error('No data available in database');
      }

      return data;
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  };
  
  clear = () => this.databaseClearingService.clearDatabase();

  async populateSampleData(quantities: DataQuantities): Promise<void> {
    try {
      await this.clear();
      await this.sampleDataService.generateSampleData(quantities);
    } catch (error) {
      throw error;
    }
  }

  public getDatabase(): IDBDatabase | null {
    return this.database;
  }

  public setDatabase(db: IDBDatabase | null): void {
    this.database = db;
  }
}
