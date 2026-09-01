export interface Place {
  id: string;
  name: string;
  description: string;
  distance: string; // Distance from hotel (e.g. "5 km")
  category: "Nature" | "Industrial" | "Shopping" | "Religious" | "Recreation" | "Other";
  image: string;
  hoverImage?: string; // Optional interactive hover transformation image (e.g. Day to Sunset/Night)
  hoverLabel?: string; // Optional custom text for hover state (e.g. "Sunset Lake View", "Evening Illumination")
}
