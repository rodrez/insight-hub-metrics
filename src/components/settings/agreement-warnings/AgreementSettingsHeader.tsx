import { Button } from "@/components/ui/button";
import { Info, Save } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AgreementSettingsHeaderProps {
  onReset: () => void;
  onSave: () => void;
}

export function AgreementSettingsHeader({ onReset, onSave }: AgreementSettingsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-medium">Agreement Warning Settings</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Configure when and how to display warnings for expiring agreements</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onReset}>
          Reset to Defaults
        </Button>
        <Button onClick={onSave}>
          <Save className="mr-2 h-4 w-4" />
          Save Settings
        </Button>
      </div>
    </div>
  );
}