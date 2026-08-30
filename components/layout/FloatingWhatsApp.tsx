"use client";

import React from "react";
import { HOTEL_INFO } from "@/lib/constants";

export function FloatingWhatsApp() {
  const message = encodeURIComponent(
    "Hello! I am visiting the Hotel Reliance website and would like to make an enquiry about room bookings or event services."
  );
  const waLink = `https://wa.me/${HOTEL_INFO.whatsapp.number}?text=${message}`;

  return (
    <a
      href={waLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-40 bg-[#25D366] hover:bg-[#20BA56] text-white p-3.5 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-[#25D366]/40 cursor-pointer active:scale-95 group"
      aria-label="Contact Hotel Reliance on WhatsApp"
    >
      <svg
        className="w-6 h-6 fill-current"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.003 5.37 5.378.003 12.003.003c3.21 0 6.225 1.249 8.49 3.52 2.26 2.27 3.504 5.29 3.504 8.502 0 6.626-5.375 11.996-12 11.996-2.01 0-3.992-.505-5.747-1.467L0 24zm6.59-4.846c1.666.988 3.308 1.488 4.968 1.49 5.425 0 9.84-4.39 9.844-9.78.002-2.61-1.01-5.06-2.852-6.907C16.806 2.11 14.36 1.1 11.79 1.1c-5.43 0-9.846 4.394-9.85 9.784-.001 1.782.493 3.504 1.43 5.086L2.33 21.6l5.728-1.5.589.354z" />
      </svg>
      {/* Tooltip */}
      <span className="absolute left-14 bg-dark text-white text-[10px] tracking-wider uppercase font-bold py-1 px-3 border border-white/10 shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        Chat With Us
      </span>
    </a>
  );
}
