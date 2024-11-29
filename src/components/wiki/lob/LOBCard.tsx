import { Info } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { DEPARTMENTS } from "@/lib/constants";

interface LOBCardProps {
  lob: {
    name: string;
    department: string;
  };
  description: string;
}

export function LOBCard({ lob, description }: LOBCardProps) {
  const deptColor = DEPARTMENTS.find(d => d.id === lob.department)?.color;

  return (
    <HoverCard>
      <HoverCardTrigger>
        <div
          className="p-3 rounded-lg transition-all hover:scale-105 cursor-pointer flex items-center justify-between group"
          style={{
            backgroundColor: `${deptColor}15`,
            borderLeft: `3px solid ${deptColor}`
          }}
        >
          <span className="text-sm">{lob.name}</span>
          <Info className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="space-y-2">
          <h4 className="font-medium">{lob.name}</h4>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}