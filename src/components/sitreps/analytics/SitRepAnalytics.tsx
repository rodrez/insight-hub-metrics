import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";
import { format, subMonths, isAfter, isBefore, startOfMonth } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export function SitRepAnalytics({ startDate, endDate }: { startDate?: Date; endDate?: Date }) {
  const { data: sitreps } = useQuery({
    queryKey: ['sitreps'],
    queryFn: () => db.getAllSitReps()
  });

  const { data: fortune30Partners } = useQuery({
    queryKey: ['collaborators-fortune30'],
    queryFn: async () => {
      const allCollaborators = await db.getAllCollaborators();
      return allCollaborators.filter(c => c.type === 'fortune30');
    }
  });

  const { data: smePartners } = useQuery({
    queryKey: ['collaborators-sme'],
    queryFn: () => db.getAllSMEPartners()
  });

  if (!sitreps) return null;

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
      if (sitrep.departmentId) {
        acc[sitrep.departmentId] = (acc[sitrep.departmentId] || 0) + 1;
      }
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  // Calculate Fortune 30 participation
  const fortune30Data = Object.entries(
    filteredSitreps.reduce((acc: Record<string, number>, sitrep) => {
      if (sitrep.fortune30PartnerId) {
        const partner = fortune30Partners?.find(p => p.id === sitrep.fortune30PartnerId);
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
        const partner = smePartners?.find(p => p.id === sitrep.smePartnerId);
        if (partner) {
          acc[partner.name] = (acc[partner.name] || 0) + 1;
        }
      }
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  return (
    <div className="grid grid-cols-2 gap-4">
      <Card className="col-span-1">
        <CardHeader className="p-4">
          <CardTitle className="text-sm">Status Distribution</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="aspect-[4/3] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="status" fontSize={10} />
                <YAxis fontSize={10} />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-1">
        <CardHeader className="p-4">
          <CardTitle className="text-sm">Department Participation</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="aspect-[4/3] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={departmentData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
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

      <Card className="col-span-1">
        <CardHeader className="p-4">
          <CardTitle className="text-sm">Fortune 30 Participation</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="aspect-[4/3] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={fortune30Data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
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

      <Card className="col-span-1">
        <CardHeader className="p-4">
          <CardTitle className="text-sm">SME Participation</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="aspect-[4/3] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={smeData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
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