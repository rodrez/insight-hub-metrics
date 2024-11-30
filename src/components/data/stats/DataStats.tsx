import { Card, CardContent } from "@/components/ui/card";
import { DataCounts } from "../types/dataTypes";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";

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
  // Add a direct query for SME partners to ensure accurate count
  const { data: smePartners = [] } = useQuery({
    queryKey: ['collaborators-sme'],
    queryFn: async () => {
      const smePartners = await db.getAllSMEPartners();
      if (smePartners && smePartners.length > 0) {
        return smePartners;
      }
      const allCollaborators = await db.getAllCollaborators();
      return allCollaborators.filter(c => c.type === 'sme');
    },
  });

  // Override the SME partners count with the actual count from the query
  const updatedCounts = {
    ...dataCounts,
    smePartners: smePartners.length
  };

  return (
    <Card className="mt-6">
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-4">Current Data Counts</h3>
        <div className="grid gap-3">
          {displayOrder.map((key) => (
            <div key={key} className="flex justify-between items-center p-2 rounded-lg hover:bg-muted/50">
              <span className="text-sm font-medium">{getDisplayName(key)}</span>
              <Badge variant={updatedCounts[key as keyof DataCounts] > 0 ? "default" : "secondary"}>
                {updatedCounts[key as keyof DataCounts]}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}