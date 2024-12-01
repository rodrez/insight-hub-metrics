import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { SPI } from "@/lib/types/spi";
import { Objective } from "@/lib/types/objective";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";

type Props = {
  spis: SPI[];
};

export function ObjectivesAchievementChart({ spis }: Props) {
  const { data: objectives = [] } = useQuery({
    queryKey: ['objectives'],
    queryFn: () => db.getAllObjectives()
  });

  const objectiveData = objectives.reduce((acc: any[], objective: Objective, index: number) => {
    const relatedSPIs = spis.filter(spi => objective.spiIds.includes(spi.id));
    const completedSPIs = relatedSPIs.filter(spi => spi.status === 'completed');
    
    acc.push({
      objective: `Objective ${index + 1}`,
      total: relatedSPIs.length,
      completed: completedSPIs.length,
      completion: relatedSPIs.length > 0 
        ? Math.round((completedSPIs.length / relatedSPIs.length) * 100) 
        : 0
    });
    
    return acc;
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Objectives Achievement</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="aspect-[4/3] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={objectiveData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis 
                dataKey="objective" 
                tick={{ fontSize: 12 }}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" name="Total SPIs" fill="#3b82f6" />
              <Bar dataKey="completed" name="Completed SPIs" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}