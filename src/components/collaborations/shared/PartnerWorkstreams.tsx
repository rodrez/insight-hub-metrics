import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Calendar } from "lucide-react";
import { Workstream, Agreement } from "@/lib/types/collaboration";
import { WorkstreamCard } from "./WorkstreamCard";
import { useAgreementStatus } from "@/hooks/useAgreementStatus";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PartnerWorkstreamsProps {
  workstreams?: Workstream[];
  agreements?: {
    nda?: Agreement;
    jtda?: Agreement;
  };
}

export function PartnerWorkstreams({ workstreams, agreements }: PartnerWorkstreamsProps) {
  const { warningColor, formatDate } = useAgreementStatus(agreements);

  const renderAgreementBadge = (agreement: Agreement | undefined, type: 'NDA' | 'JTDA') => {
    if (!agreement) return null;
    
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border ${warningColor}`}>
              <Shield className={`h-3 w-3 ${
                agreement.status === 'signed' 
                  ? 'text-green-500' 
                  : 'text-yellow-500'
              }`} />
              {type}
              <Calendar className="h-3 w-3 ml-1" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Status: {agreement.status}</p>
            <p>Signed: {formatDate(agreement.signedDate)}</p>
            <p>Expires: {formatDate(agreement.expiryDate)}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Workstreams</CardTitle>
          {agreements && (
            <div className="flex gap-2">
              {renderAgreementBadge(agreements.nda, 'NDA')}
              {renderAgreementBadge(agreements.jtda, 'JTDA')}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {workstreams?.map((workstream) => (
          <WorkstreamCard 
            key={workstream.id} 
            workstream={workstream} 
            formatDate={formatDate}
            agreements={agreements}
          />
        ))}
        {(!workstreams || workstreams.length === 0) && (
          <p className="text-muted-foreground text-center py-4">No workstreams found</p>
        )}
      </CardContent>
    </Card>
  );
}