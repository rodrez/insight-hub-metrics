import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface RelationshipSectionProps {
  title: string;
  items: any[];
  onItemClick: (id: string) => void;
  color?: string;
  badgeClassName?: string;
  getDepartmentColor: (departmentId: string) => string;
}

export function RelationshipSection({ 
  title, 
  items, 
  onItemClick, 
  color = "#6E59A5",
  badgeClassName,
  getDepartmentColor
}: RelationshipSectionProps) {
  if (!items?.length) {
    return (
      <div className="space-y-2">
        <h3 className="text-sm font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">No {title.toLowerCase()} assigned</p>
      </div>
    );
  }

  const getItemName = (item: any) => {
    return item.name || item.title || item.deliverable || 'Unnamed';
  };

  const getItemColor = (item: any) => {
    if (item.department) {
      return getDepartmentColor(item.department);
    }
    return item.color || color;
  };

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {items.map(item => (
          <Badge
            key={item.id}
            className={cn(
              "cursor-pointer transition-colors",
              badgeClassName,
              !badgeClassName && "hover:opacity-90"
            )}
            style={!badgeClassName ? { backgroundColor: getItemColor(item), color: 'white' } : undefined}
            onClick={() => onItemClick(item.id)}
          >
            {getItemName(item)}
          </Badge>
        ))}
      </div>
    </div>
  );
}