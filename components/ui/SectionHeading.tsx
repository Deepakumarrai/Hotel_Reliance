import React from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
  className?: string;
}

export function SectionHeading({
  title,
  subtitle,
  align = "center",
  className
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-10 animate-fade-in",
        align === "center" && "text-center",
        align === "left" && "text-left",
        align === "right" && "text-right",
        className
      )}
    >
      {subtitle && (
        <span className="text-xs uppercase tracking-[0.2em] text-gold font-bold block mb-3">
          {subtitle}
        </span>
      )}
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal text-dark leading-tight">
        {title}
      </h2>
      <div
        className={cn(
          "w-16 h-[2px] bg-gold mt-4",
          align === "center" && "mx-auto",
          align === "right" && "ml-auto"
        )}
      />
    </div>
  );
}
