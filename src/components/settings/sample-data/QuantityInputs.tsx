import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";

interface QuantityInputsProps {
  quantities: Record<string, number>;
  onUpdate: (key: string, value: string) => void;
}

const quantitySchema = z.object({
  projects: z.number().min(0).max(100),
  fortune30: z.number().min(0).max(50),
  internalPartners: z.number().min(0).max(100),
  smePartners: z.number().min(0).max(100),
  spis: z.number().min(0).max(200),
  objectives: z.number().min(0).max(100),
  sitreps: z.number().min(0).max(200),
  initiatives: z.number().min(0).max(100)
});

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
  'sitreps',
  'initiatives'
];

export function QuantityInputs({ quantities, onUpdate }: QuantityInputsProps) {
  const { toast } = useToast();

  const handleInputChange = (key: string, value: string) => {
    const numValue = parseInt(value) || 0;
    
    try {
      // Validate just this field
      quantitySchema.shape[key as keyof typeof quantitySchema.shape].parse(numValue);
      onUpdate(key, value);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          variant: "destructive",
          title: "Invalid Input",
          description: `${getDisplayName(key)}: ${error.errors[0].message}`
        });
      }
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {displayOrder.map((key) => (
        <div key={key} className="space-y-2">
          <Label htmlFor={key}>{getDisplayName(key)}</Label>
          <Input
            id={key}
            type="number"
            min="0"
            max={key === 'spis' || key === 'sitreps' ? "200" : "100"}
            value={quantities[key]}
            onChange={(e) => handleInputChange(key, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
}