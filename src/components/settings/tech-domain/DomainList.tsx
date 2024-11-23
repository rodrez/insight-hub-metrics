import { Button } from "@/components/ui/button";
import { Info, Trash, Edit2 } from "lucide-react";
import { TechDomain } from "@/lib/types/techDomain";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type DomainListProps = {
  domains: TechDomain[];
  onEdit: (domain: TechDomain) => void;
  onDelete: (id: string) => void;
};

export function DomainList({ domains, onEdit, onDelete }: DomainListProps) {
  return (
    <div className="grid gap-4">
      <h3 className="text-lg font-medium">Existing Tech Domains</h3>
      {domains.map(domain => (
        <div key={domain.id} className="flex items-center gap-4 p-4 border rounded-lg">
          <div
            className="w-6 h-6 rounded"
            style={{ backgroundColor: domain.color }}
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{domain.name}</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{domain.description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(domain)}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(domain.id)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}