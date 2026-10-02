"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface PageHeroProps {
  title: string;
  titleAccent?: string; // italic gold part
  subtitle?: string;
  image: string;
  imageAlt: string;
  label?: string;      // small top label e.g. "Our Story"
  height?: "md" | "lg"; // default lg
}

export function PageHero({
  title,
  titleAccent,
  subtitle,
  image,
  imageAlt,
  label,
  height = "lg",
}: PageHeroProps) {
  return (
    <section
      className={`relative w-full overflow-hidden bg-[#080C14] flex flex-col justify-end ${
        height === "lg"
          ? "min-h-[500px] sm:min-h-[560px] h-[60vh] sm:h-[68vh] max-h-[800px]"
          : "min-h-[440px] sm:min-h-[480px] h-[52vh] sm:h-[58vh] max-h-[620px]"
      }`}
    >
      {/* Background image */}
      <Image
        src={image}
        alt={imageAlt}
        fill
        priority
        unoptimized
        sizes="100vw"
        className="object-cover object-center opacity-55"
      />

      {/* Layered gradients for cinematic depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#080C14] via-[#080C14]/35 to-[#080C14]/65" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#080C14]/50 via-transparent to-transparent" />

      {/* Noise grain texture */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }}
      />

      {/* Content with safe clearance for fixed navbar (navbar takes top 0-80px) */}
      <div className="relative z-10 w-full min-h-full flex flex-col justify-end pt-28 sm:pt-36 lg:pt-40 pb-12 sm:pb-16">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-8 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {label && (
              <span className="block text-[10px] sm:text-[11px] font-sans font-semibold tracking-[0.35em] uppercase text-[#BA8B32] mb-3 sm:mb-4">
                {label}
              </span>
            )}
            <h1 className="text-3xl xs:text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-light text-white tracking-[-0.02em] leading-[1.02] break-words">
              {title}
              {titleAccent && (
                <>
                  {" "}
                  <em className="italic text-[#D8B875]">{titleAccent}</em>
                </>
              )}
            </h1>
            {subtitle && (
              <p className="mt-4 sm:mt-5 text-sm sm:text-base text-white/60 font-sans font-light max-w-xl leading-[1.8]">
                {subtitle}
              </p>
            )}
          </motion.div>

          {/* Bottom hairline */}
          <div className="mt-8 sm:mt-10 w-12 h-px bg-[#BA8B32]" />
        </div>
      </div>
    </section>
  );
}
