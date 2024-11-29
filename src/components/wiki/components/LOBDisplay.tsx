import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { Edit2, Info, Trash2 } from "lucide-react";
import { DEPARTMENTS } from "@/lib/constants";
import { Contact } from "../types/contact";

interface LOBDisplayProps {
  lob: { name: string; department: string; };
  category: { 
    detailedDescription?: string;
    contacts: Contact[];
  };
  onEdit: () => void;
  onDelete: () => void;
}

export function LOBDisplay({ lob, category, onEdit, onDelete }: LOBDisplayProps) {
  const deptColor = DEPARTMENTS.find(d => d.id === lob.department)?.color;

  return (
    <div className="group relative">
      <HoverCard>
        <HoverCardTrigger>
          <div
            className="p-3 rounded-lg transition-all hover:scale-105 cursor-pointer group"
            style={{
              backgroundColor: `${deptColor}15`,
              borderLeft: `3px solid ${deptColor}`
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm">{lob.name}</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-gray-400 hover:text-green-500 transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    onEdit();
                  }}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-gray-400 hover:text-red-500 transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    onDelete();
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Info className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
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
              {category.contacts.map((contact) => (
                <div key={contact.email} className="space-y-1">
                  <p className="font-medium text-sm">{contact.name}</p>
                  <p className="text-sm text-muted-foreground">{contact.role}</p>
                  <div className="text-sm">
                    <a href={`mailto:${contact.email}`} className="text-blue-500 hover:underline">
                      {contact.email}
                    </a>
                  </div>
                  <p className="text-sm text-muted-foreground">{contact.phone}</p>
                  {contact.notes && (
                    <p className="text-sm text-muted-foreground italic mt-1">{contact.notes}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}