import { Info } from "lucide-react";
import { Workstream } from "@/lib/types/collaboration";
import { WorkstreamCard } from "../shared/WorkstreamCard";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type PartnerWorkstreamsProps = {
  workstreams?: Workstream[];
};

export function PartnerWorkstreams({ workstreams }: PartnerWorkstreamsProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <h4 className="font-medium">Partnership Activities</h4>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Current activities and workstreams with this partner</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      {workstreams && workstreams.length > 0 ? (
        <div className="space-y-4">
          {workstreams.map((workstream) => (
            <WorkstreamCard
              key={workstream.id}
              workstream={workstream}
              formatDate={formatDate}
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No active partnership activities</p>
      )}
    </div>
  );
}