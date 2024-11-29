import { Card } from "@/components/ui/card";
import { DEPARTMENTS } from "@/lib/constants";
import { Info, Plus, Trash2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { PointOfContact, BusinessCategory } from "@/lib/types/pointOfContact";

// Define the product areas and their LOBs
const initialBusinessCategories: BusinessCategory[] = [
  {
    name: "Aircraft",
    description: "Aircraft related lines of business",
    contacts: [
      { name: "John Doe", title: "Program Manager", email: "john@example.com", department: "airplanes" },
      { name: "Jane Smith", title: "Technical Lead", email: "jane@example.com", department: "helicopters" },
      { name: "Bob Wilson", title: "Operations Director", email: "bob@example.com", department: "airplanes" }
    ],
    lobs: [
      { name: "Commercial Aircraft Systems", department: "airplanes" },
      { name: "Military Aircraft Integration", department: "airplanes" },
      { name: "Aircraft Maintenance Services", department: "helicopters" }
    ]
  },
  {
    name: "Marine",
    description: "Marine systems and solutions",
    contacts: [
      { name: "Sarah Connor", title: "Marine Director", email: "sarah@example.com", department: "space" },
      { name: "Mike Johnson", title: "Systems Engineer", email: "mike@example.com", department: "space" },
      { name: "Lisa Brown", title: "Project Manager", email: "lisa@example.com", department: "energy" }
    ],
    lobs: [
      { name: "Naval Integration Systems", department: "space" },
      { name: "Port Management Solutions", department: "energy" },
      { name: "Marine Operations", department: "space" }
    ]
  },
  {
    name: "Technology",
    description: "Technology solutions and services",
    contacts: [
      { name: "Alex Kim", title: "Tech Director", email: "alex@example.com", department: "it" },
      { name: "Maria Garcia", title: "Solutions Architect", email: "maria@example.com", department: "techlab" },
      { name: "Tom Lee", title: "Security Lead", email: "tom@example.com", department: "it" }
    ],
    lobs: [
      { name: "Digital Transformation", department: "it" },
      { name: "Cloud Infrastructure", department: "techlab" },
      { name: "Cybersecurity Services", department: "it" }
    ]
  }
];

export function LinesOfBusinessTable() {
  const [categories, setCategories] = useState<BusinessCategory[]>(initialBusinessCategories);

  const addLOB = (categoryIndex: number, newLOB: { name: string; department: string }) => {
    const updatedCategories = [...categories];
    updatedCategories[categoryIndex].lobs.push(newLOB);
    setCategories(updatedCategories);
  };

  const deleteLOB = (categoryIndex: number, lobIndex: number) => {
    const updatedCategories = [...categories];
    updatedCategories[categoryIndex].lobs.splice(lobIndex, 1);
    setCategories(updatedCategories);
  };

  return (
    <Card className="p-6 relative">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-6">Lines of Business (LOB)</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, categoryIndex) => (
            <div key={category.name} className="space-y-3">
              <h3 className="font-medium text-lg border-b pb-2 flex items-center gap-2">
                {category.name}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="space-y-2">
                        <p className="max-w-xs">{category.description}</p>
                        <div className="pt-2 border-t">
                          <p className="font-semibold">Points of Contact:</p>
                          {category.contacts.map((contact, index) => (
                            <div key={index} className="text-sm">
                              <p>{contact.name} - {contact.title}</p>
                              <p className="text-xs text-muted-foreground">{contact.email}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </h3>
              <div className="space-y-2">
                {category.lobs.map((lob, lobIndex) => {
                  const deptColor = DEPARTMENTS.find(d => d.id === lob.department)?.color;
                  return (
                    <div
                      key={`${lob.name}-${lobIndex}`}
                      className="p-3 rounded-lg transition-all hover:scale-105 flex justify-between items-center group"
                      style={{
                        backgroundColor: `${deptColor}15`,
                        borderLeft: `3px solid ${deptColor}`
                      }}
                    >
                      <span className="text-sm">{lob.name}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => deleteLOB(categoryIndex, lobIndex)}
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  );
                })}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => addLOB(categoryIndex, { 
                    name: `New LOB ${category.lobs.length + 1}`,
                    department: DEPARTMENTS[0].id
                  })}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add LOB
                </Button>
              </div>
            </div>
          ))}
        </div>

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