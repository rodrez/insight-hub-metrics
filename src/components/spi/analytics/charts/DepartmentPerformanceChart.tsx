import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { SPI } from "@/lib/types/spi";

type Props = {
  spis: SPI[];
};

export function DepartmentPerformanceChart({ spis }: Props) {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Department Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="aspect-[4/3] w-full">
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
  );
}