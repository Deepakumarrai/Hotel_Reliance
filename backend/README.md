# 🏨 Hotel Reliance — Backend API Service

Production-ready REST API and PostgreSQL database layer for the Hotel Reliance luxury hospitality portal, built with **Node.js**, **Express**, **TypeScript**, and **Prisma ORM**.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 3. Generate Prisma Client & Migrate
```bash
# Generate the type-safe Prisma client
npm run prisma:generate

# (Optional) Apply migrations to your PostgreSQL database:
npm run prisma:migrate

# Seed database with Hotel Reliance rooms, offers, and admin:
npm run prisma:seed
```

### 4. Start Development Server
```bash
npm run dev
```
The API will be live at `http://localhost:5000/api/v1` with automatic hot reloading via `nodemon`.

---

## 📡 Core API Endpoints

### Health Check
- `GET /api/v1/health`

### Authentication (`/api/v1/auth`)
- `POST /api/v1/auth/signup` — Register guest account
- `POST /api/v1/auth/signin` — Login via email & password
- `POST /api/v1/auth/send-otp` — Send SMS OTP
- `POST /api/v1/auth/verify-otp` — Verify OTP & issue JWT
- `POST /api/v1/auth/refresh` — Refresh access token
- `GET /api/v1/auth/me` — Get current profile (Bearer token)
- `PUT /api/v1/auth/profile` — Update profile (Bearer token)

### Rooms (`/api/v1/rooms`)
- `GET /api/v1/rooms` — List all active rooms
- `GET /api/v1/rooms/:slug` — Get room details (`deluxe`, `executive`, `premium`, `family`)
- `POST /api/v1/rooms/check-availability` — Check room availability & calculate stay pricing with taxes

### Bookings & Concurrency (`/api/v1/bookings`)
- `POST /api/v1/bookings/lock-room` — Hold room inventory for 10 minutes during checkout
- `POST /api/v1/bookings/create` — Create reservation & generate Razorpay order
- `GET /api/v1/bookings/my-bookings` — List authenticated user's bookings
- `GET /api/v1/bookings/:bookingId` — Fetch booking tax invoice / voucher
- `POST /api/v1/bookings/:bookingId/cancel` — Cancel upcoming booking

### Payments (`/api/v1/payments`)
- `POST /api/v1/payments/create-order` — Create Razorpay payment order
- `POST /api/v1/payments/verify` — Verify HMAC SHA-256 payment signature & confirm booking
- `POST /api/v1/payments/webhook` — Razorpay webhook event listener

### Enquiries (`/api/v1/enquiries`)
- `POST /api/v1/enquiries/general` — Contact form submission
- `POST /api/v1/enquiries/banquet` — Banquet hall quotation request
- `POST /api/v1/enquiries/restaurant` — Table booking at Kwality Restaurant

---

## 🛠 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts server with `nodemon` + `ts-node` hot reloading |
| `npm run build` | Compiles TypeScript into `./dist` |
| `npm start` | Runs production bundle from `./dist/server.js` |
| `npm run prisma:generate` | Generates type-safe Prisma client |
| `npm run prisma:migrate` | Runs database migrations |
| `npm run prisma:seed` | Seeds rooms, units, and initial offers |
| `npm run prisma:studio` | Launches Prisma Studio GUI at `http://localhost:5555` |
