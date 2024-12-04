import { Badge } from "@/components/ui/badge";
import { UserCog, Building2, Users } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CollaboratorType } from "@/lib/types/collaboration";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";

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
  // Fetch Fortune 30 partner details if needed
  const { data: fortune30Partner } = useQuery({
    queryKey: ['collaborators-fortune30', partner.id],
    queryFn: async () => {
      if (partner.type !== 'fortune30') return null;
      const allCollaborators = await db.getAllCollaborators();
      return allCollaborators.find(c => c.id === partner.id) || null;
    },
    enabled: partner.type === 'fortune30'
  });

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
    // For Fortune 30 partners, use their color from settings
    if (partner.type === 'fortune30') {
      console.log('Fortune 30 partner color:', fortune30Partner?.color);
      return fortune30Partner?.color || '#4B5563';
    }
    // For SME partners, use their color if available
    if (partner.type === 'sme' && partner.color) {
      return partner.color;
    }
    // Fallback to department color or default
    return departmentColor || '#4B5563';
  };

  const badgeColor = getBadgeColor();
  console.log('Badge color for', partner.name, ':', badgeColor);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Badge
            style={{ 
              backgroundColor: badgeColor,
              color: '#FFFFFF',
              fontWeight: 500,
              border: 'none',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
            }}
            className="flex items-center gap-1 hover:opacity-90 transition-opacity shadow-md"
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