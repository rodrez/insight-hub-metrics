import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => {
  const [activeColor, setActiveColor] = React.useState('#10B981'); // Default color

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem('projectStatusColors');
      if (saved) {
        const colors = JSON.parse(saved);
        const activeStatus = colors.find((c: any) => c.id === 'active');
        if (activeStatus?.color) {
          setActiveColor(activeStatus.color);
        }
      }
    } catch (error) {
      console.error('Error loading status colors:', error);
    }
  }, []);

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className="h-full w-full flex-1 transition-all"
        style={{ 
          transform: `translateX(-${100 - (value || 0)}%)`,
          backgroundColor: activeColor
        }}
      />
    </ProgressPrimitive.Root>
  );
})
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }