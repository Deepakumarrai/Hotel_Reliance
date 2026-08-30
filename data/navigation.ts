import { NavigationItem } from "@/types";

export const headerNavigation: NavigationItem[] = [
  { name: "HOME", path: "/" },
  { name: "ROOMS", path: "/rooms" },
  { name: "ABOUT US", path: "/about" },
  { name: "OUR BANQUET", path: "/banquet" },
  { name: "OUR RESTAURANT", path: "/restaurant" },
  { name: "PLACES", path: "/places" },
  { name: "CONTACT US", path: "/contact" }
];

export const footerQuickLinks: NavigationItem[] = [
  { name: "About Us", path: "/about" },
  { name: "Our Rooms", path: "/rooms" },
  { name: "Kwality Restaurant", path: "/restaurant" },
  { name: "Our Banquet", path: "/banquet" },
  { name: "Local Attractions", path: "/places" },
  { name: "Contact & Location", path: "/contact" }
];
