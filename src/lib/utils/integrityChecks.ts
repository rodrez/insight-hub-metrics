import { toast } from "@/components/ui/use-toast";
import { executeWithRetry } from "./loadingRetry";
import { projectChecksStep } from "./checks/projectChecks";
import { collaboratorChecksStep } from "./checks/collaboratorChecks";
import { agreementChecksStep } from "./checks/agreementChecks";

export interface IntegrityCheckResult {
  projects: boolean;
  fortune30Partners: boolean;
  internalPartners: boolean;
  glossaryItems: boolean;
  spis: boolean;
  sitreps: boolean;
}

export const runIntegrityChecks = async (): Promise<IntegrityCheckResult> => {
  const results: IntegrityCheckResult = {
    projects: false,
    fortune30Partners: false,
    internalPartners: false,
    glossaryItems: true,
    spis: false,
    sitreps: false
  };

  const loadingToast = toast({
    title: "Running Integrity Checks",
    description: "Verifying data integrity...",
    variant: "default",
  });

  try {
    // Run project checks
    const projectsSuccess = await executeWithRetry(projectChecksStep);
    if (!projectsSuccess) return results;
    results.projects = true;

    // Run collaborator checks
    const collaboratorsSuccess = await executeWithRetry(collaboratorChecksStep);
    if (!collaboratorsSuccess) return results;
    results.fortune30Partners = true;
    results.internalPartners = true;

    // Run agreement checks
    await executeWithRetry(agreementChecksStep);

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