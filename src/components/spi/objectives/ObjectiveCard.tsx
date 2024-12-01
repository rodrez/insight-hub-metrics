import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Info, Pen, Trash2 } from "lucide-react";
import { Objective } from "@/lib/types/objective";

interface ObjectiveCardProps {
  objective: Objective;
  onEdit: (objective: Objective) => void;
  onDelete: (id: string) => void;
}

export function ObjectiveCard({ objective, onEdit, onDelete }: ObjectiveCardProps) {
  // Get status colors from localStorage
  const getStatusColors = () => {
    const saved = localStorage.getItem('projectStatusColors');
    if (saved) {
      const colors = JSON.parse(saved);
      return colors.find((c: any) => c.id === 'active')?.color || '#10B981';
    }
    return '#10B981';
  };

  return (
    <Card className="group hover:shadow-md transition-all duration-300 animate-fade-in">
      <CardContent className="p-4">
        <div className="flex flex-col space-y-2">
          <div 
            className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg"
            style={{ backgroundColor: getStatusColors() }}
          />
          
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-muted-foreground" />
                <h4 className="font-medium text-lg">{objective.title}</h4>
              </div>
              <p className="text-sm text-muted-foreground pl-6">
                {objective.description}
              </p>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(objective)}
                className="h-8 w-8 text-muted-foreground hover:text-green-500 hover:bg-green-50 transition-colors"
              >
                <Pen className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(objective.id)}
                className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="pl-6 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">Initiative:</span>
              {objective.initiative}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-green-500" />
              <span className="font-medium">Desired Outcome:</span>
              {objective.desiredOutcome}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}