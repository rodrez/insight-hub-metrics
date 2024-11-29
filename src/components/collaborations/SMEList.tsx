import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Pen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collaborator } from "@/lib/types/collaboration";
import { WorkstreamCard } from "./shared/WorkstreamCard";
import { ContactInfo } from "./shared/ContactInfo";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type SMEListProps = {
  collaborators: Collaborator[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

export function SMEList({ collaborators, onEdit, onDelete }: SMEListProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="grid gap-6">
      {collaborators.map((collaborator) => (
        <Card key={collaborator.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-4xl font-bold mb-2">
                  {collaborator.name}
                </h1>
                <CardDescription className="text-lg">{collaborator.role}</CardDescription>
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
                      <p>Edit collaborator</p>
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
                      <p>Delete collaborator</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Primary Contact</h4>
                {collaborator.primaryContact ? (
                  <ContactInfo contact={collaborator.primaryContact} />
                ) : (
                  <p className="text-sm text-muted-foreground">No primary contact set</p>
                )}
              </div>

              <div>
                <h4 className="font-medium mb-4">Workstreams</h4>
                {collaborator.workstreams && collaborator.workstreams.length > 0 ? (
                  <div className="space-y-4">
                    {collaborator.workstreams.map((workstream) => (
                      <WorkstreamCard
                        key={workstream.id}
                        workstream={workstream}
                        formatDate={formatDate}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No workstreams defined</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}