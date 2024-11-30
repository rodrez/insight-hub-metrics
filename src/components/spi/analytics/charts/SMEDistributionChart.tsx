import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { SPI } from "@/lib/types/spi";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";

const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'];

type Props = {
  spis: SPI[];
};

export function SMEDistributionChart({ spis }: Props) {
  const { data: smePartners = [] } = useQuery({
    queryKey: ['sme-partners'],
    queryFn: () => db.getAllSMEPartners()
  });

  const smeData = spis.reduce((acc: any[], spi) => {
    if (!spi.smePartnerId || spi.smePartnerId === 'none') {
      const noSme = acc.find(item => item.name === 'No SME Partner');
      if (noSme) {
        noSme.value++;
      } else {
        acc.push({ name: 'No SME Partner', value: 1 });
      }
      return acc;
    }

    const smePartner = smePartners.find(partner => partner.id === spi.smePartnerId);
    if (!smePartner) return acc;

    const existingSme = acc.find(item => item.name === smePartner.name);
    if (existingSme) {
      existingSme.value++;
    } else {
      acc.push({ name: smePartner.name, value: 1 });
    }
    return acc;
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>SME Partner Distribution</CardTitle>
      </CardHeader>
      <CardContent>
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
                {smeData.map((entry: any, index: number) => (
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
  );
}