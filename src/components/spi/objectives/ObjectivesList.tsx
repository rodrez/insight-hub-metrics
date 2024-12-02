import { useState, useEffect } from "react";
import { SPIForm } from "@/components/spi/SPIForm";
import { SPIList } from "@/components/spi/SPIList";
import { ObjectivesList } from "@/components/spi/objectives/ObjectivesList";
import { SPIAnalytics } from "@/components/spi/analytics/SPIAnalytics";
import { SPIStats } from "@/components/spi/SPIStats";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { ObjectiveCard } from "./ObjectiveCard";
import { InitiativesList } from "./InitiativesList";
import { Separator } from "@/components/ui/separator";
import { ObjectivesSummary } from "./ObjectivesSummary";
import { ObjectiveEditDialog } from "./ObjectiveEditDialog";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { db } from "@/lib/db";
import { Objective } from "@/lib/types/objective";

export function ObjectivesList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedObjective, setSelectedObjective] = useState<Objective | null>(null);
  const [statusColors, setStatusColors] = useState({
    active: '#10B981'
  });

  useEffect(() => {
    const loadStatusColors = () => {
      const saved = localStorage.getItem('projectStatusColors');
      if (saved) {
        const colors = JSON.parse(saved);
        const activeColor = colors.find((c: any) => c.id === 'active')?.color;
        if (activeColor) {
          setStatusColors({
            active: activeColor
          });
        }
      }
    };

    loadStatusColors();
    window.addEventListener('storage', loadStatusColors);
    return () => window.removeEventListener('storage', loadStatusColors);
  }, []);

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
      await db.addObjective(objective);
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
      
      <div className="bg-card rounded-lg p-4 shadow-sm">
        <h3 className="text-lg font-semibold mb-2">Overall Progress</h3>
        <Progress 
          value={completionPercentage} 
          className="h-2 mb-2"
          style={{ 
            '--progress-background': statusColors.active,
            backgroundColor: 'rgba(255, 255, 255, 0.1)'
          } as React.CSSProperties}
        />
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