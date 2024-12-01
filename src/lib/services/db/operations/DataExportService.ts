import { DataService, ExportedData } from '../../DataService';

export class DataExportService {
  constructor(private dataService: DataService) {}

  async exportData(): Promise<ExportedData> {
    const [
      projects,
      collaborators,
      sitreps,
      spis,
      objectives,
      smePartners
    ] = await Promise.all([
      this.dataService.getAllProjects(),
      this.dataService.getAllCollaborators(),
      this.dataService.getAllSitReps(),
      this.dataService.getAllSPIs(),
      this.dataService.getAllObjectives(),
      this.dataService.getAllSMEPartners()
    ]);

    return {
      projects,
      collaborators,
      sitreps,
      spis,
      objectives,
      smePartners
    };
  }
}