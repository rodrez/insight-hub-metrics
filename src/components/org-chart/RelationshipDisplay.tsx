import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";
import { format } from "date-fns";
import { Collaborator } from "@/lib/types/collaboration";

interface RelationshipDisplayProps {
  title: string;
  type: 'assignedProjects' | 'assignedSpis' | 'assignedSitreps';
  itemIds: string[];
}

export function RelationshipDisplay({ title, type, itemIds }: RelationshipDisplayProps) {
  const { data: items = [] } = useQuery({
    queryKey: [type, itemIds],
    queryFn: async () => {
      if (!itemIds || itemIds.length === 0) return [];
      
      switch (type) {
        case 'assignedProjects':
          const projects = await db.getAllProjects();
          return projects.filter(p => itemIds.includes(p.id));
        case 'assignedSpis':
          const spis = await db.getAllSPIs();
          return spis.filter(s => itemIds.includes(s.id));
        case 'assignedSitreps':
          const sitreps = await db.getAllSitReps();
          return sitreps.filter(s => itemIds.includes(s.id))
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        default:
          return [];
      }
    },
    enabled: itemIds?.length > 0
  });

  if (!items || items.length === 0) return null;

  const getBadgeStyle = (item: any) => {
    if (type === 'assignedSpis') {
      switch (item.status) {
        case 'completed':
          return { backgroundColor: '#10B981', color: '#FFFFFF' };
        case 'delayed':
          return { backgroundColor: '#F59E0B', color: '#FFFFFF' };
        case 'on-track':
          return { backgroundColor: '#3B82F6', color: '#FFFFFF' };
        default:
          return {};
      }
    }
    return {};
  };

  const getItemLabel = (item: any) => {
    if (type === 'assignedSitreps') {
      return `${item.title} (${format(new Date(item.date), 'MMM d, yyyy')})`;
    }
    if (type === 'assignedSpis') {
      return `${item.name} (Due: ${format(new Date(item.expectedCompletionDate), 'MMM d, yyyy')})`;
    }
    return item.name || item.title;
  };

  return (
    <Card className="p-3 bg-card/50">
      <h4 className="text-sm font-medium mb-2">{title}</h4>
      <div className="flex flex-wrap gap-1">
        {items.map((item: any) => (
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