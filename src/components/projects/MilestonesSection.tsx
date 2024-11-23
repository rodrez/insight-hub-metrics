import { useState } from "react";
import { format } from "date-fns";
import { Milestone as MilestoneIcon, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Milestone } from "@/lib/types";
import { db } from "@/lib/db";

interface MilestonesSectionProps {
  projectId: string;
  milestones: Milestone[];
  onUpdate: (milestones: Milestone[]) => void;
  isEditing: boolean;  // Added this prop
}

export function MilestonesSection({ projectId, milestones, onUpdate, isEditing }: MilestonesSectionProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Milestone>>({});

  const handleEdit = (milestone: Milestone) => {
    setEditingId(milestone.id);
    setEditData(milestone);
  };

  const handleSave = async (milestone: Milestone) => {
    try {
      const updatedMilestones = milestones.map((m) =>
        m.id === milestone.id ? { ...m, ...editData } : m
      );

      await db.init();
      await db.updateProject(projectId, { milestones: updatedMilestones });

      onUpdate(updatedMilestones);
      setEditingId(null);
      setEditData({});

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

      await db.init();
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MilestoneIcon className="h-5 w-5" />
          Milestones
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {milestones.map((milestone) => (
            <div key={milestone.id} className="border-b pb-4 last:border-0">
              <div className="flex items-center justify-between mb-2">
                {editingId === milestone.id ? (
                  <input
                    type="text"
                    value={editData.title || milestone.title}
                    onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                    className="border p-1 rounded"
                  />
                ) : (
                  <h3 className="font-semibold">{milestone.title}</h3>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(milestone.dueDate), 'MMM d, yyyy')}
                  </span>
                </div>
              </div>
              {editingId === milestone.id ? (
                <textarea
                  value={editData.description || milestone.description}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  className="border p-1 rounded w-full mb-2"
                />
              ) : (
                <p className="text-sm text-muted-foreground mb-2">
                  {milestone.description}
                </p>
              )}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <Badge variant={
                    milestone.status === 'completed' ? 'default' :
                    milestone.status === 'in-progress' ? 'secondary' : 'outline'
                  }>
                    {milestone.status}
                  </Badge>
                  <span>{milestone.progress}%</span>
                </div>
                <Progress value={milestone.progress} className="h-2" />
              </div>
              <div className="mt-2 flex justify-end gap-2">
                {editingId === milestone.id ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingId(null);
                        setEditData({});
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleSave(milestone)}
                    >
                      Save
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(milestone)}
                    >
                      Edit
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Milestone</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this milestone? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(milestone.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
