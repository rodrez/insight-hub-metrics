import { Card, CardContent } from "@/components/ui/card";

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
          {Object.entries(counts).map(([key, count]) => (
            <div key={key} className="flex justify-between items-center">
              <span>{key.charAt(0).toUpperCase() + key.slice(1)}:</span>
              <div className="flex items-center gap-2">
                <span className={count === requestedQuantities[key] ? "text-green-600" : "text-red-600"}>
                  {count}
                </span>
                <span className="text-gray-400 text-sm">
                  / {requestedQuantities[key]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}