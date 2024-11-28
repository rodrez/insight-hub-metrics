import { DataService, SampleDataQuantities } from './DataService';
import { Project, Collaborator, Team } from '../types';
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
import { generateSampleData } from './sampleData/sampleDataGenerator';

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
        this.collaboratorService.setDatabase(this.db);
        this.sitRepService.setDatabase(this.db);
        this.spiService.setDatabase(this.db);
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

  // Collaborator methods delegated to CollaboratorService
  async getAllCollaborators(): Promise<Collaborator[]> {
    return this.collaboratorService.getAllCollaborators();
  }

  async getCollaborator(id: string): Promise<Collaborator | undefined> {
    return this.collaboratorService.getCollaborator(id);
  }

  async addCollaborator(collaborator: Collaborator): Promise<void> {
    return this.collaboratorService.addCollaborator(collaborator);
  }

  // SitRep methods delegated to SitRepService
  async getAllSitReps(): Promise<SitRep[]> {
    return this.sitRepService.getAllSitReps();
  }

  async addSitRep(sitrep: SitRep): Promise<void> {
    return this.sitRepService.addSitRep(sitrep);
  }

  // SPI methods delegated to SPIService
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

  // Implementing missing methods required by DataService interface
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
    const { projects, collaborators, spis, objectives, sitreps } = await generateSampleData([]);
    
    // Add all data in sequence
    for (const project of projects) {
      await this.addProject(project);
    }
    
    for (const collaborator of collaborators) {
      await this.addCollaborator(collaborator);
    }
    
    for (const spi of spis) {
      await this.addSPI(spi);
    }
    
    for (const objective of objectives) {
      await this.addObjective(objective);
    }
    
    for (const sitrep of sitreps) {
      await this.addSitRep(sitrep);
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