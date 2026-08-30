import React from "react";
import { cn } from "@/lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  clean?: boolean;
}

export function Container({ children, className, clean = false }: ContainerProps) {
  return (
    <div
      className={cn(
        !clean && "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full",
        className
      )}
    >
      {children}
    </div>
  );
}
