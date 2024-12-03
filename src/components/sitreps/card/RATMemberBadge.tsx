import { BadgeCheck, AlertCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

// RAT Members from the org chart
const ratMembers = [
  "Sarah Johnson",
  "Michael Chen",
  "Emily Rodriguez",
  "David Kim",
  "James Wilson",
  "Maria Garcia",
  "Robert Taylor"
];

interface RATMemberBadgeProps {
  ratMember: string;
}

export function RATMemberBadge({ ratMember }: RATMemberBadgeProps) {
  const displayMember = ratMember || ratMembers[Math.floor(Math.random() * ratMembers.length)];

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
          <p>{ratMember ? 'RAT Member assigned to this SitRep' : 'Suggested RAT Member'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}