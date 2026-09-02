# Hotel Reliance — Backend Developer Integration Guide & System Architecture

This guide provides a comprehensive technical blueprint for backend engineers integrating APIs, databases, authentication, payments, and background worker services with the **Hotel Reliance Next.js 16 Web Application**.

---

## 1. System Overview & Architecture Diagram

Hotel Reliance is a luxury hospitality portal for a boutique luxury hotel in Bokaro Steel City, Jharkhand, India. The frontend is built on **Next.js 16 (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS**.

```
                           +-------------------------------------+
                           |      Hotel Reliance Frontend        |
                           |       (Next.js 16 App Router)       |
                           +------------------+------------------+
                                              |
                                              | HTTPS / JSON
                                              v
                           +-------------------------------------+
                           |         Backend API Gateway         |
                           |   (Node.js / Express / NestJS / Go) |
                           +--+---------------+---------------+--+
                              |               |               |
               +--------------+       +-------+-------+       +--------------+
               |                      |               |                      |
               v                      v               v                      v
        +--------------+      +---------------+ +------------+       +---------------+
        |  PostgreSQL  |      | Redis Cache & | | Auth & OTP |       |   Payments    |
        |  (Prisma ORM)|      |  Room Locks   | | (JWT / SMS)|       | (Razorpay API)|
        +--------------+      +---------------+ +------------+       +---------------+
               |                                                             |
               +----------------------+---------------+----------------------+
                                      |               |
                                      v               v
                              +---------------+ +-------------+
                              | WhatsApp / SMS| | Resend/Email|
                              | Notifications | | Invoices    |
                              +---------------+ +-------------+
```

---

## 2. Database Schema (Prisma / PostgreSQL Reference)

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
  id          String    @id @default(uuid())
  roomNumber  String    @unique
  roomId      String
  floor       Int
  isOccupied  Boolean   @default(false)
  room        Room      @relation(fields: [roomId], references: [id], onDelete: Cascade)
}

model Booking {
  id              String        @id // e.g. HR-849204
  userId          String?
  roomId          String
  checkInDate     DateTime      @db.Date
  checkOutDate    DateTime      @db.Date
  nights          Int
  adults          Int
  children        Int
  guestName       String
  guestEmail      String
  guestPhone      String
  specialRequests String?       @db.Text
  totalAmount     Decimal       @db.Decimal(10, 2)
  taxAmount       Decimal       @db.Decimal(10, 2)
  discountCode    String?
  discountAmount  Decimal       @default(0.00) @db.Decimal(10, 2)
  status          BookingStatus @default(PENDING)
  paymentStatus   PaymentStatus @default(PENDING)
  paymentId       String?
  paymentMethod   String?       // "RAZORPAY", "PAY_AT_HOTEL", "UPI"
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  user            User?         @relation(fields: [userId], references: [id])
  room            Room          @relation(fields: [roomId], references: [id])
  payment         Payment?
}

model Payment {
  id                String        @id @default(uuid())
  bookingId         String        @unique
  gateway           String        // "RAZORPAY", "CASHFREE", "STRIPE"
  orderId           String        @unique // Gateway Order ID
  paymentId         String?       @unique // Gateway Transaction ID
  amount            Decimal       @db.Decimal(10, 2)
  currency          String        @default("INR")
  status            PaymentStatus @default(PENDING)
  gatewaySignature  String?
  rawPayload        Json?
  createdAt         DateTime      @default(now())
  updatedAt         DateTime      @updatedAt

  booking           Booking       @relation(fields: [bookingId], references: [id], onDelete: Cascade)
}

model Offer {
  id            String    @id @default(uuid())
  title         String
  description   String    @db.Text
  discountCode  String    @unique
  discountValue String    // "15% OFF", "FLAT ₹500 OFF"
  discountPct   Decimal?  @db.Decimal(5, 2)
  discountFixed Decimal?  @db.Decimal(10, 2)
  category      String    // "Staycation", "Corporate", "Wedding", "Dining"
  expiryDate    DateTime
  image         String
  inclusions    String[]
  terms         String?   @db.Text
  isActive      Boolean   @default(true)
}

model Enquiry {
  id          String    @id @default(uuid())
  type        String    // "GENERAL", "BANQUET", "RESTAURANT_TABLE", "CORPORATE"
  name        String
  email       String
  phone       String
  date        DateTime?
  guestCount  Int?
  message     String    @db.Text
  status      String    @default("NEW") // "NEW", "CONTACTED", "RESOLVED"
  createdAt   DateTime  @default(now())
}

model Review {
  id        String   @id @default(uuid())
  userId    String?
  author    String
  role      String?
  location  String?
  rating    Int      @default(5)
  comment   String   @db.Text
  isApproved Boolean @default(false)
  createdAt DateTime @default(now())

  user      User?    @relation(fields: [userId], references: [id])
}
```

---

## 3. REST API Specifications

Base URL: `https://api.hotelreliance.com/v1` (or local `http://localhost:5000/api/v1`)

### 3.1 Authentication & Profile

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/auth/signup` | Register new guest account | No |
| `POST` | `/auth/signin` | Login via email/password | No |
| `POST` | `/auth/send-otp` | Send phone SMS OTP for swift login | No |
| `POST` | `/auth/verify-otp` | Verify SMS OTP & issue JWT tokens | No |
| `POST` | `/auth/refresh` | Refresh expired JWT access token | Refresh Token |
| `GET` | `/auth/me` | Fetch authenticated user profile | Bearer Token |
| `PUT` | `/auth/profile` | Update profile details (Name, Phone) | Bearer Token |

#### Sample Request: `POST /auth/signin`
```json
{
  "email": "executive@tata.com",
  "password": "SecurePassword123!"
}
```

#### Sample Response:
```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "d8f34928-3e4b-4f9e-9d8a-...",
  "user": {
    "id": "usr_94829103",
    "name": "Rajesh Sharma",
    "email": "executive@tata.com",
    "phone": "+91 94311 00000",
    "role": "GUEST"
  }
}
```

---

### 3.2 Rooms & Availability

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/rooms` | List all available rooms | No |
| `GET` | `/rooms/:slug` | Get specific room by slug (`deluxe`, `executive`, `premium`, `family`) | No |
| `POST` | `/rooms/check-availability` | Check room availability for given date range & guests | No |

#### Sample Request: `POST /rooms/check-availability`
```json
{
  "checkIn": "2026-09-15",
  "checkOut": "2026-09-18",
  "adults": 2,
  "children": 1
}
```

#### Sample Response:
```json
{
  "availableRooms": [
    {
      "id": "executive",
      "name": "Executive Room",
      "slug": "executive",
      "pricePerNight": 3499,
      "availableUnits": 4,
      "totalStayPrice": 10497,
      "tax": 1259.64,
      "grandTotal": 11756.64
    },
    {
      "id": "premium",
      "name": "Premium Suite",
      "slug": "premium",
      "pricePerNight": 4999,
      "availableUnits": 2,
      "totalStayPrice": 14997,
      "tax": 1799.64,
      "grandTotal": 16796.64
    }
  ]
}
```

---

### 3.3 Bookings & Reservations

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/bookings/lock-room` | Temporarily lock inventory for 10 min during checkout | No |
| `POST` | `/bookings/create` | Finalize reservation and generate order | Optional |
| `GET` | `/bookings/:bookingId` | Fetch reservation invoice by confirmation ID | Optional (or Signed URL) |
| `GET` | `/bookings/my-bookings` | List all bookings for logged-in guest | Bearer Token |
| `POST` | `/bookings/:bookingId/cancel` | Cancel upcoming reservation according to policy | Bearer Token |

#### Sample Request: `POST /bookings/create`
```json
{
  "roomId": "executive",
  "checkIn": "2026-09-15",
  "checkOut": "2026-09-18",
  "adults": 2,
  "children": 0,
  "guest": {
    "name": "Rajesh Sharma",
    "email": "executive@tata.com",
    "phone": "+91 94311 00000",
    "specialRequests": "Quiet high-floor room with early check-in request."
  },
  "discountCode": "STAYRELIANCE",
  "paymentMethod": "RAZORPAY"
}
```

#### Sample Response:
```json
{
  "booking": {
    "id": "HR-849204",
    "status": "PENDING",
    "checkIn": "2026-09-15",
    "checkOut": "2026-09-18",
    "nights": 3,
    "room": {
      "id": "executive",
      "name": "Executive Room",
      "pricePerNight": 3499
    },
    "totalPrice": 10497,
    "taxAmount": 1259.64,
    "discountAmount": 1574.55,
    "grandTotal": 10182.09
  },
  "razorpayOrder": {
    "orderId": "order_Ok8392Ksmx01",
    "amount": 1018209,
    "currency": "INR",
    "keyId": "rzp_live_xxxxxxxxxxxx"
  }
}
```

---

### 3.4 Payments & Webhook Architecture

#### Payment Flow:
1. Client calls `/bookings/create` with reservation info.
2. Backend creates a pending `Booking` in DB, calls Razorpay API to generate an `order_id`, and returns it to the client.
3. Next.js frontend launches the Razorpay Checkout Modal.
4. Guest completes payment via UPI / Netbanking / Credit Card.
5. Razorpay returns `{ razorpay_payment_id, razorpay_order_id, razorpay_signature }` to frontend.
6. Client posts verification payload to `/payments/verify`.
7. Backend verifies HMAC SHA-256 signature using `RAZORPAY_SECRET`, marks Booking as `CONFIRMED`, assigns room unit, and triggers confirmation WhatsApp/Email.

#### Signature Verification (Node.js Reference):
```javascript
const crypto = require("crypto");

function verifyRazorpaySignature(orderId, paymentId, signature, secret) {
  const body = orderId + "|" + paymentId;
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body.toString())
    .digest("hex");
  return expectedSignature === signature;
}
```

#### Webhook Endpoint: `POST /payments/webhook`
- Handles asynchronous confirmation in case guest closes the browser before frontend verification.
- Validates `x-razorpay-signature` header.
- Idempotently marks booking as `CONFIRMED`.

---

### 3.5 Enquiries & Banquet Submissions

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/enquiries/general` | Submit contact page enquiry form |
| `POST` | `/enquiries/banquet` | Submit conference or wedding hall quotation request |
| `POST` | `/enquiries/restaurant` | Book table at Kwality Restaurant |

---

## 4. Concurrency & Double-Booking Prevention (Redis Lock)

To prevent simultaneous double-booking of finite room inventory:

1. Use a **Redis Distributed Lock** during `/bookings/lock-room` key:
   `lock:room:{roomId}:{date}`
2. Temporary hold lock expires in **10 minutes** (TTL 600s).
3. If checkout succeeds or fails, release or decrement lock accordingly.

```javascript
// Redis lock algorithm
const lockKey = `hold:inventory:${roomId}:${dateStr}`;
const acquired = await redis.set(lockKey, bookingId, "NX", "EX", 600);
if (!acquired) {
  throw new Error("Selected room is currently on temporary hold by another guest.");
}
```

---

## 5. Automated Guest Notification Pipeline

When a booking changes status to `CONFIRMED`:

1. **WhatsApp Cloud API**:
   - Send template message with reservation ID, check-in date, Google Maps directions to Hotel Reliance, Bokaro.
2. **Transactional Email (Resend / SendGrid)**:
   - Deliver branded PDF Tax Invoice with check-in instructions.
3. **Internal Hotel Reception Alert**:
   - Webhook trigger to front desk notification center / Telegram bot for GM & Front Office Manager.

---

## 6. Environment Variables (`.env`)

```bash
# Server & Database
PORT=5000
NODE_ENV=production
DATABASE_URL="postgresql://reliance_user:password@localhost:5432/hotel_reliance_db?schema=public"
REDIS_URL="redis://localhost:6379"

# JWT Secrets
JWT_SECRET="your-256-bit-secret"
JWT_EXPIRES_IN="7d"
REFRESH_TOKEN_SECRET="your-refresh-secret"

# Payment Gateways
RAZORPAY_KEY_ID="rzp_live_xxxxxxxxxxxx"
RAZORPAY_KEY_SECRET="xxxxxxxxxxxxxxxxxxxxxxxx"
RAZORPAY_WEBHOOK_SECRET="whsec_xxxxxxxxxxxxxxxxxxxx"

# Communication & Notifications
WHATSAPP_API_TOKEN="EAAG..."
WHATSAPP_PHONE_NUMBER_ID="1098234892..."
RESEND_API_KEY="re_xxxxxxxxxxxx"
FRONTEND_URL="https://hotelreliance.com"
```
