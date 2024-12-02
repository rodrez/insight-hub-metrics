import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function DataHeader() {
  return (
    <div className="flex items-center gap-2 mb-4">
      <h2 className="text-2xl font-bold">Data Management</h2>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Info className="h-4 w-4 text-muted-foreground" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Manage database operations and view data statistics</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}