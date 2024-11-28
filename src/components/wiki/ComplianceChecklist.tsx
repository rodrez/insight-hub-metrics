import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Shield, AlertTriangle } from "lucide-react";

const complianceItems = [
  {
    id: "far",
    label: "Federal Acquisition Regulation (FAR) Compliant",
    description: "Project meets FAR requirements for federal contracts"
  },
  {
    id: "dfars",
    label: "DFARS Compliance",
    description: "Adheres to Defense Federal Acquisition Regulation Supplement"
  },
  {
    id: "export",
    label: "Export Control Review",
    description: "Project has been reviewed for export control compliance"
  },
  {
    id: "security",
    label: "Security Classification",
    description: "Project security level has been properly classified"
  },
  {
    id: "data",
    label: "Data Handling",
    description: "Compliant with data protection and handling requirements"
  }
];

export function ComplianceChecklist() {
  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  const isCompliant = checkedItems.length === complianceItems.length;

  return (
    <Card className="border-2 border-muted">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-500" />
            Compliance Checklist
          </CardTitle>
          {isCompliant ? (
            <Badge variant="default" className="bg-green-500">Compliant</Badge>
          ) : (
            <Badge variant="destructive" className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Pending Review
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {complianceItems.map((item) => (
          <div key={item.id} className="flex items-start space-x-3 p-2 rounded hover:bg-muted/50 transition-colors">
            <Checkbox
              id={item.id}
              checked={checkedItems.includes(item.id)}
              onCheckedChange={(checked) => {
                setCheckedItems(prev =>
                  checked
                    ? [...prev, item.id]
                    : prev.filter(id => id !== item.id)
                );
              }}
            />
            <div className="space-y-1">
              <label
                htmlFor={item.id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {item.label}
              </label>
              <p className="text-sm text-muted-foreground">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}