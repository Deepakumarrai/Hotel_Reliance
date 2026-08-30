export interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  category: "hotel" | "rooms" | "restaurant" | "banquet" | "places";
  title?: string;
}
