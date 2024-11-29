import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";
import { format, subMonths, isAfter, isBefore, startOfMonth } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area, Tooltip, Legend, BarChart, Bar } from "recharts";

export function SPIAnalytics() {
  const { data: spis } = useQuery({
    queryKey: ['spis'],
    queryFn: () => db.getAllSPIs()
  });

  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: () => db.getAllProjects()
  });

  const { data: collaborators } = useQuery({
    queryKey: ['collaborators'],
    queryFn: () => db.getAllCollaborators()
  });

  if (!spis || !projects || !collaborators) return null;

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

  // Generate department data
  const departmentData = spis.reduce((acc: any[], spi) => {
    const dept = acc.find(d => d.department === spi.departmentId);
    if (dept) {
      dept.count++;
      if (spi.status === 'completed') dept.completed++;
    } else {
      acc.push({
        department: spi.departmentId,
        count: 1,
        completed: spi.status === 'completed' ? 1 : 0
      });
    }
    return acc;
  }, []);

  // Generate Fortune 30 partner data
  const partnerData = projects?.reduce((acc: any[], project) => {
    const fortune30Partner = collaborators.find(c => 
      c.type === 'fortune30' && project.collaborators?.some(pc => pc.id === c.id)
    );
    
    if (fortune30Partner) {
      const projectSpis = spis.filter(spi => spi.projectId === project.id);
      const partner = acc.find((p: any) => p.partner === fortune30Partner.name);
      
      if (partner) {
        partner.spiCount += projectSpis.length;
        partner.completed += projectSpis.filter(spi => spi.status === 'completed').length;
      } else {
        acc.push({
          partner: fortune30Partner.name,
          spiCount: projectSpis.length,
          completed: projectSpis.filter(spi => spi.status === 'completed').length
        });
      }
    }
    return acc;
  }, []);

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
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="total" 
                    name="Total SPIs" 
                    stroke="var(--color-line1)"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="completed" 
                    name="Completed SPIs" 
                    stroke="var(--color-line2)"
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
          <CardTitle>Department Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-[2/1] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="department" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name="Total SPIs" fill="#3b82f6" />
                <Bar dataKey="completed" name="Completed" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Fortune 30 Partner SPIs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-[2/1] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={partnerData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="partner" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="spiCount" name="Total SPIs" fill="#3b82f6" />
                <Bar dataKey="completed" name="Completed" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}