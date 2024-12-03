import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BadgeCheck, AlertCircle, Info } from "lucide-react";
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
            <h5 className="font-medium">{collaborator.title}</h5>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Badge 
                    className={cn(
                      "flex items-center gap-1.5",
                      collaborator.ratMember 
                        ? 'bg-purple-600 hover:bg-purple-700' 
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
            collaborator.status === 'active' ? 'default' :
            collaborator.status === 'completed' ? 'secondary' :
            'outline'
          }>
            {collaborator.status}
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