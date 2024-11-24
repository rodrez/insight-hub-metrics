import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Mail, Edit, Trash2, Info } from "lucide-react";
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
                  {collaborator.projects?.map((project, index) => {
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
          </CardContent>
        </Card>
      ))}
    </div>
  );
}