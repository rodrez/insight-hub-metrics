import { Button } from "@/components/ui/button";
import { Pen, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { WorkstreamForm } from "./WorkstreamForm";
import { UseFormReturn } from "react-hook-form";
import { CollaborationFormSchema } from "../form/types";
import { Workstream } from "@/lib/types/collaboration";

type WorkstreamActionsProps = {
  workstream: Workstream;
  form: UseFormReturn<CollaborationFormSchema>;
  onEdit: (workstream: Workstream) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onSubmit: (data: CollaborationFormSchema) => Promise<void>;
};

export function WorkstreamActions({ 
  workstream, 
  form, 
  onEdit, 
  onDelete,
  onSubmit 
}: WorkstreamActionsProps) {
  return (
    <div className="flex gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(workstream)}
            className="text-gray-400 hover:text-green-500 transition-colors"
          >
            <Pen className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Workstream</DialogTitle>
          </DialogHeader>
          <WorkstreamForm form={form} onSubmit={onSubmit} />
        </DialogContent>
      </Dialog>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(workstream.id)}
        className="text-gray-400 hover:text-red-500 transition-colors"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}