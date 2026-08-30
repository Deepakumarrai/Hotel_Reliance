import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "gold";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  fullWidth?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  children,
  className,
  fullWidth = false,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-medium tracking-wider uppercase transition-all duration-200 focus:outline-none cursor-pointer border",
        // Variants
        variant === "primary" && "bg-primary border-primary text-white hover:bg-primary-dark hover:border-primary-dark shadow-sm active:scale-[0.98]",
        variant === "secondary" && "bg-cream border-border-custom text-dark hover:bg-white hover:border-dark active:scale-[0.98]",
        variant === "outline" && "bg-transparent border-primary text-primary hover:bg-primary hover:text-white active:scale-[0.98]",
        variant === "gold" && "bg-gold border-gold text-white hover:bg-opacity-95 active:scale-[0.98]",
        // Sizes
        size === "sm" && "px-3 py-1.5 text-xs font-semibold",
        size === "md" && "px-5 py-2.5 text-xs font-semibold",
        size === "lg" && "px-7 py-3.5 text-sm font-semibold",
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
