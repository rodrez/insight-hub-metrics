import { Card } from "@/components/ui/card";
import { DEPARTMENTS } from "@/lib/constants";
import { Info } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { POCEditDialog } from "./POCEditDialog";
import { useState } from "react";

const businessCategories = [
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
  },
  {
    name: "Space",
    description: "Space exploration technologies, satellite systems, and launch vehicle development",
    contacts: [
      { name: "Kevin Turner", role: "Program Manager", email: "k.turner@company.com", phone: "555-0401" },
      { name: "Nancy Green", role: "Spacecraft Engineer", email: "n.green@company.com", phone: "555-0402" },
      { name: "Chris Evans", role: "Launch Coordinator", email: "c.evans@company.com", phone: "555-0403" }
    ],
    lobs: [
      { name: "Satellite Systems", department: "space" },
      { name: "Launch Vehicles", department: "space" },
      { name: "Space Exploration", department: "space" }
    ]
  },
  {
    name: "Energy",
    description: "Sustainable energy solutions, power systems, and grid infrastructure development",
    contacts: [
      { name: "Diana Lane", role: "Energy Project Lead", email: "d.lane@company.com", phone: "555-0501" },
      { name: "Mark Smith", role: "Grid Systems Engineer", email: "m.smith@company.com", phone: "555-0502" },
      { name: "Laura Hill", role: "Renewable Energy Analyst", email: "l.hill@company.com", phone: "555-0503" }
    ],
    lobs: [
      { name: "Renewable Energy", department: "energy" },
      { name: "Power Systems", department: "energy" },
      { name: "Grid Solutions", department: "energy" }
    ]
  },
  {
    name: "Defense",
    description: "Defense systems and electronics, including missile systems and combat technologies",
    contacts: [
      { name: "Henry Adams", role: "Defense Systems Director", email: "h.adams@company.com", phone: "555-0601" },
      { name: "Sophia Carter", role: "Combat Systems Engineer", email: "s.carter@company.com", phone: "555-0602" },
      { name: "Oliver James", role: "Missile Systems Analyst", email: "o.james@company.com", phone: "555-0603" }
    ],
    lobs: [
      { name: "Missile Systems", department: "space" },
      { name: "Defense Electronics", department: "techlab" },
      { name: "Combat Systems", department: "airplanes" }
    ]
  },
  {
    name: "Research",
    description: "Advanced research and development in materials, AI, robotics, and emerging technologies",
    contacts: [
      { name: "Ella Johnson", role: "R&D Lead", email: "e.johnson@company.com", phone: "555-0701" },
      { name: "Jake Brown", role: "AI Researcher", email: "j.brown@company.com", phone: "555-0702" },
      { name: "Emily Davis", role: "Robotics Engineer", email: "e.davis@company.com", phone: "555-0703" }
    ],
    lobs: [
      { name: "Advanced Materials", department: "techlab" },
      { name: "AI & Robotics", department: "techlab" },
      { name: "Future Tech", department: "techlab" }
    ]
  }
];

export function LinesOfBusinessTable() {
  const [categories, setCategories] = useState(businessCategories);

  const handleContactsUpdate = (categoryIndex: number, newContacts: any[]) => {
    setCategories(prev => prev.map((category, index) => 
      index === categoryIndex 
        ? { ...category, contacts: newContacts }
        : category
    ));
  };

  return (
    <Card className="p-6 relative">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-6">Lines of Business (LOB)</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7 gap-6">
          {categories.map((category, categoryIndex) => (
            <div key={category.name} className="space-y-3">
              <h3 className="font-medium text-lg border-b pb-2 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  {category.name}
                  <Info className="h-4 w-4 text-muted-foreground" />
                </span>
                <POCEditDialog
                  categoryName={category.name}
                  contacts={category.contacts}
                  onSave={(newContacts) => handleContactsUpdate(categoryIndex, newContacts)}
                />
              </h3>
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
