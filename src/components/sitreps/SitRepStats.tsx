import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";

export function SitRepStats() {
  const { data: sitreps } = useQuery({
    queryKey: ['sitreps'],
    queryFn: () => db.getAllSitReps()
  });

  const stats = {
    total: sitreps?.length || 0,
    pending: sitreps?.filter(s => s.status === 'pending')?.length || 0,
    ready: sitreps?.filter(s => s.status === 'ready')?.length || 0,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="p-6 bg-[#1A1F2C] text-white">
        <h3 className="text-gray-400 mb-2">Total Sitreps</h3>
        <p className="text-4xl font-bold">{stats.total}</p>
      </Card>
      <Card className="p-6 bg-[#1A1F2C] text-white">
        <h3 className="text-gray-400 mb-2">Pending Review</h3>
        <p className="text-4xl font-bold">{stats.pending}</p>
      </Card>
      <Card className="p-6 bg-[#1A1F2C] text-white">
        <h3 className="text-gray-400 mb-2">Ready for Submission</h3>
        <p className="text-4xl font-bold">{stats.ready}</p>
      </Card>
    </div>
  );
}