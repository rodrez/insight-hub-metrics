import { DataService } from './DataService';
import { IndexedDBService } from './IndexedDBService';
import { Project, Collaborator } from '../types';
import { SitRep } from '../types/sitrep';
import { SPI } from '../types/spi';
import { Objective } from '../types/objective';
import { Team } from '../types/team';
import { SampleDataQuantities } from './DataService';

export class SampleDataService implements DataService {
  private indexedDBService: IndexedDBService;

  constructor(indexedDBService: IndexedDBService) {
    this.indexedDBService = indexedDBService;
  }

  async init(): Promise<void> {
    return this.indexedDBService.init();
  }

  async getAllProjects(): Promise<Project[]> {
    return this.indexedDBService.getAllProjects();
  }

  async getProject(id: string): Promise<Project | undefined> {
    return this.indexedDBService.getProject(id);
  }

  async addProject(project: Project): Promise<void> {
    return this.indexedDBService.addProject(project);
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<void> {
    return this.indexedDBService.updateProject(id, updates);
  }

  async getAllCollaborators(): Promise<Collaborator[]> {
    return this.indexedDBService.getAllCollaborators();
  }

  async getCollaborator(id: string): Promise<Collaborator | undefined> {
    return this.indexedDBService.getCollaborator(id);
  }

  async addCollaborator(collaborator: Collaborator): Promise<void> {
    return this.indexedDBService.addCollaborator(collaborator);
  }

  async getAllSitReps(): Promise<SitRep[]> {
    return this.indexedDBService.getAllSitReps();
  }

  async addSitRep(sitrep: SitRep): Promise<void> {
    return this.indexedDBService.addSitRep(sitrep);
  }

  async getAllSPIs(): Promise<SPI[]> {
    return this.indexedDBService.getAllSPIs();
  }

  async getSPI(id: string): Promise<SPI | undefined> {
    return this.indexedDBService.getSPI(id);
  }

  async addSPI(spi: SPI): Promise<void> {
    return this.indexedDBService.addSPI(spi);
  }

  async updateSPI(id: string, updates: Partial<SPI>): Promise<void> {
    return this.indexedDBService.updateSPI(id, updates);
  }

  // Adding the missing deleteSPI method
  async deleteSPI(id: string): Promise<void> {
    return this.indexedDBService.deleteSPI(id);
  }

  async getAllObjectives(): Promise<Objective[]> {
    return this.indexedDBService.getAllObjectives();
  }

  async addObjective(objective: Objective): Promise<void> {
    return this.indexedDBService.addObjective(objective);
  }

  async updateObjective(id: string, updates: Partial<Objective>): Promise<void> {
    return this.indexedDBService.updateObjective(id, updates);
  }

  async getAllTeams(): Promise<Team[]> {
    return this.indexedDBService.getAllTeams();
  }

  async getAllSMEPartners(): Promise<Collaborator[]> {
    return this.indexedDBService.getAllSMEPartners();
  }

  async getSMEPartner(id: string): Promise<Collaborator | undefined> {
    return this.indexedDBService.getSMEPartner(id);
  }

  async addSMEPartner(partner: Collaborator): Promise<void> {
    return this.indexedDBService.addSMEPartner(partner);
  }

  async clear(): Promise<void> {
    return this.indexedDBService.clear();
  }

  async exportData(): Promise<void> {
    return this.indexedDBService.exportData();
  }

  async populateSampleData(quantities: SampleDataQuantities): Promise<void> {
    return this.indexedDBService.populateSampleData(quantities);
  }
}