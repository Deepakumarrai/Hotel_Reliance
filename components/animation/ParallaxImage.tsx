"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ParallaxImageProps {
  children: React.ReactNode;
  offset?: number;
  className?: string;
}

export function ParallaxImage({
  children,
  offset = 30,
  className
}: ParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track relative scroll position of target container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Transform scroll position to vertical y shift
  const y = useTransform(scrollYProgress, [0, 1], [-offset, offset]);

  return (
    <div ref={containerRef} className={`overflow-hidden relative ${className}`}>
      <motion.div style={{ y }} className="w-full h-full scale-110">
        {children}
      </motion.div>
    </div>
  );
}
