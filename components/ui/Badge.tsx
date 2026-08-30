import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "gold" | "outline";
  className?: string;
}

export function Badge({ children, variant = "primary", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 text-[10px] font-bold uppercase tracking-widest border rounded-full",
        variant === "primary" && "bg-primary/5 border-primary/20 text-primary",
        variant === "secondary" && "bg-muted/5 border-muted/20 text-muted",
        variant === "gold" && "bg-gold/5 border-gold/20 text-gold",
        variant === "outline" && "bg-transparent border-border-custom text-dark",
        className
      )}
    >
      {children}
    </span>
  );
}
