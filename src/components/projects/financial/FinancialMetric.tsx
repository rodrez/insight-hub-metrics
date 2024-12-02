import { Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FinancialMetricProps {
  label: string;
  tooltip: string;
  value: string | number;
  isEditing?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  prefix?: string;
  suffix?: string;
  type?: "number" | "text";
  step?: string;
  min?: string;
}

export function FinancialMetric({
  label,
  tooltip,
  value,
  isEditing = false,
  onChange,
  prefix = "$",
  suffix = "",
  type = "number",
  step = "0.1",
  min = "0"
}: FinancialMetricProps) {
  return (
    <div className="space-y-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="flex items-center gap-2">
            {label}
            <Info className="h-4 w-4" />
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {isEditing ? (
        <div className="relative">
          <Input
            type={type}
            value={value}
            onChange={onChange}
            step={step}
            min={min}
            className="pl-6 text-xl font-semibold"
          />
          {prefix && <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xl font-semibold">{prefix}</span>}
          {suffix && <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xl font-semibold">{suffix}</span>}
        </div>
      ) : (
        <p className="text-2xl font-bold">{prefix}{value}{suffix}</p>
      )}
    </div>
  );
}