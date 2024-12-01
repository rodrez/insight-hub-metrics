import { Input } from "@/components/ui/input";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface WarningThresholdsProps {
  warningDays: number;
  criticalDays: number;
  onWarningDaysChange: (days: number) => void;
  onCriticalDaysChange: (days: number) => void;
}

export function WarningThresholds({
  warningDays,
  criticalDays,
  onWarningDaysChange,
  onCriticalDaysChange,
}: WarningThresholdsProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex-1">
        <label className="text-sm text-muted-foreground flex items-center gap-2">
          Warning Threshold (days)
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Agreements will show a warning when expiring within this many days</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </label>
        <Input
          type="number"
          value={warningDays}
          onChange={(e) => onWarningDaysChange(Number(e.target.value))}
        />
      </div>
      <div className="flex-1">
        <label className="text-sm text-muted-foreground flex items-center gap-2">
          Critical Threshold (days)
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Agreements will show a critical warning when expiring within this many days</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </label>
        <Input
          type="number"
          value={criticalDays}
          onChange={(e) => onCriticalDaysChange(Number(e.target.value))}
        />
      </div>
    </div>
  );
}