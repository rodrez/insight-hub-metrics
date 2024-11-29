import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";
import { ObjectiveCard } from "./ObjectiveCard";

export function ObjectivesList() {
  const { data: objectives, refetch } = useQuery({
    queryKey: ['objectives'],
    queryFn: () => db.getAllObjectives()
  });

  const { data: spis } = useQuery({
    queryKey: ['spis'],
    queryFn: () => db.getAllSPIs()
  });

  const handleSPIsChange = async (objectiveId: string, spiIds: string[]) => {
    await db.updateObjective(objectiveId, { spiIds });
    refetch();
  };

  const handleUpdate = async (objective: any) => {
    await db.updateObjective(objective.id, objective);
    refetch();
  };

  const handleDelete = async (objectiveId: string) => {
    await db.deleteObjective(objectiveId);
    refetch();
  };

  if (!objectives || !spis) return null;

  return (
    <div className="space-y-4">
      {objectives.map((objective) => (
        <ObjectiveCard
          key={objective.id}
          objective={objective}
          spis={spis}
          onSPIsChange={handleSPIsChange}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}