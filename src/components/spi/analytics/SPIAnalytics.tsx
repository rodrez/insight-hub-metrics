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
      <Card className="p-6">
        <CardHeader className="px-0 pt-0">
          <CardTitle>SPI Progress Over Time</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[400px] w-full">
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={months}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis 
                    dataKey="month" 
                    stroke="currentColor" 
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="currentColor"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
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

      <Card className="p-6">
        <CardHeader className="px-0 pt-0">
          <CardTitle>Monthly Completion Rate (%)</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[400px] w-full">
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={months}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis 
                    dataKey="month" 
                    stroke="currentColor"
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="currentColor"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
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