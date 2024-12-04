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
  if (!items || items.length === 0) return null;

  const getItemName = (item: any) => {
    if (!item) return 'Unknown';
    return item.name || item.title || item.deliverable || 'Unnamed';
  };

  const getItemDate = (item: any) => {
    if (!item) return null;
    if (item.date) return format(new Date(item.date), 'MMM d, yyyy');
    if (item.lastActive) return format(new Date(item.lastActive), 'MMM d, yyyy');
    return null;
  };

  return (
    <Card className="p-3 bg-card/50">
      <h4 className="text-sm font-medium mb-2">{title}</h4>
      <div className="flex flex-wrap gap-1">
        {items.map((item) => {
          const itemName = getItemName(item);
          const itemDate = getItemDate(item);
          
          return (
            <Badge 
              key={item.id} 
              variant="secondary"
              className="text-xs bg-purple-600 hover:bg-purple-700 text-white cursor-pointer transition-colors"
            >
              {itemName}
              {itemDate && (
                <span className="ml-1 opacity-75">
                  ({itemDate})
                </span>
              )}
            </Badge>
          );
        })}
      </div>
    </Card>
  );
}