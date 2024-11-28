import { Project } from '../types';
import { Collaborator } from '../types/collaboration';
import { SitRep } from '../types/sitrep';
import { SPI } from '../types/spi';
import { Team } from '../types/team';

export interface DataService {
  init(): Promise<void>;
  getAllProjects(): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  addProject(project: Project): Promise<void>;
  updateProject(id: string, updates: Partial<Project>): Promise<void>;
  getAllCollaborators(): Promise<Collaborator[]>;
  getCollaborator(id: string): Promise<Collaborator | undefined>;
  addCollaborator(collaborator: Collaborator): Promise<void>;
  getAllSitReps(): Promise<SitRep[]>;
  addSitRep(sitrep: SitRep): Promise<void>;
  getAllSPIs(): Promise<SPI[]>;
  getSPI(id: string): Promise<SPI | undefined>;
  addSPI(spi: SPI): Promise<void>;
  updateSPI(id: string, updates: Partial<SPI>): Promise<void>;
  exportData(): Promise<void>;
  clear(): Promise<void>;
  populateSampleData(): Promise<{ projects: Project[] }>;
  getAllTeams(): Promise<Team[]>;
}