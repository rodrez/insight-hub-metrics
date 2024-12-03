import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { DataQuantityForm } from "./actions/DataQuantityForm";
import { BackupActions } from "./actions/BackupActions";
import { ExportActions } from "./actions/ExportActions";
import { toast } from "@/components/ui/use-toast";
import { DataQuantities } from "./types/dataTypes";
import { useQueryClient } from "@tanstack/react-query";

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
  const [error, setError] = useState<string | null>(null);
  const [showQuantityForm, setShowQuantityForm] = useState(false);
  const queryClient = useQueryClient();

  const handleClear = async () => {
    try {
      setError(null);
      await onClear();
      // Invalidate and reset all data count queries
      await queryClient.invalidateQueries({ queryKey: ['data-counts'] });
      queryClient.setQueryData(['data-counts'], {
        projects: 0,
        spis: 0,
        objectives: 0,
        sitreps: 0,
        fortune30: 0,
        internalPartners: 0,
        smePartners: 0
      });
      toast({
        title: "Success",
        description: "Database cleared successfully",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to clear database";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handlePopulate = async (quantities: DataQuantities) => {
    try {
      setError(null);
      await onPopulate(quantities);
      // Invalidate queries to refresh counts
      await queryClient.invalidateQueries({ queryKey: ['data-counts'] });
      setShowQuantityForm(false);
      toast({
        title: "Success",
        description: "Database populated successfully",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to populate database";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
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
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

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