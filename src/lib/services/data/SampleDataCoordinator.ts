import { DataQuantities } from "@/lib/types/data";
import { Fortune30GenerationService } from "./services/Fortune30GenerationService";
import { toast } from "@/components/ui/use-toast";
import { db } from "@/lib/db";

export class SampleDataCoordinator {
  private fortune30Service: Fortune30GenerationService;

  constructor() {
    this.fortune30Service = new Fortune30GenerationService();
  }

  async generateData(quantities: DataQuantities): Promise<void> {
    try {
      // Generate Fortune 30 partners
      const { data: fortune30Partners } = await this.fortune30Service.generate(quantities.fortune30);

      // Add to database
      for (const partner of fortune30Partners) {
        await db.addCollaborator(partner);
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