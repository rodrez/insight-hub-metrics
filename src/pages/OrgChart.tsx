import { Network } from "lucide-react";
import { OrgPositionCard } from "@/components/org-chart/OrgPositionCard";
import { OrgChartAnalytics } from "@/components/org-chart/analytics/OrgChartAnalytics";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function OrgChart() {
  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center gap-2">
        <Network className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Organization Chart</h1>
      </div>
      
      <Tabs defaultValue="chart" className="space-y-4">
        <TabsList>
          <TabsTrigger value="chart">Org Chart</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="chart" className="space-y-8">
          {/* Director Level */}
          <div className="flex justify-center">
            <OrgPositionCard title="Director" width="w-96" />
          </div>

          {/* Senior Manager Level */}
          <div className="flex justify-center gap-8">
            {[1, 2, 3].map((index) => (
              <OrgPositionCard
                key={index}
                title={`Senior Manager ${index}`}
                width="w-80"
              />
            ))}
          </div>

          {/* Tech Lead Level */}
          <div className="flex justify-center gap-4">
            {[1, 2, 3].map((index) => (
              <OrgPositionCard
                key={index}
                title={`Tech Lead ${index}`}
                width="w-72"
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <OrgChartAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
}