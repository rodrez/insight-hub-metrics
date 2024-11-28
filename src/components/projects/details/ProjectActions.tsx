import { Button } from "@/components/ui/button";
import { Edit, Save } from "lucide-react";
import { memo } from "react";

interface ProjectActionsProps {
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onUpdate: () => void;
}

export const ProjectActions = memo(({ isEditing, onEdit, onCancel, onUpdate }: ProjectActionsProps) => {
  return (
    <div className="flex gap-2">
      {!isEditing ? (
        <Button onClick={onEdit}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Project
        </Button>
      ) : (
        <>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onUpdate}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </>
      )}
    </div>
  );
});

ProjectActions.displayName = 'ProjectActions';