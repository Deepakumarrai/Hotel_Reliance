import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const Role = {
  GUEST: "GUEST",
  STAFF: "STAFF",
  ADMIN: "ADMIN"
} as const;

const RoomCategory = {
  DELUXE: "DELUXE",
  EXECUTIVE: "EXECUTIVE",
  PREMIUM: "PREMIUM",
  FAMILY: "FAMILY"
} as const;

async function connectWithRetry(retries = 5, delay = 2000) {
  for (let i = 1; i <= retries; i++) {
    try {
      await prisma.$connect();
      console.log("Connected to PostgreSQL database successfully.");
      return;
    } catch (err: any) {
      console.warn(`Database connection attempt ${i}/${retries} failed: ${err.message}. Waking Neon compute, retrying in ${delay}ms...`);
      if (i === retries) throw err;
      await new Promise((res) => setTimeout(res, delay));
    }
  }
}

async function main() {
  console.log("Seeding database for Hotel Reliance (Production Master Data Only)...");
  await connectWithRetry();

  // ==========================================
  // 0. CLEANUP RESIDUAL MOCK/DEMO DATA
  // ==========================================
  console.log("Purging any residual mock or test records from database...");

  // Delete mock bookings
  const deletedBookings = await prisma.booking.deleteMany({
    where: {
      OR: [
        { id: { in: ["HR-98214", "HR-98215", "HR-98218", "HR-98219", "HR-98220", "HR-98210"] } },
        { guestEmail: { in: ["amitesh.kumar@tata.com", "sunita.v@gmail.com", "rkmishra.bokaro@health.gov.in", "priyanka.roy@sail.in", "vikash@agarwalsteels.com", "rohit.d@outlook.com", "demo@example.com"] } }
      ]
    }
  });
  if (deletedBookings.count > 0) {
    console.log(`Cleaned up ${deletedBookings.count} mock bookings.`);
  }

  // Delete mock enquiries
  const deletedEnquiries = await prisma.enquiry.deleteMany({
    where: {
      OR: [
        { id: { in: ["ENQ-7401", "ENQ-7402", "TBL-101", "TBL-102"] } },
        { email: { in: ["rajeshwar.s@sail.in", "events@tatapower.com", "sanjay.s@sail.in", "meenakshi.m@gmail.com"] } }
      ]
    }
  });
  if (deletedEnquiries.count > 0) {
    console.log(`Cleaned up ${deletedEnquiries.count} mock enquiries.`);
  }

  // Delete demo guest user
  const deletedDemoUsers = await prisma.user.deleteMany({
    where: { email: "demo@example.com" }
  });
  if (deletedDemoUsers.count > 0) {
    console.log(`Cleaned up ${deletedDemoUsers.count} demo user accounts.`);
  }

  // Delete dummy audit logs
  await prisma.auditLog.deleteMany({
    where: {
      newValue: "Hotel Reliance Luxury Admin Engine Initialized with PostgreSQL Database"
    }
  });

  // ==========================================
  // 1. SEED SUPER ADMIN USER
  // ==========================================
  const passwordHash = await bcrypt.hash("AdminReliance2026!", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@hotelreliance.com" },
    update: {
      name: "Hotel Reliance Front Desk Admin",
      phone: "+91 94311 00000",
      role: Role.ADMIN,
      isVerified: true
    },
    create: {
      name: "Hotel Reliance Front Desk Admin",
      email: "admin@hotelreliance.com",
      phone: "+91 94311 00000",
      passwordHash,
      role: Role.ADMIN,
      isVerified: true
    }
  });
  console.log("Super Admin user verified:", admin.email);

  // ==========================================
  // 2. SEED ROOM CATEGORIES (MASTER CATALOG)
  // ==========================================
  const roomCategories = [
    {
      id: "deluxe-room",
      slug: "deluxe",
      name: "Deluxe Room",
      category: RoomCategory.DELUXE,
      tagline: "Modern Comfort for Discerning Travelers",
      shortDesc: "Elegant comfort with modern amenities, designed for a relaxing business or leisure stay in Bokaro.",
      description: "Our Deluxe Rooms offer a perfect blend of space, comfort, and luxury. Designed with modern aesthetics, these rooms feature premium bedding, a fully equipped workstation, high-speed Wi-Fi, and a well-appointed bathroom.",
      pricePerNight: 2499.00,
      capacityAdults: 2,
      capacityKids: 1,
      bedType: "King Bed",
      roomSizeSqFt: 280,
      images: [
        "/images/rooms/deluxe/main.jpg",
        "/images/rooms/deluxe/room.jpg"
      ],
      amenities: [
        "King Size Bed",
        "High-Speed Wi-Fi",
        "Air Conditioning",
        "Flat Screen TV",
        "Tea/Coffee Maker",
        "Mini Fridge",
        "24/7 Room Service",
        "Modern Bathroom",
        "Electronic Safe",
        "Complimentary Bottled Water"
      ],
      totalInventory: 12
    },
    {
      id: "executive-room",
      slug: "executive",
      name: "Executive Room",
      category: RoomCategory.EXECUTIVE,
      tagline: "Refined Workspace & Relaxed Luxury",
      shortDesc: "Spacious layout with enhanced services and executive desk for premium business guests.",
      description: "The Executive Room is meticulously designed for business executives who demand extra comfort and utility. Featuring a dedicated seating area, a large executive desk, premier toiletries, and high-speed connectivity.",
      pricePerNight: 3499.00,
      capacityAdults: 2,
      capacityKids: 1,
      bedType: "King Bed",
      roomSizeSqFt: 350,
      images: [
        "/images/rooms/executive/main.jpg",
        "/images/rooms/executive/room.jpg"
      ],
      amenities: [
        "King Size Bed",
        "High-Speed Wi-Fi",
        "Air Conditioning",
        "Smart LED TV",
        "Executive Work Desk",
        "Tea/Coffee Maker",
        "Mini Fridge",
        "Luxury Toiletries",
        "24/7 Room Service",
        "Complimentary Breakfast"
      ],
      totalInventory: 15
    },
    {
      id: "premium-suite",
      slug: "premium",
      name: "Premium Suite",
      category: RoomCategory.PREMIUM,
      tagline: "The Pinnacle of Hospitality Excellence",
      shortDesc: "Lavish living room, separate master bedroom, panoramic city views, and dedicated concierge.",
      description: "Our Premium Suite delivers uncompromised grandeur with an expansive master bedroom, separate lounge, soaking bathtub, walk-in closet, and sweeping vistas of the Bokaro skyline.",
      pricePerNight: 4999.00,
      capacityAdults: 3,
      capacityKids: 2,
      bedType: "King Bed + Sofa Bed",
      roomSizeSqFt: 500,
      images: [
        "/images/rooms/premium/main.jpg",
        "/images/rooms/premium/room.jpg"
      ],
      amenities: [
        "Master King Bed + Sofa Bed",
        "Separate Living Room",
        "Bathtub & Rain Shower",
        "Espresso Machine",
        "High-Speed 5G Wi-Fi",
        "55-inch 4K Smart TV",
        "Complimentary Buffet Breakfast",
        "Evening Cocktail Hour",
        "Express Check-In / Check-Out"
      ],
      totalInventory: 10
    },
    {
      id: "family-suite",
      slug: "family",
      name: "Family Suite",
      category: RoomCategory.FAMILY,
      tagline: "Spacious Sanctuary for Families & Groups",
      shortDesc: "Interconnected bedrooms, dining space, and kid-friendly amenities designed for families visiting Bokaro.",
      description: "Crafted specifically for families, this multi-room sanctuary provides two full master suites, dining space, children's welcome packs, and generous storage for effortless extended stays.",
      pricePerNight: 5999.00,
      capacityAdults: 4,
      capacityKids: 2,
      bedType: "2 King Beds",
      roomSizeSqFt: 650,
      images: [
        "/images/rooms/family/main.jpg",
        "/images/rooms/family/room.jpg"
      ],
      amenities: [
        "Two King Master Bedrooms",
        "Dining Table & Lounge",
        "Two Ensuite Bathrooms",
        "Microwave & Refrigerator",
        "High-Speed Wi-Fi",
        "Two Smart LED TVs",
        "Kids Activity Kits",
        "24/7 Butler Support"
      ],
      totalInventory: 8
    }
  ];

  for (const r of roomCategories) {
    const { id, ...roomDataWithoutId } = r;
    await prisma.room.upsert({
      where: { slug: r.slug },
      update: roomDataWithoutId,
      create: r
    });
  }
  console.log(`Seeded ${roomCategories.length} room categories.`);

  // ==========================================
  // 3. SEED 45 PHYSICAL ROOM UNITS (ALL CLEAN & AVAILABLE)
  // ==========================================
  const floorConfigs = [
    { floor: 1, roomId: "deluxe-room", count: 12, start: 101 },
    { floor: 2, roomId: "executive-room", count: 15, start: 201 },
    { floor: 3, roomId: "premium-suite", count: 10, start: 301 },
    { floor: 4, roomId: "family-suite", count: 8, start: 401 },
  ];

  for (const config of floorConfigs) {
    for (let i = 0; i < config.count; i++) {
      const roomNum = (config.start + i).toString();

      await prisma.roomUnit.upsert({
        where: { roomNumber: roomNum },
        update: {
          roomId: config.roomId,
          floor: config.floor,
          status: "AVAILABLE",
          isOccupied: false,
          currentBookingId: null,
          assignedGuest: null,
          notes: null
        },
        create: {
          roomNumber: roomNum,
          roomId: config.roomId,
          floor: config.floor,
          status: "AVAILABLE",
          isOccupied: false,
          currentBookingId: null,
          assignedGuest: null,
          notes: null
        }
      });
    }
  }
  console.log("Seeded 45 physical room units across 4 floors (all initialized to AVAILABLE).");

  // ==========================================
  // 4. SEED KWALITY RESTAURANT MENU ITEMS
  // ==========================================
  const menuItems = [
    {
      id: "dish-1",
      name: "Murgh Malai Tikka",
      category: "Tandoor",
      description: "Charcoal charred chicken supreme in cream, cheese & green cardamom marinade.",
      price: 395.00,
      image: "/images/restaurant/murgh-malai-tikka.png",
      isVeg: false,
      isAvailable: true,
      isFeatured: true
    },
    {
      id: "dish-2",
      name: "Paneer Butter Masala",
      category: "Main Course",
      description: "Velvety smooth makhani gravy with soft cottage cheese & fenugreek.",
      price: 325.00,
      image: "/images/restaurant/paneer-butter-masala.png",
      isVeg: true,
      isAvailable: true,
      isFeatured: true
    },
    {
      id: "dish-3",
      name: "Kwality Special Dum Biryani",
      category: "Biryani",
      description: "Aromatic aged basmati cooked on slow dum with saffron & spices in handi.",
      price: 445.00,
      image: "/images/restaurant/dum-biryani.png",
      isVeg: false,
      isAvailable: true,
      isFeatured: true
    },
    {
      id: "dish-4",
      name: "Tandoori Soya Chaap",
      category: "Starters",
      description: "Spiced soya chunks roasted over coal embers with mint dip.",
      price: 285.00,
      image: "/images/restaurant/canopy-lounge.png",
      isVeg: true,
      isAvailable: true,
      isFeatured: false
    },
    {
      id: "dish-5",
      name: "Shahi Tukda with Rabri",
      category: "Desserts",
      description: "Royal Awadhi fried bread soaked in saffron syrup topped with thick pistachio rabri.",
      price: 195.00,
      image: "/images/restaurant/image.png",
      isVeg: true,
      isAvailable: true,
      isFeatured: false
    }
  ];

  for (const item of menuItems) {
    await prisma.menuItem.upsert({
      where: { id: item.id },
      update: item,
      create: item
    });
  }
  console.log(`Seeded ${menuItems.length} restaurant menu items.`);

  // ==========================================
  // 5. SEED PROMOTIONAL COUPONS (START AT 0 USAGE)
  // ==========================================
  const coupons = [
    {
      id: "cp-1",
      code: "STAYRELIANCE",
      discountType: "PERCENTAGE",
      discountValue: 15.00,
      minBookingAmount: 3000.00,
      maxDiscount: 1500.00,
      startDate: new Date("2026-08-01"),
      endDate: new Date("2026-12-31"),
      usageLimit: 200,
      usedCount: 0,
      isActive: true
    },
    {
      id: "cp-2",
      code: "BOKAROFEST",
      discountType: "FLAT",
      discountValue: 500.00,
      minBookingAmount: 2500.00,
      maxDiscount: 500.00,
      startDate: new Date("2026-09-01"),
      endDate: new Date("2026-10-31"),
      usageLimit: 100,
      usedCount: 0,
      isActive: true
    }
  ];

  for (const cp of coupons) {
    await prisma.coupon.upsert({
      where: { code: cp.code },
      update: cp,
      create: cp
    });
  }
  console.log("Seeded promotional coupons (zero used count).");

  // ==========================================
  // 6. SEED MASTER HOTEL SETTINGS
  // ==========================================
  await prisma.hotelSetting.upsert({
    where: { id: "default" },
    update: {
      hotelName: "Hotel Reliance",
      tagline: "Experience Premium Hospitality in Bokaro",
      description: "Hotel Reliance is a premier 45+ room property in Bokaro Steel City with quality restaurant dining, banquet spaces, meeting rooms and outdoor celebration facilities.",
      phones: ["+91 92629 97777", "+91 92628 27777"],
      emails: ["reservation@hotelreliance.com"],
      whatsappNumber: "919262997777",
      plotNo: "Plot No: NIHP-1",
      street: "West Side of Co-Operative Colony",
      city: "Bokaro Steel City",
      state: "Jharkhand",
      pincode: "827001",
      fullAddress: "Plot No: NIHP-1, West Side of Co-Operative Colony, Bokaro Steel City, Jharkhand - 827001",
      checkInTime: "12:00 PM",
      checkOutTime: "11:00 AM",
      cancellationWindowHours: 24,
      freeCancellationAllowed: true,
      googleMapUrl: "https://maps.google.com/?q=Hotel+Reliance+Bokaro+Steel+City"
    },
    create: {
      id: "default",
      hotelName: "Hotel Reliance",
      tagline: "Experience Premium Hospitality in Bokaro",
      description: "Hotel Reliance is a premier 45+ room property in Bokaro Steel City with quality restaurant dining, banquet spaces, meeting rooms and outdoor celebration facilities.",
      phones: ["+91 92629 97777", "+91 92628 27777"],
      emails: ["reservation@hotelreliance.com"],
      whatsappNumber: "919262997777",
      plotNo: "Plot No: NIHP-1",
      street: "West Side of Co-Operative Colony",
      city: "Bokaro Steel City",
      state: "Jharkhand",
      pincode: "827001",
      fullAddress: "Plot No: NIHP-1, West Side of Co-Operative Colony, Bokaro Steel City, Jharkhand - 827001",
      checkInTime: "12:00 PM",
      checkOutTime: "11:00 AM",
      cancellationWindowHours: 24,
      freeCancellationAllowed: true,
      googleMapUrl: "https://maps.google.com/?q=Hotel+Reliance+Bokaro+Steel+City"
    }
  });
  console.log("Seeded master hotel settings.");

  // ==========================================
  // 7. SEED ROOM PRICING & SEASONAL RULES
  // ==========================================
  const pricingData = [
    { roomSlug: "deluxe", base: 2499.00, weekend: 2799.00, peak: 3199.00, extraAdult: 600.00, extraBed: 800.00 },
    { roomSlug: "executive", base: 3499.00, weekend: 3899.00, peak: 4299.00, extraAdult: 800.00, extraBed: 1000.00 },
    { roomSlug: "premium", base: 4999.00, weekend: 5499.00, peak: 6199.00, extraAdult: 1000.00, extraBed: 1200.00 },
    { roomSlug: "family", base: 5999.00, weekend: 6599.00, peak: 7499.00, extraAdult: 1000.00, extraBed: 1200.00 }
  ];

  for (const p of pricingData) {
    await prisma.roomPricing.upsert({
      where: { roomSlug: p.roomSlug },
      update: p,
      create: p
    });
  }

  const seasonalRules = [
    {
      id: "s-1",
      name: "Durga Puja & Festive Holiday Season",
      startDate: "2026-10-01",
      endDate: "2026-10-25",
      multiplier: 25.00,
      minNights: 2,
      applicableRooms: "All Categories",
      isActive: true
    },
    {
      id: "s-2",
      name: "Winter Wedding & Corporate Peak Surge",
      startDate: "2026-11-15",
      endDate: "2026-12-31",
      multiplier: 20.00,
      minNights: 1,
      applicableRooms: "Deluxe & Executive",
      isActive: true
    }
  ];

  for (const s of seasonalRules) {
    await prisma.seasonRule.upsert({
      where: { id: s.id },
      update: s,
      create: s
    });
  }
  console.log("Seeded room pricing and seasonal surge rules.");

  // ==========================================
  // 8. SEED STAFF LEADERSHIP DIRECTORY
  // ==========================================
  const staffMembers = [
    {
      id: "staff-1",
      name: "Vikramaditya Roy",
      role: "General Manager",
      department: "Operations",
      experience: "18+ Years",
      bio: "Overseeing all property operations, VIP guest hospitality, and strategic growth at Hotel Reliance Bokaro.",
      image: "/images/staff/vikramaditya-roy.png",
      order: 1
    },
    {
      id: "staff-2",
      name: "Pooja Deshmukh",
      role: "Head of Guest Experience",
      department: "Hospitality",
      experience: "12+ Years",
      bio: "Specializing in personalized concierge arrangements, wedding banquet styling, and guest satisfaction.",
      image: "/images/staff/pooja-deshmukh.png",
      order: 2
    },
    {
      id: "staff-3",
      name: "Sanjeev Sengupta",
      role: "Executive Master Chef",
      department: "Food & Beverage",
      experience: "15+ Years",
      bio: "Pioneering the Kwality restaurant culinary tradition with authentic Dum Biryanis, Awadhi tandoor, and gourmet banquets.",
      image: "/images/staff/sanjeev-sengupta.png",
      order: 3
    },
    {
      id: "staff-4",
      name: "Arun Mishra",
      role: "Front Desk & Reservations Manager",
      department: "Front Office",
      experience: "9+ Years",
      bio: "Managing guest check-ins, corporate reservations, and 24/7 guest communication pipelines.",
      image: "/images/staff/arun-mishra.png",
      order: 4
    }
  ];

  for (const sm of staffMembers) {
    await prisma.staff.upsert({
      where: { id: sm.id },
      update: sm,
      create: sm
    });
  }
  console.log("Seeded leadership staff directory.");

  // ==========================================
  // 9. SEED NOTIFICATION TEMPLATES
  // ==========================================
  await prisma.notificationTemplate.upsert({
    where: { id: "whatsapp_booking" },
    update: {
      name: "WhatsApp Booking Confirmation",
      channel: "WHATSAPP",
      subject: "Booking Confirmation",
      body: "Namaste {{GuestName}}, your reservation at Hotel Reliance Bokaro is CONFIRMED! Booking ID: {{BookingID}}. Room Category: {{RoomType}}. Check-in: {{CheckInDate}} at 12:00 PM. For directions or assistance, reply to this message directly."
    },
    create: {
      id: "whatsapp_booking",
      name: "WhatsApp Booking Confirmation",
      channel: "WHATSAPP",
      subject: "Booking Confirmation",
      body: "Namaste {{GuestName}}, your reservation at Hotel Reliance Bokaro is CONFIRMED! Booking ID: {{BookingID}}. Room Category: {{RoomType}}. Check-in: {{CheckInDate}} at 12:00 PM. For directions or assistance, reply to this message directly."
    }
  });

  await prisma.notificationTemplate.upsert({
    where: { id: "email_invoice" },
    update: {
      name: "Tax Invoice & Confirmation Email",
      channel: "EMAIL",
      subject: "Booking Confirmation & Tax Invoice — Hotel Reliance, Bokaro Steel City",
      body: "Dear {{GuestName}},\n\nThank you for choosing Hotel Reliance. Your reservation (ID: {{BookingID}}) has been confirmed for {{CheckInDate}}.\n\nWarm regards,\nHotel Reliance Front Office"
    },
    create: {
      id: "email_invoice",
      name: "Tax Invoice & Confirmation Email",
      channel: "EMAIL",
      subject: "Booking Confirmation & Tax Invoice — Hotel Reliance, Bokaro Steel City",
      body: "Dear {{GuestName}},\n\nThank you for choosing Hotel Reliance. Your reservation (ID: {{BookingID}}) has been confirmed for {{CheckInDate}}.\n\nWarm regards,\nHotel Reliance Front Office"
    }
  });
  console.log("Seeded notification templates.");

  // ==========================================
  // 10. SEED CMS CONTENT (HERO, GALLERY, BANQUETS)
  // ==========================================
  await prisma.cmsContent.upsert({
    where: { id: "homepage_hero" },
    update: {
      data: {
        heroTitle: "Luxury Hospitality in Bokaro Steel City",
        heroSubtitle: "Experience modern elegance, Kwality fine dining, and bespoke banquets in the industrial heart of Jharkhand.",
        ctaText: "Check Availability & Book",
        videoUrl: "/videos/hero.mp4",
        bannerAnnouncement: "Special Festive Discount: Use code STAYRELIANCE for 15% OFF"
      }
    },
    create: {
      id: "homepage_hero",
      data: {
        heroTitle: "Luxury Hospitality in Bokaro Steel City",
        heroSubtitle: "Experience modern elegance, Kwality fine dining, and bespoke banquets in the industrial heart of Jharkhand.",
        ctaText: "Check Availability & Book",
        videoUrl: "/videos/hero.mp4",
        bannerAnnouncement: "Special Festive Discount: Use code STAYRELIANCE for 15% OFF"
      }
    }
  });

  const galleryImages = [
    { id: "g-hotel-1", url: "/images/gallery/hotel-ext.jpg", alt: "Hotel Reliance Front Facade", category: "hotel", title: "Premium Front Facade" },
    { id: "g-hotel-2", url: "/images/gallery/hotel-lobby.jpg", alt: "Hotel Reliance Reception & Lobby", category: "hotel", title: "Elegantly Designed Lobby" },
    { id: "g-zoo-1", url: "/images/places/biological-park.png", alt: "Jawaharlal Nehru Biological Park Entrance Gate", category: "places", title: "Bokaro Biological Park (Main Gate)" },
    { id: "g-zoo-2", url: "/images/places/biological-park-hover.png", alt: "Bokaro Zoo Deer Safari Enclosure", category: "places", title: "Bokaro Zoo (Deer Safari Habitat)" },
    { id: "g-dam-1", url: "/images/places/garga-dam-day.png", alt: "Garga Dam Spillway Rapids", category: "places", title: "Garga Dam (Spillway View)" },
    { id: "g-dam-2", url: "/images/places/garga-dam-sunset.png", alt: "Garga Dam Golden Sunset", category: "places", title: "Garga Dam (Golden Sunset)" },
    { id: "g-park-1", url: "/images/places/city-park-entrance.png", alt: "City Park Bokaro Landscaped Lawns", category: "places", title: "City Park Landscaped Greenery" },
    { id: "g-park-2", url: "/images/places/city-park-lake.png", alt: "City Park Bokaro Lake Boating", category: "places", title: "City Park Scenic Lake" },
    { id: "g-steel-1", url: "/images/places/steel-plant-gates.png", alt: "SAIL Bokaro Steel Plant Main Works Gate", category: "places", title: "SAIL Steel Plant Industrial Gate" },
    { id: "g-steel-2", url: "/images/places/steel-plant-blast-furnace.png", alt: "SAIL Bokaro Blast Furnace Twilight Glow", category: "places", title: "SAIL Blast Furnace (Steel City Heritage)" },
    { id: "g-temple-1", url: "/images/places/jagannath-temple.png", alt: "Shri Jagannath Temple Bokaro Grand Shikhara", category: "places", title: "Shri Jagannath Temple (Sector 4)" },
    { id: "g-mall-1", url: "/images/places/bokaro-mall.png", alt: "Bokaro Mall Modern Facade", category: "places", title: "Bokaro Shopping Mall & Cinema" }
  ];

  await prisma.cmsContent.upsert({
    where: { id: "gallery" },
    update: { data: { images: galleryImages } },
    create: { id: "gallery", data: { images: galleryImages } }
  });

  const banquetVenues = [
    {
      name: "Grand AC Banquet Hall",
      capacity: "Up to 350 Guests",
      size: "4,200 sq. ft.",
      amenities: ["Integrated AV Setup", "Stage Lighting", "Buffet Area", "Bride/Groom Makeup Suites"],
      status: "ACTIVE"
    },
    {
      name: "Executive Meeting Boardroom",
      capacity: "Up to 30 Guests",
      size: "800 sq. ft.",
      amenities: ["Digital Projector & LED Display", "High-Speed Wi-Fi", "Ergonomic Conference Seating"],
      status: "ACTIVE"
    },
    {
      name: "Celebration Open Lawn",
      capacity: "Up to 500 Guests",
      size: "12,000 sq. ft.",
      amenities: ["Landscaped Greenery", "Grand Entry Gate", "Weatherproof Canopy Layout", "Silent Generator Backup"],
      status: "ACTIVE"
    }
  ];

  await prisma.cmsContent.upsert({
    where: { id: "banquet_venues" },
    update: { data: { venues: banquetVenues } },
    create: { id: "banquet_venues", data: { venues: banquetVenues } }
  });

  console.log("Seeded CMS content (hero, gallery & banquet venues).");
  console.log("=================================================");
  console.log("PRODUCTION MASTER DATA SEED COMPLETED WITH 0 MOCK DATA!");
  console.log("=================================================");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
