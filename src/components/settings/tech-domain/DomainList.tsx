import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TechDomain } from "@/lib/types/techDomain";
import { Info, Pencil, Trash2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DomainListProps {
  domains: TechDomain[];
  onEdit: (domain: TechDomain) => void;
  onDelete: (id: string) => void;
}

export function DomainList({ domains, onEdit, onDelete }: DomainListProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <h3 className="text-lg font-medium">Tech Domains</h3>
        
        {/* Color Legend */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-card rounded-lg">
          {domains.map(domain => (
            <TooltipProvider key={domain.id}>
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: domain.color }}
                    />
                    <span className="text-sm">{domain.name}</span>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{domain.description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>

        <div className="grid gap-4">
          {domains.map(domain => (
            <div key={domain.id} className="flex items-center gap-4 p-4 border rounded-lg">
              <div
                className="w-6 h-6 rounded"
                style={{ backgroundColor: domain.color }}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Input
                    value={domain.name}
                    readOnly
                    className="max-w-[200px]"
                  />
                  <Input
                    type="color"
                    value={domain.color}
                    readOnly
                    className="w-20 h-10"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onEdit(domain)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => onDelete(domain.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  {domain.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}