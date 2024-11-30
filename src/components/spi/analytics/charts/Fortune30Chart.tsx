import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { SPI } from "@/lib/types/spi";
import { Project } from "@/lib/types";
import { Collaborator } from "@/lib/types/collaboration";

type Props = {
  spis: SPI[];
  projects: Project[];
  collaborators: Collaborator[];
};

export function Fortune30Chart({ spis, projects, collaborators }: Props) {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fortune 30 Partner SPIs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="aspect-[4/3] w-full">
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
  );
}