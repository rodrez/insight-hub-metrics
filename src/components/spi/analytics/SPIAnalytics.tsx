import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";
import { format, subMonths, isAfter, isBefore, startOfMonth } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area } from "recharts";

export function SPIAnalytics() {
  const { data: spis } = useQuery({
    queryKey: ['spis'],
    queryFn: () => db.getAllSPIs()
  });

  if (!spis) return null;

  // Generate last 6 months of data
  const months = Array.from({ length: 6 }, (_, i) => {
    const date = subMonths(new Date(), i);
    const monthStart = startOfMonth(date);
    
    const monthSpis = spis.filter(spi => {
      const createdDate = new Date(spi.createdAt);
      return isBefore(createdDate, monthStart) || 
             (isAfter(createdDate, monthStart) && isBefore(createdDate, startOfMonth(subMonths(date, -1))));
    });

    const completedSpis = monthSpis.filter(spi => spi.status === 'completed');

    return {
      month: format(date, 'MMM yyyy'),
      total: monthSpis.length,
      completed: completedSpis.length,
      completionRate: monthSpis.length ? (completedSpis.length / monthSpis.length) * 100 : 0
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
          <CardTitle>SPI Progress Over Time</CardTitle>
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
                    dataKey="total" 
                    name="Total SPIs" 
                    stroke="var(--color-line1)"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="completed" 
                    name="Completed SPIs" 
                    stroke="var(--color-line2)"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Completion Rate (%)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-[2/1] w-full">
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
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
                  <Area
                    type="monotone"
                    dataKey="completionRate"
                    name="Completion Rate"
                    stroke="var(--color-area)"
                    fill="var(--color-area)"
                    fillOpacity={0.2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}