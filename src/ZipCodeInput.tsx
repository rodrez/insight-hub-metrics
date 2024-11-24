import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ZipCodeInputProps {
  value: string;
  onChange: (value: string) => void;
}

const ZipCodeInput = ({ value, onChange }: ZipCodeInputProps) => {
  return (
    <div className="form-group">
      <Label htmlFor="zipCode" className="block text-gray-700">ZIP Code</Label>
      <Input
        id="zipCode"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter ZIP code"
        maxLength={5}
        pattern="[0-9]*"
        className="w-full"
      />
    </div>
  );
};

export default ZipCodeInput;