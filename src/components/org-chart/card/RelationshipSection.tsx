import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface RelationshipSectionProps {
  title: string;
  items: any[];
  onItemClick: (id: string) => void;
  color?: string;
}

export function RelationshipSection({ title, items, onItemClick, color }: RelationshipSectionProps) {
  if (!items?.length) {
    return (
      <div className="space-y-2">
        <h3 className="text-sm font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">No {title.toLowerCase()} assigned</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {items.map(item => (
          <Badge
            key={item.id}
            className={cn(
              "cursor-pointer transition-colors",
              color ? "hover:opacity-90" : "hover:bg-primary/90"
            )}
            style={color ? { backgroundColor: color, color: 'white' } : undefined}
            onClick={() => onItemClick(item.id)}
          >
            {item.name || item.title || item.deliverable}
          </Badge>
        ))}
      </div>
    </div>
  );
}