import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Calendar, BadgeCheck, AlertCircle } from "lucide-react";
import { Workstream, Agreement, CollaboratorAgreements } from "@/lib/types/collaboration";
import { AgreementStatus } from "../AgreementStatus";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { getAllRatMembers, getRatMemberRole } from "@/lib/services/data/utils/ratMemberUtils";
import { useState, useEffect } from 'react';

type WorkstreamCardProps = {
  workstream: Workstream;
  formatDate: (date: string) => string;
  agreements?: CollaboratorAgreements;
};

export function WorkstreamCard({ workstream, formatDate, agreements }: WorkstreamCardProps) {
  const [statusColors, setStatusColors] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadStatusColors = () => {
      const saved = localStorage.getItem('projectStatusColors');
      if (saved) {
        setStatusColors(JSON.parse(saved));
      }
    };
    loadStatusColors();
  }, []);

  const getStatusColor = (status: string, type: 'project' | 'agreement' = 'project') => {
    if (type === 'agreement') {
      if (!status) return 'text-gray-400';
      return status === 'signed' ? 'text-green-500' : 'text-yellow-500';
    }
    
    const colorConfig = statusColors && Array.isArray(statusColors) 
      ? statusColors.find((config: any) => config.id === status)
      : null;
    return colorConfig?.color;
  };

  const ratMembers = getAllRatMembers();
  const displayMember = workstream.ratMember || ratMembers[Math.floor(Math.random() * ratMembers.length)];
  const memberRole = getRatMemberRole(displayMember);

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-2">
          <div className="space-y-2">
            <h5 className="font-medium">{workstream.title}</h5>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Badge 
                    className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700"
                  >
                    {workstream.ratMember ? (
                      <>
                        <BadgeCheck className="h-3.5 w-3.5" />
                        RAT: {displayMember}
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-3.5 w-3.5" />
                        RAT: {displayMember}
                      </>
                    )}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{memberRole}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Badge 
            variant={
              workstream.status === 'active' ? 'default' :
              workstream.status === 'completed' ? 'secondary' :
              'outline'
            }
            style={
              workstream.status === 'active' && workstream.status
                ? { backgroundColor: getStatusColor(workstream.status) }
                : undefined
            }
          >
            {workstream.status}
          </Badge>
        </div>

        {(workstream.agreements || agreements) && (
          <div className="space-y-2 mb-4">
            {(workstream.agreements?.nda || agreements?.nda) && (
              <AgreementStatus
                type="nda"
                agreement={workstream.agreements?.nda || agreements?.nda!}
                formatDate={formatDate}
                workstreamTitle={workstream.title}
              />
            )}
            {(workstream.agreements?.jtda || agreements?.jtda) && (
              <AgreementStatus
                type="jtda"
                agreement={workstream.agreements?.jtda || agreements?.jtda!}
                formatDate={formatDate}
                workstreamTitle={workstream.title}
              />
            )}
          </div>
        )}

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