# 🏨 Hotel Reliance — Backend Integration & Frontend Connection Action Plan

> **Document Version:** 2.0  
> **Target Audience:** Backend Engineering Team, Full-Stack Leads, and DevOps  
> **Objective:** Connect all customer-facing frontend pages and admin controls to the live Express + Prisma PostgreSQL backend with zero hardcoded values.

---

## 1. System Architecture & Data Flow

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                       HOTEL RELIANCE SYSTEM MAP                         │
└─────────────────────────────────────────────────────────────────────────┘

 [ CUSTOMER FRONTEND ]           [ ADMIN CONTROL PORTAL ]
  (Next.js React Client)          (Next.js Admin Suite)
            │                                │
            │  Dynamic Hooks / SWR / Fetch   │
            ▼                                ▼
 ┌──────────────────────────────────────────────────────┐
 │          Next.js App Router API Layer (/app/api/*)   │
 │   - JWT Verification & Google OAuth Gateways         │
 │   - Resilient Offline Local Fallbacks               │
 │   - Request Validation & Session Cookies            │
 └──────────────────────────┬───────────────────────────┘
                            │ HTTP / JSON (Port 5001)
                            ▼
 ┌──────────────────────────────────────────────────────┐
 │         Express.js Live Backend (backend/src)        │
 │   - Controllers: Auth, Bookings, Rooms, Payments...  │
 │   - Razorpay Webhooks & Email / WhatsApp Dispatcher  │
 └──────────────────────────┬───────────────────────────┘
                            │ Prisma ORM
                            ▼
 ┌──────────────────────────────────────────────────────┐
 │             Neon PostgreSQL Database                 │
 │   (Rooms, Bookings, Users, Menu, Offers, Staff, ...) │
 └──────────────────────────────────────────────────────┘
```

---

## 2. Customer-Facing Pages: Integration Status & Remaining Work

| # | Page Route | Customer Page Name | Current Frontend Status | Backend Endpoint Required | Remaining Work for Backend Team | Priority |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | `/` | **Homepage** | Connected via `useHotelSettings()` & `useRoomPricing()` | `GET /settings`<br>`GET /pricing`<br>`GET /reviews` | 1. Ensure `GET /settings` returns updated phones & address.<br>2. Implement `GET /reviews` to serve approved guest reviews. | **High** |
| **2** | `/rooms` | **All Rooms Directory** | Connected to `/api/pricing` & `/api/rooms` | `GET /rooms`<br>`GET /pricing` | 1. Ensure live room rates include weekend/peak calculations.<br>2. Return dynamic thumbnail image arrays. | **High** |
| **3** | `/rooms/[roomSlug]` | **Room Detail & Calculator** | Connected to dynamic pricing engine | `GET /rooms/:slug`<br>`GET /pricing/tariff/:slug` | 1. Return category amenities, bed type, size, and occupancy limits. | **High** |
| **4** | `/booking` | **Reservation & Checkout** | Connected to `/api/payments` & `/api/bookings` | `POST /bookings`<br>`POST /payments/razorpay/order`<br>`POST /payments/razorpay/verify` | 1. Finalize Razorpay webhook handler for signature verification.<br>2. Trigger WhatsApp & Email confirmation upon payment success. | **CRITICAL** |
| **5** | `/my-bookings` | **Guest Bookings History** | Connected to AuthContext | `GET /bookings/my` | 1. Extract user phone/email from authenticated JWT.<br>2. Return array of bookings with status and invoice URL. | **High** |
| **6** | `/about` | **About & Staff** | Dynamic staff component integrated | `GET /staff` | 1. Return active staff records sorted by `order` field. | **Medium** |
| **7** | `/banquet` | **Banquets & Weddings** | Dynamic venue specs & quotation form | `GET /content/banquet`<br>`POST /enquiries` | 1. Handle `POST /enquiries` (`type: "BANQUET"`) and notify sales team. | **Medium** |
| **8** | `/restaurant` | **Kwality Dining & Menu** | Ready for dynamic menu feed | `GET /restaurant/menu`<br>`POST /enquiries` | 1. Serve categorized dish list with veg/non-veg tags & prices.<br>2. Handle table reservation enquiries (`type: "RESTAURANT_TABLE"`). | **High** |
| **9** | `/offers` | **Offers & Packages** | Static fallback UI | `GET /offers` | 1. Serve active promo campaigns with expiry dates & discount codes. | **Medium** |
| **10** | `/gallery` | **Photo Gallery** | Static fallback UI | `GET /content/gallery` | 1. Return categorized image assets (Rooms, Exterior, Dining, Banquets). | **Low** |
| **11** | `/contact` | **Contact & Enquiry** | Connected to `useHotelSettings()` | `POST /enquiries` | 1. Save general enquiries to database and send auto-responder email. | **High** |
| **12** | `/auth/*` | **Guest Login / Google OAuth** | Native HMAC JWT verification active | `POST /auth/google`<br>`POST /auth/login`<br>`POST /auth/register` | 1. Upsert `User` record on Google token verification and return session JWT. | **CRITICAL** |

---

## 3. Detailed API Contracts for Backend Team

### A. Authentication & Guest Profiles
#### 1. `POST /api/v1/auth/google`
- **Request Body:**
  ```json
  {
    "credential": "GOOGLE_ID_TOKEN",
    "clientId": "GOOGLE_CLIENT_ID"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "token": "JWT_BEARER_TOKEN",
    "user": {
      "id": "usr_94821",
      "name": "Rahul Verma",
      "email": "rahul.verma@example.com",
      "phone": "+91 98351 22441",
      "role": "GUEST"
    }
  }
  ```

---

### B. Dynamic Room Tariffs & Inventory
#### 2. `GET /api/v1/pricing`
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "prices": {
      "deluxe": { "base": 2499, "weekend": 2799, "peak": 3299, "extraAdult": 800, "extraBed": 1000 },
      "executive": { "base": 2999, "weekend": 3299, "peak": 3899, "extraAdult": 900, "extraBed": 1200 },
      "premium": { "base": 3499, "weekend": 3899, "peak": 4599, "extraAdult": 1000, "extraBed": 1500 },
      "family": { "base": 3999, "weekend": 4499, "peak": 5299, "extraAdult": 1000, "extraBed": 1500 }
    },
    "taxSlabs": {
      "standard": 12,
      "luxury": 18,
      "threshold": 7500
    }
  }
  ```

---

### C. Booking & Payment Verification Pipeline
#### 3. `POST /api/v1/bookings`
- **Request Body:**
  ```json
  {
    "guestName": "Rahul Verma",
    "guestPhone": "+91 98351 22441",
    "guestEmail": "rahul.verma@example.com",
    "roomType": "deluxe",
    "checkInDate": "2026-09-12",
    "checkOutDate": "2026-09-14",
    "nights": 2,
    "adults": 2,
    "children": 0,
    "baseAmount": 4998,
    "taxAmount": 599.76,
    "discountCode": "RELIANCE10",
    "discountAmount": 500,
    "totalAmount": 5097.76,
    "paymentMethod": "RAZORPAY",
    "specialRequests": "Late check-in at 8 PM"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "success": true,
    "booking": {
      "id": "HR-90214",
      "status": "PENDING",
      "paymentStatus": "PENDING",
      "totalAmount": 5097.76
    }
  }
  ```

#### 4. `POST /api/v1/payments/razorpay/verify`
- **Request Body:**
  ```json
  {
    "bookingId": "HR-90214",
    "razorpay_order_id": "order_Px881920",
    "razorpay_payment_id": "pay_Qz771829",
    "razorpay_signature": "HMAC_SHA256_SIGNATURE"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Payment verified and booking confirmed",
    "bookingId": "HR-90214",
    "invoiceUrl": "/api/bookings/HR-90214/invoice"
  }
  ```

---

### D. Kwality Restaurant Menu API
#### 5. `GET /api/v1/restaurant/menu`
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "categories": ["Starters", "Tandoor", "Main Course", "Biryani", "Chinese", "Desserts"],
    "menu": [
      {
        "id": "dish-1",
        "name": "Murgh Malai Tikka",
        "category": "Tandoor",
        "price": 380,
        "isVeg": false,
        "isAvailable": true,
        "isFeatured": true,
        "image": "/images/restaurant/murgh-malai-tikka.png",
        "description": "Tender boneless chicken marinated in rich clotted cream, roasted garlic, and cardamom."
      }
    ]
  }
  ```

---

### E. Master Hotel Settings & Contact API
#### 6. `GET /api/v1/settings`
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "settings": {
      "hotelName": "Hotel Reliance",
      "tagline": "Premier Hospitality in the Heart of Bokaro Steel City",
      "phones": ["+91 92040 52885", "+91 94311 88220"],
      "whatsappNumber": "+91 92040 52885",
      "emails": ["info@hotelreliance.com", "reservations@hotelreliance.com"],
      "address": {
        "fullAddress": "Plot No. 12, Co-operative Colony, Bokaro Steel City, Jharkhand 827001"
      },
      "checkInTime": "12:00 PM",
      "checkOutTime": "11:00 AM",
      "cancellationWindowHours": 24,
      "freeCancellationAllowed": true
    }
  }
  ```

---

## 4. Database Seeding & Verification Checklist

1. [ ] **Prisma Migration**: Run `npx prisma migrate dev --name init_reliance_tables` inside `/backend`.
2. [ ] **45 Physical Room Units**: Seed `RoomUnit` table with room numbers `101-115` (Floor 1), `201-215` (Floor 2), `301-310` (Floor 3), `401-405` (Floor 4).
3. [ ] **Default Hotel Settings**: Seed `HotelSetting` with official Bokaro contact numbers and registered legal address.
4. [ ] **Kwality Restaurant Dishes**: Seed `MenuItem` with initial Tandoor, Main Course, Biryani, and Chinese items.
5. [ ] **Razorpay Keys**: Configure `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in `/backend/.env`.
6. [ ] **WhatsApp & Email SMTP**: Configure credentials in `/backend/.env` for automated confirmation dispatches.

---

## 5. Summary for Backend Developers

The frontend and admin portal are designed to consume the above JSON structures. As soon as the Express backend on port 5001 responds to these endpoints, the Next.js frontend and admin dashboard will automatically bind to the live database in real-time.
