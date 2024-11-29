import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TechDomain } from "@/lib/types/techDomain";

interface AddTechDomainProps {
  onAdd: (domain: TechDomain) => void;
}

export function AddTechDomain({ onAdd }: AddTechDomainProps) {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#4F46E5");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newDomain: TechDomain = {
      id: crypto.randomUUID(),
      name,
      color,
      description
    };

    onAdd(newDomain);

    // Reset form
    setName("");
    setColor("#4F46E5");
    setDescription("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg">
      <h3 className="text-lg font-medium">Add New Tech Domain</h3>
      <div className="grid gap-4">
        <div className="flex gap-4">
          <Input
            placeholder="Domain Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="flex-1"
          />
          <div className="flex items-center gap-2">
            <Input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-20 h-10"
            />
            <div
              className="w-10 h-10 rounded border"
              style={{ backgroundColor: color }}
            />
          </div>
        </div>
        <Textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="h-20"
        />
        <Button type="submit">Add Domain</Button>
      </div>
    </form>
  );
}