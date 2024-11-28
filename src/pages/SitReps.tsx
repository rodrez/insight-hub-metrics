import { CompactSitRepForm } from "@/components/sitreps/CompactSitRepForm";
import { SitRepList } from "@/components/sitreps/SitRepList";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { useState } from "react";

export default function SitReps() {
  const [showDateFilter, setShowDateFilter] = useState(false);

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Situational Reports</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowDateFilter(!showDateFilter)}
          >
            <Calendar className="h-4 w-4" />
          </Button>
          <CompactSitRepForm onSubmitSuccess={() => {}} />
        </div>
      </div>
      <SitRepList showDateFilter={showDateFilter} />
    </div>
  );
}