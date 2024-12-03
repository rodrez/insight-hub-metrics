import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BadgeCheck } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Collaborator } from '@/lib/types';
import { Link } from 'react-router-dom';
import { defaultTechDomains } from "@/lib/types/techDomain";
import { DEPARTMENTS } from "@/lib/constants";
import { ProjectPartnerBadge } from './ProjectPartnerBadge';
import { toast } from "@/components/ui/use-toast";
import { ProjectCardHeader } from './ProjectCardHeader';
import { ProjectCardProgress } from './ProjectCardProgress';
import { ProjectCardPartners } from './ProjectCardPartners';

interface PartnerCardProps {
  collaborator: Collaborator;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  type: 'fortune30' | 'sme';
};

export function PartnerCard({ collaborator, onEdit, onDelete, type }: PartnerCardProps) {
  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-200 hover:shadow-lg",
      "animate-fade-in group",
      type === 'fortune30' ? 'hover:border-blue-500/50' : 'hover:border-purple-500/50'
    )}>
      <CardHeader className="p-6">
        <PartnerHeader
          collaborator={collaborator}
          onEdit={onEdit}
          onDelete={onDelete}
          type={type}
        />
      </CardHeader>
      <CardContent className="p-6 pt-0">
        {collaborator.ratMember && (
          <div className="mb-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Badge 
                    className="bg-purple-600 hover:bg-purple-700 flex items-center gap-1.5"
                  >
                    <BadgeCheck className="h-3.5 w-3.5" />
                    RAT: {collaborator.ratMember}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>RAT Member assigned to this collaboration</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <PartnerContact contact={collaborator.primaryContact} />
            <PartnerProjects collaborator={collaborator} type={type} />
          </div>
          <PartnerWorkstreams 
            workstreams={collaborator.workstreams} 
            agreements={collaborator.agreements}
          />
        </div>

        {partnerSitreps.length > 0 && (
          <div className="mt-6 space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground">Recent SitReps</h4>
            <div className="space-y-2">
              {partnerSitreps.map((sitrep) => (
                <div 
                  key={sitrep.id}
                  onClick={() => handleSitRepClick(sitrep.id)}
                  className="p-3 rounded-md bg-accent/50 hover:bg-accent transition-colors cursor-pointer"
                  style={{ 
                    borderLeft: `4px solid ${collaborator.color || '#333'}`,
                    borderColor: collaborator.color || '#333'
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">{sitrep.title}</span>
                    <Badge variant="outline" className="text-xs">
                      {format(new Date(sitrep.date), 'MMM d, yyyy')}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {sitrep.summary}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
