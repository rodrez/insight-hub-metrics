import { useQuery } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { db } from "@/lib/db";
import { ObjectiveCard } from "./ObjectiveCard";
import { InitiativesList } from "./InitiativesList";
import { Objective } from "@/lib/types/objective";
import { Separator } from "@/components/ui/separator";
import { ObjectivesSummary } from "./ObjectivesSummary";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";

export function ObjectivesList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

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
      <ObjectivesSummary />
      
      <div className="bg-card rounded-lg p-4 shadow-sm">
        <h3 className="text-lg font-semibold mb-2">Overall Progress</h3>
        <Progress value={completionPercentage} className="h-2 mb-2" />
        <p className="text-sm text-muted-foreground">{completionPercentage.toFixed(0)}% of objectives completed</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search objectives..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <Select
          value={filterStatus}
          onValueChange={setFilterStatus}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Objectives</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
          </SelectContent>
        </Select>
      </div>

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
    </div>
  );
}