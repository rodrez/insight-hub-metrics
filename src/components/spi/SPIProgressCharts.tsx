import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

export function SPIProgressCharts() {
  const { data: spis = [] } = useQuery({
    queryKey: ['spis'],
    queryFn: () => db.getAllSPIs()
  });

  // Calculate monthly progress data
  const monthlyData = spis.reduce((acc: any[], spi) => {
    const month = new Date(spi.createdAt || Date.now()).toLocaleString('default', { month: 'short' });
    const existingMonth = acc.find(d => d.month === month);
    
    if (existingMonth) {
      existingMonth.total += 1;
      if (spi.status === 'completed') {
        existingMonth.completed += 1;
      }
    } else {
      acc.push({
        month,
        total: 1,
        completed: spi.status === 'completed' ? 1 : 0,
        completionRate: 0
      });
    }
    return acc;
  }, []);

  // Calculate completion rates
  monthlyData.forEach(data => {
    data.completionRate = data.total > 0 
      ? Math.round((data.completed / data.total) * 100) 
      : 0;
  });

  return (
    <div className="space-y-6 mt-8">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Monthly SPI Progress</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="month" 
              className="text-muted-foreground"
            />
            <YAxis 
              className="text-muted-foreground"
            />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="total" 
              name="Total SPIs"
              stroke="#8884d8" 
              strokeWidth={2}
            />
            <Line 
              type="monotone" 
              dataKey="completed" 
              name="Completed SPIs"
              stroke="#82ca9d" 
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">SPI Completion Rate</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="month" 
              className="text-muted-foreground"
            />
            <YAxis 
              className="text-muted-foreground"
              unit="%" 
            />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="completionRate"
              name="Completion Rate"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}