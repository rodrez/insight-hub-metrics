import { Button } from "@/components/ui/button";
import { Pen, Trash2 } from "lucide-react";
import { Collaborator } from "@/lib/types/collaboration";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type CollaboratorHeaderProps = {
  collaborator: Collaborator;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

export function CollaboratorHeader({ collaborator, onEdit, onDelete }: CollaboratorHeaderProps) {
  return (
    <div className="flex justify-between items-start">
      <div>
        <h1 className="text-4xl font-bold mb-2" style={{ color: collaborator.color || '#333' }}>
          {collaborator.name}
        </h1>
        <p className="text-lg text-muted-foreground">{collaborator.role}</p>
      </div>
      <div className="flex gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(collaborator.id)}
                className="text-gray-400 hover:text-green-500 transition-colors"
              >
                <Pen className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit collaborator</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(collaborator.id)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete collaborator</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}