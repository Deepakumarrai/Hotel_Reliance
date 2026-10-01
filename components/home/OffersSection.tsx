"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { offersData } from "@/data/offers";

export function OffersSection() {
  const featured = offersData.slice(0, 3);

  return (
    <section className="bg-[#FAFAF8] py-20 sm:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14 sm:mb-18">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[10px] sm:text-[11px] font-sans font-semibold tracking-[0.35em] uppercase text-[#BA8B32] block mb-3">
              Special Offers
            </span>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif font-light text-[#111E31] tracking-[-0.02em] leading-[1.05]">
              Curated just{" "}
              <em className="italic text-[#BA8B32]">for you.</em>
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-sm sm:text-base text-stone-500 max-w-sm leading-[1.8] font-sans font-light md:text-right"
          >
            Dive into curated stay experiences, corporate privileges, and grand celebration packages.
          </motion.p>
        </div>

        {/* Offer cards */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.1 } },
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
        >
          {featured.map((offer) => (
            <motion.div
              key={offer.id}
              variants={{
                hidden: { opacity: 0, y: 24 },
                show: { opacity: 1, y: 0, transition: { duration: 0.55 } },
              }}
            >
              <Link href="/offers" className="group block">
                <div className="bg-white hover:shadow-[0_20px_60px_rgba(17,30,49,0.10)] border border-stone-100 hover:border-[#BA8B32]/25 rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-400 cursor-pointer">
                  {/* Image */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
                    <Image
                      src={offer.image}
                      alt={offer.title}
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    {/* Discount pill */}
                    <div className="absolute top-3 right-3 bg-[#111E31]/80 backdrop-blur-md rounded-full px-3 py-1 border border-white/10">
                      <span className="text-[9px] font-serif uppercase tracking-widest text-[#D8B875]">
                        {offer.discountValue}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 sm:p-6">
                    <h3 className="text-[14px] sm:text-[15px] font-semibold text-[#111E31] group-hover:text-[#BA8B32] transition-colors duration-300 mb-1.5">
                      {offer.title}
                    </h3>
                    <p className="text-[12px] text-stone-400 font-sans font-light leading-relaxed line-clamp-2">
                      {offer.description}
                    </p>
                    <div className="flex items-center space-x-1.5 mt-4 text-[#BA8B32] group-hover:text-[#A67B22] transition-colors duration-300">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.1em]">Explore Package</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex justify-center mt-12 sm:mt-14"
        >
          <Link href="/offers">
            <button className="group flex items-center space-x-2.5 px-8 py-3.5 rounded-full border border-[#111E31]/20 text-[#111E31] hover:bg-[#111E31] hover:text-white text-[12px] font-semibold tracking-[0.1em] uppercase transition-all duration-300 cursor-pointer">
              <span>View All Packages</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
