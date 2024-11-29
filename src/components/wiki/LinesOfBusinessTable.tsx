import { Card } from "@/components/ui/card";
import { DEPARTMENTS } from "@/lib/constants";
import { Info } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { POCManagementDialog } from "./POCManagementDialog";
import { useState } from "react";
import { ContactPerson } from "@/lib/types/collaboration";

type BusinessCategory = {
  name: string;
  description: string;
  contacts: ContactPerson[];
  lobs: Array<{
    name: string;
    department: string;
  }>;
};

// Initial business categories data
const initialBusinessCategories: BusinessCategory[] = [
  {
    name: "Aircraft",
    description: "Development and manufacturing of commercial and military aircraft, including rotorcraft and unmanned aerial systems",
    contacts: [
      { name: "John Smith", role: "Program Director", email: "j.smith@company.com", phone: "555-0101" },
      { name: "Sarah Johnson", role: "Technical Lead", email: "s.johnson@company.com", phone: "555-0102" },
      { name: "Mike Chen", role: "Operations Manager", email: "m.chen@company.com", phone: "555-0103" }
    ],
    lobs: [
      { name: "Commercial Aviation", department: "airplanes" },
      { name: "Military Aircraft", department: "airplanes" },
      { name: "Rotorcraft", department: "helicopters" },
      { name: "UAV Systems", department: "helicopters" }
    ]
  },
  {
    name: "Marine",
    description: "Maritime solutions including naval systems, port operations, and offshore technologies",
    contacts: [
      { name: "Lisa Brown", role: "Marine Systems Director", email: "l.brown@company.com", phone: "555-0201" },
      { name: "David Park", role: "Naval Architecture Lead", email: "d.park@company.com", phone: "555-0202" },
      { name: "Emma Wilson", role: "Operations Coordinator", email: "e.wilson@company.com", phone: "555-0203" }
    ],
    lobs: [
      { name: "Naval Systems", department: "space" },
      { name: "Maritime Operations", department: "space" },
      { name: "Port Solutions", department: "energy" }
    ]
  },
  {
    name: "Technology",
    description: "Digital solutions and cybersecurity services, including cloud infrastructure and software development",
    contacts: [
      { name: "Alex Rivera", role: "Technology Director", email: "a.rivera@company.com", phone: "555-0301" },
      { name: "Grace Liu", role: "Solutions Architect", email: "g.liu@company.com", phone: "555-0302" },
      { name: "Tom Anderson", role: "Security Lead", email: "t.anderson@company.com", phone: "555-0303" }
    ],
    lobs: [
      { name: "Digital Solutions", department: "it" },
      { name: "Cybersecurity", department: "it" },
      { name: "Cloud Services", department: "techlab" }
    ]
  }
];

export function LinesOfBusinessTable() {
  const [businessCategories, setBusinessCategories] = useState<BusinessCategory[]>(initialBusinessCategories);

  const handleUpdateContacts = (categoryName: string, newContacts: ContactPerson[]) => {
    setBusinessCategories(categories =>
      categories.map(category =>
        category.name === categoryName
          ? { ...category, contacts: newContacts }
          : category
      )
    );
  };

  return (
    <Card className="p-6 relative">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Lines of Business (LOB)</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businessCategories.map((category) => (
            <div key={category.name} className="space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="font-medium text-lg flex items-center gap-2">
                  {category.name}
                  <Info className="h-4 w-4 text-muted-foreground" />
                </h3>
                <POCManagementDialog
                  categoryName={category.name}
                  contacts={category.contacts}
                  onSave={(contacts) => handleUpdateContacts(category.name, contacts)}
                />
              </div>
              <div className="space-y-2">
                {category.lobs.map((lob) => {
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
                      <HoverCardContent className="w-80">
                        <div className="space-y-4">
                          <h4 className="font-medium">{lob.name} Contacts</h4>
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
                              {index < category.contacts.length - 1 && (
                                <hr className="my-2" />
                              )}
                            </div>
                          ))}
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Color key */}
        <div className="absolute bottom-4 right-4">
          <div className="bg-card/80 backdrop-blur-sm p-3 rounded-lg shadow-sm border">
            <div className="grid grid-cols-3 gap-x-4 gap-y-2">
              {DEPARTMENTS.map((dept) => (
                <div key={dept.id} className="flex items-center gap-1.5">
                  <div 
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: dept.color }}
                  />
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{dept.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}