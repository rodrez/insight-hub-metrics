import { Collaborator } from "../../types";
import { validateCollaborator } from "../../utils/validation";
import { BaseDBService } from "./base/BaseDBService";

export class CollaboratorService extends BaseDBService {
  async addCollaborator(collaborator: Collaborator): Promise<void> {
    if (!validateCollaborator(collaborator)) {
      throw new Error("Invalid collaborator data");
    }
    
    const store = await this.getStore("collaborators");
    await store.put(collaborator);
  }

  async getCollaborator(id: string): Promise<Collaborator | undefined> {
    const store = await this.getStore("collaborators");
    const request = store.get(id);
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result as Collaborator);
      request.onerror = () => reject(request.error);
    });
  }

  async updateCollaborator(id: string, collaborator: Partial<Collaborator>): Promise<void> {
    const existingCollaborator = await this.getCollaborator(id);
    if (!existingCollaborator) {
      throw new Error("Collaborator not found");
    }
    
    const updatedCollaborator = { ...existingCollaborator, ...collaborator };
    
    if (!validateCollaborator(updatedCollaborator)) {
      throw new Error("Invalid collaborator data");
    }

    const store = await this.getStore("collaborators");
    await store.put(updatedCollaborator);
  }

  async deleteCollaborator(id: string): Promise<void> {
    const store = await this.getStore("collaborators");
    await store.delete(id);
  }

  async getAllCollaborators(): Promise<Collaborator[]> {
    const store = await this.getStore("collaborators");
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result as Collaborator[]);
      request.onerror = () => reject(request.error);
    });
  }
}