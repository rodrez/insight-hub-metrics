import { CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pen, Trash2, Info } from "lucide-react";
import { Collaborator } from "@/lib/types/collaboration";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type PartnerHeaderProps = {
  collaborator: Collaborator;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  type: 'fortune30' | 'sme';
};

export function PartnerHeader({ collaborator, onEdit, onDelete, type }: PartnerHeaderProps) {
  return (
    <div className="flex justify-between items-start">
      <div>
        <h1 
          className="text-4xl font-bold mb-2 group-hover:translate-x-1 transition-transform duration-200" 
          style={type === 'fortune30' ? { color: collaborator.color } : {}}
        >
          {collaborator.name}
        </h1>
        <CardDescription className="text-lg">
          <span className="flex items-center gap-2">
            {type === 'fortune30' ? 'Fortune 30 Partner' : 'Small Medium Enterprise Partner'}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Partnership details and collaboration status</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </span>
        </CardDescription>
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
              <p>Edit partnership details</p>
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
              <p>Delete partnership</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}