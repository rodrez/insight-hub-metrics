import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { DEPARTMENTS } from "@/lib/constants";
import { Info } from "lucide-react";
import { BusinessCategory, LOB } from "./data/businessCategories";

interface LOBCardProps {
  lob: LOB;
  category: BusinessCategory;
}

export function LOBCard({ lob, category }: LOBCardProps) {
  const deptColor = DEPARTMENTS.find(d => d.id === lob.department)?.color;

  return (
    <HoverCard key={lob.name}>
      <HoverCardTrigger>
        <div
          className="p-3 rounded-lg transition-all hover:scale-105 cursor-pointer"
          style={{
            backgroundColor: `${deptColor}15`,
            borderLeft: `3px solid ${deptColor}`
          }}
        >
          <span className="text-sm">{lob.name}</span>
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-96">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium">{lob.name}</h4>
            <p className="text-sm text-muted-foreground mt-2">{category.detailedDescription}</p>
          </div>
          <div>
            <h5 className="font-medium mb-2">Contacts</h5>
            {category.contacts.map((contact, index) => (
              <div key={contact.email} className="space-y-1">
                <p className="font-medium text-sm">{contact.name}</p>
                <p className="text-sm text-muted-foreground">{contact.role}</p>
                <div className="text-sm">
                  <a href={`mailto:${contact.email}`} className="text-blue-500 hover:underline">
                    {contact.email}
                  </a>
                </div>
                <p className="text-sm text-muted-foreground">{contact.phone}</p>
                {index < category.contacts.length - 1 && <hr className="my-2" />}
              </div>
            ))}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}