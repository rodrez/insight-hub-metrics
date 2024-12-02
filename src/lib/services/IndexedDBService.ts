import { DataService } from './DataService';
import { Project, Collaborator, Team } from '../types';
import { SitRep } from '../types/sitrep';
import { SPI } from '../types/spi';
import { Objective } from '../types/objective';
import { DataQuantities } from '@/components/data/types/dataTypes';
import { ProjectService } from './db/ProjectService';
import { CollaboratorService } from './db/CollaboratorService';
import { SitRepService } from './db/SitRepService';
import { SPIService } from './db/SPIService';
import { BaseIndexedDBService } from './db/base/BaseIndexedDBService';
import { SampleDataService } from './data/SampleDataService';
import { ServiceInitializationManager } from './db/initialization/ServiceInitializationManager';
import { DataExportService } from './db/operations/DataExportService';
import { DatabaseClearingService } from './db/operations/DatabaseClearingService';

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
  }

  public static getInstance(): IndexedDBService {
    if (!IndexedDBService.instance) {
      IndexedDBService.instance = new IndexedDBService();
    }
    return IndexedDBService.instance;
  }

  public async init(): Promise<void> {
    await this.initManager.initializeService('IndexedDB', async () => {
      await super.init();
      const db = this.getDatabase();
      
      this.projectService.setDatabase(db);
      this.collaboratorService.setDatabase(db);
      this.sitRepService.setDatabase(db);
      this.spiService.setDatabase(db);
    });
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
  addInitiative = (initiative: any) => this.spiService.addInitiative(initiative);
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
      const validatedQuantities: DataQuantities = {
        projects: quantities.projects,
        spis: quantities.spis,
        objectives: quantities.objectives,
        sitreps: quantities.sitreps,
        fortune30: quantities.fortune30,
        internalPartners: quantities.internalPartners,
        smePartners: quantities.smePartners,
        initiatives: quantities.initiatives
      };
      await this.sampleDataService.generateSampleData(validatedQuantities);
    } catch (error) {
      throw error;
    }
  }
}