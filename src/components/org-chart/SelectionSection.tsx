import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";
import { OrgPosition } from "./types";

interface SelectionSectionProps {
  title: string;
  type: keyof OrgPosition;
  position: OrgPosition;
  onPositionChange: (updatedPosition: OrgPosition) => void;
}

export function SelectionSection({ title, type, position, onPositionChange }: SelectionSectionProps) {
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

  const handleValueChange = (value: string) => {
    const currentArray = Array.isArray(position[type]) ? position[type] : [];
    if (!currentArray.includes(value)) {
      const updatedPosition = {
        ...position,
        [type]: [...currentArray, value]
      };
      onPositionChange(updatedPosition);
    }
  };

  const handleRemoveItem = (itemId: string) => {
    const currentArray = Array.isArray(position[type]) ? position[type] : [];
    const updatedPosition = {
      ...position,
      [type]: currentArray.filter((id: string) => id !== itemId)
    };
    onPositionChange(updatedPosition);
  };

  const selectedIds = Array.isArray(position[type]) ? position[type] : [];

  return (
    <div>
      <h3 className="text-sm font-medium mb-2">{title}</h3>
      <Select
        value=""
        onValueChange={handleValueChange}
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
        {selectedIds.map((itemId: string) => {
          const item = items.find((i: any) => i.id === itemId);
          return item ? (
            <Badge
              key={itemId}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {getItemLabel(item)}
              <button
                onClick={() => handleRemoveItem(itemId)}
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