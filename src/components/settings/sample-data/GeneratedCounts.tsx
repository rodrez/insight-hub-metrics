import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DataCounts {
  projects: number;
  spis: number;
  objectives: number;
  sitreps: number;
  fortune30: number;
  internalPartners: number;
  smePartners: number;
}

interface GeneratedCountsProps {
  counts: DataCounts;
  requestedQuantities: Record<string, number>;
}

export function GeneratedCounts({ counts, requestedQuantities }: GeneratedCountsProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-4">Generated Data Counts</h3>
        <div className="grid gap-2">
          {Object.entries(counts).map(([key, count]) => {
            const requested = requestedQuantities[key];
            const isMatch = count === requested;
            
            return (
              <div key={key} className="flex justify-between items-center p-2 rounded-lg hover:bg-muted/50">
                <span className="text-sm font-medium">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </span>
                <div className="flex items-center gap-2">
                  <Badge variant={isMatch ? "default" : "destructive"}>
                    {count} / {requested}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}