import { Collaborator } from "@/lib/types";
import { DatabaseTransactionService } from "../../DatabaseTransactionService";
import { toast } from "@/components/ui/use-toast";

export class SMEVerifier {
  constructor(private transactionService: DatabaseTransactionService) {}

  async verifySMEOperation(partner: Collaborator): Promise<boolean> {
    try {
      console.log('Adding SME partner:', partner.id);
      await this.transactionService.performTransaction('smePartners', 'readwrite', store => 
        store.add(partner)
      );

      const added = await this.transactionService.performTransaction('smePartners', 'readonly', store => 
        store.get(partner.id)
      );

      const success = added !== undefined;
      console.log('SME partner added successfully:', success);
      
      if (!success) {
        toast({
          title: "Warning",
          description: `Failed to verify SME partner: ${partner.id}`,
          variant: "destructive",
        });
      }

      return success;
    } catch (error) {
      console.error('Error verifying SME operation:', error);
      return false;
    }
  }
}