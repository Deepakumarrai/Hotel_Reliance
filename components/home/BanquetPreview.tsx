import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

export function BanquetPreview() {
  return (
    <section className="py-20 bg-white border-t border-border-custom overflow-hidden">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Text Layout */}
          <div className="lg:col-span-6 space-y-6">
            <SectionHeading
              title="Perfect Venues for Grand Events"
              subtitle="BANQUETS & CELEBRATIONS"
              align="left"
              className="mb-6"
            />
            <p className="text-sm text-muted leading-relaxed font-light">
              From corporate retreats and board meetings to grand wedding receptions and anniversary parties, Hotel Reliance houses versatile hosting configurations designed to match your criteria. 
            </p>
            <p className="text-sm text-muted leading-relaxed font-light">
              Choose between our spacious indoor **Banquet Hall** equipped with modern audio-visual media, our executive **Meeting Rooms** for confidential board discussions, or our grand **Outdoor Celebration Lawn** that accommodates extensive wedding gatherings in Bokaro Steel City.
            </p>

            <div className="pt-4">
              <Link href="/banquet">
                <Button variant="primary" size="md">
                  Explore Venues
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column: Image Layout */}
          <div className="lg:col-span-6 relative">
            <div className="absolute -inset-4 border-2 border-gold/15 -z-10 translate-x-2 translate-y-2 hidden sm:block" />
            <div className="image-zoom-hover border border-border-custom shadow-xl">
              <Image
                src="/images/banquet/hall-main.jpg"
                alt="Hotel Reliance Banquet Hall Event Setup"
                width={600}
                height={400}
                className="w-full h-[400px] object-cover"
                loading="lazy"
              />
            </div>
            {/* Event badge tag */}
            <div className="absolute bottom-6 left-6 bg-white border border-border-custom px-6 py-4 shadow-lg flex items-center space-x-3 z-20">
              <Sparkles className="w-5 h-5 text-primary" />
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-muted block">
                  Event Hosting
                </span>
                <span className="text-xs font-serif font-bold text-dark block mt-0.5">
                  Spacious Venues
                </span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
