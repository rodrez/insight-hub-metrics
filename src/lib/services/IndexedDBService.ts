import { DataService, SampleDataQuantities } from './DataService';
import { Project, Collaborator, Team } from '../types';
import { SitRep } from '../types/sitrep';
import { SPI } from '../types/spi';
import { Objective } from '../types/objective';
import { BaseDBService } from './db/base/BaseDBService';
import { ProjectService } from './db/ProjectService';
import { handleDatabaseError, DatabaseError } from '../utils/errorHandling';

export class IndexedDBService extends BaseDBService implements DataService {
  protected db: IDBDatabase | null = null;
  private projectService: ProjectService;
  private collaboratorService: any;
  private sitRepService: any;
  private spiService: any;
  private sampleDataService: any;
  private initialized: boolean = false;

  constructor() {
    super();
    this.projectService = new ProjectService(null);
  }

  async init(): Promise<void> {
    if (this.initialized) return;
    
    try {
      await super.init();
      this.projectService.setDatabase(this.db);
      this.collaboratorService?.setDatabase(this.db);
      this.sitRepService?.setDatabase(this.db);
      this.spiService?.setDatabase(this.db);
      this.sampleDataService?.setDatabase(this.db);
      this.initialized = true;
    } catch (error) {
      throw new DatabaseError('Failed to initialize database', error);
    }
  }

  async getAllProjects(): Promise<Project[]> {
    try {
      await this.ensureInitialized();
      return await this.performTransaction('projects', 'readonly', store => store.getAll());
    } catch (error) {
      return handleDatabaseError(error, 'getAllProjects');
    }
  }

  async getProject(id: string): Promise<Project | undefined> {
    try {
      await this.ensureInitialized();
      return await this.performTransaction('projects', 'readonly', store => store.get(id));
    } catch (error) {
      return handleDatabaseError(error, 'getProject');
    }
  }

  async addProject(project: Project): Promise<void> {
    try {
      await this.ensureInitialized();
      await this.performTransaction('projects', 'readwrite', store => store.put(project));
    } catch (error) {
      handleDatabaseError(error, 'addProject');
    }
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<void> {
    try {
      await this.ensureInitialized();
      const project = await this.getProject(id);
      if (!project) throw new DatabaseError('Project not found');
      await this.addProject({ ...project, ...updates });
    } catch (error) {
      handleDatabaseError(error, 'updateProject');
    }
  }

  async getAllCollaborators(): Promise<Collaborator[]> {
    try {
      await this.ensureInitialized();
      return await this.performTransaction('collaborators', 'readonly', store => store.getAll());
    } catch (error) {
      return handleDatabaseError(error, 'getAllCollaborators');
    }
  }

  async getCollaborator(id: string): Promise<Collaborator | undefined> {
    try {
      await this.ensureInitialized();
      return await this.performTransaction('collaborators', 'readonly', store => store.get(id));
    } catch (error) {
      return handleDatabaseError(error, 'getCollaborator');
    }
  }

  async addCollaborator(collaborator: Collaborator): Promise<void> {
    try {
      await this.ensureInitialized();
      await this.performTransaction('collaborators', 'readwrite', store => store.put(collaborator));
    } catch (error) {
      handleDatabaseError(error, 'addCollaborator');
    }
  }

  async getAllSitReps(): Promise<SitRep[]> {
    await this.ensureInitialized();
    return this.performTransaction('sitreps', 'readonly', store => store.getAll());
  }

  async addSitRep(sitrep: SitRep): Promise<void> {
    await this.ensureInitialized();
    return this.performTransaction('sitreps', 'readwrite', store => store.put(sitrep));
  }

  async getAllSPIs(): Promise<SPI[]> {
    await this.ensureInitialized();
    return this.performTransaction('spis', 'readonly', store => store.getAll());
  }

  async getSPI(id: string): Promise<SPI | undefined> {
    await this.ensureInitialized();
    return this.performTransaction('spis', 'readonly', store => store.get(id));
  }

  async addSPI(spi: SPI): Promise<void> {
    await this.ensureInitialized();
    return this.performTransaction('spis', 'readwrite', store => store.put(spi));
  }

  async updateSPI(id: string, updates: Partial<SPI>): Promise<void> {
    await this.ensureInitialized();
    const spi = await this.getSPI(id);
    if (!spi) throw new Error('SPI not found');
    return this.addSPI({ ...spi, ...updates });
  }

  async getAllObjectives(): Promise<Objective[]> {
    await this.ensureInitialized();
    return this.performTransaction('objectives', 'readonly', store => store.getAll());
  }

  async addObjective(objective: Objective): Promise<void> {
    await this.ensureInitialized();
    return this.performTransaction('objectives', 'readwrite', store => store.put(objective));
  }

  async updateObjective(id: string, updates: Partial<Objective>): Promise<void> {
    await this.ensureInitialized();
    const objective = await this.performTransaction('objectives', 'readonly', store => store.get(id)) as Objective | undefined;
    if (!objective) throw new Error('Objective not found');
    const updatedObjective: Objective = { ...objective, ...updates as Partial<Objective> };
    return this.addObjective(updatedObjective);
  }

  async getAllTeams(): Promise<Team[]> {
    await this.ensureInitialized();
    return this.performTransaction('teams', 'readonly', store => store.getAll());
  }

  async getAllSMEPartners(): Promise<Collaborator[]> {
    await this.ensureInitialized();
    return this.performTransaction('smePartners', 'readonly', store => store.getAll());
  }

  async getSMEPartner(id: string): Promise<Collaborator | undefined> {
    await this.ensureInitialized();
    return this.performTransaction('smePartners', 'readonly', store => store.get(id));
  }

  async addSMEPartner(partner: Collaborator): Promise<void> {
    await this.ensureInitialized();
    return this.performTransaction('smePartners', 'readwrite', store => store.put(partner));
  }

  async clear(): Promise<void> {
    try {
      const request = indexedDB.deleteDatabase(DB_CONFIG.name);
      
      await new Promise<void>((resolve, reject) => {
        request.onerror = () => reject(new DatabaseError('Failed to clear database'));
        request.onsuccess = () => resolve();
      });
      
      this.db = null;
      this.initialized = false;
    } catch (error) {
      handleDatabaseError(error, 'clear');
    }
  }

  async exportData(): Promise<void> {
    try {
      await this.ensureInitialized();
      const data = {
        projects: await this.getAllProjects(),
        collaborators: await this.getAllCollaborators(),
        objectives: await this.getAllObjectives(),
        sitreps: await this.getAllSitReps(),
        spis: await this.getAllSPIs()
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `project-data-${new Date().toISOString()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      handleDatabaseError(error, 'exportData');
    }
  }

  async populateSampleData(quantities: SampleDataQuantities): Promise<void> {
    try {
      await this.ensureInitialized();
    console.log('Sample data population not implemented yet');
    } catch (error) {
      handleDatabaseError(error, 'populateSampleData');
    }
  }
}
