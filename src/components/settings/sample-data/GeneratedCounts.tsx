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

// Helper function to get display name
const getDisplayName = (key: string): string => {
  switch (key) {
    case 'fortune30':
      return 'Fortune 30 Partners';
    case 'internalPartners':
      return 'Internal Partners';
    case 'smePartners':
      return 'SME Partners';
    default:
      return key.charAt(0).toUpperCase() + key.slice(1);
  }
};

// Define the order to match current database display
const displayOrder = [
  'projects',
  'fortune30',
  'internalPartners',
  'smePartners',
  'spis',
  'objectives',
  'sitreps'
];

export function GeneratedCounts({ counts, requestedQuantities }: GeneratedCountsProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-4">Generated Data Counts</h3>
        <div className="grid gap-2">
          {displayOrder.map((key) => {
            const count = counts[key as keyof DataCounts];
            const requested = requestedQuantities[key];
            const isMatch = count === requested;
            
            return (
              <div key={key} className="flex justify-between items-center p-2 rounded-lg hover:bg-muted/50">
                <span className="text-sm font-medium">
                  {getDisplayName(key)}
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