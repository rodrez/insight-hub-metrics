import { SitRepForm } from "@/components/sitreps/SitRepForm";
import { SitRepList } from "@/components/sitreps/SitRepList";

export default function SitReps() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold">Situational Reports</h1>
      <SitRepForm onSubmitSuccess={() => {}} />
      <SitRepList />
    </div>
  );
}