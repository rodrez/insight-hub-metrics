import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";
import { format } from "date-fns";

interface RelationshipDisplayProps {
  title: string;
  type: 'assignedProjects' | 'assignedSpis' | 'assignedSitreps';
  itemIds: string[];
  itemType: 'project' | 'fortune30' | 'sme' | 'spi' | 'sitrep';
}

export function RelationshipDisplay({ title, type, itemIds, itemType }: RelationshipDisplayProps) {
  const { data: items = [] } = useQuery({
    queryKey: [type, itemType, itemIds],
    queryFn: async () => {
      if (!itemIds || itemIds.length === 0) return [];
      
      switch (itemType) {
        case 'project':
          const projects = await db.getAllProjects();
          return projects.filter(p => itemIds.includes(p.id));
        case 'fortune30':
          const collaborators = await db.getAllCollaborators();
          return collaborators.filter(c => c.type === 'fortune30' && itemIds.includes(c.id));
        case 'sme':
          const smePartners = await db.getAllSMEPartners();
          return smePartners.filter(s => itemIds.includes(s.id));
        case 'spi':
          const spis = await db.getAllSPIs();
          return spis.filter(s => itemIds.includes(s.id));
        case 'sitrep':
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
    if (itemType === 'spi') {
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
    if (itemType === 'fortune30' || itemType === 'sme') {
      return { backgroundColor: item.color || '#4B5563', color: '#FFFFFF' };
    }
    return {};
  };

  const getItemLabel = (item: any) => {
    if (itemType === 'sitrep') {
      return `${item.title} (${format(new Date(item.date), 'MMM d, yyyy')})`;
    }
    if (itemType === 'spi') {
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