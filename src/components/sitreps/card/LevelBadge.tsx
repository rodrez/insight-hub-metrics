import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface LevelBadgeProps {
  level: "CEO" | "SVP" | "CTO";
}

export function LevelBadge({ level }: LevelBadgeProps) {
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'CEO':
        return 'bg-purple-500/20 text-purple-500 border-purple-500/30';
      case 'SVP':
        return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
      case 'CTO':
        return 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30';
      default:
        return 'bg-gray-500/20 text-gray-500 border-gray-500/30';
    }
  };

  const getLevelDescription = (level: string) => {
    switch (level) {
      case 'CEO':
        return 'Chief Executive Officer level - Highest priority updates requiring CEO attention';
      case 'SVP':
        return 'Senior Vice President level - Strategic updates for senior leadership';
      case 'CTO':
        return 'Chief Technology Officer level - Technical updates requiring CTO review';
      default:
        return 'Standard level update';
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Badge 
            variant="outline" 
            className={`${getLevelColor(level)} font-semibold`}
          >
            {level}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>{getLevelDescription(level)}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}