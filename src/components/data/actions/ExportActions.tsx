import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { useState } from "react";
import { Loader2, ChevronDown } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { errorHandler } from "@/lib/services/error/ErrorHandlingService";
import { CSVExportService } from "@/lib/services/CSVExportService";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ExportActionsProps {
  isInitialized: boolean;
  disabled: boolean;
}

export function ExportActions({ isInitialized, disabled }: ExportActionsProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: 'json' | 'csv') => {
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
      console.log('Exported data:', data); // Debug log
      
      let blob;
      let filename;

      if (format === 'json') {
        blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        filename = `database-export-${new Date().toISOString()}.json`;
      } else {
        const csv = CSVExportService.convertToCSV(data);
        console.log('Generated CSV:', csv); // Debug log
        blob = new Blob([csv], { type: 'text/csv' });
        filename = `database-export-${new Date().toISOString()}.csv`;
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Success",
        description: `Data exported successfully as ${format.toUpperCase()}`,
      });
    } catch (error) {
      console.error('Export error:', error); // Debug log
      errorHandler.handleError(error, {
        type: 'database',
        title: 'Failed to export data'
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled || isExporting || !isInitialized}
        >
          {isExporting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              Export Data
              <ChevronDown className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => handleExport('json')}>
          Export as JSON
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('csv')}>
          Export as CSV
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}