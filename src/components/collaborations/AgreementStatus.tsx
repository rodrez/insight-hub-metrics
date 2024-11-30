import { Shield, Calendar } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Agreement } from "@/lib/types/collaboration";

interface AgreementStatusProps {
  type: 'nda' | 'jtda';
  agreement: Agreement;
  formatDate: (date: string) => string;
}

export function AgreementStatus({ type, agreement, formatDate }: AgreementStatusProps) {
  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <Shield className={`h-4 w-4 ${
        agreement.status === 'signed' 
          ? 'text-green-500' 
          : agreement.status === 'expired'
            ? 'text-red-500'
            : 'text-yellow-500'
      }`} />
      <span>{type.toUpperCase()}: {agreement.status}</span>
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center cursor-help">
              <Calendar className="h-4 w-4" />
            </div>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p className="text-sm">Signed: {formatDate(agreement.signedDate)}</p>
            <p className="text-sm">Expires: {formatDate(agreement.expiryDate)}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}