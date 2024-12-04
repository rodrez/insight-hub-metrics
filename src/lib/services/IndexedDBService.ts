import { ProjectService } from './db/ProjectService';
import { CollaboratorService } from './db/CollaboratorService';
import { SitRepService } from './db/SitRepService';
import { SPIService } from './db/SPIService';
import { SampleDataService } from './data/SampleDataService';
import { ServiceInitializationManager } from './db/initialization/ServiceInitializationManager';
import { DataExportService } from './db/operations/DataExportService';
import { DatabaseClearingService } from './db/operations/DatabaseClearingService';
import { DatabaseMethods } from './db/methods/DatabaseMethods';
import { DatabaseError } from '../utils/errorHandling';
import { withRetry } from '../utils/retryUtils';
import { toast } from "@/components/ui/use-toast";
import { DataService } from './DataService';
import { Team, Project, Collaborator } from '../types';
import { SitRep } from '../types/sitrep';
import { SPI } from '../types/spi';
import { Objective } from '../types/objective';

export class IndexedDBService implements DataService {
  private static instance: IndexedDBService | null = null;
  private database: IDBDatabase | null = null;
  private initPromise: Promise<void> | null = null;
  
  private projectService: ProjectService;
  private collaboratorService: CollaboratorService;
  private sitRepService: SitRepService;
  private spiService: SPIService;
  private sampleDataService: SampleDataService;
  private dataExportService: DataExportService;
  private databaseClearingService: DatabaseClearingService;
  private initManager: ServiceInitializationManager;
  private dbMethods: DatabaseMethods;

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

  async init(): Promise<void> {
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

  // Implement DataService interface methods
  getAllProjects = (): Promise<Project[]> => this.dbMethods.getAllProjects();
  getProject = (id: string): Promise<Project | undefined> => this.dbMethods.getProject(id);
  addProject = (project: Project): Promise<void> => this.dbMethods.addProject(project);
  updateProject = (id: string, updates: Partial<Project>): Promise<void> => this.dbMethods.updateProject(id, updates);
  
  getAllCollaborators = (): Promise<Collaborator[]> => this.dbMethods.getAllCollaborators();
  getCollaborator = (id: string): Promise<Collaborator | undefined> => this.dbMethods.getCollaborator(id);
  addCollaborator = (collaborator: Collaborator): Promise<void> => this.dbMethods.addCollaborator(collaborator);
  updateCollaborator = (id: string, updates: Partial<Collaborator>): Promise<void> => this.dbMethods.updateCollaborator(id, updates);
  
  getAllSitReps = (): Promise<SitRep[]> => this.dbMethods.getAllSitReps();
  addSitRep = (sitrep: SitRep): Promise<void> => this.dbMethods.addSitRep(sitrep);
  updateSitRep = (id: string, updates: Partial<SitRep>): Promise<void> => this.dbMethods.updateSitRep(id, updates);
  
  getAllSPIs = (): Promise<SPI[]> => this.dbMethods.getAllSPIs();
  getSPI = (id: string): Promise<SPI | undefined> => this.dbMethods.getSPI(id);
  addSPI = (spi: SPI): Promise<void> => this.dbMethods.addSPI(spi);
  updateSPI = (id: string, updates: Partial<SPI>): Promise<void> => this.dbMethods.updateSPI(id, updates);
  deleteSPI = (id: string): Promise<void> => this.dbMethods.deleteSPI(id);
  
  getAllObjectives = (): Promise<Objective[]> => this.dbMethods.getAllObjectives();
  addObjective = (objective: Objective): Promise<void> => this.dbMethods.addObjective(objective);
  updateObjective = (id: string, updates: Partial<Objective>): Promise<void> => this.dbMethods.updateObjective(id, updates);
  deleteObjective = (id: string): Promise<void> => this.dbMethods.deleteObjective(id);
  
  getAllInitiatives = (): Promise<any[]> => this.dbMethods.getAllInitiatives();
  updateInitiative = (id: string, initiative: any): Promise<void> => this.dbMethods.updateInitiative(id, initiative);
  deleteInitiative = (id: string): Promise<void> => this.dbMethods.deleteInitiative(id);
  
  getAllSMEPartners = (): Promise<Collaborator[]> => this.dbMethods.getAllSMEPartners();
  getSMEPartner = (id: string): Promise<Collaborator | undefined> => this.dbMethods.getSMEPartner(id);
  addSMEPartner = (partner: Collaborator): Promise<void> => this.dbMethods.addSMEPartner(partner);
  updateSMEPartner = (id: string, updates: Partial<Collaborator>): Promise<void> => this.dbMethods.updateSMEPartner(id, updates);

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

  async exportData() {
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
  }

  clear = () => this.databaseClearingService.clearDatabase();

  async populateSampleData(quantities: any): Promise<void> {
    try {
      await this.clear();
      await this.sampleDataService.generateSampleData(quantities);
    } catch (error) {
      throw error;
    }
  }

  getDatabase(): IDBDatabase | null {
    return this.database;
  }

  setDatabase(db: IDBDatabase | null): void {
    this.database = db;
  }
}