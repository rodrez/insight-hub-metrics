import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { AgreementSettingsHeader } from "./agreement-warnings/AgreementSettingsHeader";
import { WarningThresholds } from "./agreement-warnings/WarningThresholds";
import { ColorSettings } from "./agreement-warnings/ColorSettings";

type WarningSettings = {
  warningDays: number;
  criticalDays: number;
  warningColor: string;
  criticalColor: string;
};

const DEFAULT_SETTINGS: WarningSettings = {
  warningDays: 180,
  criticalDays: 90,
  warningColor: '#FEF08A',
  criticalColor: '#FCA5A5'
};

export function AgreementWarningSettings() {
  const [settings, setSettings] = useState<WarningSettings>(() => {
    const saved = localStorage.getItem('agreementWarningSettings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  const handleSave = () => {
    localStorage.setItem('agreementWarningSettings', JSON.stringify(settings));
    toast({
      title: "Success",
      description: "Agreement warning settings saved successfully",
    });
  };

  const resetToDefaults = () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.setItem('agreementWarningSettings', JSON.stringify(DEFAULT_SETTINGS));
    toast({
      title: "Settings reset",
      description: "Warning settings have been reset to default values.",
    });
  };

  return (
    <div className="space-y-4">
      <AgreementSettingsHeader onReset={resetToDefaults} onSave={handleSave} />
      
      <div className="grid gap-4">
        <WarningThresholds
          warningDays={settings.warningDays}
          criticalDays={settings.criticalDays}
          onWarningDaysChange={(days) => setSettings({ ...settings, warningDays: days })}
          onCriticalDaysChange={(days) => setSettings({ ...settings, criticalDays: days })}
        />

        <ColorSettings
          warningColor={settings.warningColor}
          criticalColor={settings.criticalColor}
          onWarningColorChange={(color) => setSettings({ ...settings, warningColor: color })}
          onCriticalColorChange={(color) => setSettings({ ...settings, criticalColor: color })}
        />
      </div>
    </div>
  );
}