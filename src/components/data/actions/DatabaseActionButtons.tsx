import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { BackupActions } from "./BackupActions";
import { ExportActions } from "./ExportActions";
import { memo } from "react";

interface DatabaseActionButtonsProps {
  isClearing: boolean;
  isPopulating: boolean;
  onClear: () => void;
  onShowQuantityForm: () => void;
}

const DatabaseActionButtonsComponent = ({
  isClearing,
  isPopulating,
  onClear,
  onShowQuantityForm,
}: DatabaseActionButtonsProps) => {
  const isDisabled = isClearing || isPopulating;

  return (
    <div className="flex flex-wrap gap-4">
      <Button
        variant="destructive"
        onClick={onClear}
        disabled={isDisabled}
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
        disabled={isDisabled}
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

      <BackupActions isInitialized={true} disabled={isDisabled} />
      <ExportActions isInitialized={true} disabled={isDisabled} />
    </div>
  );
};

// Memoize the buttons component to prevent unnecessary re-renders
export const DatabaseActionButtons = memo(DatabaseActionButtonsComponent);