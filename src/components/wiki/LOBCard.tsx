import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { DEPARTMENTS } from "@/lib/constants";
import { Edit2, Info } from "lucide-react";
import { BusinessCategory, LOB } from "./data/businessCategories";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { toast } from "../ui/use-toast";

interface LOBCardProps {
  lob: LOB;
  category: BusinessCategory;
  onUpdate?: (updatedLob: LOB) => void;
}

export function LOBCard({ lob, category, onUpdate }: LOBCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(lob.name);
  const [editedDescription, setEditedDescription] = useState(category.detailedDescription || '');
  const deptColor = DEPARTMENTS.find(d => d.id === lob.department)?.color;

  const handleSave = () => {
    if (!editedName.trim()) {
      toast({
        title: "Error",
        description: "Name cannot be empty",
        variant: "destructive"
      });
      return;
    }

    const updatedLob = {
      ...lob,
      name: editedName.trim()
    };

    onUpdate?.(updatedLob);
    setIsEditing(false);
    toast({
      title: "Success",
      description: "LOB updated successfully"
    });
  };

  return (
    <div className="group relative">
      <HoverCard>
        <HoverCardTrigger>
          <div
            className="p-3 rounded-lg transition-all hover:scale-105 cursor-pointer"
            style={{
              backgroundColor: `${deptColor}15`,
              borderLeft: `3px solid ${deptColor}`
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm">{lob.name}</span>
              <Info className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </HoverCardTrigger>
        <HoverCardContent className="w-96">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium">{lob.name}</h4>
                <p className="text-sm text-muted-foreground mt-2">{category.detailedDescription}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setIsEditing(true)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
            <div>
              <h5 className="font-medium mb-2">Contacts</h5>
              {category.contacts.map((contact, index) => (
                <div key={contact.email} className="space-y-1">
                  <p className="font-medium text-sm">{contact.name}</p>
                  <p className="text-sm text-muted-foreground">{contact.role}</p>
                  <div className="text-sm">
                    <a href={`mailto:${contact.email}`} className="text-blue-500 hover:underline">
                      {contact.email}
                    </a>
                  </div>
                  <p className="text-sm text-muted-foreground">{contact.phone}</p>
                  {index < category.contacts.length - 1 && <hr className="my-2" />}
                </div>
              ))}
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit LOB Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setEditedName(lob.name);
                  setEditedDescription(category.detailedDescription || '');
                  setIsEditing(false);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleSave}>Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}