"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError("Please enter your registered email address.");
      return;
    }

    setIsLoading(true);
    // Simulate frontend password reset dispatch
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white border border-border-custom shadow-2xl p-8 sm:p-10 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-[10px] font-bold tracking-[0.25em] text-gold uppercase">
            ACCOUNT RECOVERY
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif text-dark">
            Forgot Password
          </h1>
          <p className="text-xs text-muted font-light leading-relaxed">
            Enter your registered email address to receive password reset instructions.
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-red-50 border border-red-300 text-red-700 text-xs flex items-center space-x-2"
          >
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        {isSubmitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 bg-cream border border-gold/40 text-center space-y-4"
          >
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-serif text-dark font-semibold">
                Reset Link Dispatched
              </h3>
              <p className="text-xs text-muted leading-relaxed font-light">
                Password reset instructions and a secure authorization link have been sent to{" "}
                <strong className="text-dark font-medium">{email}</strong>.
              </p>
            </div>
            <div className="pt-2">
              <Link href="/auth/sign-in">
                <Button variant="primary" fullWidth size="sm" className="uppercase text-xs tracking-wider">
                  Back to Sign In
                </Button>
              </Link>
            </div>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold tracking-wider text-muted block">
                Registered Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-muted absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. demo@example.com"
                  required
                  className="w-full bg-cream/40 border border-border-custom pl-9 pr-3 py-2.5 text-xs text-dark focus:border-gold focus:outline-none"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={isLoading}
              className="py-3 text-xs tracking-widest font-bold uppercase"
            >
              {isLoading ? "Sending Link..." : "Send Reset Link"}
            </Button>
          </form>
        )}

        <div className="text-center pt-2 border-t border-border-custom">
          <Link
            href="/auth/sign-in"
            className="inline-flex items-center text-xs font-semibold text-muted hover:text-dark uppercase tracking-wider transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
