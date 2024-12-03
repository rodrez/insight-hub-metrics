import { Pen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusIcon } from "./StatusIcon";
import { RATMemberBadge } from "./RATMemberBadge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SitRepHeaderProps {
  title: string;
  status: string;
  ratMember?: string;
  onStatusChange: (status: 'pending-review' | 'ready' | 'submitted') => void;
  onEdit: () => void;
  onDelete?: () => void;
}

export function SitRepHeader({ 
  title, 
  status, 
  ratMember,
  onStatusChange, 
  onEdit, 
  onDelete 
}: SitRepHeaderProps) {
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'pending-review':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'ready':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'Submitted';
      case 'pending-review':
        return 'Pending Review';
      case 'ready':
        return 'Ready';
      default:
        return status;
    }
  };

  return (
    <div className="flex justify-between items-start">
      <div className="flex items-center gap-2">
        <h3 className="text-xl font-semibold">{title}</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Badge 
              variant="outline" 
              className={`${getStatusBadgeColor(status)} cursor-pointer hover:opacity-80`}
            >
              {getStatusLabel(status)}
            </Badge>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => onStatusChange('pending-review')}>
              Pending Review
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusChange('ready')}>
              Ready
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusChange('submitted')}>
              Submitted
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <StatusIcon status={status} />
        <RATMemberBadge ratMember={ratMember || ''} />
      </div>
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onEdit}
          className="text-muted-foreground hover:text-green-500 transition-colors"
        >
          <Pen className="h-4 w-4" />
        </Button>
        {onDelete && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="text-muted-foreground hover:text-red-500"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}