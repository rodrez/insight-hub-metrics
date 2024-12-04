import { Button } from "@/components/ui/button";
import { DataQuantityForm } from "./actions/DataQuantityForm";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";

interface DatabaseActionsProps {
  isInitialized: boolean;
  isClearing: boolean;
  isPopulating: boolean;
  onClear: () => Promise<void>;
  onPopulate: (quantities: any) => Promise<void>;
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
    try {
      console.log('Starting database clear operation...');
      await onClear();
      console.log('Database clear operation completed successfully');
      toast({
        title: "Success",
        description: "Database cleared successfully",
      });
    } catch (error) {
      console.error('Database clear operation failed:', error);
      toast({
        title: "Error",
        description: "Failed to clear database. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePopulate = async (quantities: any) => {
    try {
      console.log('Starting database population with quantities:', quantities);
      await onPopulate(quantities);
      setShowQuantityForm(false);
      console.log('Database population completed successfully');
      toast({
        title: "Success",
        description: "Database populated successfully",
      });
    } catch (error) {
      console.error('Database population failed:', error);
      toast({
        title: "Error",
        description: "Failed to populate database. Please try again.",
        variant: "destructive",
      });
      setShowQuantityForm(false);
    }
  };

  return (
    <div className="flex gap-4">
      <Button
        variant="destructive"
        onClick={handleClear}
        disabled={!isInitialized || isClearing || isPopulating}
      >
        Clear Database
      </Button>
      <Button
        onClick={() => setShowQuantityForm(true)}
        disabled={!isInitialized || isClearing || isPopulating}
      >
        Generate Sample Data
      </Button>

      <Dialog open={showQuantityForm} onOpenChange={setShowQuantityForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Sample Data</DialogTitle>
          </DialogHeader>
          <DataQuantityForm
            onSubmit={handlePopulate}
            onCancel={() => setShowQuantityForm(false)}
            isLoading={isPopulating}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}