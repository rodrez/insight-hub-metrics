import { useState } from "react";
import { Milestone as MilestoneIcon, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Milestone } from "@/lib/types";
import { db } from "@/lib/db";
import { MilestoneCard } from "./milestones/MilestoneCard";
import { AddMilestoneDialog } from "./milestones/AddMilestoneDialog";

interface MilestonesSectionProps {
  projectId: string;
  milestones: Milestone[];
  onUpdate: (milestones: Milestone[]) => void;
  isEditing: boolean;
}

export function MilestonesSection({ projectId, milestones, onUpdate, isEditing }: MilestonesSectionProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);

  const handleEdit = async (milestone: Milestone) => {
    try {
      const updatedMilestones = milestones.map((m) =>
        m.id === milestone.id ? milestone : m
      );

      await db.updateProject(projectId, { milestones: updatedMilestones });
      onUpdate(updatedMilestones);

      toast({
        title: "Success",
        description: "Milestone updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update milestone",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (milestoneId: string) => {
    try {
      const updatedMilestones = milestones.filter((m) => m.id !== milestoneId);
      await db.updateProject(projectId, { milestones: updatedMilestones });
      onUpdate(updatedMilestones);

      toast({
        title: "Success",
        description: "Milestone deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete milestone",
        variant: "destructive",
      });
    }
  };

  const handleAddMilestone = async (newMilestone: { 
    title: string; 
    description: string; 
    dueDate: string 
  }) => {
    try {
      const milestone: Milestone = {
        id: `${projectId}-m${milestones.length + 1}`,
        title: newMilestone.title,
        description: newMilestone.description,
        dueDate: newMilestone.dueDate,
        status: 'pending',
        progress: 0
      };

      const updatedMilestones = [...milestones, milestone];
      await db.updateProject(projectId, { milestones: updatedMilestones });
      onUpdate(updatedMilestones);
      setShowAddDialog(false);

      toast({
        title: "Success",
        description: "New milestone added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add new milestone",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <MilestoneIcon className="h-5 w-5" />
          Milestones
        </CardTitle>
        {isEditing && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAddDialog(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Milestone
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {milestones.map((milestone) => (
            <MilestoneCard
              key={milestone.id}
              milestone={milestone}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isEditing={isEditing}
            />
          ))}
        </div>

        <AddMilestoneDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onAdd={handleAddMilestone}
        />
      </CardContent>
    </Card>
  );
}