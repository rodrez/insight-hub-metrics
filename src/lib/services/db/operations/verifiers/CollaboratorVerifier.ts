import { Collaborator } from "@/lib/types";
import { DatabaseTransactionService } from "../../DatabaseTransactionService";
import { toast } from "@/components/ui/use-toast";

export class CollaboratorVerifier {
  constructor(private transactionService: DatabaseTransactionService) {}

  async verifyCollaboratorOperation(collaborator: Collaborator): Promise<boolean> {
    try {
      console.log('Adding collaborator:', collaborator.id);
      await this.transactionService.performTransaction('collaborators', 'readwrite', store => 
        store.add(collaborator)
      );

      const added = await this.transactionService.performTransaction('collaborators', 'readonly', store => 
        store.get(collaborator.id)
      );

      const success = added !== undefined;
      console.log('Collaborator added successfully:', success);
      
      if (!success) {
        toast({
          title: "Warning",
          description: `Failed to verify collaborator: ${collaborator.id}`,
          variant: "destructive",
        });
      }

      return success;
    } catch (error) {
      console.error('Error verifying collaborator operation:', error);
      return false;
    }
  }
}