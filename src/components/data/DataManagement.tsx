import { DatabaseActions } from "./DatabaseActions";
import { DataStats } from "./stats/DataStats";
import { useDataInitialization } from "./hooks/useDataInitialization";
import { useDataCounts } from "./hooks/useDataCounts";
import { useDataClearing } from "./hooks/useDataClearing";
import { useDataPopulation } from "./hooks/useDataPopulation";
import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Progress } from "@/components/ui/progress";

export default function DataManagement() {
  const { isInitialized } = useDataInitialization();
  const { isClearing, clearDatabase } = useDataClearing();
  const { isPopulating, populateSampleData, progress } = useDataPopulation();
  const { dataCounts, updateDataCounts } = useDataCounts(isInitialized);
  const queryClient = useQueryClient();

  const handleClear = useCallback(async () => {
    await clearDatabase();
    queryClient.invalidateQueries({ queryKey: ['data-counts'] });
  }, [clearDatabase, queryClient]);

  const handlePopulate = useCallback(async () => {
    await populateSampleData();
    await updateDataCounts();
  }, [populateSampleData, updateDataCounts]);

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-2xl font-bold mb-4">Data Management</h2>
      <DatabaseActions
        isInitialized={isInitialized}
        isClearing={isClearing}
        isPopulating={isPopulating}
        onClear={handleClear}
        onPopulate={handlePopulate}
      />
      {isPopulating && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Populating database...</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>
      )}
      <DataStats dataCounts={dataCounts} />
    </div>
  );
}