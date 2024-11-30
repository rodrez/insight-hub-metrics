import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";
import { SPIProgressChart } from "./charts/SPIProgressChart";
import { ObjectivesAchievementChart } from "./charts/ObjectivesAchievementChart";
import { Fortune30Chart } from "./charts/Fortune30Chart";
import { SMEDistributionChart } from "./charts/SMEDistributionChart";

export function SPIAnalytics() {
  const { data: spis = [] } = useQuery({
    queryKey: ['spis'],
    queryFn: () => db.getAllSPIs()
  });

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: () => db.getAllProjects()
  });

  const { data: collaborators = [] } = useQuery({
    queryKey: ['collaborators'],
    queryFn: () => db.getAllCollaborators()
  });

  if (!spis || !projects || !collaborators) return null;

  return (
    <div className="grid grid-cols-2 gap-4">
      <SPIProgressChart spis={spis} />
      <ObjectivesAchievementChart spis={spis} />
      <Fortune30Chart spis={spis} projects={projects} collaborators={collaborators} />
      <SMEDistributionChart spis={spis} />
    </div>
  );
}