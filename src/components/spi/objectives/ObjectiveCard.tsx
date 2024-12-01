import { useState } from "react";
import { ChevronDown, ChevronUp, Pen, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Objective } from "@/lib/types/objective";
import { SPI } from "@/lib/types/spi";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ObjectiveCardProps {
  objective: Objective;
  spis: SPI[];
  onSPIsChange: (objectiveId: string, spiIds: string[]) => void;
  onUpdate: (objective: Objective) => void;
  onDelete: (objectiveId: string) => void;
}

export function ObjectiveCard({ objective, spis, onSPIsChange, onUpdate, onDelete }: ObjectiveCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedObjective, setEditedObjective] = useState(objective);

  const { data: initiatives } = useQuery({
    queryKey: ['initiatives'],
    queryFn: () => db.getAllInitiatives()
  });

  const handleSPIToggle = (spiId: string) => {
    const newSPIIds = objective.spiIds.includes(spiId)
      ? objective.spiIds.filter(id => id !== spiId)
      : [...objective.spiIds, spiId];
    onSPIsChange(objective.id, newSPIIds);
  };

  const handleInitiativeChange = (initiativeId: string) => {
    setEditedObjective({ ...editedObjective, initiativeId });
  };

  const handleSave = () => {
    onUpdate(editedObjective);
    setIsEditing(false);
    toast({
      title: "Success",
      description: "Objective updated successfully",
    });
  };

  const handleDelete = () => {
    onDelete(objective.id);
    toast({
      title: "Success",
      description: "Objective deleted successfully",
    });
  };

  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-4">
                  <Input
                    value={editedObjective.title}
                    onChange={(e) => setEditedObjective({ ...editedObjective, title: e.target.value })}
                    placeholder="Objective Title"
                  />
                  <Textarea
                    value={editedObjective.desiredOutcome}
                    onChange={(e) => setEditedObjective({ ...editedObjective, desiredOutcome: e.target.value })}
                    placeholder="Desired Outcome"
                  />
                  <Select
                    value={editedObjective.initiativeId}
                    onValueChange={handleInitiativeChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Initiative" />
                    </SelectTrigger>
                    <SelectContent>
                      {initiatives?.map((initiative) => (
                        <SelectItem key={initiative.id} value={initiative.id}>
                          {initiative.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex gap-2">
                    <Button onClick={handleSave}>Save</Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <>
                  <CardTitle>{objective.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-2">{objective.desiredOutcome}</p>
                  {objective.initiativeId && initiatives?.find(i => i.id === objective.initiativeId) && (
                    <p className="text-sm text-blue-500 mt-1">
                      Initiative: {initiatives.find(i => i.id === objective.initiativeId)?.title}
                    </p>
                  )}
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              {!isEditing && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsEditing(true)}
                    className="text-gray-400 hover:text-green-500 transition-colors"
                  >
                    <Pen className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleDelete}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
              <CollapsibleTrigger>
                {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </CollapsibleTrigger>
            </div>
          </div>
        </CardHeader>
        <CollapsibleContent>
          <CardContent>
            <div className="space-y-2">
              {spis.map((spi) => (
                <div key={spi.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`spi-${spi.id}`}
                    checked={objective.spiIds.includes(spi.id)}
                    onCheckedChange={() => handleSPIToggle(spi.id)}
                  />
                  <label htmlFor={`spi-${spi.id}`} className="text-sm">
                    {spi.name}
                  </label>
                </div>
              ))}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}