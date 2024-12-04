import { Project } from "@/lib/types";
import { DataQuantities } from "@/lib/types/data";
import { generateProjects } from '../projectGenerator';
import { db } from "@/lib/db";
import { DataIntegrityChecker } from "../../validation/DataIntegrityChecker";
import { TransactionManager } from "../../transaction/TransactionManager";
import { DEPARTMENTS } from "@/lib/constants";

export class ProjectGenerationStep {
  static async execute(quantities: DataQuantities) {
    console.log('Starting project generation step...');
    const projects = generateProjects([...DEPARTMENTS], quantities.projects);
    
    if (!DataIntegrityChecker.validateProjects(projects)) {
      throw new Error('Projects validation failed');
    }

    for (const project of projects) {
      await db.addProject(project);
      TransactionManager.addRollbackAction(async () => {
        await db.deleteProject(project.id);
      });
    }

    console.log('Projects generated:', projects.length);
    return projects;
  }
}