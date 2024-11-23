import { toast } from "@/components/ui/use-toast";
import { db } from "@/lib/db";
import { Project, Collaborator } from "@/lib/types";

export interface IntegrityCheckResult {
  projects: boolean;
  fortune30Partners: boolean;
  internalPartners: boolean;
  glossaryItems: boolean;
}

export const runIntegrityChecks = async (): Promise<IntegrityCheckResult> => {
  const results: IntegrityCheckResult = {
    projects: false,
    fortune30Partners: false,
    internalPartners: false,
    glossaryItems: false
  };

  try {
    // Check Projects
    const projects = await db.getAllProjects();
    results.projects = projects.length > 0;
    toast({
      title: "Projects Check",
      description: `${projects.length} projects loaded${results.projects ? ' ✓' : ' ✗'}`,
    });

    // Check Collaborators
    const collaborators = await db.getAllCollaborators();
    const fortune30 = collaborators.filter(c => c.type === 'fortune30');
    const internal = collaborators.filter(c => c.type === 'other');
    
    results.fortune30Partners = fortune30.length > 0;
    results.internalPartners = internal.length > 0;

    toast({
      title: "Collaborators Check",
      description: `${fortune30.length} Fortune 30 partners loaded${results.fortune30Partners ? ' ✓' : ' ✗'}\n${internal.length} internal partners loaded${results.internalPartners ? ' ✓' : ' ✗'}`,
    });

    // Validate Project-Collaborator relationships
    const projectsWithMissingCollaborators = projects.filter(
      p => !p.collaborators || p.collaborators.length === 0
    );

    if (projectsWithMissingCollaborators.length > 0) {
      toast({
        title: "Warning",
        description: `${projectsWithMissingCollaborators.length} projects have no collaborators assigned`,
        variant: "destructive",
      });
    }

    // Check for expired or soon-to-expire agreements
    const today = new Date();
    const warningDays = 180; // 6 months warning
    const criticalDays = 90; // 3 months critical

    fortune30.forEach(partner => {
      if (partner.agreements) {
        const { nda, jtda } = partner.agreements;
        const checkAgreement = (agreement: { expiryDate: string }, type: string) => {
          if (agreement) {
            const expiryDate = new Date(agreement.expiryDate);
            const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            
            if (daysUntilExpiry <= criticalDays) {
              toast({
                title: "Critical Agreement Expiry",
                description: `${partner.name}'s ${type} expires in ${daysUntilExpiry} days`,
                variant: "destructive",
              });
            } else if (daysUntilExpiry <= warningDays) {
              toast({
                title: "Agreement Expiry Warning",
                description: `${partner.name}'s ${type} expires in ${daysUntilExpiry} days`,
                variant: "warning",
              });
            }
          }
        };

        checkAgreement(nda, 'NDA');
        checkAgreement(jtda, 'JTDA');
      }
    });

    return results;
  } catch (error) {
    toast({
      title: "Integrity Check Failed",
      description: "Error running integrity checks. Please try again.",
      variant: "destructive",
    });
    throw error;
  }
};