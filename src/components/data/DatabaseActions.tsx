import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { DataQuantityForm } from "./actions/DataQuantityForm";
import { BackupActions } from "./actions/BackupActions";
import { ExportActions } from "./actions/ExportActions";
import { toast } from "@/components/ui/use-toast";
import { DataQuantities } from "./types/dataTypes";
import { errorHandler } from "@/lib/services/error/ErrorHandlingService";

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
  onPopulate,
}: DatabaseActionsProps) {
  const [showQuantityForm, setShowQuantityForm] = useState(false);

  const handleClear = async () => {
    await errorHandler.withErrorHandling(
      async () => {
        await onClear();
        toast({
          title: "Success",
          description: "Database cleared successfully",
        });
      },
      {
        type: 'database',
        title: 'Failed to clear database',
        retry: handleClear
      }
    );
  };

  const handlePopulate = async (quantities: DataQuantities) => {
    await errorHandler.withErrorHandling(
      async () => {
        await onPopulate(quantities);
        setShowQuantityForm(false);
        toast({
          title: "Success",
          description: "Database populated successfully",
        });
      },
      {
        type: 'database',
        title: 'Failed to populate database',
        retry: () => handlePopulate(quantities)
      }
    );
  };

  if (!isInitialized) {
    return (
      <Alert>
        <AlertDescription>
          Database is not initialized. Please wait...
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <Button
          variant="destructive"
          onClick={handleClear}
          disabled={isClearing || isPopulating}
        >
          {isClearing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Clearing...
            </>
          ) : (
            "Clear Database"
          )}
        </Button>

        <Button
          onClick={() => setShowQuantityForm(true)}
          disabled={isClearing || isPopulating}
        >
          {isPopulating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Populating...
            </>
          ) : (
            "Populate with Sample Data"
          )}
        </Button>

        <BackupActions isInitialized={isInitialized} disabled={isClearing || isPopulating} />
        <ExportActions isInitialized={isInitialized} disabled={isClearing || isPopulating} />
      </div>

      {showQuantityForm && (
        <DataQuantityForm
          onSubmit={handlePopulate}
          onCancel={() => setShowQuantityForm(false)}
          isLoading={isPopulating}
        />
      )}
    </div>
  );
}