import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";
import { OrgPosition } from "./types";

interface SelectionSectionProps {
  title: string;
  type: keyof OrgPosition;
  position: OrgPosition;
}

export function SelectionSection({ title, type, position }: SelectionSectionProps) {
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

  const getItemLabel = (item: any) => {
    switch (type) {
      case 'projects':
      case 'sitreps':
        return item.name || item.title;
      case 'fortune30Partners':
      case 'smePartners':
        return item.name;
      case 'spis':
        return item.name;
      default:
        return '';
    }
  };

  return (
    <div>
      <h3 className="text-sm font-medium mb-2">{title}</h3>
      <Select
        value=""
        onValueChange={(value) => {
          if (!position[type].includes(value)) {
            position[type] = [...position[type], value];
          }
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={`Select ${title}`} />
        </SelectTrigger>
        <SelectContent>
          {items.map((item: any) => (
            <SelectItem key={item.id} value={item.id}>
              {getItemLabel(item)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="flex flex-wrap gap-2 mt-2">
        {position[type].map((itemId: string) => {
          const item = items.find((i: any) => i.id === itemId);
          return item ? (
            <Badge
              key={itemId}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {getItemLabel(item)}
              <button
                onClick={() => {
                  position[type] = position[type].filter((id: string) => id !== itemId);
                }}
                className="ml-1 hover:text-destructive"
              >
                ×
              </button>
            </Badge>
          ) : null;
        })}
      </div>
    </div>
  );
}