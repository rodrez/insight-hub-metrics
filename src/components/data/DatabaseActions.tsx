import { errorHandler } from "@/lib/services/error/ErrorHandlingService";
import { toast } from "@/components/ui/use-toast";
import { ClearDatabaseAction } from "./actions/ClearDatabaseAction";
import { PopulateDataAction } from "./actions/PopulateDataAction";
import { ExportActions } from "./actions/ExportActions";
import { BackupActions } from "./actions/BackupActions";

interface DatabaseActionsProps {
  isInitialized: boolean;
  isClearing: boolean;
  isPopulating: boolean;
  onClear: () => Promise<void>;
  onPopulate: () => Promise<void>;
}

export function DatabaseActions({ 
  isInitialized, 
  isClearing,
  isPopulating,
  onClear,
  onPopulate
}: DatabaseActionsProps) {
  const handleClear = async () => {
    try {
      await onClear();
      toast({
        title: "Success",
        description: "Database cleared successfully",
      });
    } catch (error) {
      errorHandler.handleError(error, {
        type: 'database',
        title: 'Failed to clear database'
      });
    }
  };

  const handlePopulate = async () => {
    try {
      await onPopulate();
      toast({
        title: "Success",
        description: "Sample data populated successfully",
      });
    } catch (error) {
      errorHandler.handleError(error, {
        type: 'database',
        title: 'Failed to populate data'
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <ClearDatabaseAction 
            isInitialized={isInitialized}
            isClearing={isClearing}
            onClear={handleClear}
          />
          <PopulateDataAction
            isInitialized={isInitialized}
            isPopulating={isPopulating}
            onPopulate={handlePopulate}
          />
        </div>
        <ExportActions isInitialized={isInitialized} />
        <BackupActions isInitialized={isInitialized} />
      </div>
    </div>
  );
}