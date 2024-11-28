import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface QuantityInputsProps {
  quantities: Record<string, number>;
  onUpdate: (key: string, value: string) => void;
}

export function QuantityInputs({ quantities, onUpdate }: QuantityInputsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {Object.entries(quantities).map(([key, value]) => (
        <div key={key} className="space-y-2">
          <Label htmlFor={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</Label>
          <Input
            id={key}
            type="number"
            min="0"
            value={value}
            onChange={(e) => onUpdate(key, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
}