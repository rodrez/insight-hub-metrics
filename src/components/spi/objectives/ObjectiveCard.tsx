import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Pen, Trash2, Target, ArrowRight } from "lucide-react";
import { Objective } from "@/lib/types/objective";
import { useState, useEffect } from "react";

interface ObjectiveCardProps {
  objective: Objective;
  onEdit: (objective: Objective) => void;
  onDelete: (id: string) => void;
}

export function ObjectiveCard({ objective, onEdit, onDelete }: ObjectiveCardProps) {
  const [statusColors, setStatusColors] = useState({
    active: '#10B981'
  });

  useEffect(() => {
    const saved = localStorage.getItem('projectStatusColors');
    if (saved) {
      const colors = JSON.parse(saved);
      setStatusColors({
        active: colors.find((c: any) => c.id === 'active')?.color || '#10B981'
      });
    }
  }, []);

  const progress = objective.desiredOutcome.includes("100%") ? 100 : 
    parseInt(objective.desiredOutcome.match(/\d+/)?.[0] || "0");

  return (
    <Card className="hover:shadow-md transition-all duration-200 group animate-fade-in">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex items-start gap-3">
              <Target className="h-5 w-5 text-primary mt-1" />
              <div>
                <h4 className="font-medium text-lg">{objective.title}</h4>
                <p className="text-sm text-muted-foreground">{objective.description}</p>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Initiative: {objective.initiative}</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Progress</span>
                  <span>{progress}%</span>
                </div>
                <Progress 
                  value={progress} 
                  className="h-2 bg-muted [&>[role=progressbar]]"
                  style={{ 
                    ["--progress-background" as any]: statusColors.active 
                  }}
                />
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
      </CardContent>
    </Card>
  );
}