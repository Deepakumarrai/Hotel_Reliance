"use client";

import React from "react";
import { motion } from "framer-motion";

interface TextRevealProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  className?: string;
}

export function TextReveal({
  children,
  duration = 0.8,
  delay = 0,
  className
}: TextRevealProps) {
  return (
    <div className="overflow-hidden py-1 w-full">
      <motion.div
        initial={{ y: "100%" }}
        whileInView={{ y: 0 }}
        viewport={{ once: true }}
        transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
        className={className}
      >
        {children}
      </motion.div>
    </div>
  );
}
