import { Network } from "lucide-react";
import { OrgPositionCard } from "@/components/org-chart/OrgPositionCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RATMemberProvider } from "@/contexts/RATMemberContext";
import { Skeleton } from "@/components/ui/skeleton";

export default function OrgChart() {
  return (
    <RATMemberProvider>
      <div className="container py-6 space-y-6">
        <div className="flex items-center gap-2 mb-8">
          <Network className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Organization Chart</h1>
        </div>
        
        <ScrollArea className="h-[calc(100vh-120px)]">
          <div className="grid gap-12">
            {/* Director Level */}
            <div className="flex justify-center">
              <OrgPositionCard 
                title="Director of Retail Innovation" 
                name="Sarah Johnson"
                width="w-[480px]"
              />
            </div>

            {/* Senior Manager Level */}
            <div className="grid md:grid-cols-3 gap-8">
              <OrgPositionCard
                title="Senior Manager of Technology"
                name="Michael Chen"
                width="w-full"
              />
              <OrgPositionCard
                title="Senior Manager of R&D"
                name="Emily Rodriguez"
                width="w-full"
              />
              <OrgPositionCard
                title="Senior Manager of Software"
                name="David Kim"
                width="w-full"
              />
            </div>

            {/* Tech Lead Level */}
            <div className="grid md:grid-cols-3 gap-6">
              <OrgPositionCard
                title="Tech Lead of AI/ML"
                name="James Wilson"
                width="w-full"
              />
              <OrgPositionCard
                title="Tech Lead of Analytics"
                name="Maria Garcia"
                width="w-full"
              />
              <OrgPositionCard
                title="Tech Lead of Infrastructure"
                name="Robert Taylor"
                width="w-full"
              />
            </div>
          </div>
        </ScrollArea>
      </div>
    </RATMemberProvider>
  );
}