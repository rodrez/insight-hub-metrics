import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { DataQuantityForm } from "./actions/DataQuantityForm";
import { BackupActions } from "./actions/BackupActions";
import { ExportActions } from "./actions/ExportActions";
import { toast } from "@/components/ui/use-toast";
import { DataQuantities } from "./types/dataTypes";
import { db } from "@/lib/db";

interface DatabaseActionsProps {
  isInitialized: boolean;
  isClearing: boolean;
  isPopulating: boolean;
  onClear: () => Promise<void>;
  onPopulate: (quantities: DataQuantities) => Promise<void>;
}

export function DatabaseActions({
  isInitialized,
  isClearing,
  isPopulating,
  onClear,
  onPopulate,
}: DatabaseActionsProps) {
  const [error, setError] = useState<string | null>(null);
  const [showQuantityForm, setShowQuantityForm] = useState(false);
  const [isDistributing, setIsDistributing] = useState(false);

  const handleClear = async () => {
    try {
      setError(null);
      await onClear();
      toast({
        title: "Success",
        description: "Database cleared successfully",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to clear database";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handlePopulate = async (quantities: DataQuantities) => {
    try {
      setError(null);
      await onPopulate(quantities);
      setShowQuantityForm(false);
      toast({
        title: "Success",
        description: "Database populated successfully",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to populate database";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleDistributeOrgChart = async () => {
    setIsDistributing(true);
    try {
      const [projects, spis, sitreps, collaborators] = await Promise.all([
        db.getAllProjects(),
        db.getAllSPIs(),
        db.getAllSitReps(),
        db.getAllCollaborators()
      ]);

      const internalCollaborators = collaborators.filter(c => c.type === 'internal');
      
      // Distribute items evenly across collaborators
      const distribution = internalCollaborators.map(collaborator => ({
        id: collaborator.id,
        assignedProjects: [] as string[],
        assignedSpis: [] as string[],
        assignedSitreps: [] as string[]
      }));

      // Helper function to distribute items
      const distributeItems = (items: any[], type: 'assignedProjects' | 'assignedSpis' | 'assignedSitreps') => {
        let currentIndex = 0;
        items.forEach(item => {
          distribution[currentIndex % distribution.length][type].push(item.id);
          currentIndex++;
        });
      };

      distributeItems(projects, 'assignedProjects');
      distributeItems(spis, 'assignedSpis');
      distributeItems(sitreps, 'assignedSitreps');

      // Save the distribution
      for (const position of distribution) {
        await db.updateCollaborator(position.id, {
          assignedProjects: position.assignedProjects,
          assignedSpis: position.assignedSpis,
          assignedSitreps: position.assignedSitreps
        });
      }

      toast({
        title: "Success",
        description: "Org chart data distributed successfully",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to distribute org chart data";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsDistributing(false);
    }
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
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-wrap gap-4">
        <Button
          variant="destructive"
          onClick={handleClear}
          disabled={isClearing || isPopulating || isDistributing}
        >
          {isClearing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Clearing...
            </>
          ) : (
            "Clear Database"
          )}
        </Button>

        <Button
          onClick={() => setShowQuantityForm(true)}
          disabled={isClearing || isPopulating || isDistributing}
        >
          {isPopulating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Populating...
            </>
          ) : (
            "Populate with Sample Data"
          )}
        </Button>

        <Button
          onClick={handleDistributeOrgChart}
          disabled={isClearing || isPopulating || isDistributing}
        >
          {isDistributing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Distributing...
            </>
          ) : (
            "Distribute Org Chart"
          )}
        </Button>

        <BackupActions isInitialized={isInitialized} disabled={isClearing || isPopulating || isDistributing} />
        <ExportActions isInitialized={isInitialized} disabled={isClearing || isPopulating || isDistributing} />
      </div>

      {showQuantityForm && (
        <DataQuantityForm
          onSubmit={handlePopulate}
          onCancel={() => setShowQuantityForm(false)}
          isLoading={isPopulating}
        />
      )}
    </div>
  );
}
