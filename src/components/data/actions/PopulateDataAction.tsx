import { Button } from "@/components/ui/button";
import { Database, Loader2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PopulateDataActionProps {
  isInitialized: boolean;
  isPopulating: boolean;
  onPopulate: () => void;
}

export function PopulateDataAction({
  isInitialized,
  isPopulating,
  onPopulate
}: PopulateDataActionProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            onClick={onPopulate} 
            disabled={!isInitialized || isPopulating}
            className="flex items-center gap-2 relative"
          >
            {isPopulating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Database className="h-4 w-4" />
            )}
            {isPopulating ? "Generating..." : "Generate Sample Data"}
          </Button>
        </TooltipTrigger>
        <TooltipContent className="max-w-[300px] p-4">
          <p className="text-sm">This will generate sample data in the following order:</p>
          <ol className="list-decimal ml-4 mt-2 text-sm">
            <li>Generate Fortune 30 partners</li>
            <li>Create internal partners across departments</li>
            <li>Generate SME partners</li>
            <li>Create projects with assigned partners</li>
            <li>Generate SPIs for each project</li>
            <li>Create objectives</li>
            <li>Generate situation reports</li>
          </ol>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}