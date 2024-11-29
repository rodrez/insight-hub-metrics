import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";
import { format, subMonths, isAfter, isBefore, startOfMonth } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, Tooltip, Legend, AreaChart, Area } from "recharts";

export function SitRepAnalytics({ startDate, endDate }: { startDate?: Date; endDate?: Date }) {
  const { data: sitreps } = useQuery({
    queryKey: ['sitreps'],
    queryFn: () => db.getAllSitReps()
  });

  if (!sitreps) return null;

  const filteredSitreps = sitreps.filter(sitrep => {
    if (!startDate || !endDate) return true;
    const sitrepDate = new Date(sitrep.date);
    return sitrepDate >= startDate && sitrepDate <= endDate;
  });

  // Generate last 6 months of data
  const months = Array.from({ length: 6 }, (_, i) => {
    const date = subMonths(new Date(), i);
    const monthStart = startOfMonth(date);
    
    const monthSpis = filteredSitreps.filter(spi => {
      const createdDate = new Date(spi.date);
      return isBefore(createdDate, monthStart) || 
             (isAfter(createdDate, monthStart) && isBefore(createdDate, startOfMonth(subMonths(date, -1))));
    });

    const completedSpis = monthSpis.filter(spi => spi.status === 'submitted');

    return {
      month: format(date, 'MMM yyyy'),
      total: monthSpis.length,
      completed: completedSpis.length,
      completionRate: monthSpis.length ? (completedSpis.length / monthSpis.length) * 100 : 0
    };
  }).reverse();

  // Calculate status distribution
  const statusData = [
    { status: 'Pending Review', count: filteredSitreps.filter(s => s.status === 'pending-review').length },
    { status: 'Ready', count: filteredSitreps.filter(s => s.status === 'ready').length },
    { status: 'Submitted', count: filteredSitreps.filter(s => s.status === 'submitted').length },
  ];

  // Calculate importance level metrics
  const importanceLevelData = [
    { level: 'CEO', count: filteredSitreps.filter(s => s.level === 'CEO').length },
    { level: 'SVP', count: filteredSitreps.filter(s => s.level === 'SVP').length },
    { level: 'CTO', count: filteredSitreps.filter(s => s.level === 'CTO').length },
  ];

  const chartConfig = {
    total: {
      label: "Total SitReps",
      color: "#3b82f6"
    },
    completed: {
      label: "Submitted SitReps",
      color: "#22c55e"
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <Card className="col-span-1">
        <CardHeader className="p-4">
          <CardTitle className="text-sm">SitRep Submission Trends</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="aspect-[4/3] w-full">
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={months}
                  margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis 
                    dataKey="month" 
                    stroke="currentColor" 
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="currentColor"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="total" name="Total SitReps" stroke="#3b82f6" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="completed" name="Submitted SitReps" stroke="#22c55e" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-1">
        <CardHeader className="p-4">
          <CardTitle className="text-sm">Status Distribution</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="aspect-[4/3] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="status" fontSize={10} />
                <YAxis fontSize={10} />
                <Tooltip />
                <Bar dataKey="count" name="Number of SitReps" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-1">
        <CardHeader className="p-4">
          <CardTitle className="text-sm">Importance Level Distribution</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="aspect-[4/3] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={importanceLevelData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="level" fontSize={10} />
                <YAxis fontSize={10} />
                <Tooltip />
                <Bar dataKey="count" name="Number of SitReps" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-1">
        <CardHeader className="p-4">
          <CardTitle className="text-sm">Completion Rate Trend</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="aspect-[4/3] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={months} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="month" fontSize={10} />
                <YAxis fontSize={10} />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="completionRate" 
                  name="Completion Rate %" 
                  stroke="#8b5cf6" 
                  fill="#8b5cf6" 
                  fillOpacity={0.2} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}