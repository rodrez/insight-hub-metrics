import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Database, Download, FileJson, FileUp, Info, Save, Trash2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { db } from "@/lib/db";

interface DatabaseActionsProps {
  isInitialized: boolean;
  isClearing: boolean;
  isPopulating: boolean;
  onClear: () => Promise<void>;
  onPopulate: () => Promise<void>;
}

export function DatabaseActions({ 
  isInitialized, 
  isClearing, 
  isPopulating,
  onClear,
  onPopulate
}: DatabaseActionsProps) {
  const handleExportJson = async () => {
    try {
      await db.exportData();
      toast({
        title: "Data exported",
        description: "Project data has been exported as JSON successfully.",
      });
    } catch (error) {
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
      
      // Convert to CSV format
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
      toast({
        title: "Export failed",
        description: "There was an error exporting the data as CSV.",
        variant: "destructive",
      });
    }
  };

  const handleBackupDatabase = async () => {
    try {
      const projects = await db.getAllProjects();
      const collaborators = await db.getAllCollaborators();
      const backup = { projects, collaborators, timestamp: new Date().toISOString() };
      const blob = new Blob([JSON.stringify(backup)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `database-backup-${new Date().toISOString()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Database backed up",
        description: "Database backup has been created successfully.",
      });
    } catch (error) {
      toast({
        title: "Backup failed",
        description: "There was an error creating the database backup.",
        variant: "destructive",
      });
    }
  };

  const handleRestoreDatabase = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const content = await file.text();
      const backup = JSON.parse(content);
      
      // Validate backup structure
      if (!backup.projects || !backup.collaborators || !backup.timestamp) {
        throw new Error("Invalid backup file format");
      }

      await db.clear();
      await db.init();
      
      // Restore data
      for (const project of backup.projects) {
        await db.addProject(project);
      }
      for (const collaborator of backup.collaborators) {
        await db.addCollaborator(collaborator);
      }

      toast({
        title: "Database restored",
        description: `Database has been restored from backup (${new Date(backup.timestamp).toLocaleString()})`,
      });
    } catch (error) {
      toast({
        title: "Restore failed",
        description: "There was an error restoring the database from backup.",
        variant: "destructive",
      });
    }
    
    // Reset file input
    event.target.value = '';
  };

  return (
    <div className="space-y-4">
      <TooltipProvider>
        <div className="flex flex-col gap-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={!isInitialized || isClearing}>
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Database
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action will clear all data from the database. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onClear}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button
            onClick={onPopulate}
            disabled={!isInitialized || isPopulating}
            variant="outline"
          >
            <Database className="h-4 w-4 mr-2" />
            {isPopulating ? "Populating..." : "Populate Sample Data"}
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 ml-2" />
              </TooltipTrigger>
              <TooltipContent className="max-w-sm">
                <p>Populates the database with realistic sample data including:</p>
                <ul className="list-disc ml-4 mt-2">
                  <li>Fortune 30 company collaborations</li>
                  <li>Internal department projects</li>
                  <li>Project milestones and metrics</li>
                  <li>Detailed NABC analyses</li>
                </ul>
              </TooltipContent>
            </Tooltip>
          </Button>

          <div className="flex gap-2">
            <Button onClick={handleExportJson} disabled={!isInitialized}>
              <FileJson className="h-4 w-4 mr-2" />
              Export as JSON
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 ml-2" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Exports all data in JSON format, including:</p>
                  <ul className="list-disc ml-4 mt-2">
                    <li>Project details and metrics</li>
                    <li>Collaborator information</li>
                    <li>Milestones and progress</li>
                  </ul>
                </TooltipContent>
              </Tooltip>
            </Button>

            <Button onClick={handleExportCsv} disabled={!isInitialized}>
              <Download className="h-4 w-4 mr-2" />
              Export as CSV
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 ml-2" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Exports data in CSV format for spreadsheet analysis</p>
                </TooltipContent>
              </Tooltip>
            </Button>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleBackupDatabase} disabled={!isInitialized}>
              <Save className="h-4 w-4 mr-2" />
              Backup Database
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 ml-2" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Creates a complete backup of the database including all projects and collaborations</p>
                </TooltipContent>
              </Tooltip>
            </Button>

            <Button
              variant="outline"
              onClick={() => document.getElementById('restore-file')?.click()}
              disabled={!isInitialized}
            >
              <FileUp className="h-4 w-4 mr-2" />
              Restore Database
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 ml-2" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Restores the database from a previous backup file</p>
                </TooltipContent>
              </Tooltip>
            </Button>
            <input
              type="file"
              id="restore-file"
              accept=".json"
              onChange={handleRestoreDatabase}
              className="hidden"
            />
          </div>
        </div>
      </TooltipProvider>
    </div>
  );
}