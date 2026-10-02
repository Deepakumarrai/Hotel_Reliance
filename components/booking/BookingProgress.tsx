import React from "react";
import { Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookingProgressProps {
  currentStep: number;
}

const steps = [
  { step: 1, name: "Room & Dates", subtitle: "Select your stay" },
  { step: 2, name: "Guest Details", subtitle: "Personalize request" },
  { step: 3, name: "Payment & Review", subtitle: "Instant confirmation" },
];

export function BookingProgress({ currentStep }: BookingProgressProps) {
  return (
    <div className="w-full border-t border-white/10 bg-white/[0.04] backdrop-blur-md select-none py-4 sm:py-5">
      <div className="max-w-4xl mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between relative">
          {/* Background connecting track */}
          <div className="absolute top-1/2 left-8 right-8 -translate-y-1/2 h-[2px] bg-white/15 -z-0 hidden sm:block" />

          {/* Active progress fill */}
          <div
            className="absolute top-1/2 left-8 -translate-y-1/2 h-[2px] bg-gradient-to-r from-[#D8B875] to-[#BA8B32] -z-0 transition-all duration-500 ease-out hidden sm:block"
            style={{
              width: `${((currentStep - 1) / (steps.length - 1)) * 82}%`,
            }}
          />

          {steps.map((s) => {
            const isCompleted = currentStep > s.step;
            const isActive = currentStep === s.step;

            return (
              <div
                key={s.step}
                className="flex flex-col items-center text-center relative z-10 gap-1 sm:gap-2 flex-1"
              >
                {/* Step Circle Indicator */}
                <div
                  className={cn(
                    "w-7 h-7 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-sans font-bold transition-all duration-300 shadow-sm flex-shrink-0",
                    isCompleted &&
                      "bg-[#BA8B32] text-white ring-4 ring-[#BA8B32]/20 shadow-[0_0_15px_rgba(186,139,50,0.4)]",
                    isActive &&
                      "bg-white text-[#111E31] ring-4 ring-white/20 scale-105 shadow-[0_0_20px_rgba(255,255,255,0.3)]",
                    !isActive &&
                      !isCompleted &&
                      "bg-white/10 text-white/50 border border-white/15 backdrop-blur-xs"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
                  ) : (
                    <span>0{s.step}</span>
                  )}
                </div>

                {/* Step Label */}
                <div className="text-center w-full px-0.5">
                  <span
                    className={cn(
                      "text-[9.5px] sm:text-xs font-sans uppercase tracking-wider sm:tracking-[0.16em] block transition-colors leading-tight",
                      isActive
                        ? "text-white font-semibold"
                        : isCompleted
                        ? "text-[#D8B875] font-medium"
                        : "text-white/40 font-normal"
                    )}
                  >
                    {s.name}
                  </span>
                  <span
                    className={cn(
                      "text-[10px] font-sans font-light hidden sm:block mt-0.5",
                      isActive ? "text-white/70" : "text-white/30"
                    )}
                  >
                    {s.subtitle}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

