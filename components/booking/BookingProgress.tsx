import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookingProgressProps {
  currentStep: number;
}

const steps = [
  { step: 1, name: "Stay Details" },
  { step: 2, name: "Choose Room" },
  { step: 3, name: "Guest Details" },
  { step: 4, name: "Confirm" }
];

export function BookingProgress({ currentStep }: BookingProgressProps) {
  return (
    <div className="w-full py-4 border-b border-border-custom bg-white shadow-sm mb-10 select-none">
      <div className="max-w-4xl mx-auto px-4 flex items-center justify-between relative">
        
        {/* Progress bar background */}
        <div className="absolute top-[35px] left-10 right-10 h-[2px] bg-border-custom -z-10 hidden sm:block" />
        
        {/* Active Progress bar indicator */}
        <div
          className="absolute top-[35px] left-10 h-[2px] bg-gold -z-10 transition-all duration-500 hidden sm:block"
          style={{
            width: `${((currentStep - 1) / (steps.length - 1)) * 80}%`
          }}
        />

        {steps.map((s) => {
          const isCompleted = currentStep > s.step;
          const isActive = currentStep === s.step;

          return (
            <div key={s.step} className="flex flex-col items-center flex-1 text-center relative">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2 text-xs font-bold transition-all duration-300",
                  isCompleted && "bg-gold border-gold text-white",
                  isActive && "bg-primary border-primary text-white scale-110 shadow-md",
                  !isActive && !isCompleted && "bg-white border-border-custom text-muted"
                )}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : s.step}
              </div>
              <span
                className={cn(
                  "text-[10px] sm:text-xs font-bold uppercase tracking-wider mt-2 hidden sm:block",
                  isActive ? "text-primary font-extrabold" : "text-muted"
                )}
              >
                {s.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
