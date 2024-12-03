import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BadgeCheck, AlertCircle } from "lucide-react";
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
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { PartnerHeader } from "./PartnerHeader";
import { PartnerContact } from "./PartnerContact";
import { PartnerProjects } from "./PartnerProjects";
import { PartnerWorkstreams } from "./PartnerWorkstreams";
import { getAllRatMembers, getRatMemberRole } from '@/lib/services/data/utils/ratMemberUtils';

interface PartnerCardProps {
  collaborator: Collaborator;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  type: 'fortune30' | 'sme';
}

export function PartnerCard({ collaborator, onEdit, onDelete, type }: PartnerCardProps) {
  const getDepartmentColor = (departmentId: string) => {
    const department = DEPARTMENTS.find(d => d.id === departmentId);
    return department?.color || '#333';
  };

  const displayMember = collaborator.ratMember || getAllRatMembers()[Math.floor(Math.random() * getAllRatMembers().length)];
  const memberRole = getRatMemberRole(displayMember);

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-2">
          <div className="space-y-2">
            <h5 className="font-medium">{collaborator.name}</h5>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Badge 
                    className={cn(
                      "flex items-center gap-1.5",
                      collaborator.ratMember 
                        ? 'bg-[#8B5CF6] hover:bg-[#7C3AED]' 
                        : 'bg-gray-500 hover:bg-gray-600'
                    )}
                  >
                    {collaborator.ratMember ? (
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
          <Badge variant={
            collaborator.projects?.[0]?.status === 'active' ? 'default' :
            collaborator.projects?.[0]?.status === 'completed' ? 'secondary' :
            'outline'
          }>
            {collaborator.projects?.[0]?.status || 'pending'}
          </Badge>
        </div>

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
      </CardContent>
    </Card>
  );
}