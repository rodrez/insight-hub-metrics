import { QuantityInputs } from "./sample-data/QuantityInputs";
import { GeneratedCounts } from "./sample-data/GeneratedCounts";
import { SampleDataActions } from "./sample-data/SampleDataActions";
import { useSampleDataSettings } from "./sample-data/hooks/useSampleDataSettings";

export function SampleDataSettings() {
  const {
    isClearing,
    isPopulating,
    quantities,
    generatedCounts,
    updateQuantity,
    clearDatabase,
    populateDatabase
  } = useSampleDataSettings();

  return (
    <div className="space-y-6">
      <QuantityInputs quantities={quantities} onUpdate={updateQuantity} />

      <SampleDataActions
        isClearing={isClearing}
        isPopulating={isPopulating}
        onClear={clearDatabase}
        onPopulate={populateDatabase}
      />

      {generatedCounts && (
        <GeneratedCounts counts={generatedCounts} requestedQuantities={quantities} />
      )}
    </div>
  );
}