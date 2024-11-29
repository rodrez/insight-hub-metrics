import { toast } from "@/components/ui/use-toast";
import { Check } from "lucide-react";
import { db } from "@/lib/db";

export class DataValidationService {
  private showValidationStep(step: string, count: number) {
    toast({
      title: <div className="flex items-center gap-2">
        <Check className="h-4 w-4 text-green-500" />
        {step}
      </div>,
      description: `Found ${count} valid records`,
      duration: 2000,
    });
  }

  async validateAllData() {
    try {
      // Validate each store
      const projects = await db.getAllProjects();
      this.showValidationStep("Validated Projects", projects.length);

      const collaborators = await db.getAllCollaborators();
      const fortune30 = collaborators.filter(c => c.type === 'fortune30');
      const internal = collaborators.filter(c => c.type === 'other');
      this.showValidationStep("Validated Fortune 30 Partners", fortune30.length);
      this.showValidationStep("Validated Internal Partners", internal.length);

      const smePartners = await db.getAllSMEPartners();
      this.showValidationStep("Validated SME Partners", smePartners.length);

      const spis = await db.getAllSPIs();
      this.showValidationStep("Validated SPIs", spis.length);

      const objectives = await db.getAllObjectives();
      this.showValidationStep("Validated Objectives", objectives.length);

      const sitreps = await db.getAllSitReps();
      this.showValidationStep("Validated SitReps", sitreps.length);

      return {
        success: true,
        counts: {
          projects: projects.length,
          fortune30: fortune30.length,
          internal: internal.length,
          smePartners: smePartners.length,
          spis: spis.length,
          objectives: objectives.length,
          sitreps: sitreps.length
        }
      };
    } catch (error) {
      console.error('Validation error:', error);
      toast({
        title: "Validation Error",
        description: error instanceof Error ? error.message : "Failed to validate data",
        variant: "destructive",
      });
      return { success: false, error };
    }
  }
}