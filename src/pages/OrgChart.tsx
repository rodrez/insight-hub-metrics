import { Network } from "lucide-react";
import { OrgPositionCard } from "@/components/org-chart/OrgPositionCard";

export default function OrgChart() {
  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center gap-2">
        <Network className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Organization Chart</h1>
      </div>
      
      <div className="grid gap-8">
        {/* Director Level */}
        <div className="flex justify-center">
          <OrgPositionCard 
            title="Director" 
            name="Sarah Johnson"
            width="w-96" 
          />
        </div>

        {/* Senior Manager Level */}
        <div className="flex justify-center gap-8">
          <OrgPositionCard
            title="Senior Manager"
            name="Michael Chen"
            width="w-80"
          />
          <OrgPositionCard
            title="Senior Manager"
            name="Emily Rodriguez"
            width="w-80"
          />
          <OrgPositionCard
            title="Senior Manager"
            name="David Kim"
            width="w-80"
          />
        </div>

        {/* Tech Lead Level */}
        <div className="flex justify-center gap-4">
          <OrgPositionCard
            title="Tech Lead"
            name="James Wilson"
            width="w-72"
          />
          <OrgPositionCard
            title="Tech Lead"
            name="Maria Garcia"
            width="w-72"
          />
          <OrgPositionCard
            title="Tech Lead"
            name="Robert Taylor"
            width="w-72"
          />
        </div>
      </div>
    </div>
  );
}