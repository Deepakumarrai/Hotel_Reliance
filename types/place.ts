export interface Place {
  id: string;
  name: string;
  description: string;
  distance: string; // Distance from hotel (e.g. "5 km")
  category: "Nature" | "Industrial" | "Shopping" | "Religious" | "Recreation" | "Other";
  image: string;
}
