import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Mail, Pen, Trash2, Info, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collaborator } from "@/lib/types/collaboration";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";
import { CollaboratorProjects } from "./collaborator/CollaboratorProjects";
import { CollaboratorHeader } from "./collaborator/CollaboratorHeader";
import { CollaboratorContact } from "./collaborator/CollaboratorContact";
import { CollaboratorWorkstreams } from "./collaborator/CollaboratorWorkstreams";

type Fortune30ListProps = {
  collaborators: Collaborator[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

export function Fortune30List({ collaborators, onEdit, onDelete }: Fortune30ListProps) {
  const [warningSettings, setWarningSettings] = useState({
    warningDays: 180,
    criticalDays: 90,
    warningColor: '#FEF08A',
    criticalColor: '#FCA5A5'
  });

  const { data: allProjects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: () => db.getAllProjects(),
  });
  
  useEffect(() => {
    const saved = localStorage.getItem('agreementWarningSettings');
    if (saved) {
      setWarningSettings(JSON.parse(saved));
    }
  }, []);

  return (
    <div className="grid gap-6">
      {collaborators.map((collaborator) => {
        const collaboratorProjects = allProjects.filter(project => 
          project.collaborators?.some(c => c.id === collaborator.id)
        );

        return (
          <Card key={collaborator.id}>
            <CardHeader>
              <CollaboratorHeader
                collaborator={collaborator}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <CollaboratorContact contact={collaborator.primaryContact} />
                  <CollaboratorProjects
                    projects={collaboratorProjects}
                    agreements={collaborator.agreements}
                    warningSettings={warningSettings}
                  />
                </div>
                <CollaboratorWorkstreams workstreams={collaborator.workstreams} />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}