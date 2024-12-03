import { useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Edit2, Save, X, ChevronDown } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

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
  const [isOpen, setIsOpen] = useState(false);
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
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center justify-between">
          <CollapsibleTrigger className="flex items-center gap-2 hover:text-primary transition-colors">
            <h2 className="text-2xl font-semibold">{section.title}</h2>
            <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
          </CollapsibleTrigger>
          {!isEditing ? (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsEditing(true)}
              className="text-gray-400 hover:text-green-500 transition-colors"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleCancel}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <X className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleSave}
                className="text-gray-400 hover:text-green-500 transition-colors"
              >
                <Save className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        
        <CollapsibleContent className="mt-4">
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
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}