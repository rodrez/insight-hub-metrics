import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

interface BackupActionsProps {
  isInitialized: boolean;
  disabled: boolean;
}

export function BackupActions({ isInitialized, disabled }: BackupActionsProps) {
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
    <div className="flex flex-wrap gap-4">
      <Button variant="outline" disabled={disabled}>
        Backup Database
      </Button>
      <Button variant="outline" disabled={disabled}>
        Restore Database
      </Button>
    </div>
  );
}
