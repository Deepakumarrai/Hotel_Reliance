"use client";

import React, { useEffect, useRef, useState } from "react";
import { useInView, animate } from "framer-motion";

interface CounterProps {
  value: string;
  duration?: number;
}

export function Counter({ value, duration = 1.2 }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  // Extract number and suffix from string (e.g. "45+" -> 45 and "+", "100%" -> 100 and "%")
  const parsedNumber = parseInt(value.replace(/\D/g, ""), 10) || 0;
  const suffix = value.replace(/\d/g, "");
  
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      let isCancelled = false;
      const controls = animate(0, parsedNumber, {
        duration,
        ease: "easeOut",
        onUpdate(latest) {
          if (!isCancelled) {
            setDisplayValue(Math.round(latest));
          }
        }
      });
      return () => {
        isCancelled = true;
        controls.stop();
      };
    }
  }, [isInView, parsedNumber, duration]);

  return (
    <span ref={ref} className="font-serif">
      {displayValue}
      {suffix}
    </span>
  );
}
