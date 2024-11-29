import { Badge } from "@/components/ui/badge";
import { UserCog, Building2, Users } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CollaboratorType } from "@/lib/types/collaboration";

interface ProjectPartnerBadgeProps {
  partner: {
    id: string;
    name: string;
    type: CollaboratorType;
    department: string;
  };
  departmentColor?: string;
}

export function ProjectPartnerBadge({ partner, departmentColor }: ProjectPartnerBadgeProps) {
  const getIcon = () => {
    switch (partner.type) {
      case 'sme':
        return <UserCog className="h-3 w-3" />;
      case 'fortune30':
        return <Building2 className="h-3 w-3" />;
      case 'internal':
        return <Users className="h-3 w-3" />;
      default:
        return null;
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Badge
            style={{ backgroundColor: departmentColor || '#333' }}
            className="flex items-center gap-1 text-white"
          >
            {getIcon()}
            {partner.name}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>{partner.type === 'sme' ? 'Subject Matter Expert' : 
             partner.type === 'fortune30' ? 'Fortune 30 Partner' : 
             'Internal Partner'}</p>
          <p>Department: {partner.department}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}