import { Button } from "@/components/ui/button";
import { DataQuantityForm } from "./actions/DataQuantityForm";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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

  return (
    <div className="flex gap-4">
      <Button
        variant="destructive"
        onClick={onClear}
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
            onSubmit={async (quantities) => {
              await onPopulate(quantities);
              setShowQuantityForm(false);
            }}
            onCancel={() => setShowQuantityForm(false)}
            isLoading={isPopulating}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}