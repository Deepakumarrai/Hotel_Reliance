export * from "./room";
export * from "./booking";
export * from "./facility";
export * from "./place";
export * from "./gallery";
export * from "./auth";

export interface Offer {
  id: string;
  title: string;
  description: string;
  discountCode: string;
  discountValue: string; // e.g., "15% OFF" or "Complimentary Breakfast"
  expiryDate: string;
  image: string;
  featured?: boolean;
  category?: "Staycation" | "Corporate" | "Wedding & Banquet" | "Dining" | "Seasonal";
  inclusions?: string[];
  terms?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role?: string;
  location?: string;
  rating: number; // 1-5
  comment: string;
  avatar?: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category?: "General" | "Booking & Tariff" | "Dining & Kwality" | "Banquets & Events" | "Amenities & Services";
}

export interface NavigationItem {
  name: string;
  path: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  department: string;
  bio: string;
  image: string;
  experience?: string;
}

export interface PolicySection {
  id: string;
  title: string;
  iconName: string;
  summary: string;
  rules: string[];
}
