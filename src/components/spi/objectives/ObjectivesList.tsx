import { useQuery } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { db } from "@/lib/db";
import { ObjectiveCard } from "./ObjectiveCard";
import { InitiativesList } from "./InitiativesList";
import { useState } from "react";
import { Objective } from "@/lib/types/objective";
import { Separator } from "@/components/ui/separator";

export function ObjectivesList() {
  const { data: objectives = [], refetch } = useQuery({
    queryKey: ['objectives'],
    queryFn: () => db.getAllObjectives(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const handleEdit = async (objective: Objective) => {
    toast({
      title: "Edit functionality coming soon",
      description: "The ability to edit objectives will be added in a future update.",
    });
  };

  const handleDelete = async (id: string) => {
    try {
      await db.deleteObjective(id);
      await refetch();
      toast({
        title: "Success",
        description: "Objective deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete objective",
        variant: "destructive",
      });
    }
  };

  // Add sample data if none exists
  const addSampleData = async () => {
    if (objectives.length === 0) {
      const sampleObjectives = [
        {
          id: '1',
          title: 'Improve Customer Experience',
          description: 'Focus on enhancing customer satisfaction through improved service delivery',
          initiative: 'Customer First Initiative',
          desiredOutcome: 'Increase customer satisfaction score by 20%',
          spiIds: []
        },
        {
          id: '2',
          title: 'Digital Transformation',
          description: 'Modernize legacy systems and implement new digital solutions',
          initiative: 'Digital Evolution Program',
          desiredOutcome: 'Modernize 80% of legacy systems',
          spiIds: []
        },
        {
          id: '3',
          title: 'Operational Excellence',
          description: 'Streamline operations and improve efficiency across departments',
          initiative: 'Operational Optimization',
          desiredOutcome: 'Reduce operational costs by 15%',
          spiIds: []
        }
      ];

      for (const objective of sampleObjectives) {
        await db.addObjective(objective);
      }
      refetch();
      toast({
        title: "Success",
        description: "Sample objectives added successfully",
      });
    }
  };

  // Call addSampleData when component mounts if no data exists
  if (objectives.length === 0) {
    addSampleData();
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-2">
        {objectives.map((objective) => (
          <ObjectiveCard
            key={objective.id}
            objective={objective}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
      <Separator className="my-6" />
      <InitiativesList objectives={objectives} />
    </div>
  );
}