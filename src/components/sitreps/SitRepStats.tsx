import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";
import { cn } from "@/lib/utils";

interface SitRepStatsProps {
  onStatusFilter: (status: string | null) => void;
  activeFilter: string | null;
}

export function SitRepStats({ onStatusFilter, activeFilter }: SitRepStatsProps) {
  const { data: sitreps } = useQuery({
    queryKey: ['sitreps'],
    queryFn: () => db.getAllSitReps()
  });

  const stats = {
    total: sitreps?.length || 0,
    pending: sitreps?.filter(s => s.status === 'pending-review')?.length || 0,
    ready: sitreps?.filter(s => s.status === 'ready')?.length || 0,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card 
        className={cn(
          "p-6 bg-[#1A1F2C] text-white cursor-pointer transition-colors hover:bg-[#252B3B]",
          activeFilter === null && "ring-2 ring-blue-500"
        )}
        onClick={() => onStatusFilter(null)}
      >
        <h3 className="text-gray-400 mb-2">Total Sitreps</h3>
        <p className="text-4xl font-bold">{stats.total}</p>
      </Card>
      <Card 
        className={cn(
          "p-6 bg-[#1A1F2C] text-white cursor-pointer transition-colors hover:bg-[#252B3B]",
          activeFilter === 'pending-review' && "ring-2 ring-blue-500"
        )}
        onClick={() => onStatusFilter('pending-review')}
      >
        <h3 className="text-gray-400 mb-2">Pending Review</h3>
        <p className="text-4xl font-bold">{stats.pending}</p>
      </Card>
      <Card 
        className={cn(
          "p-6 bg-[#1A1F2C] text-white cursor-pointer transition-colors hover:bg-[#252B3B]",
          activeFilter === 'ready' && "ring-2 ring-blue-500"
        )}
        onClick={() => onStatusFilter('ready')}
      >
        <h3 className="text-gray-400 mb-2">Ready for Submission</h3>
        <p className="text-4xl font-bold">{stats.ready}</p>
      </Card>
    </div>
  );
}