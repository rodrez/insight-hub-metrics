import { Project } from "../../types";
import { validateProject } from "../../utils/validation";
import { BaseDBService } from "./base/BaseDBService";

export class ProjectService extends BaseDBService {
  async addProject(project: Project): Promise<void> {
    if (!validateProject(project)) {
      throw new Error("Invalid project data");
    }
    
    const store = await this.getStore("projects");
    await store.put(project);
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<void> {
    const store = await this.getStore("projects");
    const existingProject = await this.getProject(id);

    if (!existingProject) {
      throw new Error("Project not found");
    }

    const updatedProject = { ...existingProject, ...updates };

    if (!validateProject(updatedProject)) {
      throw new Error("Invalid project data");
    }

    await store.put(updatedProject);
  }

  async getProject(id: string): Promise<Project | undefined> {
    const store = await this.getStore("projects");
    return new Promise((resolve, reject) => {
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result as Project);
      request.onerror = () => reject(request.error);
    });
  }

  async getAllProjects(): Promise<Project[]> {
    const store = await this.getStore("projects");
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result as Project[]);
      request.onerror = () => reject(request.error);
    });
  }

  async deleteProject(id: string): Promise<void> {
    const store = await this.getStore("projects");
    await store.delete(id);
  }
}