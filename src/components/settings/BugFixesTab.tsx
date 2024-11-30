import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export function BugFixesTab() {
  const bugs = [
    {
      id: 1,
      title: "Fortune 30 Partner Selection Not Persisting",
      description: "When selecting a Fortune 30 partner in the SPI edit form, the selection doesn't persist in the UI",
      status: "open",
      severity: "high",
      component: "SPIEditForm"
    },
    {
      id: 2,
      title: "Edit Form Data Not Pre-populated",
      description: "SPI edit form doesn't show existing data when opened for editing",
      status: "open",
      severity: "high",
      component: "SPIEditForm"
    },
    {
      id: 3,
      title: "Missing Form Validation",
      description: "Form submissions lack proper validation for required fields",
      status: "open",
      severity: "medium",
      component: "SPIEditForm"
    },
    {
      id: 4,
      title: "Dialog Accessibility Issues",
      description: "Dialog components missing proper ARIA labels and descriptions",
      status: "open",
      severity: "medium",
      component: "Multiple"
    },
    {
      id: 5,
      title: "Inconsistent Error Handling",
      description: "Error states aren't consistently handled across the application",
      status: "open",
      severity: "medium",
      component: "Multiple"
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">Known Issues</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {bugs.map((bug) => (
            <div
              key={bug.id}
              className="border rounded-lg p-4 space-y-2 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <h3 className="font-medium">{bug.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {bug.description}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={getSeverityColor(bug.severity) + " text-white"}>
                    {bug.severity}
                  </Badge>
                  {bug.status === "resolved" && (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  )}
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                Component: {bug.component}
              </div>
            </div>
          ))}
          {bugs.length === 0 && (
            <p className="text-muted-foreground text-center py-4">
              No known issues at this time
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}