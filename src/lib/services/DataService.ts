import { Project, Collaborator, Team } from '../types';
import { SitRep } from '../types/sitrep';
import { SPI } from '../types/spi';
import { Objective } from '../types/objective';
import { DataQuantities } from '../types/data';

export interface ExportedData {
  projects: Project[];
  collaborators: Collaborator[];
  sitreps: SitRep[];
  spis: SPI[];
  objectives: Objective[];
  smePartners: Collaborator[];
}

export interface DataService {
  init(): Promise<void>;
  clear(): Promise<void>;
  getAllProjects(): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  addProject(project: Project): Promise<void>;
  updateProject(id: string, updates: Partial<Project>): Promise<void>;
  getAllCollaborators(): Promise<Collaborator[]>;
  getCollaborator(id: string): Promise<Collaborator | undefined>;
  addCollaborator(collaborator: Collaborator): Promise<void>;
  updateCollaborator(id: string, updates: Partial<Collaborator>): Promise<void>;
  getAllSitReps(): Promise<SitRep[]>;
  addSitRep(sitrep: SitRep): Promise<void>;
  updateSitRep(id: string, updates: Partial<SitRep>): Promise<void>;
  getAllSPIs(): Promise<SPI[]>;
  getSPI(id: string): Promise<SPI | undefined>;
  addSPI(spi: SPI): Promise<void>;
  updateSPI(id: string, updates: Partial<SPI>): Promise<void>;
  deleteSPI(id: string): Promise<void>;
  getAllObjectives(): Promise<Objective[]>;
  addObjective(objective: Objective): Promise<void>;
  updateObjective(id: string, updates: Partial<Objective>): Promise<void>;
  deleteObjective(id: string): Promise<void>;
  getAllInitiatives(): Promise<any[]>;
  updateInitiative(id: string, initiative: any): Promise<void>;
  deleteInitiative(id: string): Promise<void>;
  exportData(): Promise<ExportedData>;
  getAllTeams(): Promise<Team[]>;
  populateSampleData(quantities: DataQuantities): Promise<void>;
  getAllSMEPartners(): Promise<Collaborator[]>;
  getSMEPartner(id: string): Promise<Collaborator | undefined>;
  addSMEPartner(partner: Collaborator): Promise<void>;
  getDatabase(): IDBDatabase | null;
}