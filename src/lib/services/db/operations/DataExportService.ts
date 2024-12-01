import { toast } from "@/components/ui/use-toast";
import { DataService } from "../../DataService";

export class DataExportService {
  constructor(private dataService: DataService) {}

  async exportData(): Promise<void> {
    try {
      const data = {
        projects: await this.dataService.getAllProjects(),
        collaborators: await this.dataService.getAllCollaborators(),
        sitreps: await this.dataService.getAllSitReps(),
        spis: await this.dataService.getAllSPIs(),
        objectives: await this.dataService.getAllObjectives(),
        smePartners: await this.dataService.getAllSMEPartners()
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `database-export-${new Date().toISOString()}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Success",
        description: "Data exported successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export data",
        variant: "destructive",
      });
      throw error;
    }
  }
}