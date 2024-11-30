import { Card, CardContent } from "@/components/ui/card";
import { Workstream, Agreement } from "@/lib/types/collaboration";
import { WorkstreamCard } from "../shared/WorkstreamCard";
import { WorkstreamActions } from "./WorkstreamActions";
import { UseFormReturn } from "react-hook-form";
import { CollaborationFormSchema } from "../CollaborationFormFields";

type WorkstreamListProps = {
  workstreams: Workstream[];
  agreements?: {
    nda?: Agreement;
    jtda?: Agreement;
  };
  form: UseFormReturn<CollaborationFormSchema>;
  formatDate: (date: string) => string;
  onEdit: (workstream: Workstream) => Promise<void>;
  onDelete: (workstreamId: string) => Promise<void>;
  onSubmit: (data: CollaborationFormSchema) => Promise<void>;
};

export function WorkstreamList({ 
  workstreams, 
  agreements, 
  form, 
  formatDate,
  onEdit,
  onDelete,
  onSubmit 
}: WorkstreamListProps) {
  return (
    <div className="space-y-4">
      {workstreams.map((workstream) => (
        <Card key={workstream.id}>
          <CardContent className="pt-6">
            <WorkstreamCard
              workstream={workstream}
              formatDate={formatDate}
              agreements={agreements}
            />
            <WorkstreamActions
              workstream={workstream}
              form={form}
              onEdit={async (ws) => await onEdit(ws)}
              onDelete={async (id) => await onDelete(id)}
              onSubmit={onSubmit}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}