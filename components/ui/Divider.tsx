import React from "react";
import { cn } from "@/lib/utils";

interface DividerProps {
  className?: string;
  vertical?: boolean;
}

export function Divider({ className, vertical = false }: DividerProps) {
  return (
    <div
      className={cn(
        vertical ? "w-[1.5px] bg-border-custom h-full self-stretch" : "h-[1.5px] bg-border-custom w-full",
        className
      )}
    />
  );
}
