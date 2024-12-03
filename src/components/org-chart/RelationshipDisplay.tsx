import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { OrgPosition } from "./types";

interface RelationshipDisplayProps {
  title: string;
  type: keyof OrgPosition;
  itemIds: string[];
  items: any[];
}

export function RelationshipDisplay({ title, type, itemIds, items }: RelationshipDisplayProps) {
  if (items.length === 0) return null;

  const getItemName = (item: any) => {
    return item.name || item.title || 'Unnamed';
  };

  const getItemDate = (item: any) => {
    if (item.date) return format(new Date(item.date), 'MMM d, yyyy');
    if (item.lastActive) return format(new Date(item.lastActive), 'MMM d, yyyy');
    return null;
  };

  return (
    <Card className="p-3 bg-card/50">
      <h4 className="text-sm font-medium mb-2">{title}</h4>
      <div className="flex flex-wrap gap-1">
        {items.map((item) => (
          <Badge 
            key={item.id} 
            variant="secondary"
            className="text-xs"
          >
            {getItemName(item)}
            {getItemDate(item) && (
              <span className="ml-1 text-muted-foreground">
                ({getItemDate(item)})
              </span>
            )}
          </Badge>
        ))}
      </div>
    </Card>
  );
}