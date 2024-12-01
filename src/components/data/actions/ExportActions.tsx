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

  const escapeCSVValue = (value: any): string => {
    if (value === null || value === undefined) return '';
    const stringValue = String(value);
    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  };

  const formatDate = (date: string | Date): string => {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  };

  const convertToCSV = (data: any) => {
    const items = [];
    const metadata = [`Export Date: ${formatDate(new Date())}`, ''];
    items.push(metadata);
    
    // Add collaborators with improved formatting
    if (data.collaborators?.length > 0) {
      items.push(['Collaborators']);
      items.push([
        'Collaborator ID',
        'Full Name',
        'Role Type',
        'Department',
        'Email Address',
        'Status',
        'Last Updated'
      ].map(escapeCSVValue));
      
      data.collaborators.forEach((c: any) => {
        items.push([
          c.id,
          c.name,
          c.type,
          c.department,
          c.email,
          c.status || 'Active',
          formatDate(c.updatedAt || new Date())
        ].map(escapeCSVValue));
      });
      items.push(['']);  // Empty line for separation
    }

    // Add projects with improved formatting
    if (data.projects?.length > 0) {
      items.push(['Projects']);
      items.push([
        'Project ID',
        'Project Name',
        'Current Status',
        'Department',
        'Start Date',
        'End Date',
        'Budget',
        'Priority Level'
      ].map(escapeCSVValue));
      
      data.projects.forEach((p: any) => {
        items.push([
          p.id,
          p.name,
          p.status,
          p.department,
          formatDate(p.startDate),
          formatDate(p.endDate),
          p.budget || 'N/A',
          p.priority || 'Medium'
        ].map(escapeCSVValue));
      });
      items.push(['']);
    }

    // Add SPIs with improved formatting
    if (data.spis?.length > 0) {
      items.push(['Strategic Partnership Initiatives (SPIs)']);
      items.push([
        'SPI ID',
        'Title',
        'Status',
        'Project ID',
        'Start Date',
        'Target Completion',
        'Actual Completion',
        'Priority'
      ].map(escapeCSVValue));
      
      data.spis.forEach((s: any) => {
        items.push([
          s.id,
          s.title,
          s.status,
          s.projectId,
          formatDate(s.startDate),
          formatDate(s.targetDate),
          formatDate(s.completionDate),
          s.priority || 'Medium'
        ].map(escapeCSVValue));
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