import { DatabaseStateManager } from './db/initialization/DatabaseStateManager';
import { ProjectMethods } from './db/methods/ProjectMethods';
import { CollaboratorMethods } from './db/methods/CollaboratorMethods';
import { Project, Team, Collaborator } from '../types';
import { SPI } from '../types/spi';
import { Objective } from '../types/objective';
import { SitRep } from '../types/sitrep';
import { DataService } from './DataService';
import { DataQuantities } from '../types/data';
import { toast } from "@/components/ui/use-toast";

export class IndexedDBService implements DataService {
  private static instance: IndexedDBService | null = null;
  private stateManager: DatabaseStateManager;
  private projectMethods: ProjectMethods;
  private collaboratorMethods: CollaboratorMethods;

  private constructor() {
    this.stateManager = DatabaseStateManager.getInstance();
    this.projectMethods = new ProjectMethods(this.stateManager);
    this.collaboratorMethods = new CollaboratorMethods(this.stateManager);
  }

  static getInstance(): IndexedDBService {
    if (!IndexedDBService.instance) {
      IndexedDBService.instance = new IndexedDBService();
    }
    return IndexedDBService.instance;
  }

  async init(): Promise<void> {
    console.log('IndexedDBService: Starting initialization');
    try {
      // First, close any existing connections
      const currentDb = this.stateManager.getDatabase();
      if (currentDb) {
        console.log('Closing existing database connection');
        currentDb.close();
        this.stateManager.setDatabase(null);
      }

      // Ensure initialization
      await this.stateManager.ensureInitialized();
      console.log('IndexedDBService: Initialization completed successfully');
    } catch (error) {
      console.error('IndexedDBService: Initialization failed:', error);
      toast({
        title: "Database Error",
        description: "Failed to initialize database service",
        variant: "destructive",
      });
      throw error;
    }
  }

  async clear(): Promise<void> {
    const db = this.stateManager.getDatabase();
    if (!db) throw new Error('Database not initialized');

    const stores = Array.from(db.objectStoreNames);
    await Promise.all(stores.map(store => this.clearStore(store)));
  }

  private async clearStore(storeName: string): Promise<void> {
    const db = this.stateManager.getDatabase();
    if (!db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error(`Failed to clear ${storeName}`));
    });
  }

  // Project methods
  async getAllProjects(): Promise<Project[]> {
    return this.projectMethods.getAllProjects();
  }

  async getProject(id: string): Promise<Project | undefined> {
    return this.projectMethods.getProject(id);
  }

  async addProject(project: Project): Promise<void> {
    return this.projectMethods.addProject(project);
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<void> {
    return this.projectMethods.updateProject(id, updates);
  }

  async deleteProject(id: string): Promise<void> {
    return this.projectMethods.deleteProject(id);
  }

  // Collaborator methods
  async getAllCollaborators(): Promise<Collaborator[]> {
    return this.collaboratorMethods.getAllCollaborators();
  }

  async getCollaborator(id: string): Promise<Collaborator | undefined> {
    return this.collaboratorMethods.getCollaborator(id);
  }

  async addCollaborator(collaborator: Collaborator): Promise<void> {
    return this.collaboratorMethods.addCollaborator(collaborator);
  }

  async updateCollaborator(id: string, updates: Partial<Collaborator>): Promise<void> {
    return this.collaboratorMethods.updateCollaborator(id, updates);
  }

  async deleteCollaborator(id: string): Promise<void> {
    return this.collaboratorMethods.deleteCollaborator(id);
  }

  // Implement remaining DataService methods
  async getAllSitReps(): Promise<SitRep[]> {
    return [];
  }

  async addSitRep(sitrep: SitRep): Promise<void> {}

  async updateSitRep(id: string, updates: Partial<SitRep>): Promise<void> {}

  async deleteSitRep(id: string): Promise<void> {}

  async getAllSPIs(): Promise<SPI[]> {
    return [];
  }

  async getSPI(id: string): Promise<SPI | undefined> {
    return undefined;
  }

  async addSPI(spi: SPI): Promise<void> {}

  async updateSPI(id: string, updates: Partial<SPI>): Promise<void> {}

  async deleteSPI(id: string): Promise<void> {}

  async getAllObjectives(): Promise<Objective[]> {
    return [];
  }

  async addObjective(objective: Objective): Promise<void> {}

  async updateObjective(id: string, updates: Partial<Objective>): Promise<void> {}

  async deleteObjective(id: string): Promise<void> {}

  async getAllInitiatives(): Promise<any[]> {
    return [];
  }

  async updateInitiative(id: string, initiative: any): Promise<void> {}

  async deleteInitiative(id: string): Promise<void> {}

  async exportData(): Promise<any> {
    return {};
  }

  async getAllTeams(): Promise<Team[]> {
    return [];
  }

  async populateSampleData(quantities: DataQuantities): Promise<void> {}

  async getAllSMEPartners(): Promise<Collaborator[]> {
    return [];
  }

  async getSMEPartner(id: string): Promise<Collaborator | undefined> {
    return undefined;
  }

  async addSMEPartner(partner: Collaborator): Promise<void> {}

  async updateSMEPartner(id: string, updates: Partial<Collaborator>): Promise<void> {}

  async deleteSMEPartner(id: string): Promise<void> {
    const db = this.stateManager.getDatabase();
    if (!db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = db.transaction('smePartners', 'readwrite');
      const store = transaction.objectStore('smePartners');
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error(`Failed to delete SME partner ${id}`));
    });
  }

  getDatabase(): IDBDatabase | null {
    return this.stateManager.getDatabase();
  }
}