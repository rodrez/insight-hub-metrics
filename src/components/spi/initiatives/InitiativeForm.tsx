import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Initiative } from "@/lib/types/initiative";
import { db } from "@/lib/db";

interface InitiativeFormProps {
  initiative?: Initiative;
  onSuccess: () => void;
}

export function InitiativeForm({ initiative, onSuccess }: InitiativeFormProps) {
  const [title, setTitle] = useState(initiative?.title || "");
  const [description, setDescription] = useState(initiative?.description || "");
  const [details, setDetails] = useState(initiative?.details || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const initiativeData: Initiative = {
        id: initiative?.id || `initiative-${Date.now()}`,
        title,
        description,
        details,
        createdAt: initiative?.createdAt || new Date().toISOString(),
      };

      if (initiative) {
        await db.updateInitiative(initiative.id, initiativeData);
      } else {
        await db.addInitiative(initiativeData);
      }
      
      toast({
        title: "Success",
        description: `Initiative ${initiative ? 'updated' : 'added'} successfully`
      });
      
      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${initiative ? 'update' : 'add'} initiative`,
        variant: "destructive"
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Input
          placeholder="Initiative Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="h-24"
        />
      </div>
      <div className="space-y-2">
        <Textarea
          placeholder="Additional Details"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          className="h-32"
        />
      </div>
      <Button type="submit">{initiative ? 'Update' : 'Add'} Initiative</Button>
    </form>
  );
}