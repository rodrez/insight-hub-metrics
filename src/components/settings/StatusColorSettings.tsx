import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Info, Save } from "lucide-react";
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

const DEFAULT_STATUS_COLORS: StatusColor[] = [
  { id: 'active', name: 'Active Status', color: '#10B981' },
  { id: 'completed', name: 'Completed Status', color: '#3B82F6' },
  { id: 'delayed', name: 'Delayed Status', color: '#F59E0B' },
  { id: 'action-needed', name: 'Action Needed', color: '#991B1B' },
];

export function StatusColorSettings() {
  const [statusColors, setStatusColors] = useState<StatusColor[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Load saved settings on component mount
  useEffect(() => {
    const loadSettings = () => {
      try {
        const saved = localStorage.getItem('projectStatusColors');
        if (saved) {
          setStatusColors(JSON.parse(saved));
        } else {
          setStatusColors(DEFAULT_STATUS_COLORS);
        }
      } catch (error) {
        console.error('Error loading status colors:', error);
        setStatusColors(DEFAULT_STATUS_COLORS);
        toast({
          title: "Error loading settings",
          description: "Failed to load saved settings. Default values restored.",
          variant: "destructive",
        });
      }
      setHasLoaded(true);
    };

    loadSettings();
  }, []);

  // Auto-save settings whenever they change (but only after initial load)
  useEffect(() => {
    if (hasLoaded) {
      try {
        localStorage.setItem('projectStatusColors', JSON.stringify(statusColors));
      } catch (error) {
        console.error('Error saving status colors:', error);
        toast({
          title: "Error saving settings",
          description: "Failed to save settings. Changes may not persist.",
          variant: "destructive",
        });
      }
    }
  }, [statusColors, hasLoaded]);

  const handleColorChange = (id: string, color: string) => {
    setStatusColors(prev => 
      prev.map(s => s.id === id ? { ...s, color } : s)
    );
  };

  const resetToDefaults = () => {
    setStatusColors(DEFAULT_STATUS_COLORS);
    toast({
      title: "Settings reset",
      description: "Color settings have been reset to default values.",
    });
  };

  const saveSettings = () => {
    try {
      localStorage.setItem('projectStatusColors', JSON.stringify(statusColors));
      toast({
        title: "Settings saved",
        description: "Your color settings have been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error saving settings",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
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
        <div className="flex gap-2">
          <Button variant="outline" onClick={resetToDefaults}>
            Reset to Defaults
          </Button>
          <Button onClick={saveSettings}>
            <Save className="mr-2 h-4 w-4" />
            Save Settings
          </Button>
        </div>
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
      </div>
    </div>
  );
}