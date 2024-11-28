import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Trash2, Database } from "lucide-react";
import { ExportActions } from "./actions/ExportActions";
import { BackupActions } from "./actions/BackupActions";
import { toast } from "@/components/ui/use-toast";

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
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast({
        title: "Error",
        description: `Failed to clear database: ${errorMessage}`,
        variant: "destructive",
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
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast({
        title: "Error",
        description: `Failed to populate data: ${errorMessage}`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={!isInitialized || isClearing}>
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Database
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action will clear all data from the database. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleClear}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button 
            onClick={handlePopulate} 
            disabled={!isInitialized || isPopulating}
            className="flex items-center gap-2"
          >
            <Database className="h-4 w-4" />
            {isPopulating ? "Generating..." : "Generate Sample Data"}
          </Button>
        </div>

        <ExportActions isInitialized={isInitialized} />
        <BackupActions isInitialized={isInitialized} />
      </div>
    </div>
  );
}