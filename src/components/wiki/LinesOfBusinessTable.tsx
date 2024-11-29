import { Card } from "@/components/ui/card";
import { DEPARTMENTS } from "@/lib/constants";
import { useState } from "react";
import { CategoryCard } from "./lob/CategoryCard";
import { businessCategories } from "./lob/businessCategories";

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
            <CategoryCard
              key={category.name}
              category={category}
              onContactsUpdate={(newContacts) => handleContactsUpdate(categoryIndex, newContacts)}
            />
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