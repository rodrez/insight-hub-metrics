import { Card } from "@/components/ui/card";
import { DEPARTMENTS } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import DepartmentCard from "./DepartmentCard";

export default function DepartmentStats() {
  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      await db.init();
      return db.getAllProjects();
    }
  });

  const departmentStats = DEPARTMENTS.map(dept => {
    const deptProjects = projects.filter(p => p.departmentId === dept.id);
    const totalSpent = deptProjects.reduce((sum, p) => sum + (p.spent || 0), 0);
    const totalBudget = deptProjects.reduce((sum, p) => sum + p.budget, 0);
    
    return {
      ...dept,
      projectCount: deptProjects.length,
      spent: totalSpent,
      budget: totalBudget
    };
  });

  const spendingData = departmentStats.map(dept => ({
    name: dept.name,
    value: dept.spent,
    color: dept.color
  }));

  return (
    <div className="space-y-8 mt-8">
      <h2 className="text-2xl font-bold">Department Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="col-span-2 p-4">
          <h3 className="font-semibold mb-4">Budget Utilization by Department</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentStats}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="spent" name="Spent" fill="#8884d8" />
              <Bar dataKey="budget" name="Budget" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold mb-4">Spending Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={spendingData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {spendingData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {departmentStats.map((department) => (
          <DepartmentCard key={department.id} department={department} />
        ))}
      </div>
    </div>
  );
}