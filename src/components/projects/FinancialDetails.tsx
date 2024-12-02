import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";
import { Project } from "@/lib/types";
import { toast } from "@/components/ui/use-toast";
import { FinancialMetric } from "./financial/FinancialMetric";
import { RemainingBudget } from "./financial/RemainingBudget";

interface FinancialDetailsProps {
  project: Project;
  isEditing: boolean;
  onUpdate: (updates: Partial<Project>) => void;
}

export function FinancialDetails({ project, isEditing, onUpdate }: FinancialDetailsProps) {
  const handleBusinessImpactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (isNaN(value)) {
      toast({
        title: "Invalid input",
        description: "Please enter a valid number",
        variant: "destructive",
      });
      return;
    }
    onUpdate({ businessImpact: value * 1000000 }); // Convert M to actual value
  };

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (isNaN(value)) {
      toast({
        title: "Invalid input",
        description: "Please enter a valid number",
        variant: "destructive",
      });
      return;
    }
    onUpdate({ budget: value });
  };

  const handleSpentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (isNaN(value)) {
      toast({
        title: "Invalid input",
        description: "Please enter a valid number",
        variant: "destructive",
      });
      return;
    }
    if (value > project.budget) {
      toast({
        title: "Warning",
        description: "Spent amount exceeds budget",
        variant: "destructive",
      });
    }
    onUpdate({ spent: value });
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
        <FinancialMetric
          label="Business Impact"
          tooltip="Estimated business impact in millions"
          value={((project.businessImpact ?? 0) / 1000000).toFixed(1)}
          isEditing={isEditing}
          onChange={handleBusinessImpactChange}
          suffix="M"
          step="1"
        />
        <FinancialMetric
          label="Total Budget"
          tooltip="Total allocated budget for the project"
          value={project.budget}
          isEditing={isEditing}
          onChange={handleBudgetChange}
          step="1000"
        />
        <FinancialMetric
          label="Spent"
          tooltip="Amount spent to date"
          value={project.spent || 0}
          isEditing={isEditing}
          onChange={handleSpentChange}
          step="1000"
        />
        <RemainingBudget
          budget={project.budget}
          spent={project.spent || 0}
        />
      </CardContent>
    </Card>
  );
}