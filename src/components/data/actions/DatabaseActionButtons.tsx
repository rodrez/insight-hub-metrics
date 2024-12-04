import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { BackupActions } from "./BackupActions";
import { ExportActions } from "./ExportActions";

interface DatabaseActionButtonsProps {
  isClearing: boolean;
  isPopulating: boolean;
  onClear: () => void;
  onShowQuantityForm: () => void;
}

export function DatabaseActionButtons({
  isClearing,
  isPopulating,
  onClear,
  onShowQuantityForm,
}: DatabaseActionButtonsProps) {
  return (
    <div className="flex flex-wrap gap-4">
      <Button
        variant="destructive"
        onClick={onClear}
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
        onClick={onShowQuantityForm}
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

      <BackupActions isInitialized={true} disabled={isClearing || isPopulating} />
      <ExportActions isInitialized={true} disabled={isClearing || isPopulating} />
    </div>
  );
}