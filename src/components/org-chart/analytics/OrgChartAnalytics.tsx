import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line } from "recharts";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export function OrgChartAnalytics() {
  const { data: collaborators = [] } = useQuery({
    queryKey: ['collaborators'],
    queryFn: () => db.getAllCollaborators()
  });

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: () => db.getAllProjects()
  });

  const { data: spis = [] } = useQuery({
    queryKey: ['spis'],
    queryFn: () => db.getAllSPIs()
  });

  const { data: sitreps = [] } = useQuery({
    queryKey: ['sitreps'],
    queryFn: () => db.getAllSitReps()
  });

  const internalCollaborators = collaborators.filter(c => c.type === 'internal');

  // Workload Distribution
  const workloadData = internalCollaborators.map(collab => ({
    name: collab.name,
    projects: collab.assignedProjects?.length || 0,
    spis: collab.assignedSpis?.length || 0,
    sitreps: collab.assignedSitreps?.length || 0
  }));

  // Project Status Distribution
  const projectStatusData = projects.reduce((acc: any[], project) => {
    const status = project.status;
    const existingStatus = acc.find(item => item.status === status);
    if (existingStatus) {
      existingStatus.count++;
    } else {
      acc.push({ status, count: 1 });
    }
    return acc;
  }, []);

  // Assignment Coverage
  const coverageData = [
    {
      name: 'Projects',
      assigned: projects.filter(p => internalCollaborators.some(c => c.assignedProjects?.includes(p.id))).length,
      total: projects.length
    },
    {
      name: 'SPIs',
      assigned: spis.filter(s => internalCollaborators.some(c => c.assignedSpis?.includes(s.id))).length,
      total: spis.length
    },
    {
      name: 'SitReps',
      assigned: sitreps.filter(s => internalCollaborators.some(c => c.assignedSitreps?.includes(s.id))).length,
      total: sitreps.length
    }
  ];

  // Team Member Load Balance
  const loadBalanceData = internalCollaborators.map(collab => ({
    name: collab.name,
    totalAssignments: (collab.assignedProjects?.length || 0) + 
                     (collab.assignedSpis?.length || 0) + 
                     (collab.assignedSitreps?.length || 0)
  })).sort((a, b) => b.totalAssignments - a.totalAssignments);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Workload Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={workloadData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="projects" fill="#0088FE" name="Projects" />
                <Bar dataKey="spis" fill="#00C49F" name="SPIs" />
                <Bar dataKey="sitreps" fill="#FFBB28" name="SitReps" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Project Status Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={projectStatusData}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {projectStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Assignment Coverage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={coverageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="assigned" fill="#0088FE" name="Assigned" />
                <Bar dataKey="total" fill="#00C49F" name="Total" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Team Member Load Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={loadBalanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="totalAssignments" 
                  stroke="#8884d8" 
                  name="Total Assignments"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}