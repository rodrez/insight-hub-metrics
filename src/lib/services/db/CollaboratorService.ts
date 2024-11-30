import { Collaborator } from "../../types";
import { BaseIndexedDBService } from "./base/BaseIndexedDBService";

export class CollaboratorService extends BaseIndexedDBService {
  async getAllCollaborators(): Promise<Collaborator[]> {
    return this.transactionService.performTransaction('collaborators', 'readonly', store => store.getAll());
  }

  async getCollaborator(id: string): Promise<Collaborator | undefined> {
    return this.transactionService.performTransaction('collaborators', 'readonly', store => store.get(id));
  }

  async addCollaborator(collaborator: Collaborator): Promise<void> {
    await this.transactionService.performTransaction('collaborators', 'readwrite', store => store.put(collaborator));
  }

  async updateCollaborator(id: string, updates: Partial<Collaborator>): Promise<void> {
    const collaborator = await this.getCollaborator(id);
    if (!collaborator) throw new Error('Collaborator not found');
    await this.addCollaborator({ ...collaborator, ...updates });
  }
}