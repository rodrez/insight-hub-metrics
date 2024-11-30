import { errorHandler } from "@/lib/services/error/ErrorHandlingService";
import { toast } from "@/components/ui/use-toast";
import { ClearDatabaseAction } from "./actions/ClearDatabaseAction";
import { PopulateDataAction } from "./actions/PopulateDataAction";
import { ExportActions } from "./actions/ExportActions";
import { BackupActions } from "./actions/BackupActions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useState } from "react";
import { DataQuantityForm } from "./actions/DataQuantityForm";
import { DataQuantities } from "./SampleData";
import { validateDataQuantities } from "./validation/databaseSchemas";
import { ZodError } from "zod";

interface DatabaseActionsProps {
  isInitialized: boolean;
  isClearing: boolean;
  isPopulating: boolean;
  onClear: () => Promise<void>;
  onPopulate: (quantities: DataQuantities) => Promise<void>;
}

export function DatabaseActions({ 
  isInitialized, 
  isClearing,
  isPopulating,
  onClear,
  onPopulate
}: DatabaseActionsProps) {
  const [showQuantityDialog, setShowQuantityDialog] = useState(false);

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

  const handlePopulate = async (quantities: DataQuantities) => {
    try {
      // Validate quantities before proceeding
      const validatedQuantities = validateDataQuantities(quantities);
      
      await onPopulate(validatedQuantities);
      setShowQuantityDialog(false);
      toast({
        title: "Success",
        description: "Sample data populated successfully",
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const issues = error.issues.map(issue => issue.message).join(', ');
        toast({
          title: "Validation Error",
          description: `Invalid data quantities: ${issues}`,
          variant: "destructive"
        });
      } else {
        errorHandler.handleError(error, {
          type: 'database',
          title: 'Failed to populate data'
        });
      }
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
            onPopulate={() => setShowQuantityDialog(true)}
          />
        </div>
        <ExportActions isInitialized={isInitialized} />
        <BackupActions isInitialized={isInitialized} />
      </div>

      <Dialog open={showQuantityDialog} onOpenChange={setShowQuantityDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Sample Data</DialogTitle>
            <DialogDescription>
              Specify the quantity of data to generate for each category.
            </DialogDescription>
          </DialogHeader>
          <DataQuantityForm 
            onSubmit={handlePopulate}
            isPopulating={isPopulating}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}