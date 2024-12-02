import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";
import { format } from "date-fns";
import { OrgPosition } from "./types";

interface RelationshipDisplayProps {
  title: string;
  type: keyof OrgPosition;
  itemIds: string[];
}

export function RelationshipDisplay({ title, type, itemIds }: RelationshipDisplayProps) {
  const { data: items = [] } = useQuery({
    queryKey: [type],
    queryFn: async () => {
      switch (type) {
        case 'projects':
          return db.getAllProjects();
        case 'fortune30Partners':
          const collaborators = await db.getAllCollaborators();
          return collaborators.filter(c => c.type === 'fortune30');
        case 'smePartners':
          return db.getAllSMEPartners();
        case 'spis':
          return db.getAllSPIs();
        case 'sitreps':
          return db.getAllSitReps();
        default:
          return [];
      }
    }
  });

  const selectedItems = items
    .filter((item: any) => itemIds.includes(item.id))
    .sort((a: any, b: any) => {
      if (type === 'sitreps') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return 0;
    });

  if (selectedItems.length === 0) return null;

  const getBadgeStyle = (item: any) => {
    if (type === 'fortune30Partners' || type === 'smePartners') {
      return {
        backgroundColor: item.color || '#4A90E2',
        color: '#FFFFFF',
        borderColor: 'transparent'
      };
    }
    if (type === 'spis') {
      switch (item.status) {
        case 'completed':
          return { backgroundColor: '#10B981', color: '#FFFFFF', borderColor: 'transparent' };
        case 'delayed':
          return { backgroundColor: '#F59E0B', color: '#FFFFFF', borderColor: 'transparent' };
        case 'on-track':
          return { backgroundColor: '#3B82F6', color: '#FFFFFF', borderColor: 'transparent' };
        default:
          return {};
      }
    }
    return {};
  };

  const getItemLabel = (item: any) => {
    if (type === 'sitreps') {
      return `${item.title} (${format(new Date(item.date), 'MMM d, yyyy')})`;
    }
    if (type === 'spis') {
      return `${item.name} (Due: ${format(new Date(item.expectedCompletionDate), 'MMM d, yyyy')})`;
    }
    return item.name || item.title;
  };

  return (
    <Card className="p-3 bg-card/50">
      <h4 className="text-sm font-medium mb-2">{title}</h4>
      <div className="flex flex-wrap gap-1">
        {selectedItems.map((item: any) => (
          <Badge 
            key={item.id} 
            variant="secondary" 
            className="text-xs"
            style={getBadgeStyle(item)}
          >
            {getItemLabel(item)}
          </Badge>
        ))}
      </div>
    </Card>
  );
}
