import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pen, Plus, Trash2 } from "lucide-react";
import { Objective } from "@/lib/types/objective";
import { useState } from "react";
import { InitiativeEditDialog } from "./InitiativeEditDialog";
import { toast } from "@/components/ui/use-toast";

interface InitiativesListProps {
  objectives: Objective[];
}

export function InitiativesList({ objectives }: InitiativesListProps) {
  const [selectedInitiative, setSelectedInitiative] = useState<any | null>(null);
  
  const initiatives = [
    {
      id: '1',
      initiative: 'Customer Experience Enhancement',
      desiredOutcome: 'Achieve 95% customer satisfaction rating',
      objectiveIds: ['1'],
    },
    {
      id: '2',
      initiative: 'Legacy System Modernization',
      desiredOutcome: 'Complete migration of core systems to cloud infrastructure',
      objectiveIds: ['2'],
    },
    {
      id: '3',
      initiative: 'Process Automation',
      desiredOutcome: 'Automate 60% of manual processes',
      objectiveIds: ['2', '3'],
    },
  ];

  const handleEdit = (initiative: any) => {
    setSelectedInitiative(initiative);
  };

  const handleDelete = (id: string) => {
    toast({
      title: "Initiative deleted",
      description: "The initiative has been successfully removed.",
    });
  };

  const handleSave = (initiative: any) => {
    toast({
      title: "Initiative updated",
      description: "The initiative has been successfully updated.",
    });
    setSelectedInitiative(null);
  };

  const handleAddNew = () => {
    const newInitiative = {
      id: crypto.randomUUID(),
      initiative: '',
      desiredOutcome: '',
      objectiveIds: [],
    };
    setSelectedInitiative(newInitiative);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Strategic Initiatives</h3>
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
                <div className="flex gap-1">
                  {initiative.objectiveIds.map((objId) => {
                    const objective = objectives.find(o => o.id === objId);
                    return objective ? (
                      <Badge
                        key={objId}
                        variant="secondary"
                        className="text-xs"
                      >
                        {objective.title}
                      </Badge>
                    ) : null;
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <InitiativeEditDialog
        initiative={selectedInitiative}
        objectives={objectives}
        onClose={() => setSelectedInitiative(null)}
        onSave={handleSave}
      />
    </div>
  );
}