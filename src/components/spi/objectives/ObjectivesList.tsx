import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ObjectiveCard } from "./ObjectiveCard";
import { InitiativesList } from "./InitiativesList";
import { ObjectivesSummary } from "./ObjectivesSummary";
import { ObjectiveEditDialog } from "./ObjectiveEditDialog";
import { ObjectivesProgress } from "./progress/ObjectivesProgress";
import { ObjectivesFilters } from "./filters/ObjectivesFilters";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { db } from "@/lib/db";
import { Objective } from "@/lib/types/objective";

export function ObjectivesList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedObjective, setSelectedObjective] = useState<Objective | null>(null);

  const { data: objectives = [], refetch } = useQuery({
    queryKey: ['objectives'],
    queryFn: () => db.getAllObjectives(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const handleEdit = async (objective: Objective) => {
    setSelectedObjective(objective);
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

  const handleAddNew = () => {
    const newObjective: Objective = {
      id: crypto.randomUUID(),
      title: "",
      description: "",
      initiative: "",
      desiredOutcome: "0%",
      spiIds: []
    };
    setSelectedObjective(newObjective);
  };

  const handleSave = async (objective: Objective) => {
    try {
      if (objective.id) {
        await db.updateObjective(objective.id, objective);
      } else {
        await db.addObjective(objective);
      }
      await refetch();
      setSelectedObjective(null);
      toast({
        title: "Success",
        description: "Objective saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save objective",
        variant: "destructive",
      });
    }
  };

  const filteredObjectives = objectives
    .filter(obj => 
      obj.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      obj.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(obj => {
      if (filterStatus === "all") return true;
      if (filterStatus === "completed") return obj.desiredOutcome.includes("100%");
      return !obj.desiredOutcome.includes("100%");
    });

  const completionPercentage = objectives.length > 0
    ? (objectives.filter(obj => obj.desiredOutcome.includes("100%")).length / objectives.length) * 100
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Objectives</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleAddNew}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Objective
        </Button>
      </div>

      <ObjectivesSummary />
      <ObjectivesProgress completionPercentage={completionPercentage} />
      <ObjectivesFilters
        searchQuery={searchQuery}
        filterStatus={filterStatus}
        onSearchChange={setSearchQuery}
        onFilterChange={setFilterStatus}
      />

      <div className="grid grid-cols-1 gap-4 animate-fade-in">
        {filteredObjectives.map((objective) => (
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

      {selectedObjective && (
        <ObjectiveEditDialog
          objective={selectedObjective}
          onClose={() => setSelectedObjective(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}