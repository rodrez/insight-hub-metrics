import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";
import { SPICard } from "./card/SPICard";
import { Skeleton } from "@/components/ui/skeleton";

export function SPIList() {
  const { data: spis, isLoading } = useQuery({
    queryKey: ['spis'],
    queryFn: () => db.getAllSPIs()
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="p-4 border rounded-lg">
            <Skeleton className="h-6 w-3/4 mb-4" />
            <Skeleton className="h-4 w-1/2 mb-2" />
            <div className="flex gap-2 mt-4">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {spis?.map((spi) => (
        <SPICard key={spi.id} spi={spi} />
      ))}
    </div>
  );
}