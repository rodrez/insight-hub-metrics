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

interface PartnerCardProps {
  collaborator: Collaborator;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  type: 'fortune30' | 'sme';
}

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
        <div className="mb-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Badge 
                  className={`flex items-center gap-1.5 ${
                    collaborator.ratMember 
                      ? 'bg-purple-600 hover:bg-purple-700' 
                      : 'bg-gray-500 hover:bg-gray-600'
                  }`}
                >
                  {collaborator.ratMember ? (
                    <>
                      <BadgeCheck className="h-3.5 w-3.5" />
                      RAT: {collaborator.ratMember}
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-3.5 w-3.5" />
                      RAT: Unassigned
                    </>
                  )}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>{collaborator.ratMember ? 'RAT Member assigned to this collaboration' : 'No RAT Member assigned yet'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
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