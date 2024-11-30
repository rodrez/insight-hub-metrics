import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Calendar } from "lucide-react";
import { Workstream } from "@/lib/types/collaboration";
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
    nda?: {
      signedDate: string;
      expiryDate: string;
      status: 'signed' | 'pending' | 'expired';
    };
    jtda?: {
      signedDate: string;
      expiryDate: string;
      status: 'signed' | 'pending' | 'expired';
    };
  };
}

export function PartnerWorkstreams({ workstreams, agreements }: PartnerWorkstreamsProps) {
  const { warningColor, formatDate } = useAgreementStatus(agreements);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Workstreams</CardTitle>
          {agreements && (
            <div className="flex gap-2">
              {agreements.nda && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge 
                        variant="outline" 
                        className={`flex items-center gap-1 ${warningColor}`}
                      >
                        <Shield className={`h-3 w-3 ${
                          agreements.nda.status === 'signed' 
                            ? 'text-green-500' 
                            : 'text-yellow-500'
                        }`} />
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
              {agreements.jtda && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge 
                        variant="outline"
                        className={`flex items-center gap-1 ${warningColor}`}
                      >
                        <Shield className={`h-3 w-3 ${
                          agreements.jtda.status === 'signed' 
                            ? 'text-green-500' 
                            : 'text-yellow-500'
                        }`} />
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