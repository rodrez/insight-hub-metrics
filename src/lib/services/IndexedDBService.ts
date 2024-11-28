import { Project } from '../types';
import { Collaborator } from '../types/collaboration';
import { DataService } from './DataService';
import { DB_CONFIG, createStores } from './db/stores';
import { TransactionManager } from './db/transactionManager';
import { generateSampleData } from './data/sampleDataGenerator';
import { connectionManager } from './db/connectionManager';
import { DatabaseCleaner } from './db/databaseCleaner';
import { SitRep } from '../types/sitrep';
import { SPI } from '../types/spi';
import { Team } from '../types/team';
import { Objective } from '../types/objective';

export class IndexedDBService implements DataService {
  private db: IDBDatabase | null = null;
  private transactionManager: TransactionManager | null = null;

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
        connectionManager.addConnection(this.db);
        this.transactionManager = new TransactionManager(this.db);
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        createStores(db);
      };
    });
  }

  private ensureInitialized() {
    if (!this.db || !this.transactionManager) {
      throw new Error('Database not initialized');
    }
  }

  async clear(): Promise<void> {
    console.log('Starting database clear...');
    
    if (this.db) {
      connectionManager.closeAllConnections();
      this.db = null;
      this.transactionManager = null;
    }

    await DatabaseCleaner.clearDatabase();
  }

  async getAllProjects(): Promise<Project[]> {
    this.ensureInitialized();
    const result = await this.transactionManager!.performTransaction('projects', 'readonly', store => store.getAll());
    return result as Project[];
  }

  async getProject(id: string): Promise<Project | undefined> {
    this.ensureInitialized();
    const result = await this.transactionManager!.performTransaction('projects', 'readonly', store => store.get(id));
    return result as Project | undefined;
  }

  async addProject(project: Project): Promise<void> {
    this.ensureInitialized();
    try {
      await this.transactionManager!.performTransaction('projects', 'readwrite', store => {
        const request = store.put(project);
        return request;
      });
      console.log(`Project ${project.id} added successfully`);
    } catch (error) {
      console.error(`Error adding project ${project.id}:`, error);
      throw error;
    }
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<void> {
    this.ensureInitialized();
    const existingProject = await this.getProject(id);
    if (!existingProject) {
      throw new Error('Project not found');
    }
    await this.transactionManager!.performTransaction('projects', 'readwrite', 
      store => store.put({ ...existingProject, ...updates }));
  }

  async getAllCollaborators(): Promise<Collaborator[]> {
    this.ensureInitialized();
    const collaborators = await this.transactionManager!.performTransaction('collaborators', 'readonly', store => store.getAll()) as Collaborator[];
    const projects = await this.getAllProjects();
    
    return collaborators.map(collaborator => ({
      ...collaborator,
      projects: collaborator.projects.map(colProj => {
        const fullProject = projects.find(p => p.id === colProj.id);
        return {
          ...colProj,
          nabc: fullProject?.nabc,
          status: fullProject?.status
        };
      })
    }));
  }

  async getCollaborator(id: string): Promise<Collaborator | undefined> {
    this.ensureInitialized();
    const collaborator = await this.transactionManager!.performTransaction('collaborators', 'readonly', store => store.get(id)) as Collaborator | undefined;
    if (!collaborator) return undefined;
    
    const projects = await this.getAllProjects();
    return {
      ...collaborator,
      projects: collaborator.projects.map(colProj => {
        const fullProject = projects.find(p => p.id === colProj.id);
        return {
          ...colProj,
          nabc: fullProject?.nabc,
          status: fullProject?.status
        };
      })
    };
  }

  async addCollaborator(collaborator: Collaborator): Promise<void> {
    this.ensureInitialized();
    try {
      await this.transactionManager!.performTransaction('collaborators', 'readwrite', store => {
        const request = store.put({ ...collaborator });
        return request;
      });
      console.log(`Collaborator ${collaborator.name} added successfully`);
    } catch (error) {
      console.error(`Error adding collaborator ${collaborator.name}:`, error);
      throw error;
    }
  }

  async getAllSitReps(): Promise<SitRep[]> {
    this.ensureInitialized();
    const sitreps = await this.transactionManager!.performTransaction('sitreps', 'readonly', store => store.getAll()) as SitRep[];
    return sitreps;
  }

  async addSitRep(sitrep: SitRep): Promise<void> {
    this.ensureInitialized();
    try {
      await this.transactionManager!.performTransaction('sitreps', 'readwrite', store => {
        const request = store.put(sitrep);
        return request;
      });
      console.log(`SitRep ${sitrep.id} added successfully`);
    } catch (error) {
      console.error(`Error adding SitRep ${sitrep.id}:`, error);
      throw error;
    }
  }

  async getAllSPIs(): Promise<SPI[]> {
    this.ensureInitialized();
    const spis = await this.transactionManager!.performTransaction('spis', 'readonly', store => store.getAll()) as SPI[];
    return spis;
  }

  async getSPI(id: string): Promise<SPI | undefined> {
    this.ensureInitialized();
    const spi = await this.transactionManager!.performTransaction('spis', 'readonly', store => store.get(id)) as SPI | undefined;
    return spi;
  }

  async addSPI(spi: SPI): Promise<void> {
    this.ensureInitialized();
    try {
      await this.transactionManager!.performTransaction('spis', 'readwrite', store => {
        const request = store.put(spi);
        return request;
      });
      console.log(`SPI ${spi.id} added successfully`);
    } catch (error) {
      console.error(`Error adding SPI ${spi.id}:`, error);
      throw error;
    }
  }

  async updateSPI(id: string, updates: Partial<SPI>): Promise<void> {
    this.ensureInitialized();
    const existingSPI = await this.getSPI(id);
    if (!existingSPI) {
      throw new Error('SPI not found');
    }
    await this.transactionManager!.performTransaction('spis', 'readwrite', 
      store => store.put({ ...existingSPI, ...updates }));
  }

  async getAllObjectives(): Promise<Objective[]> {
    this.ensureInitialized();
    const objectives = await this.transactionManager!.performTransaction('objectives', 'readonly', store => store.getAll()) as Objective[];
    return objectives;
  }

  async updateObjective(id: string, updates: Partial<Objective>): Promise<void> {
    this.ensureInitialized();
    const existingObjective = await this.transactionManager!.performTransaction('objectives', 'readonly', store => store.get(id)) as Objective;
    if (!existingObjective) {
      throw new Error('Objective not found');
    }
    await this.transactionManager!.performTransaction('objectives', 'readwrite', 
      store => store.put({ ...existingObjective, ...updates }));
  }

  async populateSampleData(): Promise<{ projects: Project[] }> {
    this.ensureInitialized();
    const { projects, internalPartners } = await generateSampleData([]);
    
    try {
      console.log('Adding collaborators...');
      for (const collaborator of internalPartners) {
        try {
          console.log(`Adding internal collaborator: ${collaborator.name}`);
          await this.addCollaborator(collaborator);
        } catch (error) {
          console.error(`Failed to add collaborator ${collaborator.name}:`, error);
          throw error;
        }
      }
      
      console.log('Adding projects...');
      for (const project of projects) {
        try {
          console.log(`Adding project: ${project.name}`);
          await this.addProject(project);
        } catch (error) {
          console.error(`Failed to add project ${project.name}:`, error);
          throw error;
        }
      }
      
      return { projects };
    } catch (error) {
      console.error('Sample data population error:', error);
      throw error;
    }
  }

  async exportData(): Promise<void> {
    const projects = await this.getAllProjects();
    const collaborators = await this.getAllCollaborators();
    const data = {
      projects,
      collaborators,
      exportDate: new Date().toISOString(),
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
  }

  async getAllTeams(): Promise<Team[]> {
    this.ensureInitialized();
    const departments = ["Engineering", "Product", "Design", "Marketing", "Operations"];
    return departments.map(dept => ({
      id: dept.toLowerCase(),
      name: dept,
      department: dept
    }));
  }
}
