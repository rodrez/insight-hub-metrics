import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { useState } from "react";
import { Loader2, ChevronDown } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { errorHandler } from "@/lib/services/error/ErrorHandlingService";
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

  const convertToCSV = (data: any) => {
    const items = [];
    
    // Add collaborators
    if (data.collaborators) {
      items.push(['Type: Collaborators']);
      items.push(['ID', 'Name', 'Type', 'Department', 'Email']);
      data.collaborators.forEach((c: any) => {
        items.push([c.id, c.name, c.type, c.department, c.email]);
      });
      items.push([]);  // Empty line for separation
    }

    // Add projects
    if (data.projects) {
      items.push(['Type: Projects']);
      items.push(['ID', 'Name', 'Status', 'Department', 'Start Date']);
      data.projects.forEach((p: any) => {
        items.push([p.id, p.name, p.status, p.department, p.startDate]);
      });
      items.push([]);
    }

    // Add SPIs
    if (data.spis) {
      items.push(['Type: SPIs']);
      items.push(['ID', 'Title', 'Status', 'Project ID']);
      data.spis.forEach((s: any) => {
        items.push([s.id, s.title, s.status, s.projectId]);
      });
    }

    return items.map(row => row.join(',')).join('\n');
  };

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
      let blob;
      let filename;

      if (format === 'json') {
        blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        filename = `database-export-${new Date().toISOString()}.json`;
      } else {
        const csv = convertToCSV(data);
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