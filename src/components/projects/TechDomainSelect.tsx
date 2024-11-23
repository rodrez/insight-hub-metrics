import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { defaultTechDomains } from "@/lib/types/techDomain";

interface TechDomainSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
}

export function TechDomainSelect({ value, onValueChange, disabled }: TechDomainSelectProps) {
  return (
    <div className="flex items-center gap-2">
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select tech domain" />
        </SelectTrigger>
        <SelectContent>
          {defaultTechDomains.map(domain => (
            <SelectItem
              key={domain.id}
              value={domain.id}
              className="flex items-center gap-2"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: domain.color }}
                />
                {domain.name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {value && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p>{defaultTechDomains.find(d => d.id === value)?.description}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}