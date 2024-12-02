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
  const handleBusinessImpactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    onUpdate({ businessImpact: isNaN(value) ? 0 : value * 1000000 }); // Convert M to actual value
  };

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    onUpdate({ budget: isNaN(value) ? 0 : value });
  };

  const handleSpentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    onUpdate({ spent: isNaN(value) ? 0 : value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Financial Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <TooltipProvider>
          <div className="space-y-2">
            <Tooltip>
              <TooltipTrigger className="flex items-center gap-2">
                Business Impact
                <Info className="h-4 w-4" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Estimated business impact in millions</p>
              </TooltipContent>
            </Tooltip>
            {isEditing ? (
              <div className="relative">
                <input
                  type="number"
                  value={((project.businessImpact ?? 0) / 1000000).toFixed(1)}
                  onChange={handleBusinessImpactChange}
                  step="0.1"
                  min="0"
                  className="text-2xl font-bold w-full bg-transparent border-b border-gray-200 focus:outline-none focus:border-primary pl-6 pr-2"
                />
                <span className="absolute left-0 top-1/2 -translate-y-1/2 text-2xl font-bold">$</span>
                <span className="absolute right-0 top-1/2 -translate-y-1/2 text-2xl font-bold">M</span>
              </div>
            ) : (
              <p className="text-2xl font-bold">${((project.businessImpact ?? 0) / 1000000).toFixed(1)}M</p>
            )}
          </div>
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
              <div className="relative">
                <input
                  type="number"
                  value={project.budget}
                  onChange={handleBudgetChange}
                  min="0"
                  className="text-2xl font-bold w-full bg-transparent border-b border-gray-200 focus:outline-none focus:border-primary pl-6"
                />
                <span className="absolute left-0 top-1/2 -translate-y-1/2 text-2xl font-bold">$</span>
              </div>
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
              <div className="relative">
                <input
                  type="number"
                  value={project.spent}
                  onChange={handleSpentChange}
                  min="0"
                  className="text-2xl font-bold w-full bg-transparent border-b border-gray-200 focus:outline-none focus:border-primary pl-6"
                />
                <span className="absolute left-0 top-1/2 -translate-y-1/2 text-2xl font-bold">$</span>
              </div>
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
            <p className="text-2xl font-bold">${(project.budget - (project.spent || 0)).toLocaleString()}</p>
            <Progress value={((project.budget - (project.spent || 0)) / project.budget) * 100} className="h-2" />
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}