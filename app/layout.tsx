import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";
import { BackToTop } from "@/components/layout/BackToTop";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hotel Reliance | Hotel in Bokaro Steel City",
  description:
    "Hotel Reliance is a 45+ room premium property in Bokaro Steel City with quality restaurant dining, banquet spaces, meeting boardrooms, and outdoor celebration lawns.",
  keywords: [
    "Hotel Reliance",
    "Hotel in Bokaro",
    "Bokaro Steel City Hotel",
    "Kwality Restaurant Bokaro",
    "Banquet Hall Bokaro",
    "Best Hotels in Jharkhand",
  ],
  metadataBase: new URL("https://www.hotelreliance.com"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-[72px] lg:pt-[76px]">{children}</main>
        <Footer />
        <FloatingWhatsApp />
        <BackToTop />
      </body>
    </html>
  );
}
