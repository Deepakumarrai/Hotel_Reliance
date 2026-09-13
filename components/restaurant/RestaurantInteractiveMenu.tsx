"use client";

import React, { useState, useMemo } from "react";
import { Utensils, Sparkles, Search, Flame, Leaf, Award } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface MenuItem {
  id: string;
  name: string;
  category: "tandoor" | "mains" | "biryani" | "chinese" | "breads" | "desserts" | "beverages";
  type: "veg" | "non-veg";
  price: number;
  description: string;
  isChefSpecial?: boolean;
}

const MENU_ITEMS: MenuItem[] = [
  // Tandoor & Starters
  {
    id: "m-1",
    name: "Murgh Malai Tikka",
    category: "tandoor",
    type: "non-veg",
    price: 420,
    description: "Tender boneless chicken marinated in cream, cheese, roasted garlic, cardamom, slow-charred in clay tandoor.",
    isChefSpecial: true
  },
  {
    id: "m-2",
    name: "Tandoori Murgh (Half / Full)",
    category: "tandoor",
    type: "non-veg",
    price: 380,
    description: "Traditional whole chicken marinated in Kashmiri red chili paste, hung curd, and 12-spice garam masala.",
    isChefSpecial: false
  },
  {
    id: "m-3",
    name: "Paneer Tikka Shashlik",
    category: "tandoor",
    type: "veg",
    price: 340,
    description: "Cubes of fresh malai paneer, bell peppers, and red onions marinated in yellow mustard and ajwain, chargrilled.",
    isChefSpecial: true
  },
  {
    id: "m-4",
    name: "Dahi Ke Kebab",
    category: "tandoor",
    type: "veg",
    price: 310,
    description: "Crispy fried patties of hung yoghurt, crushed green chillies, coriander, and roasted gram flour.",
    isChefSpecial: false
  },
  {
    id: "m-5",
    name: "Mutton Galouti Kebab",
    category: "tandoor",
    type: "non-veg",
    price: 490,
    description: "Melt-in-mouth minced mutton patties infused with royal potli masala and rose water, served on mini parathas.",
    isChefSpecial: true
  },

  // Mains
  {
    id: "m-6",
    name: "Paneer Butter Masala",
    category: "mains",
    type: "veg",
    price: 360,
    description: "Fresh cottage cheese cubes cooked in slow-simmered rich makhani gravy enriched with fresh butter and kasuri methi.",
    isChefSpecial: true
  },
  {
    id: "m-7",
    name: "Dal Makhani Kwality Special",
    category: "mains",
    type: "veg",
    price: 310,
    description: "Slow-cooked black lentils simmered overnight on tandoor embers with butter, cream, and sun-dried tomatoes.",
    isChefSpecial: true
  },
  {
    id: "m-8",
    name: "Murgh Butter Masala",
    category: "mains",
    type: "non-veg",
    price: 440,
    description: "Charcoal-roasted chicken simmered in rich creamy tomato and cashew makhani gravy with fenugreek aroma.",
    isChefSpecial: true
  },
  {
    id: "m-9",
    name: "Mutton Rogan Josh",
    category: "mains",
    type: "non-veg",
    price: 520,
    description: "Kashmiri-style tender mutton pieces stewed in ratanjot-infused gravy with whole fennel and dried ginger.",
    isChefSpecial: true
  },
  {
    id: "m-10",
    name: "Kadai Paneer",
    category: "mains",
    type: "veg",
    price: 350,
    description: "Cottage cheese tossed with crunchy bell peppers, coriander seeds, and crushed dry red chillies in onion gravy.",
    isChefSpecial: false
  },

  // Biryani & Rice
  {
    id: "m-11",
    name: "Kwality Special Dum Biryani (Chicken)",
    category: "biryani",
    type: "non-veg",
    price: 420,
    description: "Aged long-grain basmati rice layered with spiced chicken, saffron, fried onions, and slow-cooked on dum in handi.",
    isChefSpecial: true
  },
  {
    id: "m-12",
    name: "Awadhi Gosht Dum Biryani (Mutton)",
    category: "biryani",
    type: "non-veg",
    price: 510,
    description: "Succulent mutton cuts sealed in clay handi with aromatic basmati rice, ittar, kewra water, and mint.",
    isChefSpecial: true
  },
  {
    id: "m-13",
    name: "Subz Dum Biryani",
    category: "biryani",
    type: "veg",
    price: 340,
    description: "Farm-fresh vegetables, paneer cubes, and basmati rice slow-infused with saffron milk and toasted nuts.",
    isChefSpecial: false
  },
  {
    id: "m-14",
    name: "Jeera Rice / Steam Basmati",
    category: "biryani",
    type: "veg",
    price: 180,
    description: "Fragrant basmati rice tempered with roasted cumin seeds and desi ghee.",
    isChefSpecial: false
  },

  // Chinese & Oriental
  {
    id: "m-15",
    name: "Chilli Chicken Dry / Gravy",
    category: "chinese",
    type: "non-veg",
    price: 390,
    description: "Crispy diced chicken wok-tossed with scallions, green chillies, and dark soy sauce.",
    isChefSpecial: false
  },
  {
    id: "m-16",
    name: "Veg Manchurian Gravy",
    category: "chinese",
    type: "veg",
    price: 290,
    description: "Crisp vegetable dumplings in tangy ginger, garlic, and coriander soy sauce.",
    isChefSpecial: false
  },
  {
    id: "m-17",
    name: "Hakka Noodles (Veg / Chicken)",
    category: "chinese",
    type: "veg",
    price: 260,
    description: "Wok-tossed thin noodles with julienned bell peppers, shredded cabbage, and light sesame oil.",
    isChefSpecial: false
  },

  // Tandoori Breads
  {
    id: "m-18",
    name: "Butter Naan / Garlic Naan",
    category: "breads",
    type: "veg",
    price: 75,
    description: "Leavened refined flour flatbread baked in clay oven, brushed with butter or roasted garlic flakes.",
    isChefSpecial: false
  },
  {
    id: "m-19",
    name: "Lachha Paratha / Missi Roti",
    category: "breads",
    type: "veg",
    price: 65,
    description: "Multi-layered flaky whole wheat bread or spiced gram flour flatbread.",
    isChefSpecial: false
  },
  {
    id: "m-20",
    name: "Amritsari Kulcha",
    category: "breads",
    type: "veg",
    price: 110,
    description: "Crispy tandoori kulcha stuffed with spiced mashed potatoes, paneer, and pomegranate seeds.",
    isChefSpecial: true
  },

  // Desserts & Beverages
  {
    id: "m-21",
    name: "Shahi Tukda with Rabri",
    category: "desserts",
    type: "veg",
    price: 220,
    description: "Crispy golden fried brioche soaked in saffron cardamom syrup, topped with thick clotted rabri and pistachios.",
    isChefSpecial: true
  },
  {
    id: "m-22",
    name: "Gulab Jamun with Ice Cream",
    category: "desserts",
    type: "veg",
    price: 170,
    description: "Warm khoya dumplings soaked in rose sugar syrup, paired with vanilla bean ice cream.",
    isChefSpecial: false
  },
  {
    id: "m-23",
    name: "Fresh Mint Mojito / Masala Chaas",
    category: "beverages",
    type: "veg",
    price: 140,
    description: "Refreshing crushed mint lime cooler or spiced buttermilk with roasted cumin and rock salt.",
    isChefSpecial: false
  }
];

const CATEGORIES = [
  { id: "all", label: "Full Menu" },
  { id: "tandoor", label: "Tandoor & Starters" },
  { id: "mains", label: "Curries & Gravies" },
  { id: "biryani", label: "Dum Biryani & Rice" },
  { id: "chinese", label: "Oriental Chinese" },
  { id: "breads", label: "Tandoori Breads" },
  { id: "desserts", label: "Royal Desserts" }
];

export function RestaurantInteractiveMenu({ onOpenReserveModal }: { onOpenReserveModal?: () => void }) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [dietFilter, setDietFilter] = useState<"all" | "veg" | "non-veg">("all");

  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
      const matchesDiet = dietFilter === "all" || item.type === dietFilter;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesDiet && matchesSearch;
    });
  }, [selectedCategory, dietFilter, searchQuery]);

  return (
    <div id="menu" className="space-y-8">
      {/* Header & Controls */}
      <div className="bg-[#FAF8F5] border border-[#E8E1D7] p-6 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-[0.22em] text-[#BA8B32] block">
              AUTHENTIC CULINARY REPERTOIRE
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif tracking-[0.06em] text-[#2B2320]">
              Digital A La Carte Menu
            </h3>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-[#7A6B61] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search kebabs, biryanis, curries..."
              className="w-full bg-white border border-[#E8E1D7] pl-9 pr-3 py-2 text-xs focus:border-[#BA8B32] focus:outline-none placeholder:text-[#9A8B81]"
            />
          </div>
        </div>

        {/* Dietary and Category Filter Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-[#E8E1D7]">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-xs border transition-colors cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-[#1E1815] text-white border-[#1E1815]"
                    : "bg-white text-[#5C4F46] border-[#E8E1D7] hover:border-[#BA8B32]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Diet Toggle */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setDietFilter("all")}
              className={`px-2.5 py-1 text-[11px] font-bold uppercase rounded-xs border cursor-pointer ${
                dietFilter === "all" ? "bg-[#2B2320] text-white" : "bg-white text-[#5C4F46] border-[#E8E1D7]"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setDietFilter("veg")}
              className={`px-2.5 py-1 text-[11px] font-bold uppercase flex items-center space-x-1 rounded-xs border cursor-pointer ${
                dietFilter === "veg" ? "bg-emerald-800 text-white" : "bg-white text-emerald-800 border-emerald-300"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Veg Only</span>
            </button>
            <button
              onClick={() => setDietFilter("non-veg")}
              className={`px-2.5 py-1 text-[11px] font-bold uppercase flex items-center space-x-1 rounded-xs border cursor-pointer ${
                dietFilter === "non-veg" ? "bg-red-900 text-white" : "bg-white text-red-900 border-red-300"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span>Non-Veg</span>
            </button>
          </div>
        </div>
      </div>

      {/* Menu Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-[#E8E1D7] p-5 shadow-xs hover:border-[#BA8B32] hover:shadow-md transition-all flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center space-x-2">
                  {/* Veg / Non-Veg Icon */}
                  <div
                    className={`w-3.5 h-3.5 border flex items-center justify-center p-0.5 rounded-[2px] flex-shrink-0 ${
                      item.type === "veg" ? "border-emerald-600" : "border-red-600"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        item.type === "veg" ? "bg-emerald-600" : "bg-red-600"
                      }`}
                    />
                  </div>

                  <h4 className="font-serif text-[15px] sm:text-base font-normal text-[#2B2320]">
                    {item.name}
                  </h4>
                </div>

                <span className="text-sm font-serif font-bold text-[#BA8B32] whitespace-nowrap">
                  {formatPrice(item.price)}
                </span>
              </div>

              <p className="text-xs text-[#5C4F46] font-light leading-relaxed mt-2">
                {item.description}
              </p>
            </div>

            {item.isChefSpecial && (
              <div className="flex items-center text-[10px] font-bold uppercase tracking-wider text-[#BA8B32] pt-1">
                <Sparkles className="w-3 h-3 mr-1 text-[#BA8B32]" />
                <span>Chef's Recommended Specialty</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12 bg-white border border-[#E8E1D7] text-muted space-y-2">
          <p className="font-serif text-base text-dark">No culinary items found matching your filters.</p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
              setDietFilter("all");
            }}
            className="text-xs text-gold underline cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
