import { Button } from "@/components/ui/button";

interface QuantityInputsProps {
  onSubmit: (quantities: any) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export function DataQuantityForm({ onSubmit, onCancel, isLoading }: QuantityInputsProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const quantities = {
      projects: 6,
      fortune30: 6,
      internalPartners: 20,
      smePartners: 6,
      spis: 10,
      objectives: 5,
      sitreps: 10
    };
    onSubmit(quantities);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>Projects: 6</div>
        <div>Fortune 30 Partners: 6</div>
        <div>Internal Partners: 20</div>
        <div>SME Partners: 6</div>
        <div>SPIs: 10</div>
        <div>Objectives: 5</div>
        <div>SitReps: 10</div>
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={isLoading}>
          Generate Data
        </Button>
      </div>
    </div>
  );
}