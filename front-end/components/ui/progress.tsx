"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & { 
    color?: string;
  }
>(({ className, value, color, ...props }, ref) => {
  const indicatorStyle = React.useMemo(() => {
    const style: React.CSSProperties = { 
      transform: `translateX(-${100 - (value || 0)}%)`,
    };
    
    if (color) {
      style.backgroundColor = color;
    }
    
    return style;
  }, [value, color]);
  
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
        className="h-full w-full flex-1 bg-primary transition-all"
        style={indicatorStyle}
      />
    </ProgressPrimitive.Root>
  );
})
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
