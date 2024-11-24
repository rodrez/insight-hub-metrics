import { Badge } from "@/components/ui/badge";
import { CollaboratorProject as CollaboratorProjectType, Agreement } from "@/lib/types/collaboration";
import { AgreementStatus } from "./AgreementStatus";
import { useNavigate } from "react-router-dom";

interface CollaboratorProjectProps {
  project: CollaboratorProjectType;
  agreements?: {
    nda?: Agreement;
    jtda?: Agreement;
  };
  warningColor?: string;
  formatDate: (date: string) => string;
}

export function CollaboratorProject({ project, agreements, warningColor, formatDate }: CollaboratorProjectProps) {
  const navigate = useNavigate();

  const handleProjectClick = () => {
    navigate('/', { state: { scrollToProject: project.id } });
  };

  return (
    <div 
      className={`p-3 rounded-lg border space-y-2 cursor-pointer hover:bg-muted/50 transition-colors ${
        project.status === 'active' ? 'border-green-500' : ''
      }`}
      onClick={handleProjectClick}
      style={{ backgroundColor: warningColor }}
    >
      <div className="flex items-center justify-between">
        <span className="font-medium">{project.name}</span>
        {project.status === 'active' && <Badge variant="outline">Active</Badge>}
      </div>
      <p className="text-sm text-muted-foreground line-clamp-2">
        {project.description}
      </p>
      <div className="space-y-2 text-sm">
        {agreements?.nda && (
          <AgreementStatus 
            type="nda" 
            agreement={agreements.nda} 
            formatDate={formatDate}
          />
        )}
        {agreements?.jtda && (
          <AgreementStatus 
            type="jtda" 
            agreement={agreements.jtda} 
            formatDate={formatDate}
          />
        )}
      </div>
    </div>
  );
}