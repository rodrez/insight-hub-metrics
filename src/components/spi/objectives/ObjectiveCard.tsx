import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pen, Trash2 } from "lucide-react";
import { Objective } from "@/lib/types/objective";

interface ObjectiveCardProps {
  objective: Objective;
  onEdit: (objective: Objective) => void;
  onDelete: (id: string) => void;
}

export function ObjectiveCard({ objective, onEdit, onDelete }: ObjectiveCardProps) {
  return (
    <Card className="hover:bg-accent/50 transition-colors">
      <CardContent>
        <div className="text-lg font-semibold mb-4">Strategic Objectives</div>
        <div className="p-4">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h4 className="font-medium">{objective.title}</h4>
              <p className="text-sm text-muted-foreground">{objective.desiredOutcome}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(objective)}
                className="text-gray-400 hover:text-green-500 transition-colors"
              >
                <Pen className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(objective.id)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}