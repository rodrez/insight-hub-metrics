import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface QuantityInputsProps {
  quantities: Record<string, number>;
  onUpdate: (key: string, value: string) => void;
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

export function QuantityInputs({ quantities, onUpdate }: QuantityInputsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {displayOrder.map((key) => (
        <div key={key} className="space-y-2">
          <Label htmlFor={key}>{getDisplayName(key)}</Label>
          <Input
            id={key}
            type="number"
            min="0"
            value={quantities[key]}
            onChange={(e) => onUpdate(key, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
}