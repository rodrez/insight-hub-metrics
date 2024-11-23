import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { FileJson, Download } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { db } from "@/lib/db";

export function ExportActions({ isInitialized }: { isInitialized: boolean }) {
  const handleExportJson = async () => {
    try {
      await db.exportData();
      toast({
        title: "Data exported",
        description: "Project data has been exported as JSON successfully.",
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export failed",
        description: "There was an error exporting the data.",
        variant: "destructive",
      });
    }
  };

  const handleExportCsv = async () => {
    try {
      const projects = await db.getAllProjects();
      const collaborators = await db.getAllCollaborators();
      
      const projectsCsv = projects.map(p => 
        `${p.id},${p.name},${p.departmentId},${p.budget},${p.spent},${p.status}`
      ).join('\n');
      
      const collaboratorsCsv = collaborators.map(c => 
        `${c.id},${c.name},${c.email},${c.role},${c.department}`
      ).join('\n');

      const csvContent = `Projects\nID,Name,Department,Budget,Spent,Status\n${projectsCsv}\n\nCollaborators\nID,Name,Email,Role,Department\n${collaboratorsCsv}`;
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `project-data-${new Date().toISOString()}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Data exported",
        description: "Project data has been exported as CSV successfully.",
      });
    } catch (error) {
      console.error('CSV export error:', error);
      toast({
        title: "Export failed",
        description: "There was an error exporting the data as CSV.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={handleExportJson} disabled={!isInitialized}>
              <FileJson className="h-4 w-4 mr-2" />
              Export as JSON
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Exports all data in JSON format</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={handleExportCsv} disabled={!isInitialized}>
              <Download className="h-4 w-4 mr-2" />
              Export as CSV
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Exports data in CSV format for spreadsheet analysis</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}