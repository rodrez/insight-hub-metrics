import { Card, CardContent } from "@/components/ui/card";
import { DataCounts } from "../types/dataTypes";
import { Badge } from "@/components/ui/badge";

interface DataStatsProps {
  dataCounts: DataCounts;
}

export function DataStats({ dataCounts }: DataStatsProps) {
  return (
    <Card className="mt-6">
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-4">Current Data Counts</h3>
        <div className="grid gap-3">
          {Object.entries(dataCounts).map(([key, count]) => (
            <div key={key} className="flex justify-between items-center p-2 rounded-lg hover:bg-muted/50">
              <span className="text-sm font-medium">{key.charAt(0).toUpperCase() + key.slice(1)}:</span>
              <Badge variant={count > 0 ? "default" : "secondary"}>
                {count}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}