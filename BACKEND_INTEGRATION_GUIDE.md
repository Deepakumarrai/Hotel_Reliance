# Hotel Reliance — Full-Stack Technical Documentation & Backend Developer Integration Guide

> **Project Version:** 2.0 (Production-Ready Architecture)  
> **Frontend Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Lucide Icons, Framer Motion  
> **Target Backend Stack:** Node.js / NestJS / Express / Go / PostgreSQL (Prisma) / Redis / Razorpay API  
> **Property:** Hotel Reliance, Plot No: NIHP-1, Co-Operative Colony, Bokaro Steel City, Jharkhand - 827001  

---

## Table of Contents
1. [Executive Summary & Full-Stack Architecture](#1-executive-summary--full-stack-architecture)
2. [Frontend Architecture & Module Breakdown](#2-frontend-architecture--module-breakdown)
3. [Authentication & User Management Architecture](#3-authentication--user-management-architecture)
4. [Admin Panel & Operations Control Center](#4-admin-panel--operations-control-center)
5. [Dynamic Pricing & Inventory Engine](#5-dynamic-pricing--inventory-engine)
6. [Complete Database Schema (PostgreSQL / Prisma)](#6-complete-database-schema-postgresql--prisma)
7. [Comprehensive REST API Specification](#7-comprehensive-rest-api-specification)
8. [Razorpay Payment Gateway & Webhook Pipeline](#8-razorpay-payment-gateway--webhook-pipeline)
9. [Concurrency & Distributed Lock System (Redis)](#9-concurrency--distributed-lock-system-redis)
10. [Automated Notifications Pipeline (WhatsApp, Email, SMS)](#10-automated-notifications-pipeline-whatsapp-email-sms)
11. [Environment Variables & Deployment Checklist](#11-environment-variables--deployment-checklist)

---

## 1. Executive Summary & Full-Stack Architecture

The **Hotel Reliance Web Platform** is an enterprise-grade luxury hospitality system designed for end-to-end guest booking, dining discovery, banquet quotation, photo gallery presentation, and full admin operations.

```
                                  +-------------------------------------------------------------+
                                  |                 Hotel Reliance Web Client                   |
                                  |         (Next.js 16 App Router + React 19 + TypeScript)     |
                                  +------------------------------+------------------------------+
                                                                 |
                                                                 | HTTPS / JSON (REST + SSE)
                                                                 v
                                  +-------------------------------------------------------------+
                                  |                     API Gateway & Auth                      |
                                  |             JWT Bearer Tokens / Role Verification           |
                                  +---+--------------------------+--------------------------+---+
                                      |                          |                          |
                   +------------------+                  +-------+-------+                  +------------------+
                   |                                     |               |                                     |
                   v                                     v               v                                     v
          +------------------+                  +----------------+ +------------+                     +------------------+
          |  PostgreSQL DB   |                  |  Redis Engine  | | Auth / OTP |                     | Payment Gateway  |
          |  (Prisma ORM)    |                  |  Locks & Cache | | (JWT / SMS)|                     | (Razorpay API)   |
          +------------------+                  +----------------+ +------------+                     +------------------+
                   |                                                                                           |
                   +-------------------------------------+---------------+-------------------------------------+
                                                         |               |
                                                         v               v
                                                 +---------------+ +-------------+
                                                 | WhatsApp Cloud| | Resend/SMTP |
                                                 | & SMS Alerts  | | Invoices    |
                                                 +---------------+ +-------------+
```

---

## 2. Frontend Architecture & Module Breakdown

All customer-facing routes feature a unified design system with full-bleed hero banners, gold prefix lines (`w-8 sm:w-16 h-[2px] bg-[#C5A880]`), uppercase serif typography, and zero image compression (`unoptimized`).

### 2.1 Route Map & Purpose

| Route | Primary File | Description | Dynamic Features |
|---|---|---|---|
| `/` | `app/page.tsx` | Home Landing Page | Hero banner, story spread, room carousel, dining preview, events preview, attractions preview, offers carousel. |
| `/rooms` | `app/rooms/page.tsx` | Rooms & Suites Directory | Category filters (`All`, `Couples & Business`, `Family`), live starting price pills, peak badges. |
| `/rooms/[roomSlug]` | `app/rooms/[roomSlug]/page.tsx` | Room Detail Page | Photo gallery, amenities matrix, live tariff calculator, instant booking CTA. |
| `/offers` | `app/offers/page.tsx` | Offers & Packages | Category tabs, discount badges, inclusion checklists, promo code copy-to-clipboard, direct booking guarantee. |
| `/banquet` | `app/banquet/page.tsx` | Banquets & Events | Venue cards, interactive 3D floorplan schematic visualizer (Wedding/Corporate/Party), quotation enquiry form. |
| `/restaurant` | `app/restaurant/page.tsx` | Kwality Restaurant | Service timings table, dual ambiance showcase (Palace Hall & Canopy Lounge), signature chef dishes, table booking enquiry. |
| `/about` | `app/about/page.tsx` | About Us & Story | Hotel history, 5-stage cinematic video walkthrough (`hero.mp4`), leadership team cards, 3 core hospitality standards. |
| `/places` | `app/places/page.tsx` | Local Attractions Guide | Interactive Day/Night crossfade cards, travel tips, distance indicators. |
| `/places/[placeSlug]` | `app/places/[placeSlug]/page.tsx` | Attraction Detail Page | Historical background, sightseeing guidance, visitor timings. |
| `/gallery` | `app/gallery/page.tsx` | Photo Gallery | Category pills, uncompressed masonry grid, interactive fullscreen Lightbox with keyboard & swipe navigation. |
| `/contact` | `app/contact/page.tsx` | Contact & Reception | 24/7 front desk phone numbers, interactive enquiry form, Google Maps iframe embed. |
| `/booking` | `app/booking/page.tsx` | Checkout & Booking Funnel | Date range picker, guest counter, room selector, GST computation, promo code engine, Razorpay checkout modal. |
| `/booking/confirmation`| `app/booking/confirmation/page.tsx` | Booking Receipt | Printable confirmation receipt, booking ID (`HR-XXXXXX`), check-in instructions. |
| `/profile` | `app/profile/page.tsx` | Guest Profile | Account details, personal information, reservation history shortcuts. |
| `/my-bookings` | `app/my-bookings/page.tsx` | Guest Bookings History | List of upcoming and past reservations with status badges and cancellation actions. |
| `/policies` | `app/policies/page.tsx` | Hotel Policies | Check-in/out policies, cancellation rules, ID verification requirements. |
| `/privacy-policy` | `app/privacy-policy/page.tsx` | Legal Privacy Policy | Data protection policy complying with Indian IT Act. |
| `/terms-and-conditions`| `app/terms-and-conditions/page.tsx` | Legal Terms of Service | Booking terms, tariff rules, liability clauses. |
| `/faq` | `app/faq/page.tsx` | FAQ Hub | Searchable accordion FAQs categorized into stay, dining, and banquets. |

---

## 3. Authentication & User Management Architecture

The authentication layer supports both stateful session tokens and stateless JWT tokens, with user credentials, profile synchronization, and role-based route guards.

### 3.1 Roles & Privileges

```
       +--------------+
       |    GUEST     | -> Book rooms, view invoices, save profile, cancel bookings
       +-------+------+
               |
       +-------v------+
       |    STAFF     | -> View daily check-in lists, update table reservations, mark check-ins
       +-------+------+
               |
       +-------v------+
       |    ADMIN     | -> Full access: pricing overrides, inventory locks, review moderation, settings
       +--------------+
```

### 3.2 Frontend Auth State (`hooks/useAuth.ts`)
- Stored in React context with persistent `localStorage` synchronization.
- Modal-based Sign In / Sign Up triggers via `openAuthModal('signin' | 'signup')`.
- Auto-injects `Authorization: Bearer <token>` into API calls.
- Route protection in `app/admin/layout.tsx` redirecting unauthorized users.

---

## 4. Admin Panel & Operations Control Center

The admin panel (`/admin`) provides full administrative oversight over hotel operations.

```
/admin
├── / (Dashboard)               -> Revenue, occupancy rate, total bookings, pending enquiries
├── /bookings                   -> Live booking ledger, search, status filter, check-in/out toggles
├── /rooms                      -> Room inventory units, maintenance status
├── /rooms/pricing              -> Dynamic tariff override engine (base, peak, weekend rates)
├── /banquet                    -> Banquet hall calendar & quotation tracker
├── /banquet/enquiries          -> Incoming event hosting leads pipeline
├── /restaurant                 -> Table booking reservations & service slots
├── /restaurant/enquiries       -> Incoming dining reservations
├── /content                    -> Live Hotel settings overrides (phone, email, address, social URLs)
└── /reviews                    -> Guest review moderation and approval queue
```

### 4.1 Live Settings Override Engine (`hooks/useHotelSettings.ts` & `lib/admin/store.ts`)
Allows hoteliers to modify the hotel's phone numbers, email addresses, physical address, and social links in real time without redeploying code.

---

## 5. Dynamic Pricing & Inventory Engine

Dynamic pricing is managed via `hooks/useRoomPricing.ts` and allows real-time tariff adjustments:

```typescript
export interface RoomPricingRule {
  basePrice: number;     // e.g. ₹3,499
  peak: number;          // e.g. ₹4,499
  weekendSurge: number;  // e.g. ₹500
  discountPct: number;   // e.g. 10%
  isActive: boolean;
}
```

- **Live Price Calculation**: `activePrice = isPeakSeason ? rule.peak : rule.basePrice`
- **Taxes**: 12% GST applied for tariffs under ₹7,500; 18% GST for tariffs above ₹7,500.
- **Promo Codes**: Validated against active offer records in DB (`data/offers.ts`).

---

## 6. Complete Database Schema (PostgreSQL / Prisma)

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  GUEST
  STAFF
  ADMIN
}

enum BookingStatus {
  PENDING
  CONFIRMED
  CHECKED_IN
  CHECKED_OUT
  CANCELLED
}

enum PaymentStatus {
  PENDING
  PAID
  FAILED
  REFUNDED
}

enum RoomCategory {
  DELUXE
  EXECUTIVE
  PREMIUM
  FAMILY
}

model User {
  id            String    @id @default(uuid())
  name          String
  email         String    @unique
  phone         String    @unique
  passwordHash  String?
  role          Role      @default(GUEST)
  avatar        String?
  isVerified    Boolean   @default(false)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  bookings      Booking[]
  reviews       Review[]
  sessions      Session[]
}

model Session {
  id           String   @id @default(uuid())
  userId       String
  token        String   @unique
  expiresAt    DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Room {
  id              String        @id
  slug            String        @unique
  name            String
  category        RoomCategory
  tagline         String
  description     String        @db.Text
  shortDesc       String
  pricePerNight   Decimal       @db.Decimal(10, 2)
  peakPrice       Decimal       @db.Decimal(10, 2)
  capacityAdults  Int
  capacityKids    Int
  bedType         String
  roomSizeSqFt    Int
  images          String[]
  amenities       String[]
  totalInventory  Int           @default(10)
  isActive        Boolean       @default(true)
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  inventoryUnits  RoomUnit[]
  bookings        Booking[]
}

model RoomUnit {
  id              String    @id @default(uuid())
  roomNumber      String    @unique
  roomId          String
  floor           Int
  status          String    @default("AVAILABLE") // "AVAILABLE", "OCCUPIED", "RESERVED", "CLEANING", "MAINTENANCE"
  currentBookingId String?
  assignedGuest   String?
  notes           String?
  room            Room      @relation(fields: [roomId], references: [id], onDelete: Cascade)
}

model Booking {
  id              String        @id // e.g. HR-849204
  userId          String?
  roomId          String
  roomNumber      String?
  checkInDate     DateTime      @db.Date
  checkOutDate    DateTime      @db.Date
  nights          Int
  adults          Int
  children        Int
  guestName       String
  guestEmail      String
  guestPhone      String
  specialRequests String?       @db.Text
  baseAmount      Decimal       @db.Decimal(10, 2)
  taxAmount       Decimal       @db.Decimal(10, 2)
  discountCode    String?
  discountAmount  Decimal       @default(0.00) @db.Decimal(10, 2)
  totalAmount     Decimal       @db.Decimal(10, 2)
  paidAmount      Decimal       @default(0.00) @db.Decimal(10, 2)
  status          BookingStatus @default(PENDING)
  paymentStatus   PaymentStatus @default(PENDING)
  paymentId       String?
  paymentMethod   String?       // "RAZORPAY", "PAY_AT_HOTEL", "UPI"
  cancellationReason String?
  refundAmount    Decimal?      @db.Decimal(10, 2)
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  user            User?         @relation(fields: [userId], references: [id])
  room            Room          @relation(fields: [roomId], references: [id])
  payment         Payment?
}

model Payment {
  id                String        @id @default(uuid())
  bookingId         String        @unique
  gateway           String        // "RAZORPAY"
  orderId           String        @unique // Razorpay Order ID
  paymentId         String?       @unique // Razorpay Payment ID
  amount            Decimal       @db.Decimal(10, 2)
  currency          String        @default("INR")
  status            PaymentStatus @default(PENDING)
  gatewaySignature  String?
  rawPayload        Json?
  createdAt         DateTime      @default(now())
  updatedAt         DateTime      @updatedAt

  booking           Booking       @relation(fields: [bookingId], references: [id], onDelete: Cascade)
}

model Coupon {
  id                String    @id @default(uuid())
  code              String    @unique
  discountType      String    // "PERCENTAGE" | "FLAT"
  discountValue     Decimal   @db.Decimal(10, 2)
  minBookingAmount  Decimal   @default(0.00) @db.Decimal(10, 2)
  maxDiscount       Decimal?  @db.Decimal(10, 2)
  startDate         DateTime
  endDate           DateTime
  usageLimit        Int       @default(100)
  usedCount         Int       @default(0)
  isActive          Boolean   @default(true)
}

model RestaurantMenuItem {
  id          String    @id @default(uuid())
  name        String
  category    String    // "Starters", "Main Course", "Biryani", "Chinese", "Tandoor", "Desserts", "Beverages"
  description String    @db.Text
  price       Decimal   @db.Decimal(10, 2)
  image       String
  isVeg       Boolean   @default(true)
  isAvailable Boolean   @default(true)
  isFeatured  Boolean   @default(false)
}

model BanquetEnquiry {
  id          String    @id @default(uuid())
  name        String
  email       String
  phone       String
  eventType   String    // "Wedding Reception", "Corporate Summit", "Engagement", "Birthday Party", "Annual Gala"
  eventDate   DateTime
  guestCount  Int
  venue       String    // "AC Banquet Hall", "Executive Boardroom", "Celebration Lawn"
  budget      String?
  message     String?   @db.Text
  status      String    @default("NEW") // "NEW", "CONTACTED", "QUOTED", "CONFIRMED", "COMPLETED", "LOST"
  notes       String?   @db.Text
  createdAt   DateTime  @default(now())
}

model Enquiry {
  id          String    @id @default(uuid())
  type        String    // "GENERAL", "BANQUET", "RESTAURANT_TABLE"
  name        String
  email       String
  phone       String
  date        DateTime?
  guestCount  Int?
  venueId     String?
  message     String    @db.Text
  status      String    @default("NEW") // "NEW", "CONTACTED", "RESOLVED"
  createdAt   DateTime  @default(now())
}

model Review {
  id          String    @id @default(uuid())
  userId      String?
  author      String
  role        String?
  location    String?
  rating      Int       @default(5)
  comment     String    @db.Text
  isApproved  Boolean   @default(false)
  createdAt   DateTime  @default(now())

  user        User?     @relation(fields: [userId], references: [id])
}

model AuditLog {
  id          String    @id @default(uuid())
  timestamp   DateTime  @default(now())
  adminUser   String
  action      String
  entity      String
  entityId    String
  oldValue    String?   @db.Text
  newValue    String?   @db.Text
  ipAddress   String?
}

model HotelSetting {
  key         String    @id
  value       String    @db.Text
  updatedAt   DateTime  @updatedAt
}
```

---

## 7. Comprehensive REST API Specification

**Base URL:** `https://api.hotelreliance.com/v1` (or local `http://localhost:5000/api/v1`)

### 7.1 Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/auth/signup` | Register new guest account | No |
| `POST` | `/auth/signin` | Login via email/password | No |
| `POST` | `/auth/send-otp` | Send 6-digit SMS OTP to phone | No |
| `POST` | `/auth/verify-otp` | Verify SMS OTP & issue tokens | No |
| `POST` | `/auth/refresh` | Refresh expired access token | Refresh Token |
| `GET` | `/auth/me` | Fetch logged-in user profile | Bearer Token |
| `PUT` | `/auth/profile` | Update profile info | Bearer Token |

### 7.2 Rooms & Availability Endpoints

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/rooms` | List all active rooms | No |
| `GET` | `/rooms/:slug` | Get single room details by slug | No |
| `POST` | `/rooms/check-availability` | Check date range availability & computed taxes | No |
| `PUT` | `/admin/rooms/:id/pricing` | Admin: Override base & peak rates | Admin Token |

### 7.3 Bookings & Reservations Endpoints

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/bookings/lock-room` | Hold room inventory for 10 minutes | No |
| `POST` | `/bookings/create` | Create booking record and generate Razorpay order | Optional |
| `GET` | `/bookings/:id` | Fetch booking invoice by ID | Optional |
| `GET` | `/bookings/my-bookings` | List user's booking history | Bearer Token |
| `POST` | `/bookings/:id/cancel` | Cancel upcoming reservation | Bearer Token |
| `GET` | `/admin/bookings` | Admin: List all bookings with filters & pagination | Admin Token |
| `PUT` | `/admin/bookings/:id/status` | Admin: Update status (`CHECKED_IN`, `CHECKED_OUT`) | Admin Token |

### 7.4 Enquiries & Quotations Endpoints

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/enquiries/general` | Submit contact form enquiry | No |
| `POST` | `/enquiries/banquet` | Submit banquet hall quotation request | No |
| `POST` | `/enquiries/restaurant` | Submit table booking request | No |
| `GET` | `/admin/enquiries` | Admin: List incoming leads by status | Admin Token |

### 7.5 Hotel Settings Endpoints

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/settings` | Fetch public hotel configuration | No |
| `PUT` | `/admin/settings` | Admin: Update hotel phone, email, address, social URLs | Admin Token |

---

## 8. Razorpay Payment Gateway & Webhook Pipeline

### 8.1 Workflow
1. Client submits checkout data to `POST /bookings/create`.
2. Backend generates Razorpay Order:
   ```javascript
   const order = await razorpay.orders.create({
     amount: Math.round(grandTotal * 100), // Amount in paise
     currency: "INR",
     receipt: bookingId,
     notes: { roomId, checkIn, checkOut, guestName }
   });
   ```
3. Frontend opens Razorpay popup.
4. On success, client sends verification payload to `POST /payments/verify`:
   ```javascript
   const crypto = require("crypto");
   const generatedSignature = crypto
     .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
     .update(`${razorpay_order_id}|${razorpay_payment_id}`)
     .digest("hex");

   if (generatedSignature === razorpay_signature) {
     // Mark Booking CONFIRMED, Payment PAID
     // Dispatch WhatsApp confirmation and Email invoice
   }
   ```
5. `POST /payments/webhook` handles asynchronous payments if the guest closes the browser prematurely.

---

## 9. Concurrency & Distributed Lock System (Redis)

To prevent simultaneous double-booking during high-demand festival seasons:

```javascript
// Redis Distributed Lock on Room Inventory
const lockKey = `hold:inventory:${roomId}:${checkInDate}_${checkOutDate}`;
const isLocked = await redis.set(lockKey, bookingId, "NX", "EX", 600); // 10-minute hold

if (!isLocked) {
  return res.status(409).json({
    error: "This suite is currently on temporary hold by another guest during checkout."
  });
}
```

---

## 10. Automated Notifications Pipeline (WhatsApp, Email, SMS)

When a booking transitions to `CONFIRMED`:

```
                                      +------------------------------------+
                                      |    Booking Status = 'CONFIRMED'    |
                                      +-----------------+------------------+
                                                        |
                         +------------------------------+------------------------------+
                         |                                                             |
                         v                                                             v
              +----------------------+                                      +----------------------+
              |  WhatsApp Cloud API  |                                      |   Transactional SMTP |
              |  (Booking Template)  |                                      |   (PDF Tax Invoice)  |
              +----------------------+                                      +----------------------+
                         |                                                             |
                         v                                                             v
                 Guest Mobile Phone                                            Guest Email Inbox
```

### Official Verified Social Links Configured:
- **Facebook**: `https://www.facebook.com/share/1N5dD3DvRk/`
- **Instagram**: `https://www.instagram.com/hotelreliancebokaro?igsh=MWI3bGpoODVnNHRvdA==`
- **YouTube**: `https://youtube.com/@hotelreliancebokaro2683?si=1CpOpWNnGipC5R2A`

---

## 11. Environment Variables & Deployment Checklist

```bash
# Server & Port
PORT=5000
NODE_ENV=production
FRONTEND_URL="https://hotelreliance.com"

# Database & Cache
DATABASE_URL="postgresql://reliance_user:password@localhost:5432/hotel_reliance_db?schema=public"
REDIS_URL="redis://localhost:6379"

# JWT Authentication
JWT_SECRET="super-secret-256-bit-key"
JWT_EXPIRES_IN="7d"
REFRESH_TOKEN_SECRET="refresh-token-secret-key"

# Razorpay Payments
RAZORPAY_KEY_ID="rzp_live_xxxxxxxxxxxx"
RAZORPAY_KEY_SECRET="xxxxxxxxxxxxxxxxxxxxxxxx"
RAZORPAY_WEBHOOK_SECRET="whsec_xxxxxxxxxxxxxxxxxxxx"

# WhatsApp Cloud API & Email
WHATSAPP_API_TOKEN="EAAG..."
WHATSAPP_PHONE_NUMBER_ID="1098234892..."
RESEND_API_KEY="re_xxxxxxxxxxxx"
ADMIN_NOTIFICATION_EMAIL="reservation@hotelreliance.com"
```
