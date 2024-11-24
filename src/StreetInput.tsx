import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface StreetInputProps {
  value: string;
  onChange: (value: string) => void;
}

const StreetInput = ({ value, onChange }: StreetInputProps) => {
  return (
    <div className="form-group">
      <Label htmlFor="street" className="block text-gray-700">Street Address</Label>
      <Input
        id="street"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter street address"
        className="w-full"
      />
    </div>
  );
};

export default StreetInput;