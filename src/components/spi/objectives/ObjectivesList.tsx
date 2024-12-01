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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

type GroupedObjectives = {
  [key: string]: Objective[];
};

export function ObjectivesList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("all");
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);

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

  // Filter and group objectives
  const filteredObjectives = objectives.filter(objective => {
    const matchesSearch = objective.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         objective.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterBy === "all") return matchesSearch;
    if (filterBy === "completed") return matchesSearch && objective.spiIds.length > 0;
    if (filterBy === "in-progress") return matchesSearch && objective.spiIds.length === 0;
    return matchesSearch;
  });

  const groupedObjectives = filteredObjectives.reduce((groups: GroupedObjectives, objective) => {
    const category = objective.initiative || "Uncategorized";
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(objective);
    return groups;
  }, {});

  const toggleGroup = (category: string) => {
    setExpandedGroups(prev => 
      prev.includes(category)
        ? prev.filter(g => g !== category)
        : [...prev, category]
    );
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
    <div className="space-y-6 animate-fade-in">
      <ObjectivesSummary />
      
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Input
          placeholder="Search objectives..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="sm:max-w-xs"
        />
        <Select value={filterBy} onValueChange={setFilterBy}>
          <SelectTrigger className="sm:max-w-xs">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Objectives</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {Object.entries(groupedObjectives).map(([category, objectives]) => (
          <Collapsible
            key={category}
            open={expandedGroups.includes(category)}
            className="border rounded-lg overflow-hidden"
          >
            <CollapsibleTrigger
              className="flex items-center justify-between w-full p-4 bg-muted/50 hover:bg-muted transition-colors"
              onClick={() => toggleGroup(category)}
            >
              <h3 className="text-lg font-semibold flex items-center gap-2">
                {expandedGroups.includes(category) ? (
                  <ChevronDown className="h-5 w-5" />
                ) : (
                  <ChevronRight className="h-5 w-5" />
                )}
                {category}
                <span className="text-sm text-muted-foreground ml-2">
                  ({objectives.length} objectives)
                </span>
              </h3>
            </CollapsibleTrigger>
            <CollapsibleContent className="p-4 space-y-4 animate-accordion-down">
              {objectives.map((objective) => (
                <ObjectiveCard
                  key={objective.id}
                  objective={objective}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>

      <Separator className="my-6" />
      <InitiativesList objectives={objectives} />
    </div>
  );
}