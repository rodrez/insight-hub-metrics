import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type StatusColor = {
  id: string;
  name: string;
  color: string;
};

export function StatusColorSettings() {
  const [statusColors, setStatusColors] = useState<StatusColor[]>(() => {
    const saved = localStorage.getItem('projectStatusColors');
    return saved ? JSON.parse(saved) : [
      { id: 'active', name: 'Active Status', color: '#10B981' },
      { id: 'completed', name: 'Completed Status', color: '#3B82F6' },
      { id: 'delayed', name: 'Delayed Status', color: '#F59E0B' },
      { id: 'action-needed', name: 'Action Needed', color: '#991B1B' },
    ];
  });

  const handleColorChange = (id: string, color: string) => {
    setStatusColors(prev => 
      prev.map(s => s.id === id ? { ...s, color } : s)
    );
  };

  const saveColors = () => {
    localStorage.setItem('projectStatusColors', JSON.stringify(statusColors));
    toast({
      title: "Colors saved",
      description: "Your status color settings have been saved successfully.",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-medium">Project Status Colors</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Configure colors for different project statuses</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="space-y-4">
        {statusColors.map((status) => (
          <div key={status.id} className="flex items-center gap-4">
            <span className="w-32">{status.name}</span>
            <Input
              type="color"
              value={status.color}
              onChange={(e) => handleColorChange(status.id, e.target.value)}
              className="w-20 h-10"
            />
            <div 
              className="w-20 h-10 rounded"
              style={{ backgroundColor: status.color }}
            />
          </div>
        ))}
        <Button onClick={saveColors} className="mt-4">
          Save Colors
        </Button>
      </div>
    </div>
  );
}