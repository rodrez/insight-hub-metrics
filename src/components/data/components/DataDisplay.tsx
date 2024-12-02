import { DataStats } from "../stats/DataStats";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { DataCounts } from "../types/dataTypes";

interface DataDisplayProps {
  dataCounts: DataCounts;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
}

export function DataDisplay({
  dataCounts,
  currentPage,
  totalPages,
  itemsPerPage,
  isLoading,
  onPageChange,
}: DataDisplayProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-8 w-[200px]" />
      </div>
    );
  }

  return (
    <>
      <DataStats
        dataCounts={dataCounts}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
      />
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <Button
                variant="outline"
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => onPageChange(page)}
                  isActive={currentPage === page}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <Button
                variant="outline"
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </>
  );
}