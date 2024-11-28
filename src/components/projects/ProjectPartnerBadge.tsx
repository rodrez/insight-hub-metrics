import { Badge } from "@/components/ui/badge";
import { Collaborator } from "@/lib/types";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DEPARTMENTS } from "@/lib/constants";

interface ProjectPartnerBadgeProps {
  partner: Collaborator;
  departmentColor?: string;
}

export function ProjectPartnerBadge({ partner, departmentColor }: ProjectPartnerBadgeProps) {
  const department = DEPARTMENTS.find(d => d.id === partner.department);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Badge
            style={{ backgroundColor: departmentColor || partner.color || '#333' }}
            className="text-white"
          >
            {partner.name}
          </Badge>
        </TooltipTrigger>
        <TooltipContent className="p-3">
          <div className="space-y-1">
            <p className="font-medium">{partner.name}</p>
            <p className="text-sm text-muted-foreground">{partner.role}</p>
            {department && (
              <p className="text-sm text-muted-foreground">
                Department: {department.name}
              </p>
            )}
            <p className="text-sm text-muted-foreground">{partner.email}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}