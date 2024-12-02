import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line } from "recharts";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export function OrgChartAnalytics() {
  const { data: collaborators = [] } = useQuery({
    queryKey: ['collaborators'],
    queryFn: () => db.getAllCollaborators()
  });

  // Group collaborators by position
  const seniorManagers = collaborators.filter(c => c.role?.toLowerCase().includes('senior manager'));
  const techLeads = collaborators.filter(c => c.role?.toLowerCase().includes('tech lead'));
  const directors = collaborators.filter(c => c.role?.toLowerCase().includes('director'));

  // Position Workload Distribution
  const positionWorkloadData = [
    {
      position: 'Senior Managers',
      projects: seniorManagers.reduce((sum, c) => sum + (c.assignedProjects?.length || 0), 0),
      spis: seniorManagers.reduce((sum, c) => sum + (c.assignedSpis?.length || 0), 0),
      sitreps: seniorManagers.reduce((sum, c) => sum + (c.assignedSitreps?.length || 0), 0),
      fortune30: seniorManagers.reduce((sum, c) => sum + (c.fortune30Partners?.length || 0), 0),
      sme: seniorManagers.reduce((sum, c) => sum + (c.smePartners?.length || 0), 0),
    },
    {
      position: 'Tech Leads',
      projects: techLeads.reduce((sum, c) => sum + (c.assignedProjects?.length || 0), 0),
      spis: techLeads.reduce((sum, c) => sum + (c.assignedSpis?.length || 0), 0),
      sitreps: techLeads.reduce((sum, c) => sum + (c.assignedSitreps?.length || 0), 0),
      fortune30: techLeads.reduce((sum, c) => sum + (c.fortune30Partners?.length || 0), 0),
      sme: techLeads.reduce((sum, c) => sum + (c.smePartners?.length || 0), 0),
    },
    {
      position: 'Directors',
      projects: directors.reduce((sum, c) => sum + (c.assignedProjects?.length || 0), 0),
      spis: directors.reduce((sum, c) => sum + (c.assignedSpis?.length || 0), 0),
      sitreps: directors.reduce((sum, c) => sum + (c.assignedSitreps?.length || 0), 0),
      fortune30: directors.reduce((sum, c) => sum + (c.fortune30Partners?.length || 0), 0),
      sme: directors.reduce((sum, c) => sum + (c.smePartners?.length || 0), 0),
    }
  ];

  // Individual Position Load Distribution
  const getPositionData = (position: string[]) => {
    return position.map(c => ({
      name: c.name,
      totalAssignments: 
        (c.assignedProjects?.length || 0) +
        (c.assignedSpis?.length || 0) +
        (c.assignedSitreps?.length || 0) +
        (c.fortune30Partners?.length || 0) +
        (c.smePartners?.length || 0)
    }));
  };

  // Partner Type Distribution
  const partnerDistributionData = [
    { 
      name: 'Fortune 30',
      value: collaborators.reduce((sum, c) => sum + (c.fortune30Partners?.length || 0), 0)
    },
    { 
      name: 'SME',
      value: collaborators.reduce((sum, c) => sum + (c.smePartners?.length || 0), 0)
    }
  ];

  // Assignment Type Distribution
  const assignmentTypeData = [
    { 
      name: 'Projects',
      value: collaborators.reduce((sum, c) => sum + (c.assignedProjects?.length || 0), 0)
    },
    { 
      name: 'SPIs',
      value: collaborators.reduce((sum, c) => sum + (c.assignedSpis?.length || 0), 0)
    },
    { 
      name: 'SitReps',
      value: collaborators.reduce((sum, c) => sum + (c.assignedSitreps?.length || 0), 0)
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Position Workload Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={positionWorkloadData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="position" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="projects" name="Projects" fill="#0088FE" />
                <Bar dataKey="spis" name="SPIs" fill="#00C49F" />
                <Bar dataKey="sitreps" name="SitReps" fill="#FFBB28" />
                <Bar dataKey="fortune30" name="Fortune 30" fill="#FF8042" />
                <Bar dataKey="sme" name="SME" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Senior Manager Load Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getPositionData(seniorManagers)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalAssignments" name="Total Assignments" fill="#0088FE" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Partner Type Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={partnerDistributionData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {partnerDistributionData.map((entry, index) => (
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
          <CardTitle>Assignment Type Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={assignmentTypeData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {assignmentTypeData.map((entry, index) => (
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
    </div>
  );
}