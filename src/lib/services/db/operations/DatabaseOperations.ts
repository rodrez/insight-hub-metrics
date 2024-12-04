import { DatabaseTransactionService } from '../DatabaseTransactionService';
import { SMEOperations } from './SMEOperations';
import { CollaboratorVerifier } from './verifiers/CollaboratorVerifier';
import { SMEVerifier } from './verifiers/SMEVerifier';
import { toast } from "@/components/ui/use-toast";
import { Collaborator } from '@/lib/types';
import { TransactionRollbackManager } from '../transaction/TransactionRollbackManager';

export class DatabaseOperations {
  private smeOperations: SMEOperations;
  private collaboratorVerifier: CollaboratorVerifier;
  private smeVerifier: SMEVerifier;
  private rollbackManager: TransactionRollbackManager;

  constructor(private transactionService: DatabaseTransactionService) {
    this.smeOperations = new SMEOperations(transactionService);
    this.collaboratorVerifier = new CollaboratorVerifier(transactionService);
    this.smeVerifier = new SMEVerifier(transactionService);
    this.rollbackManager = TransactionRollbackManager.getInstance();
  }

  async addCollaborator(collaborator: Collaborator): Promise<void> {
    return this.rollbackManager.executeWithRollback(async () => {
      const success = await this.collaboratorVerifier.verifyCollaboratorOperation(collaborator);
      if (!success) {
        throw new Error(`Failed to add collaborator: ${collaborator.id}`);
      }
    });
  }

  async addSMEPartner(partner: Collaborator): Promise<void> {
    return this.rollbackManager.executeWithRollback(async () => {
      const success = await this.smeVerifier.verifySMEOperation(partner);
      if (!success) {
        throw new Error(`Failed to add SME partner: ${partner.id}`);
      }
    });
  }

  async clearAllData(): Promise<void> {
    const stores = ['projects', 'collaborators', 'sitreps', 'spis', 'objectives', 'smePartners'];
    
    return this.rollbackManager.executeWithRollback(async () => {
      try {
        for (const storeName of stores) {
          await this.transactionService.performTransaction(storeName, 'readwrite', store => store.clear());
          console.log(`Cleared store: ${storeName}`);
        }
        console.log('All stores cleared successfully');
        toast({
          title: "Success",
          description: "Database cleared successfully",
        });
      } catch (error) {
        console.error('Error clearing stores:', error);
        toast({
          title: "Error",
          description: "Failed to clear database",
          variant: "destructive",
        });
        throw error;
      }
    });
  }

  getSMEOperations(): SMEOperations {
    return this.smeOperations;
  }
}