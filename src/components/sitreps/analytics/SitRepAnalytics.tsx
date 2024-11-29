import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";
import { format, isWithinInterval, startOfMonth, subMonths } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area } from "recharts";

interface SitRepAnalyticsProps {
  startDate?: Date;
  endDate?: Date;
}

export function SitRepAnalytics({ startDate, endDate }: SitRepAnalyticsProps) {
  const { data: sitreps } = useQuery({
    queryKey: ['sitreps'],
    queryFn: () => db.getAllSitReps()
  });

  if (!sitreps) return null;

  // Filter sitreps by date range if provided
  const filteredSitreps = sitreps.filter(sitrep => {
    if (!startDate || !endDate) return true;
    const sitrepDate = new Date(sitrep.date);
    return isWithinInterval(sitrepDate, { start: startDate, end: endDate });
  });

  // Generate monthly data
  const months = Array.from({ length: 6 }, (_, i) => {
    const date = subMonths(new Date(), i);
    const monthStart = startOfMonth(date);
    
    const monthSitreps = filteredSitreps.filter(sitrep => {
      const createdDate = new Date(sitrep.date);
      return isWithinInterval(createdDate, {
        start: monthStart,
        end: startOfMonth(subMonths(date, -1))
      });
    });

    return {
      month: format(date, 'MMM yyyy'),
      total: monthSitreps.length,
      pending: monthSitreps.filter(s => s.status === 'pending-review').length,
      ready: monthSitreps.filter(s => s.status === 'ready').length,
      submitted: monthSitreps.filter(s => s.status === 'submitted').length,
    };
  }).reverse();

  const chartConfig = {
    line1: { theme: { light: "#2563eb", dark: "#3b82f6" } },
    line2: { theme: { light: "#16a34a", dark: "#22c55e" } },
    area: { theme: { light: "#3b82f6", dark: "#60a5fa" } }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>SitRep Status Over Time</CardTitle>
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
                  <ChartTooltip />
                  <Line 
                    type="monotone" 
                    dataKey="pending" 
                    name="Pending Review" 
                    stroke="#eab308"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="ready" 
                    name="Ready" 
                    stroke="#2563eb"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="submitted" 
                    name="Submitted" 
                    stroke="#16a34a"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}