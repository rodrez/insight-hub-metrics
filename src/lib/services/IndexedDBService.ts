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
import { SampleDataService } from './data/SampleDataService';

export class IndexedDBService implements DataService {
  protected connectionService: DatabaseConnectionService;
  protected transactionService: DatabaseTransactionService;
  protected teamService: TeamService;
  private sampleDataService: SampleDataService;

  constructor() {
    this.connectionService = new DatabaseConnectionService();
    this.transactionService = new DatabaseTransactionService(null);
    this.sampleDataService = new SampleDataService();
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

  public async getAllSitReps(): Promise<SitRep[]> {
    return this.transactionService.performTransaction('sitreps', 'readonly', store => store.getAll());
  }

  public async addSitRep(sitrep: SitRep): Promise<void> {
    await this.transactionService.performTransaction('sitreps', 'readwrite', store => store.put(sitrep));
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

  public async getAllObjectives(): Promise<Objective[]> {
    return this.transactionService.performTransaction('objectives', 'readonly', store => store.getAll());
  }

  public async addObjective(objective: Objective): Promise<void> {
    await this.transactionService.performTransaction('objectives', 'readwrite', store => store.put(objective));
  }

  public async exportData(): Promise<void> {
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

  public async getAllTeams(): Promise<Team[]> {
    return this.transactionService.performTransaction('teams', 'readonly', store => store.getAll());
  }

  public async populateSampleData(quantities: DataQuantities): Promise<void> {
    const data = await this.sampleDataService.generateSampleData(quantities);
    await this.clear();
    
    for (const partner of data.fortune30Partners) {
      await this.addCollaborator(partner);
    }
    
    for (const partner of data.internalPartners) {
      await this.addCollaborator(partner);
    }
    
    for (const partner of data.smePartners) {
      await this.addSMEPartner(partner);
    }
    
    for (const project of data.projects) {
      await this.addProject(project);
    }
    
    for (const spi of data.spis) {
      await this.addSPI(spi);
    }
    
    for (const objective of data.objectives) {
      await this.addObjective(objective);
    }
    
    for (const sitrep of data.sitreps) {
      await this.addSitRep(sitrep);
    }
  }

  public async getAllSMEPartners(): Promise<Collaborator[]> {
    return this.transactionService.performTransaction('smePartners', 'readonly', store => store.getAll());
  }

  public async getSMEPartner(id: string): Promise<Collaborator | undefined> {
    return this.transactionService.performTransaction('smePartners', 'readonly', store => store.get(id));
  }

  public async addSMEPartner(partner: Collaborator): Promise<void> {
    await this.transactionService.performTransaction('smePartners', 'readwrite', store => store.put(partner));
  }

  public getDatabase(): IDBDatabase | null {
    return this.connectionService.getDatabase();
  }
}
