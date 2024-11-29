import { Card } from "@/components/ui/card";
import { DEPARTMENTS } from "@/lib/constants";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LOBEditForm } from "./LOBEditForm";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { PointOfContact } from "@/lib/types/pointOfContact";

type LOB = {
  name: string;
  department: string;
};

type BusinessCategory = {
  name: string;
  description: string;
  lobs: LOB[];
  contacts: PointOfContact[];
};

// Initial business categories data
const initialBusinessCategories: BusinessCategory[] = [
  {
    name: "Aircraft",
    description: "Development and manufacturing of commercial and military aircraft, including rotorcraft and unmanned aerial systems",
    lobs: [
      { name: "Commercial Aviation", department: "airplanes" },
      { name: "Military Aircraft", department: "airplanes" },
      { name: "Rotorcraft", department: "helicopters" },
      { name: "UAV Systems", department: "helicopters" }
    ],
    contacts: [
      { name: "John Doe", title: "Project Manager", email: "john.doe@example.com", department: "Engineering" },
      { name: "Jane Smith", title: "Lead Engineer", email: "jane.smith@example.com", department: "R&D" },
      { name: "Alice Johnson", title: "Quality Assurance", email: "alice.johnson@example.com", department: "QA" }
    ]
  },
  {
    name: "Marine",
    description: "Maritime solutions including naval systems, port operations, and offshore technologies",
    lobs: [
      { name: "Naval Systems", department: "space" },
      { name: "Maritime Operations", department: "space" },
      { name: "Port Solutions", department: "energy" }
    ],
    contacts: [
      { name: "Robert Brown", title: "Naval Architect", email: "robert.brown@example.com", department: "Naval" },
      { name: "Emily Davis", title: "Operations Manager", email: "emily.davis@example.com", department: "Operations" },
      { name: "Michael Taylor", title: "Research Scientist", email: "michael.taylor@example.com", department: "Research" }
    ]
  }
];

export function LinesOfBusinessTable() {
  const [categories, setCategories] = useState<BusinessCategory[]>(initialBusinessCategories);
  const { toast } = useToast();

  const handleAddCategory = (data: BusinessCategory) => {
    setCategories(prev => [...prev, data]);
    toast({
      title: "Category Added",
      description: "The new business category has been added successfully."
    });
  };

  const handleUpdateCategory = (index: number, data: BusinessCategory) => {
    setCategories(prev => {
      const updated = [...prev];
      updated[index] = data;
      return updated;
    });
    toast({
      title: "Category Updated",
      description: "The business category has been updated successfully."
    });
  };

  const handleDeleteCategory = (index: number) => {
    setCategories(prev => prev.filter((_, i) => i !== index));
    toast({
      title: "Category Deleted",
      description: "The business category has been removed successfully."
    });
  };

  return (
    <Card className="p-6 relative">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Lines of Business (LOB)</h2>
          <LOBEditForm onSubmit={handleAddCategory} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7 gap-6">
          {categories.map((category, categoryIndex) => (
            <div key={category.name} className="space-y-3">
              <div className="flex items-center justify-between">
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
                            <p className="font-medium">Points of Contact:</p>
                            {category.contacts.map((contact, i) => (
                              <div key={i} className="text-sm">
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
                <LOBEditForm
                  initialData={category}
                  onSubmit={(data) => handleUpdateCategory(categoryIndex, data)}
                  onDelete={() => handleDeleteCategory(categoryIndex)}
                />
              </div>
              <div className="space-y-2">
                {category.lobs.map((lob) => {
                  const deptColor = DEPARTMENTS.find(d => d.id === lob.department)?.color;
                  return (
                    <div
                      key={lob.name}
                      className="p-3 rounded-lg transition-all hover:scale-105"
                      style={{
                        backgroundColor: `${deptColor}15`,
                        borderLeft: `3px solid ${deptColor}`
                      }}
                    >
                      <span className="text-sm">{lob.name}</span>
                    </div>
                  );
                })}
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
