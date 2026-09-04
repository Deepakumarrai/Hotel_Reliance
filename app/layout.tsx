import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/AuthContext";
import { GuestLayoutWrapper } from "@/components/layout/GuestLayoutWrapper";
import { hotelData } from "@/data/hotel";

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
  metadataBase: new URL("https://www.hotelreliance.com"),
  title: {
    default: "Hotel Reliance | Luxury Hotel, Restaurant & Banquets in Bokaro Steel City",
    template: "%s | Hotel Reliance Bokaro",
  },
  description:
    "Experience premier luxury hospitality at Hotel Reliance, Bokaro Steel City. Offering 45+ premium rooms, Kwality multi-cuisine restaurant, AC banquet halls, 300+ guest wedding lawn, 24/7 room service & free Wi-Fi.",
  keywords: [
    "Hotel Reliance",
    "Hotel in Bokaro",
    "Bokaro Steel City Hotel",
    "Luxury Hotel Bokaro",
    "Best Hotels in Bokaro Jharkhand",
    "Kwality Restaurant Bokaro",
    "Banquet Hall in Bokaro",
    "Wedding Venue Bokaro",
    "Corporate Hotel Bokaro",
    "Hotel Reliance Co-Operative Colony",
    "Hotels near Bokaro Steel Plant",
    "Bokaro Hotels Booking",
  ],
  authors: [{ name: "Hotel Reliance Hospitality Team", url: "https://www.hotelreliance.com" }],
  creator: "Hotel Reliance",
  publisher: "Hotel Reliance Bokaro",
  formatDetection: {
    telephone: true,
    address: true,
    email: true,
  },
  alternates: {
    canonical: "https://www.hotelreliance.com",
  },
  openGraph: {
    title: "Hotel Reliance | Luxury Hotel, Restaurant & Banquets in Bokaro Steel City",
    description:
      "Book your stay at Hotel Reliance, Bokaro Steel City. Enjoy deluxe rooms, Kwality fine dining restaurant, grand wedding banquets, and 24/7 personalized hospitality.",
    url: "https://www.hotelreliance.com",
    siteName: "Hotel Reliance",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/images/hero/hero-bg.jpg",
        width: 1200,
        height: 630,
        alt: "Hotel Reliance - Luxury Hospitality in Bokaro Steel City",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hotel Reliance | Luxury Hotel & Banquets in Bokaro Steel City",
    description:
      "Boutique luxury lodging, Kwality multi-cuisine dining, and celebration banquets in Bokaro Steel City, Jharkhand.",
    images: ["/images/hero/hero-bg.jpg"],
    creator: "@hotelreliance",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  other: {
    "geo.region": "IN-JH",
    "geo.placename": "Bokaro Steel City",
    "geo.position": "23.6693;86.1511",
    ICBM: "23.6693, 86.1511",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Schema.org JSON-LD for Hotel Reliance
  const hotelSchema = {
    "@context": "https://schema.org",
    "@type": "Hotel",
    name: "Hotel Reliance",
    description: hotelData.description,
    url: "https://www.hotelreliance.com",
    telephone: hotelData.phones[0],
    email: hotelData.emails[0],
    priceRange: "₹2,499 - ₹6,999",
    starRating: {
      "@type": "Rating",
      ratingValue: "4.5",
      bestRating: "5",
    },
    checkinTime: "12:00",
    checkoutTime: "11:00",
    address: {
      "@type": "PostalAddress",
      streetAddress: `${hotelData.address.plotNo}, ${hotelData.address.street}`,
      addressLocality: hotelData.address.city,
      addressRegion: hotelData.address.state,
      postalCode: hotelData.address.pincode,
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 23.6693,
      longitude: 86.1511,
    },
    hasMap: "https://maps.google.com/?q=Hotel+Reliance+Bokaro+Steel+City",
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: "Kwality Multi-Cuisine Restaurant", value: true },
      { "@type": "LocationFeatureSpecification", name: "AC Banquet Hall & Event Lawn", value: true },
      { "@type": "LocationFeatureSpecification", name: "High-Speed Wi-Fi", value: true },
      { "@type": "LocationFeatureSpecification", name: "24/7 Room Service", value: true },
      { "@type": "LocationFeatureSpecification", name: "Free Valet & Self Parking", value: true },
      { "@type": "LocationFeatureSpecification", name: "100% Power Backup", value: true },
    ],
    photo: [
      "https://www.hotelreliance.com/images/gallery/hotel-ext.jpg",
      "https://www.hotelreliance.com/images/gallery/hotel-lobby.jpg",
      "https://www.hotelreliance.com/images/restaurant/image.png",
    ],
  };

  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(hotelSchema) }}
        />
      </head>
      <body className="flex flex-col min-h-screen">
        <AuthProvider>
          <GuestLayoutWrapper>{children}</GuestLayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
