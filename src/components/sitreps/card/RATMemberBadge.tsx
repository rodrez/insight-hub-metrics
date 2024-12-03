import { BadgeCheck } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

interface RATMemberBadgeProps {
  ratMember: string;
}

export function RATMemberBadge({ ratMember }: RATMemberBadgeProps) {
  if (!ratMember) return null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Badge 
            className="bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200 transition-colors flex items-center gap-1"
          >
            <BadgeCheck className="h-3.5 w-3.5" />
            RAT: {ratMember}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>RAT Member assigned to this SitRep</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}