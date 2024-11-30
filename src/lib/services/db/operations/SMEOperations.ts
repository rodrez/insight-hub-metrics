import { Collaborator } from '../../../types/collaboration';
import { DatabaseTransactionService } from '../DatabaseTransactionService';

export class SMEOperations {
  constructor(private transactionService: DatabaseTransactionService) {}

  async getAllSMEPartners(): Promise<Collaborator[]> {
    return this.transactionService.performTransaction('smePartners', 'readonly', store => store.getAll());
  }

  async getSMEPartner(id: string): Promise<Collaborator | undefined> {
    return this.transactionService.performTransaction('smePartners', 'readonly', store => store.get(id));
  }

  async addSMEPartner(partner: Collaborator): Promise<void> {
    await this.transactionService.performTransaction('smePartners', 'readwrite', store => store.put(partner));
  }
}