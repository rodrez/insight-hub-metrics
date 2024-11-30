import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { Department } from "@/lib/types";

interface DepartmentColorLegendProps {
  departments: Department[];
  descriptions: Record<string, string>;
}

export function DepartmentColorLegend({ departments, descriptions }: DepartmentColorLegendProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-card rounded-lg">
      {departments.map(dept => (
        <TooltipProvider key={dept.id}>
          <Tooltip>
            <TooltipTrigger>
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: dept.color }}
                />
                <span className="text-sm">{dept.name}</span>
                <Info className="h-4 w-4 text-muted-foreground" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{descriptions[dept.id as keyof typeof descriptions]}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
}