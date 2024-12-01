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
import { ServiceInitializationManager } from './db/initialization/ServiceInitializationManager';
import { toast } from "@/components/ui/use-toast";

export class IndexedDBService extends BaseIndexedDBService implements DataService {
  private static instance: IndexedDBService | null = null;
  private projectService: ProjectService;
  private collaboratorService: CollaboratorService;
  private sitRepService: SitRepService;
  private spiService: SPIService;
  private sampleDataService: SampleDataService;
  private initManager: ServiceInitializationManager;

  private constructor() {
    super();
    this.projectService = new ProjectService();
    this.collaboratorService = new CollaboratorService();
    this.sitRepService = new SitRepService();
    this.spiService = new SPIService();
    this.sampleDataService = new SampleDataService();
    this.initManager = ServiceInitializationManager.getInstance();
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
      
      // Initialize all services with the current database instance
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

  // Implementing the missing methods from DataService interface
  async exportData(): Promise<void> {
    if (!this.getDatabase()) {
      throw new Error('Database not initialized');
    }

    try {
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

      toast({
        title: "Success",
        description: "Data exported successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export data",
        variant: "destructive",
      });
      throw error;
    }
  }

  async populateSampleData(quantities: DataQuantities): Promise<void> {
    try {
      await this.clear();
      await this.sampleDataService.generateSampleData(quantities);
      toast({
        title: "Success",
        description: "Sample data populated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to populate sample data",
        variant: "destructive",
      });
      throw error;
    }
  }

  async clear(): Promise<void> {
    const stores = ['projects', 'collaborators', 'sitreps', 'spis', 'objectives', 'smePartners', 'teams'];
    try {
      for (const storeName of stores) {
        const transaction = this.getDatabase()?.transaction(storeName, 'readwrite');
        if (transaction) {
          const objectStore = transaction.objectStore(storeName);
          await objectStore.clear();
        }
      }
      this.initManager.resetService('IndexedDB');
      toast({
        title: "Success",
        description: "Database cleared successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear database",
        variant: "destructive",
      });
      throw error;
    }
  }
}