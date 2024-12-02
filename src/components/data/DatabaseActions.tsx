import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Database } from "lucide-react";
import { useState } from "react";
import { DataQuantityForm } from "./actions/DataQuantityForm";
import { BackupActions } from "./actions/BackupActions";
import { ExportActions } from "./actions/ExportActions";
import { toast } from "@/components/ui/use-toast";
import { DataQuantities } from "./types/dataTypes";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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
      // Invalidate all queries to refresh the UI
      await queryClient.invalidateQueries();
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
      console.log('Starting population with quantities:', quantities);
      setError(null);
      await onPopulate(quantities);
      // Invalidate all queries to refresh the UI
      await queryClient.invalidateQueries();
      setShowQuantityForm(false);
      toast({
        title: "Success",
        description: "Database populated successfully",
      });
    } catch (err) {
      console.error('Population error:', err);
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

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
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
                  <>
                    <Database className="mr-2 h-4 w-4" />
                    Populate with Sample Data
                  </>
                )}
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
                <li>Generate initiatives</li>
                <li>Generate situation reports</li>
              </ol>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

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