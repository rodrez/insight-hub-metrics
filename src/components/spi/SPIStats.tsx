import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SPIStats() {
  const [statusColors, setStatusColors] = useState({
    completed: '#3B82F6',
    delayed: '#F59E0B',
    'on-track': '#10B981'
  });

  useEffect(() => {
    const saved = localStorage.getItem('projectStatusColors');
    if (saved) {
      const colors = JSON.parse(saved);
      setStatusColors({
        completed: colors.find((c: any) => c.id === 'completed')?.color || '#3B82F6',
        delayed: colors.find((c: any) => c.id === 'delayed')?.color || '#F59E0B',
        'on-track': colors.find((c: any) => c.id === 'active')?.color || '#10B981'
      });
    }
  }, []);

  const { data: spis = [] } = useQuery({
    queryKey: ['spis'],
    queryFn: () => db.getAllSPIs()
  });

  const stats = {
    total: spis.length,
    completed: spis.filter(spi => spi.status === 'completed').length,
    onTrack: spis.filter(spi => spi.status === 'on-track').length,
    delayed: spis.filter(spi => spi.status === 'delayed').length
  };

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total SPIs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold" style={{ color: statusColors.completed }}>{stats.completed}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">On Track</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold" style={{ color: statusColors["on-track"] }}>{stats.onTrack}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Delayed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold" style={{ color: statusColors.delayed }}>{stats.delayed}</div>
        </CardContent>
      </Card>
    </div>
  );
}