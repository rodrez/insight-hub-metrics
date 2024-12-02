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

  async generateData(quantities: Required<DataQuantities>): Promise<void> {
    try {
      console.log('Starting data generation with quantities:', quantities);
      
      // Generate Fortune 30 partners
      const { data: fortune30Partners } = await this.fortune30Service.generate(quantities.fortune30);
      
      const projectInput = {
        ...quantities,
        departments: Array.from(DEPARTMENTS),
        fortune30Partners,
        collaborators: []
      };

      const { projects, spis, objectives, initiatives, sitreps } = await generateSampleProjects(projectInput);
      
      console.log('Generated data counts:', {
        projects: projects.length,
        spis: spis.length,
        objectives: objectives.length,
        initiatives: initiatives.length,
        sitreps: sitreps.length
      });

      // Add to database in order
      console.log('Starting database population...');

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

      console.log('Saving initiatives:', initiatives);
      for (const initiative of initiatives) {
        try {
          await db.addInitiative(initiative);
          console.log('Successfully saved initiative:', initiative.id);
        } catch (error) {
          console.error('Error saving initiative:', error);
          throw error;
        }
      }

      for (const sitrep of sitreps) {
        await db.addSitRep(sitrep);
      }

      toast({
        title: "Success",
        description: `Generated ${initiatives.length} initiatives and other sample data successfully`,
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