import { useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Edit2, Save, X } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

interface WikiSectionProps {
  section: {
    id: string;
    title: string;
    content: string;
  };
  onSave: (id: string, newContent: string) => void;
}

export default function WikiSection({ section, onSave }: WikiSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(section.content);
  const { toast } = useToast();

  const handleSave = () => {
    onSave(section.id, editedContent);
    setIsEditing(false);
    toast({
      title: "Changes saved",
      description: "Wiki section has been updated successfully.",
    });
  };

  const handleCancel = () => {
    setEditedContent(section.content);
    setIsEditing(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">{section.title}</h2>
        {!isEditing ? (
          <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
            <Edit2 className="h-4 w-4" />
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={handleCancel}>
              <X className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleSave}>
              <Save className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      
      {isEditing ? (
        <Textarea
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          className="min-h-[200px] font-mono text-sm"
        />
      ) : (
        <div className="whitespace-pre-line text-sm text-muted-foreground">
          {section.content}
        </div>
      )}
    </div>
  );
}