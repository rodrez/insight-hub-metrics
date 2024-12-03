import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pen } from "lucide-react";

interface OrgPositionHeaderProps {
  title: string;
  name: string;
  memberInfo: any;
  onEditClick: () => void;
}

export function OrgPositionHeader({ title, name, memberInfo, onEditClick }: OrgPositionHeaderProps) {
  return (
    <div className="flex justify-between items-start">
      <div>
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">{name}</p>
        {memberInfo?.expertise && (
          <Badge variant="secondary" className="mt-2">
            {memberInfo.expertise}
          </Badge>
        )}
      </div>
      <Button
        variant="outline"
        size="icon"
        onClick={onEditClick}
      >
        <Pen className="h-4 w-4" />
      </Button>
    </div>
  );
}