import { Progress } from "@/components/ui/progress";

interface DataProgressProps {
  isPopulating: boolean;
  progress: number;
}

export function DataProgress({ isPopulating, progress }: DataProgressProps) {
  if (!isPopulating) return null;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>Populating database...</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} className="w-full" />
    </div>
  );
}