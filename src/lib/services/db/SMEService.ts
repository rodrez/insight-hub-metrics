import { Collaborator } from '../../types';
import { BaseIndexedDBService } from './base/BaseIndexedDBService';

export class SMEService extends BaseIndexedDBService {
  async getAllSMEPartners(): Promise<Collaborator[]> {
    await this.ensureInitialized();
    return this.transactionService.performTransaction('smePartners', 'readonly', store => store.getAll());
  }

  async getSMEPartner(id: string): Promise<Collaborator | undefined> {
    await this.ensureInitialized();
    return this.transactionService.performTransaction('smePartners', 'readonly', store => store.get(id));
  }

  async addSMEPartner(partner: Collaborator): Promise<void> {
    await this.ensureInitialized();
    await this.transactionService.performTransaction('smePartners', 'readwrite', store => store.put(partner));
  }
}