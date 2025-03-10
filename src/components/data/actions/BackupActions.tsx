import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { db } from "@/lib/db";
import { toast } from "@/components/ui/use-toast";
import { errorHandler } from "@/lib/services/error/ErrorHandlingService";

interface BackupActionsProps {
  isInitialized: boolean;
  disabled: boolean;
}

export function BackupActions({ isInitialized, disabled }: BackupActionsProps) {
  const [isRestoring, setIsRestoring] = useState(false);

  const handleRestore = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) return;

      setIsRestoring(true);
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        await db.clear();
        await db.init();
        
        // Restore data in sequence
        if (data.collaborators) {
          for (const collaborator of data.collaborators) {
            await db.addCollaborator(collaborator);
          }
        }
        if (data.smePartners) {
          for (const partner of data.smePartners) {
            await db.addSMEPartner(partner);
          }
        }
        if (data.projects) {
          for (const project of data.projects) {
            await db.addProject(project);
          }
        }
        if (data.spis) {
          for (const spi of data.spis) {
            await db.addSPI(spi);
          }
        }
        if (data.objectives) {
          for (const objective of data.objectives) {
            await db.addObjective(objective);
          }
        }
        if (data.sitreps) {
          for (const sitrep of data.sitreps) {
            await db.addSitRep(sitrep);
          }
        }

        toast({
          title: "Success",
          description: "Database restored successfully",
        });
      } catch (error) {
        errorHandler.handleError(error, {
          type: 'database',
          title: 'Failed to restore database'
        });
      } finally {
        setIsRestoring(false);
      }
    };

    input.click();
  };

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
    <Button 
      variant="outline" 
      onClick={handleRestore}
      disabled={disabled || isRestoring}
    >
      {isRestoring ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Restore Backup
        </>
      ) : (
        "Restore Backup"
      )}
    </Button>
  );
}