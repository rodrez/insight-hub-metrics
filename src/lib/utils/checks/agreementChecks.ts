import { toast } from "@/components/ui/use-toast";
import { db } from "@/lib/db";
import { LoadingStep } from "../loadingRetry";

export const checkAgreements = async (): Promise<boolean> => {
  const collaborators = await db.getAllCollaborators();
  const fortune30 = collaborators.filter(c => c.type === 'fortune30');
  
  const today = new Date();
  const warningDays = 180;
  const criticalDays = 90;
  
  fortune30.forEach(partner => {
    if (partner.agreements) {
      const { nda, jtda } = partner.agreements;
      const checkAgreement = (agreement: { expiryDate: string }, type: string) => {
        if (agreement) {
          const expiryDate = new Date(agreement.expiryDate);
          const daysUntilExpiry = Math.ceil(
            (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
          );
          
          if (daysUntilExpiry <= criticalDays) {
            toast({
              title: "Critical Agreement Expiry",
              description: `${partner.name}'s ${type} expires in ${daysUntilExpiry} days`,
              variant: "destructive",
            });
          } else if (daysUntilExpiry <= warningDays) {
            toast({
              title: "Agreement Expiry Warning",
              description: `${partner.name}'s ${type} expires in ${daysUntilExpiry} days`,
              variant: "destructive",
            });
          }
        }
      };

      checkAgreement(nda, 'NDA');
      checkAgreement(jtda, 'JTDA');
    }
  });
  
  return true;
};

export const agreementChecksStep: LoadingStep = {
  name: "Agreements Check",
  action: checkAgreements
};