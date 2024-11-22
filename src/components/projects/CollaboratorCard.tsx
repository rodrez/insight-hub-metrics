import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Collaborator } from "@/lib/types";

interface CollaboratorCardProps {
  collaborator: Collaborator;
}

export function CollaboratorCard({ collaborator }: CollaboratorCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/collaborations/${collaborator.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="flex items-center justify-between p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors"
    >
      <div>
        <p className="font-medium">{collaborator.name}</p>
        <p className="text-sm text-muted-foreground">{collaborator.role}</p>
      </div>
      <Badge variant={collaborator.type === 'fortune30' ? 'default' : 'secondary'}>
        {collaborator.type === 'fortune30' ? 'Fortune 30' : 'Partner'}
      </Badge>
    </div>
  );
}