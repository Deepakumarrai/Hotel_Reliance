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
  discountValue: string; // e.g., "15% OFF" or "Flat ₹1000 OFF"
  expiryDate: string;
  image: string;
  featured?: boolean;
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
  category?: string;
}

export interface NavigationItem {
  name: string;
  path: string;
}
