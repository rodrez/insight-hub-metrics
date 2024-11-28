import { DataService, SampleDataQuantities } from './DataService';
import { Project, Collaborator } from '../types';
import { SitRep } from '../types/sitrep';
import { SPI } from '../types/spi';
import { Objective } from '../types/objective';
import { DB_CONFIG, createStores } from './db/stores';
import { connectionManager } from './db/connectionManager';
import { DatabaseCleaner } from './db/databaseCleaner';
import { ProjectStore } from './db/stores/projectStore';
import { SMEStore } from './db/stores/smeStore';
import { CollaboratorService } from './db/CollaboratorService';
import { SitRepService } from './db/SitRepService';
import { SPIService } from './db/SPIService';
import { BaseDBService } from './db/base/BaseDBService';
import { SampleDataPopulationService } from './db/SampleDataPopulationService';
import { Team } from '../types';
import { toast } from "@/components/ui/use-toast";

export class IndexedDBService extends BaseDBService implements DataService {
  private projectStore: ProjectStore | null = null;
  private smeStore: SMEStore | null = null;
  private collaboratorService: CollaboratorService;
  private sitRepService: SitRepService;
  private spiService: SPIService;
  private sampleDataService: SampleDataPopulationService;

  constructor() {
    super();
    this.collaboratorService = new CollaboratorService();
    this.sitRepService = new SitRepService();
    this.spiService = new SPIService();
    this.sampleDataService = new SampleDataPopulationService();
  }

  async init(): Promise<void> {
    try {
      return new Promise<void>((resolve, reject) => {
        const request = indexedDB.open(DB_CONFIG.name, DB_CONFIG.version);

        request.onerror = () => {
          const error = request.error?.message || 'Unknown error during initialization';
          console.error('Database initialization error:', error);
          toast({
            title: "Database Error",
            description: "Failed to initialize database",
            variant: "destructive",
          });
          reject(new Error(error));
        };
        
        request.onsuccess = () => {
          this.db = request.result;
          this.collaboratorService.setDatabase(this.db);
          this.sitRepService.setDatabase(this.db);
          this.spiService.setDatabase(this.db);
          this.sampleDataService.setDatabase(this.db);
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
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to initialize database",
        variant: "destructive",
      });
      throw error;
    }
  }

  async clear(): Promise<void> {
    try {
      // Close all existing connections
      connectionManager.closeAllConnections();
      
      // Use DatabaseCleaner to clear the database
      await DatabaseCleaner.clearDatabase();
      
      // Reset internal stores
      this.projectStore = null;
      this.smeStore = null;
      this.db = null;

      toast({
        title: "Database cleared",
        description: "All data has been successfully removed.",
      });
    } catch (error) {
      console.error('Error clearing database:', error);
      toast({
        title: "Error",
        description: "Failed to clear database",
        variant: "destructive",
      });
      throw error;
    }
  }

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

  async getAllCollaborators(): Promise<Collaborator[]> {
    return this.collaboratorService.getAllCollaborators();
  }

  async getCollaborator(id: string): Promise<Collaborator | undefined> {
    return this.collaboratorService.getCollaborator(id);
  }

  async addCollaborator(collaborator: Collaborator): Promise<void> {
    return this.collaboratorService.addCollaborator(collaborator);
  }

  async getAllSitReps(): Promise<SitRep[]> {
    return this.sitRepService.getAllSitReps();
  }

  async addSitRep(sitrep: SitRep): Promise<void> {
    return this.sitRepService.addSitRep(sitrep);
  }

  async getAllSPIs(): Promise<SPI[]> {
    return this.spiService.getAllSPIs();
  }

  async getSPI(id: string): Promise<SPI | undefined> {
    return this.spiService.getSPI(id);
  }

  async addSPI(spi: SPI): Promise<void> {
    return this.spiService.addSPI(spi);
  }

  async updateSPI(id: string, updates: Partial<SPI>): Promise<void> {
    return this.spiService.updateSPI(id, updates);
  }

  async getAllObjectives(): Promise<Objective[]> {
    return this.performTransaction<Objective[]>(
      'objectives',
      'readonly',
      store => store.getAll()
    );
  }

  async addObjective(objective: Objective): Promise<void> {
    await this.performTransaction(
      'objectives',
      'readwrite',
      store => store.put(objective)
    );
  }

  async updateObjective(id: string, updates: Partial<Objective>): Promise<void> {
    const existing = await this.performTransaction<Objective | undefined>(
      'objectives',
      'readonly',
      store => store.get(id)
    );
    if (!existing) {
      throw new Error('Objective not found');
    }
    await this.performTransaction(
      'objectives',
      'readwrite',
      store => store.put({ ...existing, ...updates })
    );
  }

  async exportData(): Promise<void> {
    const data = {
      projects: await this.getAllProjects(),
      collaborators: await this.getAllCollaborators(),
      sitreps: await this.getAllSitReps(),
      spis: await this.getAllSPIs(),
      objectives: await this.getAllObjectives()
    };
    
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `project-data-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  async getAllTeams(): Promise<Team[]> {
    return this.performTransaction<Team[]>(
      'teams',
      'readonly',
      store => store.getAll()
    );
  }

  async populateSampleData(quantities: SampleDataQuantities): Promise<void> {
    this.ensureInitialized();
    await this.sampleDataService.populateData(quantities);
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
