import { DatabaseActions } from "./DatabaseActions";
import { DataStats } from "./stats/DataStats";
import { useDataInitialization } from "./hooks/useDataInitialization";
import { useDataCounts } from "./hooks/useDataCounts";
import { useDataClearing } from "./hooks/useDataClearing";
import { useDataPopulation } from "./hooks/useDataPopulation";
import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Progress } from "@/components/ui/progress";
import { DataQuantities } from "./SampleData";
import { errorHandler } from "@/lib/services/error/ErrorHandlingService";

export default function DataManagement() {
  const { isInitialized } = useDataInitialization();
  const { isClearing, clearDatabase } = useDataClearing();
  const { isPopulating, populateSampleData, progress } = useDataPopulation();
  const { dataCounts, updateDataCounts } = useDataCounts(isInitialized);
  const queryClient = useQueryClient();

  const handleClear = useCallback(async () => {
    try {
      await clearDatabase();
      await queryClient.invalidateQueries({ queryKey: ['data-counts'] });
      await updateDataCounts();
    } catch (error) {
      errorHandler.handleError(error, {
        type: 'database',
        title: 'Failed to clear database'
      });
    }
  }, [clearDatabase, queryClient, updateDataCounts]);

  const handlePopulate = useCallback(async (quantities: DataQuantities) => {
    try {
      await populateSampleData(quantities);
      await updateDataCounts();
    } catch (error) {
      errorHandler.handleError(error, {
        type: 'database',
        title: 'Failed to populate data'
      });
    }
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