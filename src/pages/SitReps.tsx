import { CompactSitRepForm } from "@/components/sitreps/CompactSitRepForm";
import { SitRepList } from "@/components/sitreps/SitRepList";

export default function SitReps() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Situational Reports</h1>
        <CompactSitRepForm onSubmitSuccess={() => {}} />
      </div>
      <SitRepList />
    </div>
  );
}