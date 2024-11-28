import { Project } from '../types';
import { Collaborator } from '../types/collaboration';
import { SitRep } from '../types/sitrep';

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
  exportData(): Promise<void>;
  clear(): Promise<void>;
  populateSampleData(): Promise<{ projects: Project[] }>;
}