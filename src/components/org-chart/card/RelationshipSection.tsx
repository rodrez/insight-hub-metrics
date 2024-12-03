import { Badge } from "@/components/ui/badge";

interface RelationshipSectionProps {
  title: string;
  items: any[];
  onItemClick: (id: string) => void;
}

export function RelationshipSection({ title, items, onItemClick }: RelationshipSectionProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {items.map(item => (
          <Badge
            key={item.id}
            className="cursor-pointer hover:bg-primary/90"
            onClick={() => onItemClick(item.id)}
          >
            {item.name || item.title}
          </Badge>
        ))}
      </div>
    </div>
  );
}