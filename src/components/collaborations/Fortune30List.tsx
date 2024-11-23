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

type Fortune30ListProps = {
  collaborators: Collaborator[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

export function Fortune30List({ collaborators, onEdit, onDelete }: Fortune30ListProps) {
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
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Agreement Details</h4>
                  <div className="space-y-2">
                    {collaborator.agreements?.nda && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">NDA Status:</span>
                          <Badge>{collaborator.agreements.nda.status}</Badge>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">NDA Signed:</span>
                          <span>{formatDate(collaborator.agreements.nda.signedDate)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">NDA Expires:</span>
                          <span>{formatDate(collaborator.agreements.nda.expiryDate)}</span>
                        </div>
                      </div>
                    )}
                    {collaborator.agreements?.jtda && (
                      <div className="space-y-2 mt-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">JTDA Status:</span>
                          <Badge>{collaborator.agreements.jtda.status}</Badge>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">JTDA Signed:</span>
                          <span>{formatDate(collaborator.agreements.jtda.signedDate)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">JTDA Expires:</span>
                          <span>{formatDate(collaborator.agreements.jtda.expiryDate)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
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
              </div>
              <div>
                <h4 className="font-medium mb-2">Associated Projects</h4>
                <div className="space-y-2">
                  {collaborator.projects.map((project, index) => (
                    <div key={index} className="p-3 rounded-lg border space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{project}</span>
                        <Badge variant="outline">Active</Badge>
                      </div>
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