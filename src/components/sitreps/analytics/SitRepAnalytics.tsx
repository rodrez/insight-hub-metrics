import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";
import { format, isWithinInterval, startOfMonth, subMonths } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area, BarChart, Bar, Tooltip } from "recharts";
import { Badge } from "@/components/ui/badge";

interface SitRepAnalyticsProps {
  startDate?: Date;
  endDate?: Date;
}

export function SitRepAnalytics({ startDate, endDate }: SitRepAnalyticsProps) {
  const { data: sitreps } = useQuery({
    queryKey: ['sitreps'],
    queryFn: () => db.getAllSitReps()
  });

  const { data: collaborators } = useQuery({
    queryKey: ['collaborators'],
    queryFn: () => db.getAllCollaborators()
  });

  if (!sitreps) return null;

  // Filter sitreps by date range if provided
  const filteredSitreps = sitreps.filter(sitrep => {
    if (!startDate || !endDate) return true;
    const sitrepDate = new Date(sitrep.date);
    return isWithinInterval(sitrepDate, { start: startDate, end: endDate });
  });

  // Calculate statistics
  const totalSitreps = filteredSitreps.length;
  const pendingReview = filteredSitreps.filter(s => s.status === 'pending-review').length;
  const ready = filteredSitreps.filter(s => s.status === 'ready').length;
  const submitted = filteredSitreps.filter(s => s.status === 'submitted').length;

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

  // Generate Fortune 30 partner data
  const partnerData = collaborators
    ?.filter(c => c.type === 'fortune30')
    .map(partner => {
      const partnerSitreps = filteredSitreps.filter(s => s.fortune30PartnerId === partner.id);
      return {
        name: partner.name,
        count: partnerSitreps.length,
        submitted: partnerSitreps.filter(s => s.status === 'submitted').length,
        pending: partnerSitreps.filter(s => s.status === 'pending-review').length,
      };
    })
    .filter(p => p.count > 0);

  const chartConfig = {
    line1: { theme: { light: "#2563eb", dark: "#3b82f6" } },
    line2: { theme: { light: "#16a34a", dark: "#22c55e" } },
    area: { theme: { light: "#3b82f6", dark: "#60a5fa" } }
  };

  return (
    <div className="space-y-8">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total SitReps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSitreps}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">{pendingReview}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ready</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{ready}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Submitted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{submitted}</div>
          </CardContent>
        </Card>
      </div>

      {/* Status Over Time Chart */}
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

      {/* Fortune 30 Partners Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Fortune 30 Partner Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-[2/1] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={partnerData}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis
                  dataKey="name"
                  stroke="currentColor"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  angle={-45}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis
                  stroke="currentColor"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip />
                <Bar dataKey="submitted" name="Submitted" fill="#16a34a" stackId="a" />
                <Bar dataKey="pending" name="Pending" fill="#eab308" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}