import { DataService, SampleDataQuantities } from './DataService';
import { Project, Collaborator, Team } from '../types';
import { SitRep } from '../types/sitrep';
import { SPI } from '../types/spi';
import { Objective } from '../types/objective';
import { ProjectService } from './db/ProjectService';
import { CollaboratorService } from './db/CollaboratorService';
import { SitRepService } from './db/SitRepService';
import { SPIService } from './db/SPIService';
import { SampleDataPopulationService } from './db/SampleDataPopulationService';
import { DatabaseClearingService } from './db/DatabaseClearingService';
import { toast } from "@/components/ui/use-toast";

export class IndexedDBService extends BaseDBService implements DataService {
  private projectService: ProjectService;
  private collaboratorService: CollaboratorService;
  private sitRepService: SitRepService;
  private spiService: SPIService;
  private sampleDataService: SampleDataPopulationService;
  private databaseClearingService: DatabaseClearingService;

  constructor() {
    super();
    this.projectService = new ProjectService(this.db);
    this.collaboratorService = new CollaboratorService();
    this.sitRepService = new SitRepService();
    this.spiService = new SPIService();
    this.sampleDataService = new SampleDataPopulationService();
    this.databaseClearingService = new DatabaseClearingService(this.db, null, null);
  }

  async init(): Promise<void> {
    try {
      await super.init();
      this.projectService.setDatabase(this.db);
      this.collaboratorService.setDatabase(this.db);
      this.sitRepService.setDatabase(this.db);
      this.spiService.setDatabase(this.db);
      this.sampleDataService.setDatabase(this.db);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to initialize database services",
        variant: "destructive",
      });
      throw error;
    }
  }

  // Delegate methods to respective services
  getAllProjects = () => this.projectService.getAllProjects();
  getProject = (id: string) => this.projectService.getProject(id);
  addProject = (project: Project) => this.projectService.addProject(project);
  updateProject = (id: string, updates: Partial<Project>) => this.projectService.updateProject(id, updates);
  
  getAllCollaborators = () => this.collaboratorService.getAllCollaborators();
  getCollaborator = (id: string) => this.collaboratorService.getCollaborator(id);
  addCollaborator = (collaborator: Collaborator) => this.collaboratorService.addCollaborator(collaborator);
  
  getAllSitReps = () => this.sitRepService.getAllSitReps();
  addSitRep = (sitrep: SitRep) => this.sitRepService.addSitRep(sitrep);
  
  getAllSPIs = () => this.spiService.getAllSPIs();
  getSPI = (id: string) => this.spiService.getSPI(id);
  addSPI = (spi: SPI) => this.spiService.addSPI(spi);
  updateSPI = (id: string, updates: Partial<SPI>) => this.spiService.updateSPI(id, updates);
  
  clear = () => this.databaseClearingService.clearDatabase();
  populateSampleData = (quantities: SampleDataQuantities) => this.sampleDataService.populateData(quantities);
}