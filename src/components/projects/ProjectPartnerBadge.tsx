import { Badge } from "@/components/ui/badge";
import { UserCog } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ProjectPartnerBadgeProps {
  partner: {
    id: string;
    name: string;
    type?: 'fortune30' | 'other' | 'sme';
    department?: string;
  };
  departmentColor?: string;
}

export function ProjectPartnerBadge({ partner, departmentColor }: ProjectPartnerBadgeProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Badge
            style={{ backgroundColor: departmentColor || '#333' }}
            className="flex items-center gap-1 text-white"
          >
            {partner.type === 'sme' && <UserCog className="h-3 w-3" />}
            {partner.name}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>{partner.type === 'sme' ? 'Subject Matter Expert' : 'Partner'}</p>
          {partner.department && <p>Department: {partner.department}</p>}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}