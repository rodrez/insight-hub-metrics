import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pen, Trash2 } from "lucide-react";
import { Objective } from "@/lib/types/objective";
import { Badge } from "@/components/ui/badge";

interface ObjectiveCardProps {
  objective: Objective;
  onEdit: (objective: Objective) => void;
  onDelete: (id: string) => void;
}

export function ObjectiveCard({ objective, onEdit, onDelete }: ObjectiveCardProps) {
  return (
    <Card className="hover:bg-accent/50 transition-colors animate-fade-in">
      <CardContent className="p-3">
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-sm truncate">{objective.title}</h4>
              <Badge variant="secondary" className="shrink-0">
                {objective.initiative}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">{objective.desiredOutcome}</p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(objective)}
              className="h-8 w-8 text-gray-400 hover:text-green-500 hover:bg-green-500/10 transition-colors"
            >
              <Pen className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(objective.id)}
              className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}