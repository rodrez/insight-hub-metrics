import { Badge } from "@/components/ui/badge";
import { BadgeCheck, AlertCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getRatMemberRole } from "@/lib/services/data/utils/ratMemberUtils";

type RATMemberBadgeProps = {
  ratMember: string | undefined;
  displayRatMember: string;
};

export function RATMemberBadge({ ratMember, displayRatMember }: RATMemberBadgeProps) {
  const memberRole = getRatMemberRole(displayRatMember);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Badge 
            className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700"
          >
            {ratMember ? (
              <>
                <BadgeCheck className="h-3.5 w-3.5" />
                RAT: {displayRatMember}
              </>
            ) : (
              <>
                <AlertCircle className="h-3.5 w-3.5" />
                RAT: {displayRatMember}
              </>
            )}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>{memberRole}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}