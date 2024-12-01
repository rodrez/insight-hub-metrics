import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import { Initiative } from "@/lib/types/initiative";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { InitiativeForm } from "./InitiativeForm";
import { db } from "@/lib/db";
import { toast } from "@/components/ui/use-toast";

interface InitiativeCardProps {
  initiative: Initiative;
  onUpdate: () => void;
}

export function InitiativeCard({ initiative, onUpdate }: InitiativeCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleDelete = async () => {
    try {
      await db.deleteInitiative(initiative.id);
      onUpdate();
      toast({
        title: "Success",
        description: "Initiative deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete initiative",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{initiative.title}</CardTitle>
            <p className="text-sm text-muted-foreground mt-2">{initiative.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditing(true)}
              className="text-gray-400 hover:text-green-500 transition-colors"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{initiative.details}</p>
      </CardContent>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Initiative</DialogTitle>
          </DialogHeader>
          <InitiativeForm
            initiative={initiative}
            onSuccess={() => {
              setIsEditing(false);
              onUpdate();
            }}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
}