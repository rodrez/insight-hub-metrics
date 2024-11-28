import { Collaborator } from '../../types';
import { BaseDBService } from './base/BaseDBService';

export class CollaboratorService extends BaseDBService {
  async getAllCollaborators(): Promise<Collaborator[]> {
    const collaborators = await this.performTransaction<Collaborator[]>(
      'collaborators',
      'readonly',
      store => store.getAll()
    );
    return collaborators;
  }

  async getCollaborator(id: string): Promise<Collaborator | undefined> {
    return this.performTransaction<Collaborator | undefined>(
      'collaborators',
      'readonly',
      store => store.get(id)
    );
  }

  async addCollaborator(collaborator: Collaborator): Promise<void> {
    await this.performTransaction(
      'collaborators',
      'readwrite',
      store => store.put(collaborator)
    );
  }
}