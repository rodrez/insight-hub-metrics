import { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Milestone } from "@/lib/types";
import { DeleteMilestoneDialog } from "./DeleteMilestoneDialog";

interface MilestoneCardProps {
  milestone: Milestone;
  onEdit: (milestone: Milestone) => void;
  onDelete: (milestoneId: string) => void;
  isEditing: boolean;
}

export function MilestoneCard({ milestone, onEdit, onDelete, isEditing }: MilestoneCardProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Milestone>>({});

  const handleEdit = () => {
    setEditingId(milestone.id);
    setEditData(milestone);
  };

  const handleSave = () => {
    onEdit({ ...milestone, ...editData });
    setEditingId(null);
    setEditData({});
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
  };

  return (
    <div className="border-b pb-4 last:border-0">
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

      {isEditing && (
        <div className="mt-2 flex justify-end gap-2">
          {editingId === milestone.id ? (
            <>
              <Button variant="outline" size="sm" onClick={handleCancel}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave}>
                Save
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" onClick={handleEdit}>
                Edit
              </Button>
              <DeleteMilestoneDialog onDelete={() => onDelete(milestone.id)} />
            </>
          )}
        </div>
      )}
    </div>
  );
}