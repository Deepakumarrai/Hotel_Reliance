import React from "react";
import { cn } from "@/lib/utils";

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function IconButton({ children, className, ...props }: IconButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center p-2.5 rounded-full border border-border-custom bg-white hover:bg-cream transition-all duration-200 cursor-pointer text-muted hover:text-dark focus:outline-none active:scale-95",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
