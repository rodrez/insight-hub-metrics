import { CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pen, Trash2, Info, Shield } from "lucide-react";
import { Collaborator } from "@/lib/types/collaboration";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { useAgreementStatus } from "@/hooks/useAgreementStatus";

type PartnerHeaderProps = {
  collaborator: Collaborator;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  type: 'fortune30' | 'sme';
};

export function PartnerHeader({ collaborator, onEdit, onDelete, type }: PartnerHeaderProps) {
  const { formatDate } = useAgreementStatus(collaborator.agreements);

  return (
    <div className="flex justify-between items-start">
      <div>
        <h1 
          className="text-4xl font-bold mb-2 group-hover:translate-x-1 transition-transform duration-200" 
          style={{ color: collaborator.color }}
        >
          {collaborator.name}
        </h1>
        <CardDescription className="text-lg">
          <div className="flex items-center gap-4">
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

            {collaborator.agreements?.nda && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Shield className={`h-3 w-3 ${
                        collaborator.agreements.nda.status === 'signed' 
                          ? 'text-green-500' 
                          : 'text-yellow-500'
                      }`} />
                      NDA
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Status: {collaborator.agreements.nda.status}</p>
                    <p>Signed: {formatDate(collaborator.agreements.nda.signedDate)}</p>
                    <p>Expires: {formatDate(collaborator.agreements.nda.expiryDate)}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            {collaborator.agreements?.jtda && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Shield className={`h-3 w-3 ${
                        collaborator.agreements.jtda.status === 'signed' 
                          ? 'text-green-500' 
                          : 'text-yellow-500'
                      }`} />
                      JTDA
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Status: {collaborator.agreements.jtda.status}</p>
                    <p>Signed: {formatDate(collaborator.agreements.jtda.signedDate)}</p>
                    <p>Expires: {formatDate(collaborator.agreements.jtda.expiryDate)}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
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