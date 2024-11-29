import { Button } from "@/components/ui/button";
import { Database, Loader2 } from "lucide-react";

interface PopulateDataActionProps {
  isInitialized: boolean;
  isPopulating: boolean;
  onPopulate: () => Promise<void>;
}

export function PopulateDataAction({
  isInitialized,
  isPopulating,
  onPopulate
}: PopulateDataActionProps) {
  return (
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
  );
}