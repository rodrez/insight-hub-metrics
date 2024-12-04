import { Alert, AlertDescription } from "@/components/ui/alert";
import { DataQuantityForm } from "./actions/DataQuantityForm";
import { DatabaseActionButtons } from "./actions/DatabaseActionButtons";
import { useDatabaseActions } from "./hooks/useDatabaseActions";
import { DataQuantities } from "./types/dataTypes";

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
  const {
    error,
    showQuantityForm,
    setShowQuantityForm,
    handleClear,
    handlePopulate
  } = useDatabaseActions(onClear, onPopulate);

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

      <DatabaseActionButtons
        isClearing={isClearing}
        isPopulating={isPopulating}
        onClear={handleClear}
        onShowQuantityForm={() => setShowQuantityForm(true)}
      />

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