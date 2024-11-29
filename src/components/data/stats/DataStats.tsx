import { Card, CardContent } from "@/components/ui/card";
import { DataCounts } from "../types/dataTypes";
import { Badge } from "@/components/ui/badge";

interface DataStatsProps {
  dataCounts: DataCounts;
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

export function DataStats({ dataCounts }: DataStatsProps) {
  return (
    <Card className="mt-6">
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-4">Current Data Counts</h3>
        <div className="grid gap-3">
          {displayOrder.map((key) => (
            <div key={key} className="flex justify-between items-center p-2 rounded-lg hover:bg-muted/50">
              <span className="text-sm font-medium">{getDisplayName(key)}</span>
              <Badge variant={dataCounts[key as keyof DataCounts] > 0 ? "default" : "secondary"}>
                {dataCounts[key as keyof DataCounts]}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}