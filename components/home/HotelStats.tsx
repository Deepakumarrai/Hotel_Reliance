import React from "react";
import { Container } from "@/components/ui/Container";
import { Sparkles, Utensils, Users, MapPin } from "lucide-react";

const stats = [
  {
    id: 1,
    icon: <Users className="w-8 h-8 text-gold" />,
    value: "45+",
    label: "Guest Rooms & Suites"
  },
  {
    id: 2,
    icon: <Utensils className="w-8 h-8 text-gold" />,
    value: "1",
    label: "Kwality Multi-Cuisine Restaurant"
  },
  {
    id: 3,
    icon: <Sparkles className="w-8 h-8 text-gold" />,
    value: "3",
    label: "Grand Event Spaces"
  },
  {
    id: 4,
    icon: <MapPin className="w-8 h-8 text-gold" />,
    value: "100%",
    label: "Secure Parking & Security"
  }
];

export function HotelStats() {
  return (
    <section className="bg-dark text-white py-16 border-y border-white/5">
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="flex flex-col items-center text-center space-y-3 p-4 border border-white/5 bg-white/[0.02]"
            >
              <div className="p-3 bg-white/5 rounded-full mb-1">
                {stat.icon}
              </div>
              <span className="text-4xl sm:text-5xl font-serif font-bold text-gold">
                {stat.value}
              </span>
              <span className="text-[10px] sm:text-xs uppercase font-bold tracking-widest text-white/70 max-w-[180px]">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
