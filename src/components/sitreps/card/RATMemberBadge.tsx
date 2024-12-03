import { BadgeCheck, AlertCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { getAllRatMembers, getRatMemberRole } from '@/lib/services/data/utils/ratMemberUtils';

interface RATMemberBadgeProps {
  ratMember: string;
}

export function RATMemberBadge({ ratMember }: RATMemberBadgeProps) {
  const ratMembers = getAllRatMembers();
  const displayMember = ratMember || ratMembers[Math.floor(Math.random() * ratMembers.length)];
  const memberRole = getRatMemberRole(displayMember);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Badge 
            className={`flex items-center gap-1.5 ${
              ratMember 
                ? 'bg-purple-600 hover:bg-purple-700' 
                : 'bg-gray-500 hover:bg-gray-600'
            }`}
          >
            {ratMember ? (
              <>
                <BadgeCheck className="h-3.5 w-3.5" />
                RAT: {displayMember}
              </>
            ) : (
              <>
                <AlertCircle className="h-3.5 w-3.5" />
                RAT: {displayMember}
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