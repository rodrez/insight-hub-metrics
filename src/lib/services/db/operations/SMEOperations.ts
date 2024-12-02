import { DatabaseTransactionService } from '../DatabaseTransactionService';
import { withRetry } from '@/lib/utils/retryUtils';
import { Collaborator } from '@/lib/types';

export class SMEOperations {
  constructor(private transactionService: DatabaseTransactionService) {}

  async addSMEPartner(partner: Collaborator): Promise<void> {
    await withRetry(
      async () => this.transactionService.performTransaction('smePartners', 'readwrite', store => store.put(partner)),
      {
        operation: 'Adding SME Partner',
        maxAttempts: 3,
        delayMs: 1000
      }
    );
  }

  async getSMEPartner(id: string): Promise<Collaborator | undefined> {
    return withRetry(
      async () => this.transactionService.performTransaction('smePartners', 'readonly', store => store.get(id)),
      {
        operation: 'Getting SME Partner',
        maxAttempts: 2,
        delayMs: 500
      }
    );
  }

  async getAllSMEPartners(): Promise<Collaborator[]> {
    return withRetry(
      async () => this.transactionService.performTransaction('smePartners', 'readonly', store => store.getAll()),
      {
        operation: 'Getting All SME Partners',
        maxAttempts: 2,
        delayMs: 500
      }
    );
  }

  async updateSMEPartner(id: string, updates: Partial<Collaborator>): Promise<void> {
    await withRetry(
      async () => {
        const partner = await this.getSMEPartner(id);
        if (!partner) throw new Error('SME Partner not found');
        return this.transactionService.performTransaction(
          'smePartners',
          'readwrite',
          store => store.put({ ...partner, ...updates })
        );
      },
      {
        operation: 'Updating SME Partner',
        maxAttempts: 3,
        delayMs: 1000
      }
    );
  }

  async deleteSMEPartner(id: string): Promise<void> {
    await withRetry(
      async () => this.transactionService.performTransaction('smePartners', 'readwrite', store => store.delete(id)),
      {
        operation: 'Deleting SME Partner',
        maxAttempts: 3,
        delayMs: 1000
      }
    );
  }
}