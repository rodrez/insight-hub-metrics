import { DatabaseActions } from "./DatabaseActions";
import { DataStats } from "./stats/DataStats";
import { useDataInitialization } from "./hooks/useDataInitialization";
import { useDataCounts } from "./hooks/useDataCounts";
import { useDataClearing } from "./hooks/useDataClearing";
import { useDataPopulation } from "./hooks/useDataPopulation";
import { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Progress } from "@/components/ui/progress";
import { DataQuantities } from "./SampleData";
import { errorHandler } from "@/lib/services/error/ErrorHandlingService";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const ITEMS_PER_PAGE = 10;

export default function DataManagement() {
  const { isInitialized } = useDataInitialization();
  const { isClearing, clearDatabase } = useDataClearing();
  const { isPopulating, populateSampleData, progress } = useDataPopulation();
  const { dataCounts, updateDataCounts, isLoading: isLoadingCounts } = useDataCounts(isInitialized);
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);

  const handleClear = useCallback(async () => {
    try {
      await clearDatabase();
      await queryClient.invalidateQueries({ queryKey: ['data-counts'] });
      await updateDataCounts();
      setCurrentPage(1); // Reset to first page after clearing
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

  const totalPages = Math.ceil((dataCounts?.projects || 0) / ITEMS_PER_PAGE);

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                onClick={() => setCurrentPage(page)}
                isActive={currentPage === page}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
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
      {isPopulating && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Populating database...</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>
      )}
      {isLoadingCounts ? (
        <div className="space-y-4">
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-8 w-[200px]" />
        </div>
      ) : (
        <>
          <DataStats 
            dataCounts={dataCounts} 
            currentPage={currentPage}
            itemsPerPage={ITEMS_PER_PAGE}
          />
          {renderPagination()}
        </>
      )}
    </div>
  );
}