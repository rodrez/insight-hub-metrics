import { DatabaseActions } from "./DatabaseActions";
import { useDataInitialization } from "./hooks/useDataInitialization";
import { useDataCounts } from "./hooks/useDataCounts";
import { useDataClearing } from "./hooks/useDataClearing";
import { useDataPopulation } from "./hooks/useDataPopulation";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { DataQuantities } from "./SampleData";
import { errorHandler } from "@/lib/services/error/ErrorHandlingService";
import { toast } from "@/components/ui/use-toast";
import { db } from "@/lib/db";
import { DataHeader } from "./components/DataHeader";
import { DataProgress } from "./components/DataProgress";
import { DataDisplay } from "./components/DataDisplay";

const ITEMS_PER_PAGE = 10;

export default function DataManagement() {
  const { isInitialized } = useDataInitialization();
  const { isClearing, clearDatabase } = useDataClearing();
  const { isPopulating, populateSampleData, progress } = useDataPopulation();
  const { dataCounts, updateDataCounts, isLoading: isLoadingCounts } = useDataCounts(isInitialized);
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);

  const handleClear = async () => {
    if (!isInitialized) {
      toast({
        title: "Error",
        description: "Database not initialized. Please wait...",
        variant: "destructive",
      });
      return;
    }

    try {
      await clearDatabase();
      await db.init();
      await queryClient.invalidateQueries();
      await updateDataCounts();
      setCurrentPage(1);
      
      toast({
        title: "Success",
        description: "Database cleared successfully",
      });
    } catch (error) {
      console.error('Clear error:', error);
      errorHandler.handleError(error, {
        type: 'database',
        title: 'Failed to clear database'
      });
    }
  };

  const handlePopulate = async (quantities: DataQuantities) => {
    if (!isInitialized) {
      toast({
        title: "Error",
        description: "Database not initialized. Please wait...",
        variant: "destructive",
      });
      return;
    }

    try {
      await populateSampleData(quantities);
      await queryClient.invalidateQueries();
      await updateDataCounts();
      
      toast({
        title: "Success",
        description: "Database populated successfully. Refreshing data...",
      });
    } catch (error) {
      console.error('Population error:', error);
      errorHandler.handleError(error, {
        type: 'database',
        title: 'Failed to populate data'
      });
    }
  };

  const totalPages = Math.ceil((dataCounts?.projects || 0) / ITEMS_PER_PAGE);

  return (
    <div className="space-y-4 p-4">
      <DataHeader />
      <DatabaseActions
        isInitialized={isInitialized}
        isClearing={isClearing}
        isPopulating={isPopulating}
        onClear={handleClear}
        onPopulate={handlePopulate}
      />
      <DataProgress isPopulating={isPopulating} progress={progress} />
      <DataDisplay
        dataCounts={dataCounts}
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={ITEMS_PER_PAGE}
        isLoading={isLoadingCounts}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}