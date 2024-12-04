import { Alert, AlertDescription } from "@/components/ui/alert";
import { DataQuantityForm } from "./actions/DataQuantityForm";
import { DatabaseActionButtons } from "./actions/DatabaseActionButtons";
import { useDatabaseActions } from "./hooks/useDatabaseActions";
import { DataQuantities } from "./types/dataTypes";
import { memo, useMemo } from "react";

interface DatabaseActionsProps {
  isInitialized: boolean;
  isClearing: boolean;
  isPopulating: boolean;
  onClear: () => Promise<void>;
  onPopulate: (quantities: DataQuantities) => Promise<void>;
}

const DatabaseActionsComponent = ({
  isInitialized,
  isClearing,
  isPopulating,
  onClear,
  onPopulate,
}: DatabaseActionsProps) => {
  const {
    error,
    showQuantityForm,
    setShowQuantityForm,
    handleClear,
    handlePopulate
  } = useDatabaseActions(onClear, onPopulate);

  // Memoize the initialization alert to prevent unnecessary re-renders
  const initializationAlert = useMemo(() => {
    if (!isInitialized) {
      return (
        <Alert>
          <AlertDescription>
            Database is not initialized. Please wait...
          </AlertDescription>
        </Alert>
      );
    }
    return null;
  }, [isInitialized]);

  // Memoize the error alert
  const errorAlert = useMemo(() => {
    if (error) {
      return (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      );
    }
    return null;
  }, [error]);

  // Memoize the form component to prevent unnecessary re-renders
  const quantityForm = useMemo(() => {
    if (showQuantityForm) {
      return (
        <DataQuantityForm
          onSubmit={handlePopulate}
          onCancel={() => setShowQuantityForm(false)}
          isLoading={isPopulating}
        />
      );
    }
    return null;
  }, [showQuantityForm, handlePopulate, setShowQuantityForm, isPopulating]);

  if (!isInitialized) {
    return initializationAlert;
  }

  return (
    <div className="space-y-4">
      {errorAlert}

      <DatabaseActionButtons
        isClearing={isClearing}
        isPopulating={isPopulating}
        onClear={handleClear}
        onShowQuantityForm={() => setShowQuantityForm(true)}
      />

      {quantityForm}
    </div>
  );
};

// Memoize the entire component to prevent unnecessary re-renders
export const DatabaseActions = memo(DatabaseActionsComponent);