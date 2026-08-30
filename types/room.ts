export interface Room {
  id: string;
  slug: string;
  name: string;
  description: string;
  longDescription?: string;
  images: string[];
  amenities: string[];
  occupancy: number;
  bedType: string;
  price: number | null; // Null representing Price on Request
  featured?: boolean;
  size?: string;
  view?: string;
}
