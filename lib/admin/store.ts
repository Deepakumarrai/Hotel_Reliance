export interface PhysicalRoom {
  id: string;
  roomNumber: string;
  roomType: "deluxe" | "executive" | "premium" | "family";
  floor: number;
  status: "AVAILABLE" | "OCCUPIED" | "RESERVED" | "CLEANING" | "MAINTENANCE" | "OUT_OF_SERVICE";
  currentBookingId?: string;
  assignedGuest?: string;
  notes?: string;
}

export interface AdminBooking {
  id: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  roomType: "deluxe" | "executive" | "premium" | "family";
  roomNumber?: string;
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  adults: number;
  children: number;
  baseAmount: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  paidAmount: number;
  paymentStatus: "SUCCESS" | "PENDING" | "FAILED" | "REFUNDED" | "PARTIALLY_REFUNDED";
  bookingStatus: "CONFIRMED" | "CHECKED_IN" | "CHECKED_OUT" | "CANCELLED" | "PENDING" | "NO_SHOW";
  paymentMethod: "RAZORPAY" | "UPI" | "CREDIT_CARD" | "PAY_AT_HOTEL";
  transactionId?: string;
  specialRequests?: string;
  cancellationReason?: string;
  refundAmount?: number;
  createdAt: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  adminUser: string;
  action: string;
  entity: string;
  entityId: string;
  oldValue?: string;
  newValue?: string;
  ipAddress?: string;
}

export interface RestaurantMenuItem {
  id: string;
  name: string;
  category: "Starters" | "Main Course" | "Biryani" | "Chinese" | "Tandoor" | "Desserts" | "Beverages";
  description: string;
  price: number;
  image: string;
  isVeg: boolean;
  isAvailable: boolean;
  isFeatured: boolean;
}

export interface BanquetEnquiryRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  eventType: "Wedding Reception" | "Corporate Summit" | "Engagement" | "Birthday Party" | "Annual Gala";
  eventDate: string;
  guestCount: number;
  venue: "AC Banquet Hall" | "Executive Boardroom" | "Celebration Lawn";
  budget: string;
  status: "NEW" | "CONTACTED" | "QUOTED" | "CONFIRMED" | "COMPLETED" | "LOST";
  createdAt: string;
  notes?: string;
}

export interface CouponRecord {
  id: string;
  code: string;
  discountType: "PERCENTAGE" | "FLAT";
  discountValue: number;
  minBookingAmount: number;
  maxDiscount: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
}

export interface HotelSettings {
  hotelName: string;
  tagline: string;
  description: string;
  phones: string[];
  emails: string[];
  whatsappNumber: string;
  address: {
    plotNo: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
    fullAddress: string;
  };
  checkInTime: string;
  checkOutTime: string;
  cancellationWindowHours: number;
  freeCancellationAllowed: boolean;
  googleMapUrl?: string;
  updatedAt: string;
}

// Global In-Memory Persistent Store across Next.js API lifecycle
class AdminStore {
  public rooms: PhysicalRoom[] = [];
  public bookings: AdminBooking[] = [];
  public auditLogs: AuditLogEntry[] = [];
  public menuItems: RestaurantMenuItem[] = [];
  public banquetEnquiries: BanquetEnquiryRecord[] = [];
  public coupons: CouponRecord[] = [];
  public hotelSettings: HotelSettings = {
    hotelName: "Hotel Reliance",
    tagline: "Experience Premium Hospitality in Bokaro",
    description: "Hotel Reliance is a 45+ room property in Bokaro Steel City with quality restaurant dining, banquet spaces, meeting rooms and outdoor celebration facilities.",
    phones: ["+91 92629 97777", "+91 92628 27777"],
    emails: ["reservation@hotelreliance.com"],
    whatsappNumber: "919262997777",
    address: {
      plotNo: "Plot No: NIHP-1",
      street: "West Side of Co-Operative Colony",
      city: "Bokaro Steel City",
      state: "Jharkhand",
      pincode: "827001",
      fullAddress: "Plot No: NIHP-1, West Side of Co-Operative Colony, Bokaro Steel City, Jharkhand - 827001",
    },
    checkInTime: "12:00 PM",
    checkOutTime: "11:00 AM",
    cancellationWindowHours: 24,
    freeCancellationAllowed: true,
    googleMapUrl: "https://maps.google.com/?q=Hotel+Reliance+Bokaro+Steel+City",
    updatedAt: new Date().toISOString(),
  };
  public roomPrices: Record<string, { base: number; weekend: number; peak: number; extraAdult: number; extraBed: number }> = {
    deluxe: { base: 2499, weekend: 2799, peak: 3199, extraAdult: 600, extraBed: 800 },
    executive: { base: 3499, weekend: 3899, peak: 4299, extraAdult: 800, extraBed: 1000 },
    premium: { base: 4999, weekend: 5499, peak: 6199, extraAdult: 1000, extraBed: 1200 },
    family: { base: 5999, weekend: 6599, peak: 7499, extraAdult: 1000, extraBed: 1200 },
  };

  constructor() {
    this.seedInitialState();
  }

  private seedInitialState() {
    // 1. Seed 45+ Physical Rooms across 4 Floors
    const floorConfigs = [
      { floor: 1, type: "deluxe" as const, count: 12, start: 101 },
      { floor: 2, type: "executive" as const, count: 15, start: 201 },
      { floor: 3, type: "premium" as const, count: 10, start: 301 },
      { floor: 4, type: "family" as const, count: 8, start: 401 },
    ];

    floorConfigs.forEach(({ floor, type, count, start }) => {
      for (let i = 0; i < count; i++) {
        const roomNum = (start + i).toString();
        // Give some initial realistic statuses
        let status: PhysicalRoom["status"] = "AVAILABLE";
        let assignedGuest: string | undefined;
        let bookingId: string | undefined;

        if (roomNum === "102") {
          status = "OCCUPIED";
          assignedGuest = "Amitesh Kumar";
          bookingId = "HR-98214";
        } else if (roomNum === "104") {
          status = "CLEANING";
        } else if (roomNum === "201") {
          status = "OCCUPIED";
          assignedGuest = "Sunita Verma";
          bookingId = "HR-98215";
        } else if (roomNum === "205") {
          status = "RESERVED";
          assignedGuest = "Dr. R. K. Mishra";
          bookingId = "HR-98218";
        } else if (roomNum === "302") {
          status = "MAINTENANCE";
        }

        this.rooms.push({
          id: `room-${roomNum}`,
          roomNumber: roomNum,
          roomType: type,
          floor,
          status,
          currentBookingId: bookingId,
          assignedGuest,
          notes: status === "MAINTENANCE" ? "AC filter replacement scheduled" : undefined,
        });
      }
    });

    // 2. Seed Realistic Hotel Bookings
    const todayStr = new Date().toISOString().split("T")[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];
    const dayAfter = new Date(Date.now() + 172800000).toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

    this.bookings = [
      {
        id: "HR-98214",
        guestName: "Amitesh Kumar",
        guestEmail: "amitesh.kumar@tata.com",
        guestPhone: "+91 94311 22890",
        roomType: "deluxe",
        roomNumber: "102",
        checkInDate: yesterday,
        checkOutDate: tomorrow,
        nights: 2,
        adults: 2,
        children: 0,
        baseAmount: 4998,
        taxAmount: 599.76,
        discountAmount: 500,
        totalAmount: 5097.76,
        paidAmount: 5097.76,
        paymentStatus: "SUCCESS",
        bookingStatus: "CHECKED_IN",
        paymentMethod: "RAZORPAY",
        transactionId: "pay_Ok8923Ksm10",
        specialRequests: "Quiet room facing inner garden.",
        createdAt: "2026-09-01T10:30:00Z",
      },
      {
        id: "HR-98215",
        guestName: "Sunita Verma",
        guestEmail: "sunita.v@gmail.com",
        guestPhone: "+91 98351 09841",
        roomType: "executive",
        roomNumber: "201",
        checkInDate: yesterday,
        checkOutDate: todayStr,
        nights: 1,
        adults: 1,
        children: 0,
        baseAmount: 3499,
        taxAmount: 419.88,
        discountAmount: 0,
        totalAmount: 3918.88,
        paidAmount: 3918.88,
        paymentStatus: "SUCCESS",
        bookingStatus: "CHECKED_IN",
        paymentMethod: "UPI",
        transactionId: "upi_49829381029",
        specialRequests: "Late check-out request at 1:00 PM.",
        createdAt: "2026-09-02T14:15:00Z",
      },
      {
        id: "HR-98218",
        guestName: "Dr. R. K. Mishra",
        guestEmail: "rkmishra.bokaro@health.gov.in",
        guestPhone: "+91 94313 87654",
        roomType: "executive",
        roomNumber: "205",
        checkInDate: todayStr,
        checkOutDate: dayAfter,
        nights: 2,
        adults: 2,
        children: 1,
        baseAmount: 6998,
        taxAmount: 839.76,
        discountAmount: 700,
        totalAmount: 7137.76,
        paidAmount: 7137.76,
        paymentStatus: "SUCCESS",
        bookingStatus: "CONFIRMED",
        paymentMethod: "CREDIT_CARD",
        transactionId: "pay_Nls8392Ksm91",
        specialRequests: "Extra dental kit & early check-in.",
        createdAt: "2026-09-02T18:40:00Z",
      },
      {
        id: "HR-98219",
        guestName: "Priyanka Roy",
        guestEmail: "priyanka.roy@sail.in",
        guestPhone: "+91 87654 32109",
        roomType: "premium",
        checkInDate: todayStr,
        checkOutDate: tomorrow,
        nights: 1,
        adults: 2,
        children: 0,
        baseAmount: 4999,
        taxAmount: 599.88,
        discountAmount: 0,
        totalAmount: 5598.88,
        paidAmount: 0,
        paymentStatus: "PENDING",
        bookingStatus: "CONFIRMED",
        paymentMethod: "PAY_AT_HOTEL",
        specialRequests: "High floor suite requested.",
        createdAt: "2026-09-03T09:12:00Z",
      },
      {
        id: "HR-98220",
        guestName: "Vikash Agarwal",
        guestEmail: "vikash@agarwalsteels.com",
        guestPhone: "+91 99341 55678",
        roomType: "family",
        checkInDate: dayAfter,
        checkOutDate: new Date(Date.now() + 345600000).toISOString().split("T")[0],
        nights: 2,
        adults: 4,
        children: 2,
        baseAmount: 11998,
        taxAmount: 1439.76,
        discountAmount: 1200,
        totalAmount: 12237.76,
        paidAmount: 12237.76,
        paymentStatus: "SUCCESS",
        bookingStatus: "CONFIRMED",
        paymentMethod: "RAZORPAY",
        transactionId: "pay_Zms8934102K",
        specialRequests: "Family suite with interconnecting room preference.",
        createdAt: "2026-09-03T11:45:00Z",
      },
      {
        id: "HR-98210",
        guestName: "Rohit Deshmukh",
        guestEmail: "rohit.d@outlook.com",
        guestPhone: "+91 98231 11223",
        roomType: "deluxe",
        checkInDate: yesterday,
        checkOutDate: yesterday,
        nights: 1,
        adults: 1,
        children: 0,
        baseAmount: 2499,
        taxAmount: 299.88,
        discountAmount: 0,
        totalAmount: 2798.88,
        paidAmount: 2798.88,
        paymentStatus: "SUCCESS",
        bookingStatus: "CHECKED_OUT",
        paymentMethod: "RAZORPAY",
        transactionId: "pay_Ksm9482019",
        createdAt: "2026-08-30T16:20:00Z",
      },
    ];

    // 3. Seed Restaurant Menu
    this.menuItems = [
      {
        id: "dish-1",
        name: "Murgh Malai Tikka",
        category: "Tandoor",
        description: "Charcoal charred chicken supreme in cream, cheese & green cardamom marinade.",
        price: 395,
        image: "/images/restaurant/murgh-malai-tikka.png",
        isVeg: false,
        isAvailable: true,
        isFeatured: true,
      },
      {
        id: "dish-2",
        name: "Paneer Butter Masala",
        category: "Main Course",
        description: "Velvety smooth makhani gravy with soft cottage cheese & fenugreek.",
        price: 325,
        image: "/images/restaurant/paneer-butter-masala.png",
        isVeg: true,
        isAvailable: true,
        isFeatured: true,
      },
      {
        id: "dish-3",
        name: "Kwality Special Dum Biryani",
        category: "Biryani",
        description: "Aromatic aged basmati cooked on slow dum with saffron & spices in handi.",
        price: 445,
        image: "/images/restaurant/dum-biryani.png",
        isVeg: false,
        isAvailable: true,
        isFeatured: true,
      },
      {
        id: "dish-4",
        name: "Tandoori Soya Chaap",
        category: "Starters",
        description: "Spiced soya chunks roasted over coal embers with mint dip.",
        price: 285,
        image: "/images/restaurant/canopy-lounge.png",
        isVeg: true,
        isAvailable: true,
        isFeatured: false,
      },
      {
        id: "dish-5",
        name: "Shahi Tukda with Rabri",
        category: "Desserts",
        description: "Royal Awadhi fried bread soaked in saffron syrup topped with thick pistachio rabri.",
        price: 195,
        image: "/images/restaurant/image.png",
        isVeg: true,
        isAvailable: true,
        isFeatured: false,
      },
    ];

    // 4. Seed Banquet Enquiries
    this.banquetEnquiries = [
      {
        id: "ENQ-7401",
        name: "Rajeshwar Singh (SAIL Executive)",
        email: "rajeshwar.s@sail.in",
        phone: "+91 94311 78901",
        eventType: "Wedding Reception",
        eventDate: "2026-11-20",
        guestCount: 280,
        venue: "AC Banquet Hall",
        budget: "₹3,50,000",
        status: "QUOTED",
        createdAt: "2026-09-02T12:00:00Z",
        notes: "Requested North Indian & Mughlai buffet tasting.",
      },
      {
        id: "ENQ-7402",
        name: "Tata Power Corporate Team",
        email: "events@tatapower.com",
        phone: "+91 98200 44556",
        eventType: "Corporate Summit",
        eventDate: "2026-09-25",
        guestCount: 30,
        venue: "Executive Boardroom",
        budget: "₹65,000",
        status: "CONFIRMED",
        createdAt: "2026-09-01T15:30:00Z",
        notes: "Digital projector and high-speed Wi-Fi required.",
      },
    ];

    // 5. Seed Coupons
    this.coupons = [
      {
        id: "cp-1",
        code: "STAYRELIANCE",
        discountType: "PERCENTAGE",
        discountValue: 15,
        minBookingAmount: 3000,
        maxDiscount: 1500,
        startDate: "2026-08-01",
        endDate: "2026-12-31",
        usageLimit: 200,
        usedCount: 42,
        isActive: true,
      },
      {
        id: "cp-2",
        code: "BOKAROFEST",
        discountType: "FLAT",
        discountValue: 500,
        minBookingAmount: 2500,
        maxDiscount: 500,
        startDate: "2026-09-01",
        endDate: "2026-10-31",
        usageLimit: 100,
        usedCount: 18,
        isActive: true,
      },
    ];

    // 6. Initial Audit Log
    this.addAuditLog("SUPER_ADMIN", "SYSTEM_INIT", "System", "0", "Hotel Reliance Luxury Admin Engine Initialized");
  }

  public addAuditLog(adminUser: string, action: string, entity: string, entityId: string, newValue?: string, oldValue?: string) {
    this.auditLogs.unshift({
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      adminUser,
      action,
      entity,
      entityId,
      oldValue,
      newValue,
    });
    // Keep max 200 logs in memory
    if (this.auditLogs.length > 200) {
      this.auditLogs.pop();
    }
  }
}

// Global Singleton
const globalForStore = globalThis as unknown as { adminStore?: AdminStore };
export const adminStore = globalForStore.adminStore || new AdminStore();
if (process.env.NODE_ENV !== "production") globalForStore.adminStore = adminStore;
