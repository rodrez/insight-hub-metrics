import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { errorHandler } from "@/lib/services/error/ErrorHandlingService";

interface ExportActionsProps {
  isInitialized: boolean;
  disabled: boolean;
}

export function ExportActions({ isInitialized, disabled }: ExportActionsProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!isInitialized) {
      toast({
        title: "Error",
        description: "Database is not initialized",
        variant: "destructive",
      });
      return;
    }

    setIsExporting(true);
    try {
      const data = await db.exportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `database-export-${new Date().toISOString()}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Success",
        description: "Data exported successfully",
      });
    } catch (error) {
      errorHandler.handleError(error, {
        type: 'database',
        title: 'Failed to export data'
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleExport}
      disabled={disabled || isExporting || !isInitialized}
    >
      {isExporting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Exporting...
        </>
      ) : (
        "Export Data"
      )}
    </Button>
  );
}