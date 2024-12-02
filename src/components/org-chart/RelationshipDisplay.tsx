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
          const sitreps = await db.getAllSitReps();
          return sitreps.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        default:
          return [];
      }
    }
  });

  const selectedItems = items.filter((item: any) => itemIds.includes(item.id));

  if (selectedItems.length === 0) return null;

  const getSPIStatusColor = (status: string) => {
    switch (status) {
      case 'on-track':
        return 'bg-green-500/10 border-green-500 text-green-500';
      case 'delayed':
        return 'bg-red-500/10 border-red-500 text-red-500';
      case 'completed':
        return 'bg-blue-500/10 border-blue-500 text-blue-500';
      default:
        return 'bg-gray-500/10 border-gray-500 text-gray-500';
    }
  };

  const getBadgeContent = (item: any) => {
    if (type === 'sitreps') {
      return (
        <div className="flex items-center gap-2">
          <span>{item.title}</span>
          <span className="text-xs text-muted-foreground">
            {format(new Date(item.date), 'MMM d, yyyy')}
          </span>
        </div>
      );
    }
    
    if (type === 'spis') {
      return (
        <div className="flex items-center gap-2">
          <span>{item.name}</span>
          <span className="text-xs text-muted-foreground">
            ECD: {format(new Date(item.expectedCompletionDate), 'MMM d, yyyy')}
          </span>
        </div>
      );
    }

    return item.name || item.title;
  };

  const getBadgeStyle = (item: any) => {
    if (type === 'fortune30Partners' || type === 'smePartners') {
      return {
        backgroundColor: item.color || '#4A90E2',
        color: '#FFFFFF',
        borderColor: 'transparent'
      };
    }
    
    if (type === 'spis') {
      return {};
    }
    
    return {};
  };

  return (
    <Card className="p-3 bg-card/50">
      <h4 className="text-sm font-medium mb-2">{title}</h4>
      <div className="flex flex-wrap gap-1">
        {selectedItems.map((item: any) => (
          <Badge 
            key={item.id} 
            variant="secondary" 
            className={`text-xs ${type === 'spis' ? getSPIStatusColor(item.status) : ''}`}
            style={getBadgeStyle(item)}
          >
            {getBadgeContent(item)}
          </Badge>
        ))}
      </div>
    </Card>
  );
}