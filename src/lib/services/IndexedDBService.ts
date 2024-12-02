import { DataService } from "./DataService";
import { Project, Collaborator, Team } from "../types";
import { SitRep } from "../types/sitrep";
import { SPI } from "../types/spi";
import { Objective } from "../types/objective";
import { DataQuantities } from "../types/data";
import { generateSampleData } from "./data/sampleDataGenerator";

export class IndexedDBService implements DataService {
  private db: IDBDatabase | null = null;

  constructor() {
    this.init().catch(console.error);
  }

  public async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('collaboration-db', 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        if (!db.objectStoreNames.contains('projects')) {
          db.createObjectStore('projects', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('collaborators')) {
          db.createObjectStore('collaborators', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('sitreps')) {
          db.createObjectStore('sitreps', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('spis')) {
          db.createObjectStore('spis', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('objectives')) {
          db.createObjectStore('objectives', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('initiatives')) {
          db.createObjectStore('initiatives', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('teams')) {
          db.createObjectStore('teams', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('smePartners')) {
          db.createObjectStore('smePartners', { keyPath: 'id' });
        }
      };
    });
  }

  public async clear(): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    const stores = ['projects', 'collaborators', 'sitreps', 'spis', 'objectives', 'initiatives', 'teams', 'smePartners'];
    const promises = stores.map(store => {
      return new Promise<void>((resolve, reject) => {
        const transaction = this.db!.transaction([store], 'readwrite');
        const objectStore = transaction.objectStore(store);
        const request = objectStore.clear();

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve();
      });
    });

    await Promise.all(promises);
  }

  public async getAllProjects(): Promise<Project[]> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['projects'], 'readonly');
      const store = transaction.objectStore('projects');
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  public async getProject(id: string): Promise<Project | undefined> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['projects'], 'readonly');
      const store = transaction.objectStore('projects');
      const request = store.get(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  public async addProject(project: Project): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['projects'], 'readwrite');
      const store = transaction.objectStore('projects');
      const request = store.put(project);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  public async updateProject(id: string, updates: Partial<Project>): Promise<void> {
    const project = await this.getProject(id);
    if (!project) throw new Error("Project not found");

    await this.addProject({ ...project, ...updates });
  }

  public async getAllCollaborators(): Promise<Collaborator[]> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['collaborators'], 'readonly');
      const store = transaction.objectStore('collaborators');
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  public async getCollaborator(id: string): Promise<Collaborator | undefined> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['collaborators'], 'readonly');
      const store = transaction.objectStore('collaborators');
      const request = store.get(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  public async addCollaborator(collaborator: Collaborator): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['collaborators'], 'readwrite');
      const store = transaction.objectStore('collaborators');
      const request = store.put(collaborator);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  public async updateCollaborator(id: string, updates: Partial<Collaborator>): Promise<void> {
    const collaborator = await this.getCollaborator(id);
    if (!collaborator) throw new Error("Collaborator not found");

    await this.addCollaborator({ ...collaborator, ...updates });
  }

  public async deleteCollaborator(id: string): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['collaborators'], 'readwrite');
      const store = transaction.objectStore('collaborators');
      
      const request = store.delete(id);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  public async getAllSitReps(): Promise<SitRep[]> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['sitreps'], 'readonly');
      const store = transaction.objectStore('sitreps');
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  public async addSitRep(sitrep: SitRep): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['sitreps'], 'readwrite');
      const store = transaction.objectStore('sitreps');
      const request = store.put(sitrep);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  public async updateSitRep(id: string, updates: Partial<SitRep>): Promise<void> {
    const sitrep = await this.getSitRep(id);
    if (!sitrep) throw new Error("SitRep not found");

    await this.addSitRep({ ...sitrep, ...updates });
  }

  public async getSitRep(id: string): Promise<SitRep | undefined> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['sitreps'], 'readonly');
      const store = transaction.objectStore('sitreps');
      const request = store.get(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  public async getAllSPIs(): Promise<SPI[]> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['spis'], 'readonly');
      const store = transaction.objectStore('spis');
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  public async getSPI(id: string): Promise<SPI | undefined> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['spis'], 'readonly');
      const store = transaction.objectStore('spis');
      const request = store.get(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  public async addSPI(spi: SPI): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['spis'], 'readwrite');
      const store = transaction.objectStore('spis');
      const request = store.put(spi);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  public async updateSPI(id: string, updates: Partial<SPI>): Promise<void> {
    const spi = await this.getSPI(id);
    if (!spi) throw new Error("SPI not found");

    await this.addSPI({ ...spi, ...updates });
  }

  public async deleteSPI(id: string): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['spis'], 'readwrite');
      const store = transaction.objectStore('spis');
      const request = store.delete(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  public async getAllObjectives(): Promise<Objective[]> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['objectives'], 'readonly');
      const store = transaction.objectStore('objectives');
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  public async addObjective(objective: Objective): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['objectives'], 'readwrite');
      const store = transaction.objectStore('objectives');
      const request = store.put(objective);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  public async updateObjective(id: string, updates: Partial<Objective>): Promise<void> {
    const objective = await this.getObjective(id);
    if (!objective) throw new Error("Objective not found");

    await this.addObjective({ ...objective, ...updates });
  }

  public async deleteObjective(id: string): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['objectives'], 'readwrite');
      const store = transaction.objectStore('objectives');
      const request = store.delete(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  public async getObjective(id: string): Promise<Objective | undefined> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['objectives'], 'readonly');
      const store = transaction.objectStore('objectives');
      const request = store.get(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  public async getAllInitiatives(): Promise<any[]> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['initiatives'], 'readonly');
      const store = transaction.objectStore('initiatives');
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  public async updateInitiative(id: string, initiative: any): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['initiatives'], 'readwrite');
      const store = transaction.objectStore('initiatives');
      const request = store.put(initiative);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  public async deleteInitiative(id: string): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['initiatives'], 'readwrite');
      const store = transaction.objectStore('initiatives');
      const request = store.delete(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  public async exportData(): Promise<any> {
    const projects = await this.getAllProjects();
    const collaborators = await this.getAllCollaborators();
    const sitreps = await this.getAllSitReps();
    const spis = await this.getAllSPIs();
    const objectives = await this.getAllObjectives();
    const smePartners = await this.getAllSMEPartners();

    return {
      projects,
      collaborators,
      sitreps,
      spis,
      objectives,
      smePartners
    };
  }

  public async getAllTeams(): Promise<Team[]> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['teams'], 'readonly');
      const store = transaction.objectStore('teams');
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  public async populateSampleData(quantities: DataQuantities): Promise<void> {
    await this.clear();
    const data = await generateSampleData(quantities);
    
    for (const project of data.projects) {
      await this.addProject(project);
    }
    
    for (const collaborator of data.collaborators) {
      await this.addCollaborator(collaborator);
    }
    
    for (const sitrep of data.sitreps) {
      await this.addSitRep(sitrep);
    }
    
    for (const spi of data.spis) {
      await this.addSPI(spi);
    }
    
    for (const objective of data.objectives) {
      await this.addObjective(objective);
    }
  }

  public getDatabase(): IDBDatabase | null {
    return this.db;
  }

  public async getAllSMEPartners(): Promise<Collaborator[]> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['smePartners'], 'readonly');
      const store = transaction.objectStore('smePartners');
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  public async getSMEPartner(id: string): Promise<Collaborator | undefined> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['smePartners'], 'readonly');
      const store = transaction.objectStore('smePartners');
      const request = store.get(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  public async addSMEPartner(partner: Collaborator): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['smePartners'], 'readwrite');
      const store = transaction.objectStore('smePartners');
      const request = store.put(partner);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }
}