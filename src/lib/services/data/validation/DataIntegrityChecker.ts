import { Collaborator, Project } from "@/lib/types";
import { SPI } from "@/lib/types/spi";
import { Objective } from "@/lib/types/objective";
import { SitRep } from "@/lib/types/sitrep";

export class DataIntegrityChecker {
  static validateInternalPartners(partners: Collaborator[]): boolean {
    return partners.every(partner => 
      partner.id && 
      partner.name && 
      partner.department &&
      partner.type === 'internal'
    );
  }

  static validateFortune30Partners(partners: Collaborator[]): boolean {
    return partners.every(partner => 
      partner.id && 
      partner.name && 
      partner.type === 'fortune30'
    );
  }

  static validateSMEPartners(partners: Collaborator[]): boolean {
    return partners.every(partner => 
      partner.id && 
      partner.name && 
      partner.type === 'sme'
    );
  }

  static validateProjects(projects: Project[]): boolean {
    return projects.every(project => 
      project.id &&
      project.name &&
      project.departmentId &&
      project.poc &&
      project.techLead
    );
  }

  static validateSPIs(spis: SPI[]): boolean {
    return spis.every(spi => 
      spi.id &&
      spi.projectId &&
      spi.title
    );
  }

  static validateObjectives(objectives: Objective[]): boolean {
    return objectives.every(objective => 
      objective.id &&
      objective.title &&
      objective.description
    );
  }

  static validateSitReps(sitreps: SitRep[]): boolean {
    return sitreps.every(sitrep => 
      sitrep.id &&
      sitrep.title &&
      sitrep.content
    );
  }
}