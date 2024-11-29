import { Badge } from "@/components/ui/badge";
import { Building2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SMEDetails } from "./SMEDetails";
import { Collaborator } from "@/lib/types";

interface SMEPartnerBadgeProps {
  partner: Collaborator;
  departmentColor?: string;
}

export function SMEPartnerBadge({ partner, departmentColor }: SMEPartnerBadgeProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Badge
            style={{ backgroundColor: departmentColor || partner.color || '#333' }}
            className="flex items-center gap-1 text-white"
          >
            <Building2 className="h-3 w-3" />
            {partner.name}
          </Badge>
        </TooltipTrigger>
        <SMEDetails partner={partner} />
      </Tooltip>
    </TooltipProvider>
  );
}