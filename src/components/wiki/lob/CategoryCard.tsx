import { Info } from "lucide-react";
import { POCEditDialog } from "../POCEditDialog";
import { LOBCard } from "./LOBCard";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface CategoryCardProps {
  category: {
    name: string;
    description: string;
    contacts: any[];
    lobs: Array<{
      name: string;
      department: string;
    }>;
  };
  onContactsUpdate: (newContacts: any[]) => void;
}

export function CategoryCard({ category, onContactsUpdate }: CategoryCardProps) {
  return (
    <div className="space-y-3">
      <h3 className="font-medium text-lg border-b pb-2 flex items-center justify-between">
        <span className="flex items-center gap-2">
          {category.name}
          <HoverCard>
            <HoverCardTrigger>
              <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
            </HoverCardTrigger>
            <HoverCardContent>
              <p className="text-sm">{category.description}</p>
            </HoverCardContent>
          </HoverCard>
        </span>
        <POCEditDialog
          categoryName={category.name}
          contacts={category.contacts}
          onSave={onContactsUpdate}
        />
      </h3>
      <div className="space-y-2">
        {category.lobs.map((lob) => (
          <LOBCard 
            key={lob.name} 
            lob={lob} 
            description={`${category.name} - ${lob.name}: Specialized division focusing on ${lob.name.toLowerCase()} solutions and innovations within the ${category.name} sector.`}
          />
        ))}
      </div>
    </div>
  );
}