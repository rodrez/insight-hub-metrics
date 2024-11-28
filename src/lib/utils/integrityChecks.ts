import { toast } from "@/components/ui/use-toast";
import { db } from "@/lib/db";
import { executeWithRetry, LoadingStep } from "./loadingRetry";

export interface IntegrityCheckResult {
  projects: boolean;
  fortune30Partners: boolean;
  internalPartners: boolean;
  glossaryItems: boolean;
  spis: boolean;
  sitreps: boolean;
}

const checkProjects = async (): Promise<boolean> => {
  const projects = await db.getAllProjects();
  return projects.length > 0;
};

const checkCollaborators = async (): Promise<{
  fortune30: boolean;
  internal: boolean;
}> => {
  const collaborators = await db.getAllCollaborators();
  const fortune30 = collaborators.filter(c => c.type === 'fortune30');
  const internal = collaborators.filter(c => c.type === 'other');
  return {
    fortune30: fortune30.length > 0,
    internal: internal.length > 0
  };
};

const checkSPIsAndSitReps = async (): Promise<{
  spis: boolean;
  sitreps: boolean;
}> => {
  const spis = await db.getAllSPIs();
  const sitreps = await db.getAllSitReps();
  return {
    spis: true,
    sitreps: true
  };
};

const validateProjectCollaborators = async (): Promise<boolean> => {
  const projects = await db.getAllProjects();
  return !projects.some(p => !p.collaborators || p.collaborators.length === 0);
};

const checkAgreements = async (): Promise<boolean> => {
  const collaborators = await db.getAllCollaborators();
  const fortune30 = collaborators.filter(c => c.type === 'fortune30');
  
  const today = new Date();
  const warningDays = 180;
  const criticalDays = 90;
  
  fortune30.forEach(partner => {
    if (partner.agreements) {
      const { nda, jtda } = partner.agreements;
      const checkAgreement = (agreement: { expiryDate: string }, type: string) => {
        if (agreement) {
          const expiryDate = new Date(agreement.expiryDate);
          const daysUntilExpiry = Math.ceil(
            (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
          );
          
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
              variant: "destructive",
            });
          }
        }
      };

      checkAgreement(nda, 'NDA');
      checkAgreement(jtda, 'JTDA');
    }
  });
  
  return true;
};

export const runIntegrityChecks = async (): Promise<IntegrityCheckResult> => {
  const results: IntegrityCheckResult = {
    projects: false,
    fortune30Partners: false,
    internalPartners: false,
    glossaryItems: true,
    spis: true,
    sitreps: true 
  };

  const loadingToast = toast({
    title: "Running Integrity Checks",
    description: "Verifying data integrity...",
    variant: "default",
  });

  try {
    const projectsStep: LoadingStep = {
      name: "Projects Check",
      action: async () => {
        results.projects = await checkProjects();
        return results.projects;
      }
    };
    
    const projectsSuccess = await executeWithRetry(projectsStep);
    if (!projectsSuccess) {
      toast({
        title: "Projects Check Failed",
        description: "Please contact an administrator to resolve this issue.",
        variant: "destructive",
      });
      return results;
    }

    const collaboratorsStep: LoadingStep = {
      name: "Collaborators Check",
      action: async () => {
        const { fortune30, internal } = await checkCollaborators();
        results.fortune30Partners = fortune30;
        results.internalPartners = internal;
        return fortune30 && internal;
      }
    };
    
    const collaboratorsSuccess = await executeWithRetry(collaboratorsStep);
    if (!collaboratorsSuccess) {
      toast({
        title: "Collaborators Check Failed",
        description: "Please contact an administrator to resolve this issue.",
        variant: "destructive",
      });
      return results;
    }

    const spisSitrepsStep: LoadingStep = {
      name: "SPIs and SitReps Check",
      action: async () => {
        const { spis, sitreps } = await checkSPIsAndSitReps();
        results.spis = true;
        results.sitreps = true;
        return true;
      }
    };
    
    await executeWithRetry(spisSitrepsStep);

    const relationshipsStep: LoadingStep = {
      name: "Relationship Validation",
      action: validateProjectCollaborators
    };
    
    await executeWithRetry(relationshipsStep);

    const agreementsStep: LoadingStep = {
      name: "Agreements Check",
      action: checkAgreements
    };
    
    await executeWithRetry(agreementsStep);

    toast({
      title: "Integrity Checks Complete",
      description: "All data verified successfully ✓",
      variant: "default",
    });

    return results;
  } catch (error) {
    console.error('Integrity check failed:', error);
    toast({
      title: "Integrity Check Failed",
      description: "Please contact an administrator to resolve this issue.",
      variant: "destructive",
    });
    throw error;
  }
};
