import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export function SitRepAnalytics({ startDate, endDate }: { startDate?: Date; endDate?: Date }) {
  const { data: sitreps = [] } = useQuery({
    queryKey: ['sitreps'],
    queryFn: () => db.getAllSitReps()
  });

  const { data: fortune30Partners = [] } = useQuery({
    queryKey: ['collaborators-fortune30'],
    queryFn: async () => {
      const allCollaborators = await db.getAllCollaborators();
      return allCollaborators.filter(c => c.type === 'fortune30');
    }
  });

  const { data: smePartners = [] } = useQuery({
    queryKey: ['collaborators-sme'],
    queryFn: () => db.getAllSMEPartners()
  });

  const filteredSitreps = sitreps.filter(sitrep => {
    if (!startDate || !endDate) return true;
    const sitrepDate = new Date(sitrep.date);
    return sitrepDate >= startDate && sitrepDate <= endDate;
  });

  // Calculate status distribution
  const statusData = [
    { status: 'Pending Review', count: filteredSitreps.filter(s => s.status === 'pending-review').length },
    { status: 'Ready', count: filteredSitreps.filter(s => s.status === 'ready').length },
    { status: 'Submitted', count: filteredSitreps.filter(s => s.status === 'submitted').length },
  ];

  // Calculate department participation
  const departmentData = Object.entries(
    filteredSitreps.reduce((acc: Record<string, number>, sitrep) => {
      const dept = sitrep.departmentId || 'Unknown';
      acc[dept] = (acc[dept] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  // Calculate Fortune 30 participation
  const fortune30Data = Object.entries(
    filteredSitreps.reduce((acc: Record<string, number>, sitrep) => {
      if (sitrep.fortune30PartnerId) {
        const partner = fortune30Partners.find(p => p.id === sitrep.fortune30PartnerId);
        if (partner) {
          acc[partner.name] = (acc[partner.name] || 0) + 1;
        }
      }
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  // Calculate SME participation
  const smeData = Object.entries(
    filteredSitreps.reduce((acc: Record<string, number>, sitrep) => {
      if (sitrep.smePartnerId) {
        const partner = smePartners.find(p => p.id === sitrep.smePartnerId);
        if (partner) {
          acc[partner.name] = (acc[partner.name] || 0) + 1;
        }
      }
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Status Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer>
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#3b82f6" name="Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Department Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={departmentData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {departmentData.map((entry, index) => (
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
          <CardTitle className="text-lg">Fortune 30 Partner Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={fortune30Data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {fortune30Data.map((entry, index) => (
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
          <CardTitle className="text-lg">SME Partner Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={smeData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {smeData.map((entry, index) => (
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