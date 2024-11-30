import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Shield, Calendar } from "lucide-react";
import { Workstream, Agreement } from "@/lib/types/collaboration";
import { getAgreementWarningSettings, getDaysUntilExpiry } from "@/lib/utils/agreementUtils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type WorkstreamCardProps = {
  workstream: Workstream;
  formatDate: (date: string) => string;
  agreements?: {
    nda?: Agreement;
    jtda?: Agreement;
  };
};

export function WorkstreamCard({ workstream, formatDate, agreements }: WorkstreamCardProps) {
  const getStatusColor = (status?: string) => {
    if (!status) return 'text-gray-400';
    return status === 'signed' ? 'text-green-500' : 'text-yellow-500';
  };

  const getWarningColor = () => {
    if (!agreements) return '';

    const settings = getAgreementWarningSettings();
    let ndaDays, jtdaDays;

    if (agreements.nda) {
      ndaDays = getDaysUntilExpiry(agreements.nda.expiryDate);
    }
    if (agreements.jtda) {
      jtdaDays = getDaysUntilExpiry(agreements.jtda.expiryDate);
    }

    // Use the most critical warning level between NDA and JTDA
    const minDays = Math.min(
      ndaDays !== undefined ? ndaDays : Infinity,
      jtdaDays !== undefined ? jtdaDays : Infinity
    );

    if (minDays <= settings.criticalDays) {
      return 'bg-red-500/10 border-red-500';
    }
    if (minDays <= settings.warningDays) {
      return 'bg-yellow-500/10 border-yellow-500';
    }
    return '';
  };

  return (
    <Card className={`${getWarningColor()}`}>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-2">
          <h5 className="font-medium">{workstream.title}</h5>
          <div className="flex gap-2">
            {agreements?.nda && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Shield className={`h-3 w-3 ${getStatusColor(agreements.nda.status)}`} />
                      NDA
                      <Calendar className="h-3 w-3 ml-1" />
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Status: {agreements.nda.status}</p>
                    <p>Signed: {formatDate(agreements.nda.signedDate)}</p>
                    <p>Expires: {formatDate(agreements.nda.expiryDate)}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {agreements?.jtda && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Shield className={`h-3 w-3 ${getStatusColor(agreements.jtda.status)}`} />
                      JTDA
                      <Calendar className="h-3 w-3 ml-1" />
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Status: {agreements.jtda.status}</p>
                    <p>Signed: {formatDate(agreements.jtda.signedDate)}</p>
                    <p>Expires: {formatDate(agreements.jtda.expiryDate)}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            <Badge variant={
              workstream.status === 'active' ? 'default' :
              workstream.status === 'completed' ? 'secondary' :
              'outline'
            }>
              {workstream.status}
            </Badge>
          </div>
        </div>
        <div className="space-y-2 text-sm">
          <div>
            <p className="font-medium">Objectives:</p>
            <p className="text-muted-foreground">{workstream.objectives}</p>
          </div>
          <Separator />
          <div>
            <p className="font-medium">Next Steps:</p>
            <p className="text-muted-foreground">{workstream.nextSteps}</p>
          </div>
          <div className="text-xs text-muted-foreground">
            Last updated: {formatDate(workstream.lastUpdated)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}