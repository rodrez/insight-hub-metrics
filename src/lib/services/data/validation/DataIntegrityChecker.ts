import { Collaborator, Project } from "@/lib/types";
import { SPI } from "@/lib/types/spi";
import { Objective } from "@/lib/types/objective";
import { SitRep } from "@/lib/types/sitrep";
import { toast } from "@/components/ui/use-toast";

export class DataIntegrityChecker {
  static validateInternalPartners(partners: Collaborator[]): boolean {
    console.log(`Validating ${partners.length} internal partners...`);
    const isValid = partners.every(partner => 
      partner.id && 
      partner.name && 
      partner.department &&
      partner.type === 'internal'
    );
    
    this.logValidationResult('Internal Partners', isValid, partners.length);
    return isValid;
  }

  static validateFortune30Partners(partners: Collaborator[]): boolean {
    console.log(`Validating ${partners.length} Fortune 30 partners...`);
    const isValid = partners.every(partner => 
      partner.id && 
      partner.name && 
      partner.type === 'fortune30'
    );
    
    this.logValidationResult('Fortune 30 Partners', isValid, partners.length);
    return isValid;
  }

  static validateSMEPartners(partners: Collaborator[]): boolean {
    console.log(`Validating ${partners.length} SME partners...`);
    const isValid = partners.every(partner => 
      partner.id && 
      partner.name && 
      partner.type === 'sme'
    );
    
    this.logValidationResult('SME Partners', isValid, partners.length);
    return isValid;
  }

  static validateProjects(projects: Project[]): boolean {
    console.log(`Validating ${projects.length} projects...`);
    const isValid = projects.every(project => 
      project.id &&
      project.name &&
      project.departmentId &&
      project.poc &&
      project.techLead
    );
    
    this.logValidationResult('Projects', isValid, projects.length);
    return isValid;
  }

  static validateSPIs(spis: SPI[]): boolean {
    console.log(`Validating ${spis.length} SPIs...`);
    const isValid = spis.every(spi => 
      spi.id &&
      spi.name &&
      spi.deliverable
    );
    
    this.logValidationResult('SPIs', isValid, spis.length);
    return isValid;
  }

  static validateObjectives(objectives: Objective[]): boolean {
    console.log(`Validating ${objectives.length} objectives...`);
    const isValid = objectives.every(objective => 
      objective.id &&
      objective.title &&
      objective.description
    );
    
    this.logValidationResult('Objectives', isValid, objectives.length);
    return isValid;
  }

  static validateSitReps(sitreps: SitRep[]): boolean {
    console.log(`Validating ${sitreps.length} sitreps...`);
    const isValid = sitreps.every(sitrep => 
      sitrep.id &&
      sitrep.title &&
      sitrep.update
    );
    
    this.logValidationResult('SitReps', isValid, sitreps.length);
    return isValid;
  }

  private static logValidationResult(type: string, isValid: boolean, count: number) {
    if (isValid) {
      console.log(`✓ ${type} validation passed (${count} items)`);
    } else {
      console.error(`✗ ${type} validation failed (${count} items)`);
      toast({
        title: "Validation Error",
        description: `${type} validation failed`,
        variant: "destructive",
      });
    }
  }
}