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

  public async init(): Promise<void> {
    // If initialization is already in progress, return the existing promise
    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    // If already initialized, return immediately
    if (this.isInitialized()) {
      return Promise.resolve();
    }

    // Create new initialization promise
    this.initializationPromise = this.performInitialization();

    try {
      await this.initializationPromise;
      this.initialized = true;
    } finally {
      // Clear the promise once initialization is complete (success or failure)
      this.initializationPromise = null;
    }
  }

  private async performInitialization(): Promise<void> {
    try {
      await super.init();
      await Promise.all([
        this.projectService.init(),
        this.collaboratorService.init(),
        this.sitRepService.init(),
        this.spiService.init()
      ]);
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
    return this.transactionService.performTransaction('teams', 'readonly', store => store.getAll());
  }

  // Other methods
  async clear(): Promise<void> {
    const stores = ['projects', 'collaborators', 'sitreps', 'spis', 'objectives', 'smePartners'];
    for (const store of stores) {
      await this.transactionService.performTransaction(store, 'readwrite', store => store.clear());
    }
  }

  async exportData(): Promise<void> {
    if (!this.getDatabase()) throw new Error('Database not initialized');
    const data = {
      projects: await this.getAllProjects(),
      collaborators: await this.getAllCollaborators(),
      sitreps: await this.getAllSitReps(),
      spis: await this.getAllSPIs(),
      objectives: await this.getAllObjectives(),
      smePartners: await this.getAllSMEPartners()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `database-export-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  async populateSampleData(quantities: DataQuantities): Promise<void> {
    await this.clear();
    await this.sampleDataService.generateSampleData(quantities);
  }

  // SME Partner methods
  getAllSMEPartners = () => this.collaboratorService.getAllSMEPartners();
  getSMEPartner = (id: string) => this.collaboratorService.getSMEPartner(id);
  addSMEPartner = (partner: Collaborator) => this.collaboratorService.addSMEPartner(partner);
}
