import { Collaborator } from '../../types';
import { BaseDBService } from './base/BaseDBService';

export class SMEService extends BaseDBService {
  async getAllSMEPartners(): Promise<Collaborator[]> {
    await this.ensureInitialized();
    return this.performTransaction('smePartners', 'readonly', store => store.getAll());
  }

  async getSMEPartner(id: string): Promise<Collaborator | undefined> {
    await this.ensureInitialized();
    return this.performTransaction('smePartners', 'readonly', store => store.get(id));
  }

  async addSMEPartner(partner: Collaborator): Promise<void> {
    await this.ensureInitialized();
    await this.performTransaction('smePartners', 'readwrite', store => store.put(partner));
  }
}