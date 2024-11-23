import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Edit, Trash2, Shield, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collaborator } from "@/lib/types/collaboration";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";

type Fortune30ListProps = {
  collaborators: Collaborator[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

export function Fortune30List({ collaborators, onEdit, onDelete }: Fortune30ListProps) {
  const navigate = useNavigate();
  
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  const handleProjectClick = (projectId: string) => {
    navigate(`/projects/${projectId}`, { state: { scrollToProject: projectId } });
  };

  return (
    <div className="grid gap-6">
      {collaborators.map((collaborator) => (
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
              <div>
                <h4 className="font-medium mb-2">Contact</h4>
                <a 
                  href={`mailto:${collaborator.email}`}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  <Mail className="h-4 w-4" />
                  {collaborator.email}
                </a>
              </div>
              <div>
                <h4 className="font-medium mb-2">Associated Projects</h4>
                <div className="space-y-2">
                  {collaborator.projects.map((project, index) => (
                    <div 
                      key={index} 
                      className="p-3 rounded-lg border space-y-2 cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleProjectClick(project.id)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{project.name}</span>
                        <Badge variant="outline">Active</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {project.description}
                      </p>
                      <div className="space-y-2 text-sm">
                        {collaborator.agreements?.nda && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Shield className={`h-4 w-4 ${
                              collaborator.agreements.nda.status === 'signed' 
                                ? 'text-green-500' 
                                : 'text-yellow-500'
                            }`} />
                            <span>NDA: {collaborator.agreements.nda.status}</span>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Calendar className="h-4 w-4" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Signed: {formatDate(collaborator.agreements.nda.signedDate)}</p>
                                  <p>Expires: {formatDate(collaborator.agreements.nda.expiryDate)}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        )}
                        {collaborator.agreements?.jtda && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Shield className={`h-4 w-4 ${
                              collaborator.agreements.jtda.status === 'signed' 
                                ? 'text-green-500' 
                                : 'text-yellow-500'
                            }`} />
                            <span>JTDA: {collaborator.agreements.jtda.status}</span>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Calendar className="h-4 w-4" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Signed: {formatDate(collaborator.agreements.jtda.signedDate)}</p>
                                  <p>Expires: {formatDate(collaborator.agreements.jtda.expiryDate)}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}