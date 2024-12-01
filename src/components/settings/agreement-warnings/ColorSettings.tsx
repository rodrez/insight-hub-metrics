import { Input } from "@/components/ui/input";

interface ColorSettingsProps {
  warningColor: string;
  criticalColor: string;
  onWarningColorChange: (color: string) => void;
  onCriticalColorChange: (color: string) => void;
}

export function ColorSettings({
  warningColor,
  criticalColor,
  onWarningColorChange,
  onCriticalColorChange,
}: ColorSettingsProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex-1">
        <label className="text-sm text-muted-foreground">Warning Color</label>
        <div className="flex gap-4 items-center">
          <Input
            type="color"
            value={warningColor}
            onChange={(e) => onWarningColorChange(e.target.value)}
            className="w-20 h-10"
          />
          <div
            className="w-10 h-10 rounded border"
            style={{ backgroundColor: warningColor }}
          />
        </div>
      </div>
      <div className="flex-1">
        <label className="text-sm text-muted-foreground">Critical Color</label>
        <div className="flex gap-4 items-center">
          <Input
            type="color"
            value={criticalColor}
            onChange={(e) => onCriticalColorChange(e.target.value)}
            className="w-20 h-10"
          />
          <div
            className="w-10 h-10 rounded border"
            style={{ backgroundColor: criticalColor }}
          />
        </div>
      </div>
    </div>
  );
}