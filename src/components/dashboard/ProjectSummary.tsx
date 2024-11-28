import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Activity, Timer, DollarSign } from 'lucide-react';
import { useQuery } from "@tanstack/react-query";
import { db } from '@/lib/db';

const SUMMARY_CARDS = [
  { title: 'Total Projects', icon: BarChart, getValue: (data: any[]) => data.length },
  { title: 'Active Projects', icon: Activity, getValue: (data: any[]) => data.filter(p => p.status === 'active').length },
  { title: 'Total Business Impact', icon: DollarSign, getValue: (data: any[]) => 
    (data.reduce((sum, p) => sum + (p.businessImpact || 10000000), 0) / 1000000).toFixed(1) + 'M' },
  { title: 'Total Budget', icon: Timer, getValue: (data: any[]) => 
    (data.reduce((sum, p) => sum + p.budget, 0) / 1000000).toFixed(1) + 'M' }
];

export default function ProjectSummary() {
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      await db.init();
      return db.getAllProjects();
    }
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 animate-pulse">
        {SUMMARY_CARDS.map((card, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-24 bg-gray-200 rounded" />
              <div className="h-4 w-4 bg-gray-200 rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-gray-200 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      {SUMMARY_CARDS.map((card, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {card.getValue(projects)}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}