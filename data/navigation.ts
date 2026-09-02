import { NavigationItem } from "@/types";

export const headerNavigation: NavigationItem[] = [
  { name: "HOME", path: "/" },
  { name: "ROOMS", path: "/rooms" },
  { name: "ABOUT US", path: "/about" },
  { name: "BANQUET", path: "/banquet" },
  { name: "RESTAURANT", path: "/restaurant" },
  { name: "GALLERY", path: "/gallery" },
  { name: "OFFERS", path: "/offers" },
  { name: "PLACES", path: "/places" },
  { name: "CONTACT US", path: "/contact" }
];

export const footerQuickLinks: NavigationItem[] = [
  { name: "About Hotel", path: "/about" },
  { name: "Rooms & Suites", path: "/rooms" },
  { name: "Photo Gallery", path: "/gallery" },
  { name: "Special Offers", path: "/offers" },
  { name: "Kwality Restaurant", path: "/restaurant" },
  { name: "Banquet & Events", path: "/banquet" },
  { name: "Local Attractions", path: "/places" },
  { name: "FAQs", path: "/faq" },
  { name: "Hotel Policies", path: "/policies" },
  { name: "Contact Us", path: "/contact" }
];

export const footerLegalLinks: NavigationItem[] = [
  { name: "Hotel Policies", path: "/policies" },
  { name: "Privacy Policy", path: "/privacy-policy" },
  { name: "Terms & Conditions", path: "/terms-and-conditions" }
];
