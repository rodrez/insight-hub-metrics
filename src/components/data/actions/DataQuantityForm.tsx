import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

interface QuantityInputsProps {
  onSubmit: (quantities: any) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export function DataQuantityForm({ onSubmit, onCancel, isLoading }: QuantityInputsProps) {
  const [quantities, setQuantities] = useState({
    projects: 5, // Minimum of 5 projects
    fortune30: 6,
    internalPartners: 20,
    smePartners: 10,
    spis: 10,
    objectives: 5,
    sitreps: 10
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ensure minimum of 5 projects
    if (quantities.projects < 5) {
      toast({
        title: "Validation Error",
        description: "Minimum of 5 projects required",
        variant: "destructive",
      });
      return;
    }
    
    onSubmit(quantities);
  };

  const updateQuantity = (key: string, value: string) => {
    const numValue = Math.max(parseInt(value) || 0, key === 'projects' ? 5 : 0);
    setQuantities(prev => ({ ...prev, [key]: numValue }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(quantities).map(([key, value]) => (
          <div key={key} className="space-y-2">
            <Label htmlFor={key}>
              {key.charAt(0).toUpperCase() + key.slice(1)}
              {key === 'projects' && " (min: 5)"}
            </Label>
            <Input
              id={key}
              type="number"
              min={key === 'projects' ? 5 : 0}
              value={value}
              onChange={(e) => updateQuantity(key, e.target.value)}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          Generate Data
        </Button>
      </div>
    </form>
  );
}