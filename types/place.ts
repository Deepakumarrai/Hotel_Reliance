export interface PlaceHighlight {
  title: string;
  description: string;
}

export interface Place {
  id: string;
  slug: string;
  name: string;
  tagline?: string;
  description: string;
  distance: string; // Distance from hotel (e.g. "5 km")
  category: "Nature" | "Industrial" | "Shopping" | "Religious" | "Recreation" | "Other";
  image: string;
  hoverImage?: string; // Optional interactive hover transformation image (e.g. Day to Sunset/Night)
  hoverLabel?: string; // Optional custom text for hover state (e.g. "Sunset Lake View", "Evening Illumination")
  establishedYear?: string;
  founder?: string;
  timings?: string;
  entryFee?: string;
  bestTime?: string;
  address?: string;
  history?: string[];
  highlights?: PlaceHighlight[];
  visitorTips?: string[];
  gallery?: string[];
}
