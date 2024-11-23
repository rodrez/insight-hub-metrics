import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DollarSign, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Project } from "@/lib/types";

interface FinancialDetailsProps {
  project: Project;
  isEditing: boolean;
  onUpdate: (updates: Partial<Project>) => void;
}

export function FinancialDetails({ project, isEditing, onUpdate }: FinancialDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Financial Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <TooltipProvider>
          <div className="space-y-2">
            <Tooltip>
              <TooltipTrigger className="flex items-center gap-2">
                Total Budget
                <Info className="h-4 w-4" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Total allocated budget for the project</p>
              </TooltipContent>
            </Tooltip>
            {isEditing ? (
              <input
                type="number"
                value={project.budget}
                onChange={(e) => onUpdate({ budget: Number(e.target.value) })}
                className="text-2xl font-bold w-full bg-transparent border-b border-gray-200 focus:outline-none focus:border-primary"
              />
            ) : (
              <p className="text-2xl font-bold">${project.budget.toLocaleString()}</p>
            )}
          </div>
          <div className="space-y-2">
            <Tooltip>
              <TooltipTrigger className="flex items-center gap-2">
                Spent
                <Info className="h-4 w-4" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Amount spent to date</p>
              </TooltipContent>
            </Tooltip>
            {isEditing ? (
              <input
                type="number"
                value={project.spent}
                onChange={(e) => onUpdate({ spent: Number(e.target.value) })}
                className="text-2xl font-bold w-full bg-transparent border-b border-gray-200 focus:outline-none focus:border-primary"
              />
            ) : (
              <p className="text-2xl font-bold">${project.spent?.toLocaleString() || 0}</p>
            )}
          </div>
          <div className="space-y-2">
            <Tooltip>
              <TooltipTrigger className="flex items-center gap-2">
                Remaining
                <Info className="h-4 w-4" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Remaining budget</p>
              </TooltipContent>
            </Tooltip>
            <p className="text-2xl font-bold">${project.budget - (project.spent || 0)}</p>
            <Progress value={((project.budget - (project.spent || 0)) / project.budget) * 100} className="h-2" />
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}