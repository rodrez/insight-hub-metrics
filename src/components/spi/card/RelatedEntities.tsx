import { Project } from "@/lib/types";
import { Collaborator } from "@/lib/types/collaboration";
import { DEPARTMENTS } from "@/lib/constants";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface RelatedEntitiesProps {
  relatedProject?: Project;
  fortune30Partner?: Collaborator;
  smePartner?: { id: string; name: string };
  departmentId: string;
}

export function RelatedEntities({
  relatedProject,
  fortune30Partner,
  smePartner,
  departmentId
}: RelatedEntitiesProps) {
  const getDepartmentColor = (departmentId: string) => {
    const dept = DEPARTMENTS.find(d => d.id === departmentId);
    return dept?.color || '#333';
  };

  return (
    <div className="space-y-4">
      <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Related Entities</h4>
      <div className="space-y-3">
        {relatedProject && (
          <div className="p-2 rounded-md bg-blue-500/10 border-l-2 border-blue-500">
            <p className="text-sm font-medium">Project</p>
            <p className="text-sm">{relatedProject.name}</p>
          </div>
        )}
        {fortune30Partner && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="p-2 rounded-md bg-purple-500/10 border-l-2 border-purple-500">
                  <p className="text-sm font-medium">Fortune 30 Partner</p>
                  <p className="text-sm" style={{ color: fortune30Partner.color }}>
                    {fortune30Partner.name}
                  </p>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{fortune30Partner.role}</p>
                {fortune30Partner.primaryContact && (
                  <p>Contact: {fortune30Partner.primaryContact.name}</p>
                )}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        {smePartner && (
          <div className="p-2 rounded-md bg-orange-500/10 border-l-2 border-orange-500">
            <p className="text-sm font-medium">SME Partner</p>
            <p className="text-sm">{smePartner.name}</p>
          </div>
        )}
        <div 
          className="p-2 rounded-md"
          style={{ 
            backgroundColor: `${getDepartmentColor(departmentId)}15`,
            borderLeft: `3px solid ${getDepartmentColor(departmentId)}`
          }}
        >
          <p className="text-sm font-medium">SME</p>
          <p className="text-sm">
            {DEPARTMENTS.find(d => d.id === departmentId)?.name || departmentId}
          </p>
        </div>
      </div>
    </div>
  );
}