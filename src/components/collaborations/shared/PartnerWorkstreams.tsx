import { Workstream, Agreement } from "@/lib/types/collaboration";
import { WorkstreamCard } from "./WorkstreamCard";
import { format } from "date-fns";

type PartnerWorkstreamsProps = {
  workstreams?: Workstream[];
  agreements?: {
    nda?: Agreement;
    jtda?: Agreement;
  };
  color?: string;
};

export function PartnerWorkstreams({ workstreams = [], agreements, color }: PartnerWorkstreamsProps) {
  const formatDate = (date: string) => {
    return format(new Date(date), 'MMM d, yyyy');
  };

  return (
    <div className="space-y-4">
      <h4 className="font-medium">Workstreams</h4>
      <div className="space-y-4">
        {workstreams.map((workstream) => (
          <WorkstreamCard
            key={workstream.id}
            workstream={workstream}
            formatDate={formatDate}
            agreements={agreements}
            color={color}
          />
        ))}
        {workstreams.length === 0 && (
          <p className="text-sm text-muted-foreground">No workstreams</p>
        )}
      </div>
    </div>
  );
}