import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Edit, Info, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useState } from "react";
import { InitiativeEditDialog } from "./InitiativeEditDialog";
import { toast } from "@/components/ui/use-toast";
import { db } from "@/lib/db";

interface Initiative {
  id: string;
  initiative: string;
  desiredOutcome: string;
  objectiveIds: string[];
}

interface Objective {
  id: string;
  title: string;
  desiredOutcome: string;
  description: string;
  initiative: string;
  spiIds: string[];
}

export function ObjectivesList() {
  const { data: objectives = [], refetch: refetchObjectives } = useQuery({
    queryKey: ['objectives'],
    queryFn: () => db.getAllObjectives(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const { data: initiatives = [], refetch: refetchInitiatives } = useQuery({
    queryKey: ['initiatives'],
    queryFn: () => db.getAllInitiatives(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const [editingInitiative, setEditingInitiative] = useState<Initiative | null>(null);

  const handleUpdateInitiative = async (updatedInitiative: Initiative) => {
    try {
      await db.updateInitiative(updatedInitiative.id, updatedInitiative);
      await refetchInitiatives();
      setEditingInitiative(null);
      toast({
        title: "Success",
        description: "Initiative updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update initiative",
        variant: "destructive",
      });
    }
  };

  const handleDeleteInitiative = async (initiativeId: string) => {
    try {
      await db.deleteInitiative(initiativeId);
      await refetchInitiatives();
      toast({
        title: "Success",
        description: "Initiative deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete initiative",
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
      refetchObjectives();
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
    <div className="space-y-8">
      {/* Objectives Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Strategic Objectives</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {objectives.map((objective) => (
            <Card key={objective.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold">{objective.title}</h3>
                  <HoverCard>
                    <HoverCardTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      <p>{objective.desiredOutcome}</p>
                    </HoverCardContent>
                  </HoverCard>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Initiatives Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Initiatives</h2>
        <div className="grid grid-cols-1 gap-4">
          {initiatives.map((initiative) => (
            <Card key={initiative.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{initiative.initiative}</h4>
                    <div className="flex gap-2">
                      {initiative.objectiveIds.map((objectiveId) => {
                        const objective = objectives.find(o => o.id === objectiveId);
                        return objective ? (
                          <Badge key={objectiveId} variant="secondary">
                            {objective.title}
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{initiative.desiredOutcome}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingInitiative(initiative)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteInitiative(initiative.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <InitiativeEditDialog
        initiative={editingInitiative}
        objectives={objectives}
        onClose={() => setEditingInitiative(null)}
        onSave={handleUpdateInitiative}
      />
    </div>
  );
}