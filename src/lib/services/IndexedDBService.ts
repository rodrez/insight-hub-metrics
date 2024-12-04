import { ProjectService } from './db/ProjectService';
import { CollaboratorService } from './db/CollaboratorService';
import { SitRepService } from './db/SitRepService';
import { SPIService } from './db/SPIService';
import { SampleDataService } from './data/SampleDataService';
import { ServiceInitializationManager } from './db/initialization/ServiceInitializationManager';
import { DataExportService } from './db/operations/DataExportService';
import { DatabaseClearingService } from './db/operations/DatabaseClearingService';
import { DatabaseTransactionService } from './db/transactions/DatabaseTransactionService';
import { DatabaseMethods } from './db/methods/DatabaseMethods';
import { DatabaseError } from '../utils/errorHandling';
import { withRetry } from '../utils/retryUtils';
import { toast } from "@/components/ui/use-toast";
import { DataService } from './DataService';

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
  private dbMethods: DatabaseMethods;
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
    this.dbMethods = new DatabaseMethods(
      this.projectService,
      this.collaboratorService,
      this.sitRepService,
      this.spiService
    );
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

  // Delegate all database methods to dbMethods
  getAllProjects = this.dbMethods.getAllProjects;
  getProject = this.dbMethods.getProject;
  addProject = this.dbMethods.addProject;
  updateProject = this.dbMethods.updateProject;
  getAllCollaborators = this.dbMethods.getAllCollaborators;
  getCollaborator = this.dbMethods.getCollaborator;
  addCollaborator = this.dbMethods.addCollaborator;
  updateCollaborator = this.dbMethods.updateCollaborator;
  getAllSitReps = this.dbMethods.getAllSitReps;
  addSitRep = this.dbMethods.addSitRep;
  updateSitRep = this.dbMethods.updateSitRep;
  getAllSPIs = this.dbMethods.getAllSPIs;
  getSPI = this.dbMethods.getSPI;
  addSPI = this.dbMethods.addSPI;
  updateSPI = this.dbMethods.updateSPI;
  deleteSPI = this.dbMethods.deleteSPI;
  getAllObjectives = this.dbMethods.getAllObjectives;
  addObjective = this.dbMethods.addObjective;
  updateObjective = this.dbMethods.updateObjective;
  deleteObjective = this.dbMethods.deleteObjective;
  getAllInitiatives = this.dbMethods.getAllInitiatives;
  updateInitiative = this.dbMethods.updateInitiative;
  deleteInitiative = this.dbMethods.deleteInitiative;
  getAllSMEPartners = this.dbMethods.getAllSMEPartners;
  getSMEPartner = this.dbMethods.getSMEPartner;
  addSMEPartner = this.dbMethods.addSMEPartner;
  updateSMEPartner = this.dbMethods.updateSMEPartner;

  // Team methods
  async getAllTeams() {
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

  async populateSampleData(quantities: any): Promise<void> {
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