"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { IconButton } from "./IconButton";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-dark/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Content Container */}
      <div className="relative w-full max-w-2xl bg-white shadow-2xl z-10 overflow-hidden animate-fade-in flex flex-col max-h-[90vh] border border-border-custom">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-custom bg-cream">
          {title ? (
            <h3 className="text-xl font-normal text-dark font-serif">{title}</h3>
          ) : (
            <div />
          )}
          <IconButton
            onClick={onClose}
            aria-label="Close modal"
            className="border-none bg-transparent hover:bg-dark/5 p-1 text-dark"
          >
            <X className="w-5 h-5" />
          </IconButton>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}
