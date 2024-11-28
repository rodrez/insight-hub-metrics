import { Card, CardContent } from "@/components/ui/card";
import { DataCounts } from "../types/dataTypes";

interface DataStatsProps {
  dataCounts: DataCounts;
}

export function DataStats({ dataCounts }: DataStatsProps) {
  return (
    <Card className="mt-6">
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-4">Current Data Counts</h3>
        <div className="grid gap-2">
          {Object.entries(dataCounts).map(([key, count]) => (
            <div key={key} className="flex justify-between items-center">
              <span>{key.charAt(0).toUpperCase() + key.slice(1)}:</span>
              <span>{count}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}