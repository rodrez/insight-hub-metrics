import { DataQuantities } from "@/lib/types/data";
import { Fortune30GenerationService } from "./services/Fortune30GenerationService";
import { toast } from "@/components/ui/use-toast";
import { db } from "@/lib/db";
import { generateSampleProjects } from "./generators/projectGenerator";
import { DEPARTMENTS } from "@/lib/constants";

export class SampleDataCoordinator {
  private fortune30Service: Fortune30GenerationService;

  constructor() {
    this.fortune30Service = new Fortune30GenerationService();
  }

  async generateData(quantities: DataQuantities): Promise<void> {
    try {
      // Generate Fortune 30 partners
      const { data: fortune30Partners } = await this.fortune30Service.generate(quantities.fortune30);
      
      const projectInput = {
        ...quantities,
        departments: DEPARTMENTS,
        fortune30Partners,
        collaborators: []
      };

      const { projects, spis, objectives, initiatives, sitreps } = await generateSampleProjects(projectInput);

      // Add to database
      for (const partner of fortune30Partners) {
        await db.addCollaborator(partner);
      }

      for (const project of projects) {
        await db.addProject(project);
      }

      for (const spi of spis) {
        await db.addSPI(spi);
      }

      for (const objective of objectives) {
        await db.addObjective(objective);
      }

      for (const initiative of initiatives) {
        await db.addInitiative(initiative);
      }

      for (const sitrep of sitreps) {
        await db.addSitRep(sitrep);
      }

      toast({
        title: "Success",
        description: "Sample data generated successfully",
      });
    } catch (error) {
      console.error('Error generating sample data:', error);
      toast({
        title: "Error",
        description: "Failed to generate sample data",
        variant: "destructive",
      });
      throw error;
    }
  }
}