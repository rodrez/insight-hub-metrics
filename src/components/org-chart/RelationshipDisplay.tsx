import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";
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

  const selectedItems = items.filter((item: any) => itemIds.includes(item.id));

  if (selectedItems.length === 0) return null;

  return (
    <Card className="p-3 bg-card/50">
      <h4 className="text-sm font-medium mb-2">{title}</h4>
      <div className="flex flex-wrap gap-1">
        {selectedItems.map((item: any) => (
          <Badge key={item.id} variant="secondary" className="text-xs">
            {item.name || item.title}
          </Badge>
        ))}
      </div>
    </Card>
  );
}