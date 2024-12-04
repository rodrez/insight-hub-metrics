import { DatabaseStateManager } from './db/initialization/DatabaseStateManager';
import { DatabaseMethods } from './db/methods/DatabaseMethods';
import { DataService } from './DataService';
import { Project, Team, Collaborator } from '../types';
import { SPI } from '../types/spi';
import { SitRep } from '../types/sitrep';
import { Objective } from '../types/objective';

export class IndexedDBService implements DataService {
  private static instance: IndexedDBService | null = null;
  private stateManager: DatabaseStateManager;
  private dbMethods: DatabaseMethods;

  private constructor() {
    this.stateManager = DatabaseStateManager.getInstance();
    this.dbMethods = new DatabaseMethods(this.stateManager);
  }

  static getInstance(): IndexedDBService {
    if (!IndexedDBService.instance) {
      IndexedDBService.instance = new IndexedDBService();
    }
    return IndexedDBService.instance;
  }

  async init(): Promise<void> {
    await this.stateManager.ensureInitialized();
  }

  // Project methods
  async getAllProjects(): Promise<Project[]> {
    return this.stateManager.queueOperation(() => this.dbMethods.getAllProjects());
  }

  async getProject(id: string): Promise<Project | undefined> {
    return this.stateManager.queueOperation(() => this.dbMethods.getProject(id));
  }

  async addProject(project: Project): Promise<void> {
    return this.stateManager.queueOperation(() => this.dbMethods.addProject(project));
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<void> {
    return this.stateManager.queueOperation(() => this.dbMethods.updateProject(id, updates));
  }

  async deleteProject(id: string): Promise<void> {
    return this.stateManager.queueOperation(() => this.dbMethods.deleteProject(id));
  }

  async getAllCollaborators(): Promise<Collaborator[]> {
    return this.stateManager.queueOperation(() => this.dbMethods.getAllCollaborators());
  }

  async addCollaborator(collaborator: Collaborator): Promise<void> {
    return this.stateManager.queueOperation(() => this.dbMethods.addCollaborator(collaborator));
  }

  async updateCollaborator(id: string, updates: Partial<Collaborator>): Promise<void> {
    return this.stateManager.queueOperation(() => this.dbMethods.updateCollaborator(id, updates));
  }

  async deleteCollaborator(id: string): Promise<void> {
    return this.stateManager.queueOperation(() => this.dbMethods.deleteCollaborator(id));
  }

  async getAllSitReps(): Promise<SitRep[]> {
    return this.stateManager.queueOperation(() => this.dbMethods.getAllSitReps());
  }

  async addSitRep(sitrep: SitRep): Promise<void> {
    return this.stateManager.queueOperation(() => this.dbMethods.addSitRep(sitrep));
  }

  async updateSitRep(id: string, updates: Partial<SitRep>): Promise<void> {
    return this.stateManager.queueOperation(() => this.dbMethods.updateSitRep(id, updates));
  }

  async deleteSitRep(id: string): Promise<void> {
    return this.stateManager.queueOperation(() => this.dbMethods.deleteSitRep(id));
  }

  async getAllSPIs(): Promise<SPI[]> {
    return this.stateManager.queueOperation(() => this.dbMethods.getAllSPIs());
  }

  async addSPI(spi: SPI): Promise<void> {
    return this.stateManager.queueOperation(() => this.dbMethods.addSPI(spi));
  }

  async updateSPI(id: string, updates: Partial<SPI>): Promise<void> {
    return this.stateManager.queueOperation(() => this.dbMethods.updateSPI(id, updates));
  }

  async deleteSPI(id: string): Promise<void> {
    return this.stateManager.queueOperation(() => this.dbMethods.deleteSPI(id));
  }

  async getAllObjectives(): Promise<Objective[]> {
    return this.stateManager.queueOperation(() => this.dbMethods.getAllObjectives());
  }

  async addObjective(objective: Objective): Promise<void> {
    return this.stateManager.queueOperation(() => this.dbMethods.addObjective(objective));
  }

  async updateObjective(id: string, updates: Partial<Objective>): Promise<void> {
    return this.stateManager.queueOperation(() => this.dbMethods.updateObjective(id, updates));
  }

  async deleteObjective(id: string): Promise<void> {
    return this.stateManager.queueOperation(() => this.dbMethods.deleteObjective(id));
  }

  getDatabase(): IDBDatabase | null {
    return this.stateManager.getDatabase();
  }

  setDatabase(db: IDBDatabase | null): void {
    this.stateManager.setDatabase(db);
  }
}
