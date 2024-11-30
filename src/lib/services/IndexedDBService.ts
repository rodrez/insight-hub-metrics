import { DatabaseTransactionService } from './db/DatabaseTransactionService';
import { DatabaseConnectionService } from './db/DatabaseConnectionService';
import { Team } from '@/lib/types/team';
import { TeamService } from './db/TeamService';
import { DataService } from './DataService';
import { Project, Collaborator } from '@/lib/types';
import { SPI } from '@/lib/types/spi';
import { Objective } from '@/lib/types/objective';
import { SitRep } from '@/lib/types/sitrep';
import { DataQuantities } from '@/lib/types/data';

export class IndexedDBService implements DataService {
  protected connectionService: DatabaseConnectionService;
  protected transactionService: DatabaseTransactionService;
  protected teamService: TeamService;

  constructor() {
    this.connectionService = new DatabaseConnectionService();
    this.transactionService = new DatabaseTransactionService(null);
  }

  public async init(): Promise<void> {
    await this.connectionService.init();
    this.transactionService = new DatabaseTransactionService(this.connectionService.getDatabase());
    this.teamService = new TeamService(this.transactionService);
  }

  public async clear(): Promise<void> {
    if (!this.getDatabase()) throw new Error('Database not initialized');
    await this.transactionService.performTransaction('projects', 'readwrite', store => store.clear());
    await this.transactionService.performTransaction('collaborators', 'readwrite', store => store.clear());
    await this.transactionService.performTransaction('sitreps', 'readwrite', store => store.clear());
    await this.transactionService.performTransaction('spis', 'readwrite', store => store.clear());
    await this.transactionService.performTransaction('objectives', 'readwrite', store => store.clear());
    await this.transactionService.performTransaction('smePartners', 'readwrite', store => store.clear());
  }

  public async getAllProjects(): Promise<Project[]> {
    return this.transactionService.performTransaction('projects', 'readonly', store => store.getAll());
  }

  public async getProject(id: string): Promise<Project | undefined> {
    return this.transactionService.performTransaction('projects', 'readonly', store => store.get(id));
  }

  public async addProject(project: Project): Promise<void> {
    await this.transactionService.performTransaction('projects', 'readwrite', store => store.put(project));
  }

  public async updateProject(id: string, updates: Partial<Project>): Promise<void> {
    const project = await this.getProject(id);
    if (!project) throw new Error('Project not found');
    await this.addProject({ ...project, ...updates });
  }

  public async getAllCollaborators(): Promise<Collaborator[]> {
    return this.transactionService.performTransaction('collaborators', 'readonly', store => store.getAll());
  }

  public async getCollaborator(id: string): Promise<Collaborator | undefined> {
    return this.transactionService.performTransaction('collaborators', 'readonly', store => store.get(id));
  }

  public async addCollaborator(collaborator: Collaborator): Promise<void> {
    await this.transactionService.performTransaction('collaborators', 'readwrite', store => store.put(collaborator));
  }

  public async updateCollaborator(id: string, updates: Partial<Collaborator>): Promise<void> {
    const collaborator = await this.getCollaborator(id);
    if (!collaborator) throw new Error('Collaborator not found');
    await this.transactionService.performTransaction('collaborators', 'readwrite', store => store.put({ ...collaborator, ...updates }));
  }

  public async getAllSitReps(): Promise<SitRep[]> {
    return this.transactionService.performTransaction('sitreps', 'readonly', store => store.getAll());
  }

  public async addSitRep(sitrep: SitRep): Promise<void> {
    await this.transactionService.performTransaction('sitreps', 'readwrite', store => store.put(sitrep));
  }

  public async updateSitRep(id: string, updates: Partial<SitRep>): Promise<void> {
    const sitrep = await this.transactionService.performTransaction('sitreps', 'readonly', store => store.get(id));
    if (!sitrep) throw new Error('SitRep not found');
    await this.transactionService.performTransaction('sitreps', 'readwrite', store => store.put({ ...sitrep, ...updates }));
  }

  public async getAllSPIs(): Promise<SPI[]> {
    return this.transactionService.performTransaction('spis', 'readonly', store => store.getAll());
  }

  public async getSPI(id: string): Promise<SPI | undefined> {
    return this.transactionService.performTransaction('spis', 'readonly', store => store.get(id));
  }

  public async addSPI(spi: SPI): Promise<void> {
    await this.transactionService.performTransaction('spis', 'readwrite', store => store.put(spi));
  }

  public async updateSPI(id: string, updates: Partial<SPI>): Promise<void> {
    const spi = await this.getSPI(id);
    if (!spi) throw new Error('SPI not found');
    await this.addSPI({ ...spi, ...updates });
  }

  public async deleteSPI(id: string): Promise<void> {
    await this.transactionService.performTransaction('spis', 'readwrite', store => store.delete(id));
  }

  public async getAllObjectives(): Promise<Objective[]> {
    return this.transactionService.performTransaction('objectives', 'readonly', store => store.getAll());
  }

  public async addObjective(objective: Objective): Promise<void> {
    await this.transactionService.performTransaction('objectives', 'readwrite', store => store.put(objective));
  }

  public async updateObjective(id: string, updates: Partial<Objective>): Promise<void> {
    const objective = await this.transactionService.performTransaction('objectives', 'readonly', store => store.get(id));
    if (!objective) throw new Error('Objective not found');
    await this.transactionService.performTransaction('objectives', 'readwrite', store => store.put({ ...objective, ...updates }));
  }

  public async deleteObjective(id: string): Promise<void> {
    await this.transactionService.performTransaction('objectives', 'readwrite', store => store.delete(id));
  }

  public getDatabase(): IDBDatabase {
    return this.connectionService.getDatabase();
  }
}
