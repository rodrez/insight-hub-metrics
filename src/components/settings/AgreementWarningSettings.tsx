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

type WarningSettings = {
  warningDays: number;
  criticalDays: number;
  warningColor: string;
  criticalColor: string;
};

export function AgreementWarningSettings() {
  const [settings, setSettings] = useState<WarningSettings>(() => {
    const saved = localStorage.getItem('agreementWarningSettings');
    return saved ? JSON.parse(saved) : {
      warningDays: 180,
      criticalDays: 90,
      warningColor: '#FEF08A',
      criticalColor: '#FCA5A5'
    };
  });

  const handleSave = () => {
    localStorage.setItem('agreementWarningSettings', JSON.stringify(settings));
    toast({
      title: "Success",
      description: "Agreement warning settings saved successfully",
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium flex items-center gap-2">
        Agreement Warning Settings
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
      </h3>
      
      <div className="grid gap-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="text-sm text-muted-foreground flex items-center gap-2">
              Warning Threshold (days)
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Agreements will show a warning when expiring within this many days</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </label>
            <Input
              type="number"
              value={settings.warningDays}
              onChange={(e) => setSettings({ ...settings, warningDays: Number(e.target.value) })}
            />
          </div>
          <div className="flex-1">
            <label className="text-sm text-muted-foreground">Warning Color</label>
            <div className="flex gap-4 items-center">
              <Input
                type="color"
                value={settings.warningColor}
                onChange={(e) => setSettings({ ...settings, warningColor: e.target.value })}
                className="w-20 h-10"
              />
              <div
                className="w-10 h-10 rounded border"
                style={{ backgroundColor: settings.warningColor }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="text-sm text-muted-foreground flex items-center gap-2">
              Critical Threshold (days)
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Agreements will show a critical warning when expiring within this many days</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </label>
            <Input
              type="number"
              value={settings.criticalDays}
              onChange={(e) => setSettings({ ...settings, criticalDays: Number(e.target.value) })}
            />
          </div>
          <div className="flex-1">
            <label className="text-sm text-muted-foreground">Critical Color</label>
            <div className="flex gap-4 items-center">
              <Input
                type="color"
                value={settings.criticalColor}
                onChange={(e) => setSettings({ ...settings, criticalColor: e.target.value })}
                className="w-20 h-10"
              />
              <div
                className="w-10 h-10 rounded border"
                style={{ backgroundColor: settings.criticalColor }}
              />
            </div>
          </div>
        </div>

        <Button onClick={handleSave}>Save Settings</Button>
      </div>
    </div>
  );
}