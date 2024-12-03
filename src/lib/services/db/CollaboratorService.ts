import { BaseDBService } from './base/BaseDBService';
import { Collaborator } from '../../types';

export class CollaboratorService extends BaseDBService {
  async getAllSMEPartners(): Promise<Collaborator[]> {
    return this.getStore('smePartners').getAll();
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
