"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

export function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 30, stiffness: 300 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Disable completely on touch devices
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    if (isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Search for any parent containing the view trigger tag
      const hasTrigger = target.closest('[data-custom-cursor="view"]');
      
      if (hasTrigger) {
        setIsVisible(true);
        mouseX.set(e.clientX - 32); // Offset to center 64px circle
        mouseY.set(e.clientY - 32);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mouseX, mouseY]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          style={{
            left: cursorX,
            top: cursorY,
          }}
          className="fixed pointer-events-none z-[9999] w-16 h-16 rounded-full border border-gold bg-primary/20 backdrop-blur-[1px] flex items-center justify-center text-[9px] uppercase font-bold tracking-widest text-gold select-none font-sans"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          View
        </motion.div>
      )}
    </AnimatePresence>
  );
}
