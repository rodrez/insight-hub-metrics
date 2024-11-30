import { Workstream, Agreement } from "@/lib/types/collaboration";
import { useAgreementStatus } from "@/hooks/useAgreementStatus";
import { WorkstreamList } from "../workstream/WorkstreamList";
import { useWorkstreamActions } from "../workstream/useWorkstreamActions";

type CollaboratorWorkstreamsProps = {
  workstreams?: Workstream[];
  collaboratorId: string;
  agreements?: {
    nda?: Agreement;
    jtda?: Agreement;
  };
};

export function CollaboratorWorkstreams({ 
  workstreams, 
  collaboratorId, 
  agreements 
}: CollaboratorWorkstreamsProps) {
  const { formatDate } = useAgreementStatus(agreements);
  const { form, handleDelete, handleEdit, onSubmit } = useWorkstreamActions(collaboratorId);

  if (!workstreams?.length) {
    return (
      <div>
        <h4 className="font-medium mb-4">Workstreams</h4>
        <p className="text-sm text-muted-foreground">No workstreams defined</p>
      </div>
    );
  }

  return (
    <div>
      <h4 className="font-medium mb-4">Workstreams</h4>
      <WorkstreamList
        workstreams={workstreams}
        agreements={agreements}
        form={form}
        formatDate={formatDate}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSubmit={onSubmit}
      />
    </div>
  );
}