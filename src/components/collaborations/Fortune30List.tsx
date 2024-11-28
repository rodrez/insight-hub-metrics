import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Mail, Edit, Trash2, Info, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collaborator } from "@/lib/types/collaboration";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState, useEffect } from "react";
import { CollaboratorProject } from "./CollaboratorProject";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

type Fortune30ListProps = {
  collaborators: Collaborator[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

type WarningSettings = {
  warningDays: number;
  criticalDays: number;
  warningColor: string;
  criticalColor: string;
};

export function Fortune30List({ collaborators, onEdit, onDelete }: Fortune30ListProps) {
  const [warningSettings, setWarningSettings] = useState<WarningSettings>({
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

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  const getDaysUntilExpiry = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getExpiryWarningColor = (expiryDate: string) => {
    const daysUntil = getDaysUntilExpiry(expiryDate);
    if (daysUntil <= warningSettings.criticalDays) {
      return warningSettings.criticalColor;
    }
    if (daysUntil <= warningSettings.warningDays) {
      return warningSettings.warningColor;
    }
    return undefined;
  };

  return (
    <div className="grid gap-6">
      {collaborators.map((collaborator) => {
        const collaboratorProjects = allProjects.filter(project => 
          project.collaborators?.some(c => c.id === collaborator.id)
        ).map(project => ({
          id: project.id,
          name: project.name,
          description: project.nabc?.needs || "No description available",
          status: project.status,
          nabc: project.nabc
        }));

        return (
          <Card key={collaborator.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-4xl font-bold mb-2" style={{ color: collaborator.color || '#333' }}>
                    {collaborator.name}
                  </h1>
                  <CardDescription className="text-lg">{collaborator.role}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={() => onEdit(collaborator.id)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => onDelete(collaborator.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-2">Primary Contact</h4>
                    {collaborator.primaryContact ? (
                      <div className="space-y-2">
                        <p className="font-medium">{collaborator.primaryContact.name}</p>
                        <p className="text-sm text-muted-foreground">{collaborator.primaryContact.role}</p>
                        <div className="flex flex-col gap-2">
                          <a 
                            href={`mailto:${collaborator.primaryContact.email}`}
                            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                          >
                            <Mail className="h-4 w-4" />
                            {collaborator.primaryContact.email}
                          </a>
                          {collaborator.primaryContact.phone && (
                            <a 
                              href={`tel:${collaborator.primaryContact.phone}`}
                              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                            >
                              <Phone className="h-4 w-4" />
                              {collaborator.primaryContact.phone}
                            </a>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No primary contact set</p>
                    )}
                  </div>

                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      Associated Projects
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Yellow background: Agreement expires within {warningSettings.warningDays} days</p>
                            <p>Red background: Agreement expires within {warningSettings.criticalDays} days</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </h4>
                    <div className="space-y-2">
                      {collaboratorProjects.map((project, index) => {
                        const nda = collaborator.agreements?.nda;
                        const jtda = collaborator.agreements?.jtda;
                        const warningColor = nda ? getExpiryWarningColor(nda.expiryDate) : 
                                           jtda ? getExpiryWarningColor(jtda.expiryDate) : 
                                           undefined;
                        
                        return (
                          <CollaboratorProject
                            key={index}
                            project={project}
                            agreements={collaborator.agreements}
                            warningColor={warningColor}
                            formatDate={formatDate}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-4">Workstreams</h4>
                  {collaborator.workstreams && collaborator.workstreams.length > 0 ? (
                    <div className="space-y-4">
                      {collaborator.workstreams.map((workstream) => (
                        <Card key={workstream.id}>
                          <CardContent className="pt-6">
                            <div className="flex justify-between items-start mb-2">
                              <h5 className="font-medium">{workstream.title}</h5>
                              <Badge variant={
                                workstream.status === 'active' ? 'default' :
                                workstream.status === 'completed' ? 'secondary' :
                                'outline'
                              }>
                                {workstream.status}
                              </Badge>
                            </div>
                            <div className="space-y-2 text-sm">
                              <div>
                                <p className="font-medium">Objectives:</p>
                                <p className="text-muted-foreground">{workstream.objectives}</p>
                              </div>
                              <Separator />
                              <div>
                                <p className="font-medium">Next Steps:</p>
                                <p className="text-muted-foreground">{workstream.nextSteps}</p>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Last updated: {formatDate(workstream.lastUpdated)}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No workstreams defined</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}