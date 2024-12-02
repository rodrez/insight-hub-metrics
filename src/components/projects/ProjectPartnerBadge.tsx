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
    color?: string;
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

  const getBadgeColor = () => {
    // For Fortune 30 partners, always use their brand color if available
    if (partner.type === 'fortune30') {
      return partner.color;
    }
    // For SME partners, use their color if available
    if (partner.type === 'sme' && partner.color) {
      return partner.color;
    }
    // Fallback to department color or default
    return departmentColor || '#4B5563';
  };

  const badgeColor = getBadgeColor();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Badge
            style={{ 
              backgroundColor: badgeColor,
              borderColor: badgeColor,
              color: 'white'
            }}
            className="flex items-center gap-1 hover:opacity-90 transition-opacity"
          >
            {getIcon()}
            {partner.name}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>{partner.type === 'sme' ? 'Small Medium Enterprise' : 
             partner.type === 'fortune30' ? 'Fortune 30 Partner' : 
             'Internal Partner'}</p>
          <p>Department: {partner.department}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}