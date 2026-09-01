import { Place } from "@/types/place";

export const placesData: Place[] = [
  {
    id: "bokaro-steel-plant",
    name: "Bokaro Steel Plant (SAIL)",
    description: "One of India's largest integrated steel plants. Experience the golden morning skyline and hover to witness its magnificent evening illumination.",
    distance: "5 km from hotel",
    category: "Industrial",
    image: "/images/places/steel-plant-day.png", // Default morning view
    hoverImage: "/images/places/steel-plant-night.png", // Interactive evening view on hover
    hoverLabel: "Evening Illumination"
  },
  {
    id: "city-park",
    name: "City Park",
    description: "A scenic, tranquil oasis featuring a large artificial lake, manicured palm promenades, and picturesque blue bridges that glow at golden hour.",
    distance: "3 km from hotel",
    category: "Nature",
    image: "/images/places/city-park-day.png", // Daytime view
    hoverImage: "/images/places/city-park-sunset.png", // Sunset/Golden hour view on hover
    hoverLabel: "Golden Sunset View"
  },
  {
    id: "jagannath-temple",
    name: "Jagannath Temple Bokaro",
    description: "A breathtaking architectural replica of the sacred Puri Jagannath Temple. Hover to explore the intricately carved sandstone sanctum, shrines, and darshan courtyard.",
    distance: "4 km from hotel",
    category: "Religious",
    image: "/images/places/jagannath-temple.png", // Main pristine white marble temple view
    hoverImage: "/images/places/jagannath-temple-hover.png", // Carved sandstone sanctum & courtyard view on hover
    hoverLabel: "Temple Courtyard & Sanctum"
  },
  {
    id: "garga-dam",
    name: "Garga Dam Reservoir",
    description: "A popular scenic river getaway and picnic destination. Hover to watch the thunderous spillway rapids catch the golden rays of sunset.",
    distance: "12 km from hotel",
    category: "Nature",
    image: "/images/places/garga-dam-day.png", // Daytime clear spillway view
    hoverImage: "/images/places/garga-dam-sunset.png", // Golden sunset spillway view on hover
    hoverLabel: "Sunset Spillway View"
  },
  {
    id: "nehru-biological-park",
    name: "Jawaharlal Nehru Biological Park (Bokaro Zoo)",
    description: "Jharkhand's premier zoological park spread across lush greenery. Hover to explore the peaceful deer safari and natural wildlife habitat at golden hour.",
    distance: "6 km from hotel",
    category: "Recreation",
    image: "/images/places/biological-park.png", // Main entrance arch gate
    hoverImage: "/images/places/biological-park-hover.png", // Golden hour deer park habitat on hover
    hoverLabel: "Golden Hour Deer Safari"
  }
];
