import { Agreement } from "@/lib/types/collaboration";
import { getExpiryWarningColor, formatDate } from "@/lib/utils/agreementUtils";

export function useAgreementStatus(agreements?: { nda?: Agreement; jtda?: Agreement }) {
  const getWarningColor = () => {
    if (!agreements) return undefined;
    
    if (agreements.nda) {
      const color = getExpiryWarningColor(agreements.nda.expiryDate);
      if (color) return color;
    }
    
    if (agreements.jtda) {
      return getExpiryWarningColor(agreements.jtda.expiryDate);
    }
    
    return undefined;
  };

  return {
    warningColor: getWarningColor(),
    formatDate
  };
}