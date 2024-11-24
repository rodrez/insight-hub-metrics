import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CityInputProps {
  value: string;
  onChange: (value: string) => void;
}

const CityInput = ({ value, onChange }: CityInputProps) => {
  return (
    <div className="form-group">
      <Label htmlFor="city" className="block text-gray-700">City</Label>
      <Input
        id="city"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter city"
        className="w-full"
      />
    </div>
  );
};

export default CityInput;