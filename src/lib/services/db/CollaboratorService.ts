import { BaseDBService } from './base/BaseDBService';
import { Collaborator } from '../../types';

export class CollaboratorService extends BaseDBService {
  async getAllCollaborators(): Promise<Collaborator[]> {
    return this.performTransaction('collaborators', 'readonly', (store) => {
      return store.getAll();
    });
  }

  async getCollaborator(id: string): Promise<Collaborator | undefined> {
    return this.performTransaction('collaborators', 'readonly', (store) => {
      return store.get(id);
    });
  }

  async addCollaborator(collaborator: Collaborator): Promise<void> {
    return this.performTransaction('collaborators', 'readwrite', (store) => {
      return store.add(collaborator);
    });
  }

  async updateCollaborator(id: string, updates: Partial<Collaborator>): Promise<void> {
    return this.performTransaction('collaborators', 'readwrite', (store) => {
      return store.put({ ...updates, id });
    });
  }

  async getAllSMEPartners(): Promise<Collaborator[]> {
    return this.performTransaction('smePartners', 'readonly', (store) => {
      return store.getAll();
    });
  }

  async getSMEPartner(id: string): Promise<Collaborator | undefined> {
    return this.performTransaction('smePartners', 'readonly', (store) => {
      return store.get(id);
    });
  }

  async addSMEPartner(partner: Collaborator): Promise<void> {
    return this.performTransaction('smePartners', 'readwrite', (store) => {
      return store.add(partner);
    });
  }

  async updateSMEPartner(id: string, updates: Partial<Collaborator>): Promise<void> {
    return this.performTransaction('smePartners', 'readwrite', (store) => {
      return store.put({ ...updates, id });
    });
  }

  async deleteSMEPartner(id: string): Promise<void> {
    return this.performTransaction('smePartners', 'readwrite', (store) => {
      return store.delete(id);
    });
  }
}