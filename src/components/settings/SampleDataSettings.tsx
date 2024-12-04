import { SampleDataActions } from "./sample-data/SampleDataActions";
import { useSampleDataSettings } from "./sample-data/hooks/useSampleDataSettings";

export function SampleDataSettings() {
  const {
    isClearing,
    isPopulating,
    generatedCounts,
    clearDatabase,
    populateDatabase
  } = useSampleDataSettings();

  return (
    <div className="space-y-6">
      <SampleDataActions
        isClearing={isClearing}
        isPopulating={isPopulating}
        onClear={clearDatabase}
        onPopulate={populateDatabase}
      />

      {generatedCounts && (
        <div className="grid gap-4 p-4 border rounded-lg">
          <h3 className="text-lg font-semibold">Generated Data Counts</h3>
          <div className="grid gap-2">
            <div className="flex justify-between items-center p-2 rounded-lg hover:bg-muted/50">
              <span className="text-sm font-medium">Projects</span>
              <span>{generatedCounts.projects}</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg hover:bg-muted/50">
              <span className="text-sm font-medium">Fortune 30 Partners</span>
              <span>{generatedCounts.fortune30}</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg hover:bg-muted/50">
              <span className="text-sm font-medium">Internal Partners</span>
              <span>{generatedCounts.internalPartners}</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg hover:bg-muted/50">
              <span className="text-sm font-medium">SME Partners</span>
              <span>{generatedCounts.smePartners}</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg hover:bg-muted/50">
              <span className="text-sm font-medium">SPIs</span>
              <span>{generatedCounts.spis}</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg hover:bg-muted/50">
              <span className="text-sm font-medium">Objectives</span>
              <span>{generatedCounts.objectives}</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg hover:bg-muted/50">
              <span className="text-sm font-medium">SitReps</span>
              <span>{generatedCounts.sitreps}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}