import { DatabaseActions } from "./DatabaseActions";
import { DataStats } from "./stats/DataStats";
import { useDataInitialization } from "./hooks/useDataInitialization";
import { useDataCounts } from "./hooks/useDataCounts";
import { useDataClearing } from "./hooks/useDataClearing";
import { useDataPopulation } from "./hooks/useDataPopulation";
import { useEffect } from "react";

export default function DataManagement() {
  const { isInitialized } = useDataInitialization();
  const { isClearing, clearDatabase } = useDataClearing();
  const { isPopulating, populateSampleData } = useDataPopulation();
  const { dataCounts, updateDataCounts } = useDataCounts(isInitialized);

  // Update counts after population or clearing
  useEffect(() => {
    if (!isPopulating && !isClearing) {
      updateDataCounts();
    }
  }, [isPopulating, isClearing]);

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-2xl font-bold mb-4">Data Management</h2>
      <DatabaseActions
        isInitialized={isInitialized}
        isClearing={isClearing}
        isPopulating={isPopulating}
        onClear={clearDatabase}
        onPopulate={async () => {
          await populateSampleData();
          updateDataCounts();
        }}
      />
      <DataStats dataCounts={dataCounts} />
    </div>
  );
}