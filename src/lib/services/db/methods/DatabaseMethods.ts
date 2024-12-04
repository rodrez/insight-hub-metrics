import { Project, Collaborator, Team } from '@/lib/types';
import { SitRep } from '@/lib/types/sitrep';
import { SPI } from '@/lib/types/spi';
import { Objective } from '@/lib/types/objective';

export class DatabaseMethods {
  constructor(
    private projectService: any,
    private collaboratorService: any,
    private sitRepService: any,
    private spiService: any
  ) {}

  // Project methods
  getAllProjects = () => this.projectService.getAllProjects();
  getProject = (id: string) => this.projectService.getProject(id);
  addProject = (project: Project) => this.projectService.addProject(project);
  updateProject = (id: string, updates: Partial<Project>) => this.projectService.updateProject(id, updates);

  // Collaborator methods
  getAllCollaborators = () => this.collaboratorService.getAllCollaborators();
  getCollaborator = (id: string) => this.collaboratorService.getCollaborator(id);
  addCollaborator = (collaborator: Collaborator) => this.collaboratorService.addCollaborator(collaborator);
  updateCollaborator = (id: string, updates: Partial<Collaborator>) => this.collaboratorService.updateCollaborator(id, updates);

  // SitRep methods
  getAllSitReps = () => this.sitRepService.getAllSitReps();
  addSitRep = (sitrep: SitRep) => this.sitRepService.addSitRep(sitrep);
  updateSitRep = (id: string, updates: Partial<SitRep>) => this.sitRepService.updateSitRep(id, updates);

  // SPI methods
  getAllSPIs = () => this.spiService.getAllSPIs();
  getSPI = (id: string) => this.spiService.getSPI(id);
  addSPI = (spi: SPI) => this.spiService.addSPI(spi);
  updateSPI = (id: string, updates: Partial<SPI>) => this.spiService.updateSPI(id, updates);
  deleteSPI = (id: string) => this.spiService.deleteSPI(id);

  // Objective methods
  getAllObjectives = () => this.spiService.getAllObjectives();
  addObjective = (objective: Objective) => this.spiService.addObjective(objective);
  updateObjective = (id: string, updates: Partial<Objective>) => this.spiService.updateObjective(id, updates);
  deleteObjective = (id: string) => this.spiService.deleteObjective(id);

  // Initiative methods
  getAllInitiatives = () => this.spiService.getAllInitiatives();
  updateInitiative = (id: string, initiative: any) => this.spiService.updateInitiative(id, initiative);
  deleteInitiative = (id: string) => this.spiService.deleteInitiative(id);

  // SME Partner methods
  getAllSMEPartners = () => this.collaboratorService.getAllSMEPartners();
  getSMEPartner = (id: string) => this.collaboratorService.getSMEPartner(id);
  addSMEPartner = (partner: Collaborator) => this.collaboratorService.addSMEPartner(partner);
  updateSMEPartner = (id: string, updates: Partial<Collaborator>) => this.collaboratorService.updateSMEPartner(id, updates);
}