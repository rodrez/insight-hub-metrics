import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { DataQuantities } from "../SampleData";
import { Loader2 } from "lucide-react";

interface DataQuantityFormProps {
  onSubmit: (quantities: DataQuantities) => Promise<void>;
  isPopulating: boolean;
}

export function DataQuantityForm({ onSubmit, isPopulating }: DataQuantityFormProps) {
  const [quantities, setQuantities] = useState<DataQuantities>({
    projects: 5,
    spis: 10,
    objectives: 5,
    sitreps: 10,
    fortune30: 6,
    internalPartners: 20,
    smePartners: 5
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(quantities);
  };

  const handleChange = (key: keyof DataQuantities, value: string) => {
    const numValue = parseInt(value) || 0;
    setQuantities(prev => ({ ...prev, [key]: numValue }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="projects">Projects</Label>
          <Input
            id="projects"
            type="number"
            min="0"
            value={quantities.projects}
            onChange={(e) => handleChange('projects', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fortune30">Fortune 30 Partners</Label>
          <Input
            id="fortune30"
            type="number"
            min="0"
            max="6"
            value={quantities.fortune30}
            onChange={(e) => handleChange('fortune30', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="internalPartners">Internal Partners</Label>
          <Input
            id="internalPartners"
            type="number"
            min="0"
            value={quantities.internalPartners}
            onChange={(e) => handleChange('internalPartners', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="smePartners">SME Partners</Label>
          <Input
            id="smePartners"
            type="number"
            min="0"
            value={quantities.smePartners}
            onChange={(e) => handleChange('smePartners', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="spis">SPIs</Label>
          <Input
            id="spis"
            type="number"
            min="0"
            value={quantities.spis}
            onChange={(e) => handleChange('spis', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="objectives">Objectives</Label>
          <Input
            id="objectives"
            type="number"
            min="0"
            value={quantities.objectives}
            onChange={(e) => handleChange('objectives', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sitreps">Sitreps</Label>
          <Input
            id="sitreps"
            type="number"
            min="0"
            value={quantities.sitreps}
            onChange={(e) => handleChange('sitreps', e.target.value)}
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={isPopulating}>
          {isPopulating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Generate Data
        </Button>
      </div>
    </form>
  );
}