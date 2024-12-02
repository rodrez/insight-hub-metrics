import { Info } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface RemainingBudgetProps {
  budget: number;
  spent: number;
}

export function RemainingBudget({ budget, spent }: RemainingBudgetProps) {
  const remaining = budget - (spent || 0);
  const progressValue = ((spent || 0) / budget) * 100;

  return (
    <div className="space-y-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="flex items-center gap-2">
            Remaining
            <Info className="h-4 w-4" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Remaining budget</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <p className="text-2xl font-bold">${remaining.toLocaleString()}</p>
      <Progress value={progressValue} className="h-2" />
    </div>
  );
}