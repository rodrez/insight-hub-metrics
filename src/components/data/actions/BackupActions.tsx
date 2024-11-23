import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Save, FileUp } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { db } from "@/lib/db";

export function BackupActions({ isInitialized }: { isInitialized: boolean }) {
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
      console.error('Backup error:', error);
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
      
      if (!backup.projects || !backup.collaborators || !backup.timestamp) {
        throw new Error("Invalid backup file format");
      }

      await db.clear();
      await db.init();
      
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
      console.error('Restore error:', error);
      toast({
        title: "Restore failed",
        description: "There was an error restoring the database from backup.",
        variant: "destructive",
      });
    }
    
    event.target.value = '';
  };

  return (
    <div className="flex gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={handleBackupDatabase} disabled={!isInitialized}>
              <Save className="h-4 w-4 mr-2" />
              Backup Database
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Creates a complete backup of the database</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              onClick={() => document.getElementById('restore-file')?.click()}
              disabled={!isInitialized}
            >
              <FileUp className="h-4 w-4 mr-2" />
              Restore Database
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Restores the database from a backup file</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <input
        type="file"
        id="restore-file"
        accept=".json"
        onChange={handleRestoreDatabase}
        className="hidden"
      />
    </div>
  );
}