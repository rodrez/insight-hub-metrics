import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";
import { format, subMonths, isAfter, isBefore, startOfMonth } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, Tooltip, Legend } from "recharts";

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
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>SitRep Submission Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-[2/1] w-full">
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={months}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis 
                    dataKey="month" 
                    stroke="currentColor" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                  />
                  <YAxis 
                    stroke="currentColor"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    dx={-10}
                  />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="total" 
                    name="Total SitReps" 
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="completed" 
                    name="Submitted SitReps" 
                    stroke="#22c55e"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SitRep Status Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-[2/1] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" name="Number of SitReps" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SitRep Importance Level Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-[2/1] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={importanceLevelData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="level" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" name="Number of SitReps" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
