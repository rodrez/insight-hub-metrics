import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";

type ProjectPartnerBadgeProps = {
  partner: {
    id: string;
    name: string;
    role: string;
    lastActive: string;
    color?: string;
    type: 'fortune30' | 'internal';
    department?: string;
  };
  departmentColor?: string;
};

export function ProjectPartnerBadge({ partner, departmentColor }: ProjectPartnerBadgeProps) {
  const navigate = useNavigate();

  const handlePartnerClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/collaborations/${partner.id}`);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Badge
            variant="default"
            style={{ 
              backgroundColor: partner.type === 'fortune30' ? partner.color : departmentColor,
              cursor: 'pointer'
            }}
            className="text-xs text-white"
            onClick={handlePartnerClick}
          >
            {partner.name}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>{partner.type === 'fortune30' ? 'Fortune 30 Partner' : 'Internal Partner'}</p>
          <p>Role: {partner.role}</p>
          <p>Last Active: {new Date(partner.lastActive).toLocaleDateString()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}