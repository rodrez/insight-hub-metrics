import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Collaborator } from "@/lib/types";

interface PartnerBadgeProps {
  partner: Collaborator;
  onClick: (id: string) => void;
}

export function PartnerBadge({ partner, onClick }: PartnerBadgeProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Badge
            variant="default"
            style={{ 
              backgroundColor: partner.type === 'fortune30' ? partner.color : undefined,
              cursor: 'pointer'
            }}
            className="text-xs"
            onClick={() => onClick(partner.id)}
          >
            {partner.name}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>{partner.type === 'fortune30' ? 'Fortune 30 Partner' : 'Internal Partner'}</p>
          <p>Role: {partner.role}</p>
          <p>Department: {partner.department}</p>
          <p>Last Active: {new Date(partner.lastActive).toLocaleDateString()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}