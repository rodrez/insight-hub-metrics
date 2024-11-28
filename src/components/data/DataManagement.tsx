import { DatabaseActions } from "./DatabaseActions";
import { DataStats } from "./stats/DataStats";
import { useDataInitialization } from "./hooks/useDataInitialization";
import { useDataCounts } from "./hooks/useDataCounts";
import { useDataClearing } from "./hooks/useDataClearing";
import { useDataPopulation } from "./hooks/useDataPopulation";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

export default function DataManagement() {
  const { isInitialized } = useDataInitialization();
  const { isClearing, clearDatabase } = useDataClearing();
  const { isPopulating, populateSampleData } = useDataPopulation();
  const { dataCounts, updateDataCounts } = useDataCounts(isInitialized);
  const queryClient = useQueryClient();

  // Update counts after population or clearing
  useEffect(() => {
    if (!isPopulating && !isClearing) {
      updateDataCounts();
    }
  }, [isPopulating, isClearing]);

  const handleClear = async () => {
    await clearDatabase();
    queryClient.invalidateQueries({ queryKey: ['data-counts'] });
  };

  const handlePopulate = async () => {
    await populateSampleData();
    await updateDataCounts();
  };

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
      <DataStats dataCounts={dataCounts} />
    </div>
  );
}