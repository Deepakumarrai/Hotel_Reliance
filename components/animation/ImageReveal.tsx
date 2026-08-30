"use client";

import React from "react";
import { motion } from "framer-motion";

interface ImageRevealProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  className?: string;
}

export function ImageReveal({
  children,
  duration = 1.2,
  delay = 0,
  className
}: ImageRevealProps) {
  return (
    <motion.div
      initial={{ clipPath: "inset(0 100% 0 0)" }}
      whileInView={{ clipPath: "inset(0 0 0 0)" }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
