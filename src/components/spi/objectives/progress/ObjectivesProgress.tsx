import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

interface ObjectivesProgressProps {
  completionPercentage: number;
}

export function ObjectivesProgress({ completionPercentage }: ObjectivesProgressProps) {
  const [statusColors, setStatusColors] = useState({
    active: '#10B981'
  });

  useEffect(() => {
    const loadStatusColors = () => {
      const saved = localStorage.getItem('projectStatusColors');
      if (saved) {
        const colors = JSON.parse(saved);
        const activeColor = colors.find((c: any) => c.id === 'active')?.color || '#10B981';
        setStatusColors({
          active: activeColor
        });
      }
    };

    loadStatusColors();
    window.addEventListener('storage', loadStatusColors);
    return () => window.removeEventListener('storage', loadStatusColors);
  }, []);

  return (
    <div className="bg-card rounded-lg p-4 shadow-sm">
      <h3 className="text-lg font-semibold mb-2">Overall Progress</h3>
      <div className="relative">
        <Progress 
          value={completionPercentage} 
          className={`h-2 mb-2 [&>div]:bg-[${statusColors.active}]`}
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.1)'
          }}
        />
      </div>
      <p className="text-sm text-muted-foreground">{completionPercentage.toFixed(0)}% of objectives completed</p>
    </div>
  );
}