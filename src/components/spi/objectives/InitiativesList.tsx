import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pen, Plus, Trash2 } from "lucide-react";
import { Objective } from "@/lib/types/objective";
import { useState } from "react";
import { InitiativeEditDialog } from "./InitiativeEditDialog";
import { toast } from "@/components/ui/use-toast";
import { db } from "@/lib/db";
import { useQuery } from "@tanstack/react-query";

interface Initiative {
  id: string;
  initiative: string;
  desiredOutcome: string;
  objectiveIds: string[];
  description: string;
  priority: number;
  targetDate: string;
  progress: number;
  department: string;
}

export function InitiativesList({ objectives }: { objectives: Objective[] }) {
  const [selectedInitiative, setSelectedInitiative] = useState<Initiative | null>(null);
  
  const { data: initiatives = [], refetch } = useQuery({
    queryKey: ['initiatives'],
    queryFn: async () => {
      console.log('Fetching initiatives...');
      const result = await db.getAllInitiatives();
      console.log('Fetched initiatives:', result);
      return result;
    },
  });

  const handleEdit = (initiative: Initiative) => {
    setSelectedInitiative(initiative);
  };

  const handleDelete = async (id: string) => {
    try {
      await db.deleteInitiative(id);
      await refetch();
      toast({
        title: "Success",
        description: "Initiative deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting initiative:', error);
      toast({
        title: "Error",
        description: "Failed to delete initiative",
        variant: "destructive",
      });
    }
  };

  const handleAddNew = () => {
    const newInitiative: Initiative = {
      id: crypto.randomUUID(),
      initiative: '',
      desiredOutcome: '',
      objectiveIds: [],
      description: '',
      priority: 1,
      targetDate: new Date().toISOString(),
      progress: 0,
      department: 'default'
    };
    setSelectedInitiative(newInitiative);
  };

  const handleSave = async (initiative: Initiative) => {
    try {
      if (initiative.id) {
        if (selectedInitiative?.id) {
          await db.updateInitiative(initiative.id, initiative);
        } else {
          await db.addInitiative(initiative);
        }
      }
      await refetch();
      setSelectedInitiative(null);
      toast({
        title: "Success",
        description: "Initiative saved successfully",
      });
    } catch (error) {
      console.error('Error saving initiative:', error);
      toast({
        title: "Error",
        description: "Failed to save initiative",
        variant: "destructive",
      });
    }
  };

  console.log('Current initiatives:', initiatives);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Strategic Initiatives ({initiatives.length})</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleAddNew}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Initiative
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-2">
        {initiatives.map((initiative) => (
          <Card key={initiative.id} className="hover:bg-accent/50 transition-colors">
            <CardContent className="p-4">
              <div className="flex flex-col space-y-2">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h4 className="font-medium">{initiative.initiative}</h4>
                    <p className="text-sm text-muted-foreground">
                      {initiative.desiredOutcome}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Priority: {initiative.priority} | Progress: {initiative.progress}%
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(initiative)}
                      className="h-8 w-8 text-gray-400 hover:text-green-500 transition-colors"
                    >
                      <Pen className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(initiative.id)}
                      className="h-8 w-8 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedInitiative && (
        <InitiativeEditDialog
          initiative={selectedInitiative}
          objectives={objectives}
          onClose={() => setSelectedInitiative(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}