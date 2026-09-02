# 🏨 Hotel Reliance — Full-Stack Technical Documentation & Developer Guide

Welcome to the official codebase for **Hotel Reliance**, the premier boutique luxury hotel in Bokaro Steel City, Jharkhand, India.

This repository is an enterprise-grade **Next.js 16 (App Router)** web application featuring ultra-high-resolution imagery, bespoke micro-animations, a multi-step booking engine, authentication flows, Kwality fine dining showcase, banquet coordinator, interactive cinema carousels, and complete TypeScript architecture.

---

## 📑 Table of Contents

1. [Quick Start & Local Execution](#1-quick-start--local-execution)
2. [Tech Stack & Architecture](#2-tech-stack--architecture)
3. [Repository Directory Hierarchy](#3-repository-directory-hierarchy)
4. [Complete Page & Route Catalog (34 Routes)](#4-complete-page--route-catalog-34-routes)
5. [Frontend Components & Systems Breakdown](#5-frontend-components--systems-breakdown)
6. [Data Layer, Schemas & Types](#6-data-layer-schemas--types)
7. [Backend Developer Integration Blueprint](#7-backend-developer-integration-blueprint)
8. [Asset & Media Catalog](#8-asset--media-catalog)
9. [Performance, SEO & Production Build](#9-performance-seo--production-build)

---

## 1. Quick Start & Local Execution

### Prerequisites
- **Node.js**: v18.18.0 or v20+ recommended
- **Package Manager**: `npm` (v9+) or `pnpm`

### Installation & Launch

```bash
# 1. Clone the repository
git clone https://github.com/Deepakumarrai/Hotel_Reliance.git
cd "hotel reliance"

# 2. Install dependencies
npm install

# 3. Start local development server (with Turbopack)
npm run dev

# 4. Open browser
# Navigate to http://localhost:3000
```

### Production Build & Verification

```bash
# Run strict TypeScript check and compile static HTML + server routes
npm run build

# Preview production build locally
npm start
```

---

## 2. Tech Stack & Architecture

- **Framework**: [Next.js 16.3.3](https://nextjs.org/) (App Router, Server & Client Components, Turbopack, Dynamic Segment Conventions)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/) (Strict typing, comprehensive data models)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & Vanilla CSS design tokens in `app/globals.css`
- **Iconography**: [Lucide React](https://lucide.dev/) (Thin-stroke luxury icons)
- **Typography**: Google Fonts (*Playfair Display* serif headers, *Outfit* body copy, *Cinzel* luxury badges)
- **Animation**: CSS Keyframes, cubic-bezier transitions, dynamic backdrop synchronization
- **Architecture**: Modular Component-Driven Architecture (Atomic UI primitives, feature modules, externalized data fixtures)

---

## 3. Repository Directory Hierarchy

```text
hotel-reliance/
│
├── app/                                # Next.js 16 App Router Routes
│   ├── layout.tsx                      # Root Layout (Navbar, Footer, WhatsApp floating widget, SEO)
│   ├── page.tsx                        # Homepage composition (Hero, ExclusivelyForYou, Rooms, Amenities, Dining, Banquets, Places, Offers)
│   ├── globals.css                     # Global design tokens, color palette, animations, reset
│   │
│   ├── about/                          # About Us page (Philosophy, Walkthrough Video, Team, Hospitality Standards, Gallery)
│   ├── banquet/                        # Banquets & Conferences (Hall capacity, lawn details, quotation form)
│   ├── restaurant/                     # Kwality Restaurant (Dual Ambiance Showcase, Chef Specialties, Hours)
│   ├── places/                         # Bokaro Steel City Guide (Overview grid)
│   │   └── [placeSlug]/                # Dynamic Attraction Details (Jagannath Temple, City Park, Bokaro Steel Plant, etc.)
│   ├── rooms/                          # Rooms Catalog (Filterable grid by price & capacity)
│   │   └── [roomSlug]/                 # Dynamic Room Details (Deluxe, Executive, Premium, Family Suite)
│   ├── offers/                         # Offers & Promotions (Promo code 1-click copy, terms, category filters)
│   ├── gallery/                        # Interactive Photo Gallery (Lightbox modal, category tabs)
│   ├── contact/                        # Contact Information, Google Maps, Interactive Enquiry Form
│   ├── faq/                            # Categorized Accordion FAQ
│   ├── policies/                       # House Rules, Check-in/out, Cancellation, Child Policies
│   ├── privacy-policy/                 # Privacy Policy legal document
│   ├── terms-and-conditions/           # Terms & Conditions legal document
│   │
│   ├── booking/                        # Multi-Step Stay Reservation Flow
│   │   ├── page.tsx                    # Step 1 (Dates & Guests) -> Step 2 (Select Room) -> Step 3 (Guest Info & Add-ons)
│   │   ├── confirmation/page.tsx       # Step 4 (Order Review & Tariff Calculation)
│   │   └── success/page.tsx            # Booking Success & Printable PDF Tax Invoice
│   │
│   ├── auth/                           # Guest Account Flow
│   │   ├── sign-in/page.tsx            # Sign In (Password / SMS OTP)
│   │   ├── sign-up/page.tsx            # Registration
│   │   ├── forgot-password/page.tsx    # Password recovery
│   │   └── verify/page.tsx             # 6-digit verification code entry
│   │
│   ├── profile/page.tsx                # Guest profile management & preferences
│   ├── my-bookings/                    # Guest Bookings History
│   │   ├── page.tsx                    # Bookings list (Upcoming, Completed, Cancelled)
│   │   └── [id]/page.tsx               # Dynamic Booking Details & Invoice
│   │
│   └── not-found.tsx                   # Luxury 404 handler
│
├── components/                         # Modular Component Library
│   ├── layout/                         # Structural Layouts
│   │   ├── Navbar.tsx                  # Responsive header with luxury gold accents, active indicator, mobile drawer
│   │   ├── Footer.tsx                  # Multi-column footer with contact, quick links, newsletter, copyright
│   │   └── FloatingWhatsApp.tsx        # Direct 1-click 24/7 concierge chat widget
│   │
│   ├── home/                           # Homepage Feature Blocks
│   │   ├── HeroSection.tsx             # Full-bleed cinematic video/image hero with quick date-picker bar
│   │   ├── ExclusivelyForYou.tsx       # Taj-style 3-panel cinema carousel with dynamic synchronized backdrop
│   │   ├── FeaturedRooms.tsx           # Luxury accommodation cards with tariff badges & amenities
│   │   ├── FacilitiesSection.tsx       # 6-card hospitality amenities grid with gold badges
│   │   ├── RestaurantPreview.tsx       # Kwality fine dining carousel with dish highlights
│   │   ├── EventsAndConferences.tsx    # AC Banquet & Open Lawn conference showcase
│   │   ├── PlacesPreview.tsx           # Bokaro Steel City top tourist landmarks
│   │   ├── OffersSection.tsx           # Special seasonal staycation offers
│   │   ├── TestimonialsSection.tsx     # Guest reviews with star ratings & avatars
│   │   └── HomeCTA.tsx                 # Direct reservation call-to-action banner
│   │
│   ├── booking/                        # Booking Engine Components
│   │   ├── DateSelector.tsx            # Check-in / Check-out calendar picker
│   │   ├── GuestCounter.tsx            # Adults and Children stepper
│   │   ├── RoomSelectionCard.tsx       # Selectable room tier card with live pricing
│   │   └── PriceBreakdown.tsx          # Real-time subtotal, GST (12%/18%), discount, grand total
│   │
│   └── ui/                             # Core UI Primitives
│       ├── Button.tsx                  # Gold, Dark, Outline, Ghost button variants
│       ├── Container.tsx               # Responsive max-width wrapper
│       ├── SectionHeading.tsx          # Luxury serif header with category kicker and gold divider
│       └── Modal.tsx                   # Accessible modal dialog
│
├── data/                               # Externalized Static & Mock Data
│   ├── hotel.ts                        # Master hotel data (Address, phones, email, check-in rules, GPS coordinates)
│   ├── rooms.ts                        # Detailed specs for Deluxe, Executive, Premium, Family rooms
│   ├── facilities.ts                   # Master amenities list (Free Wi-Fi, 24/7 Room Service, Parking, Power Backup)
│   ├── staff.ts                        # Leadership team (GM, Executive Head Chef, Front Office Mgr, Banquet Lead)
│   ├── offers.ts                       # Curated promo codes, discounts, validity dates, terms
│   ├── places.ts                       # Bokaro tourist spots with distances, history, visiting hours
│   ├── testimonials.ts                 # Real guest reviews and corporate client feedback
│   └── faq.ts                          # Categorized hospitality FAQs
│
├── types/                              # Strict TypeScript Definitions
│   ├── index.ts                        # Master type exporter
│   ├── room.ts                         # Room, RoomAmenity, RoomPrice models
│   ├── booking.ts                      # Booking, GuestDetails, BookingState models
│   ├── auth.ts                         # User, AuthState, Session models
│   ├── facility.ts                     # Facility, Amenity models
│   └── place.ts                        # Place, Attraction models
│
└── public/                             # Static Assets
    ├── images/                         # Curated photography
    │   ├── hero/                       # Hero banners
    │   ├── rooms/                      # Room interiors & suites
    │   ├── restaurant/                 # Kwality dining hall, canopy lounge, signature dishes
    │   ├── standards/                  # Guests First, Premium Quality, Safety & Security
    │   ├── staff/                      # Official leadership portraits
    │   ├── offers/                     # Widescreen lifestyle offers banner
    │   ├── banquet/                    # Wedding & conference venues
    │   └── gallery/                    # Hotel exterior, reception, lobby
    └── videos/
        └── hero.mp4                    # Cinematic hotel walkthrough video
```

---

## 4. Complete Page & Route Catalog (34 Routes)

Every route in the application is fully functional, statically typed, and optimized for SEO:

| Route Path | Description | Key Features |
|---|---|---|
| `/` | Homepage | Full-bleed Hero, 3-panel Cinema Carousel, Rooms, Amenities, Dining, Banquets, Bokaro Places, Offers |
| `/about` | About Hotel Reliance | Story & Philosophy, Video Walkthrough, Our Hospitality Standards, Leadership Team, Photo Gallery |
| `/rooms` | Rooms & Suites Catalog | Filterable by capacity & price, live tariff comparison, amenity badges |
| `/rooms/[roomSlug]` | Dynamic Room Details | Deluxe, Executive, Premium, Family Suite with full image carousel & instant booking |
| `/restaurant` | Kwality Fine Dining | Dual Ambiance Showcase, Signature Dishes (Murgh Malai Tikka, Paneer Butter Masala, Dum Biryani), Hours |
| `/banquet` | Banquets & Conferences | AC Banquet Hall, Open Celebration Lawn, capacity chart, quote enquiry form |
| `/booking` | 3-Step Booking Wizard | Date selector, room selector, guest information form, special requests |
| `/booking/confirmation` | Booking Confirmation | Order summary, tariff breakdown, GST calculation, payment method selection |
| `/booking/success` | Booking Success Invoice | Printable PDF tax invoice, confirmation code, WhatsApp receipt trigger |
| `/offers` | Offers & Promotions | Widescreen banner, 1-click promo code copy, category filter, tariff guarantee |
| `/gallery` | Photo Gallery | Lightbox viewer, high-res category filtering (Rooms, Dining, Events, Lobby) |
| `/places` | Bokaro Attractions Guide | Grid of local landmarks with distances and historical context |
| `/places/[placeSlug]` | Dynamic Place Details | Bokaro Steel Plant, Jagannath Temple, City Park, Garga Dam, Jawaharlal Nehru Park |
| `/contact` | Contact Us | Google Map embed, direct phone dialers, reception desk messaging form |
| `/faq` | Frequently Asked Questions | Categorized accordion FAQs (General, Booking, Dining, Banquets) |
| `/policies` | Hotel Policies | Check-in/out guidelines, ID requirements, pet policy, cancellation rules |
| `/privacy-policy` | Privacy Policy | Data protection, cookie policy, compliance documentation |
| `/terms-and-conditions` | Terms & Conditions | Booking agreements, tariffs, liability disclaimers |
| `/auth/sign-in` | Guest Sign In | Email/password login and 1-click SMS OTP login flow |
| `/auth/sign-up` | Guest Registration | Account creation with phone verification |
| `/auth/forgot-password` | Password Recovery | Email reset link generator |
| `/auth/verify` | OTP Verification | 6-digit PIN code input with resend countdown timer |
| `/profile` | Guest Profile Dashboard | Manage contact details, identity verification status, travel preferences |
| `/my-bookings` | Bookings History | Overview of upcoming stays, completed reservations, and cancellations |
| `/my-bookings/[id]` | Booking Details | Single reservation view with room specs, price summary, and cancellation request |

---

## 5. Frontend Components & Systems Breakdown

### 5.1 Taj-Style 3-Panel Cinema Carousel (`ExclusivelyForYou.tsx`)
- **Dynamic Synchronized Backdrop**: When a user switches slides, the entire section's background crossfades seamlessly to the exact high-resolution photograph active in the center card.
- **Glassmorphic Preview Panels**: Side preview frames use `backdrop-blur-sm bg-black/40 border-white/40`.
- **Golden Timeline Progress**: Real-time progress indicators (`01 / 05`) with 6-second auto-cycle and hover-pause.

### 5.2 Multi-Step Booking Engine (`/booking`)
- **State Persistence**: Uses client-side state management preserving selected dates, room selection, and guest details across navigation steps.
- **Dynamic Price Engine**: Calculates base stay price `(nights * pricePerNight)`, adds 12% or 18% GST according to Indian hotel tax slabs, and applies valid promo codes.
- **Invoice Generator**: Generates formatted printable receipts on `/booking/success` with timestamp, booking ID (`HR-XXXXXX`), and room unit assignments.

### 5.3 Kwality Restaurant Showcase (`/restaurant`)
- **Dual Ambiance Showcase**: Edge-to-edge uncropped display of both the **Grand Palace Dining Hall** (crystal chandelier hall) and the **Sunlit Canopy Bistro Lounge**.
- **Signature Chef Specialties**: Direct showcase of authentic kitchen creations (Murgh Malai Tikka, Paneer Butter Masala, and Dum Biryani) in uncompressed high definition (`unoptimized={true}`).

### 5.4 Hospitality Standards Grid (`/about`)
- **Bespoke Luxury Cards**: Three distinct cards (**Guests First**, **Premium Quality**, **Safety & Security**) featuring floating circular emblems, fleur-de-lis ornamental headers, and triple gold dot dividers.

---

## 6. Data Layer, Schemas & Types

All entities are strictly typed in `types/index.ts` and externalized into modular mock data fixtures in `data/*.ts`:

### Core Type Definitions
- `Room`: `id`, `slug`, `name`, `tagline`, `price`, `capacity`, `bedType`, `size`, `images`, `amenities`
- `Booking`: `id`, `checkIn`, `checkOut`, `nights`, `adults`, `children`, `room`, `guest`, `totalPrice`, `status`
- `GuestDetails`: `name`, `email`, `phone`, `specialRequests`
- `Offer`: `id`, `title`, `description`, `discountCode`, `discountValue`, `expiryDate`, `image`, `inclusions`
- `StaffMember`: `id`, `name`, `role`, `department`, `bio`, `image`, `experience`
- `Place`: `id`, `slug`, `title`, `category`, `distance`, `summary`, `description`, `image`, `bestTime`, `timings`

---

## 7. Backend Developer Integration Blueprint

For complete database schemas, REST API endpoints, Redis concurrency locks, and Razorpay webhook integrations, please read the companion document:

👉 **[BACKEND_INTEGRATION_GUIDE.md](./BACKEND_INTEGRATION_GUIDE.md)**

### Quick Backend Checklist:
1. **Database Setup**: Run PostgreSQL schema from `BACKEND_INTEGRATION_GUIDE.md`.
2. **REST API**: Implement endpoints matching the JSON contracts in `/v1/rooms`, `/v1/bookings`, and `/v1/auth`.
3. **Payment Webhook**: Configure `POST /api/v1/payments/webhook` for Razorpay / Cashfree signature validation.
4. **WhatsApp Cloud API**: Connect booking confirmation webhook to dispatch WhatsApp notifications to guests.

---

## 8. Asset & Media Catalog

All static media assets are located in `/public/images` and `/public/videos`:

- **Restaurant & Dining**:
  - `public/images/restaurant/image.png` — Palace Chandelier Dining Room
  - `public/images/restaurant/canopy-lounge.png` — Sunlit Canopy Bistro Lounge
  - `public/images/restaurant/murgh-malai-tikka.png` — Murgh Malai Tikka
  - `public/images/restaurant/paneer-butter-masala.png` — Paneer Butter Masala
  - `public/images/restaurant/dum-biryani.png` — Kwality Special Dum Biryani
- **Hospitality Standards**:
  - `public/images/standards/guest-first-hq.png` — Lilies, Bell & Guest First Plaque
  - `public/images/standards/premium-quality-hq.png` — Towels & Luxury Toiletries
  - `public/images/standards/safety-security-hq.png` — CCTV Security Camera
- **Leadership Portraits**:
  - `public/images/staff/vikramaditya-roy.png` — Vikramaditya Roy (General Manager)
  - `public/images/staff/sanjeev-sengupta.png` — Chef Sanjeev Sengupta (Executive Head Chef)
  - `public/images/staff/pooja-deshmukh.png` — Pooja Deshmukh (Front Office Manager)
  - `public/images/staff/arun-mishra.png` — Arun Kumar Mishra (Banquet Operations Lead)
- **Offers & Lifestyle**:
  - `public/images/offers/image-copy.png` — Widescreen Resort Couple Staycation Banner
- **Video**:
  - `public/videos/hero.mp4` — Cinematic Hotel Walkthrough

---

## 9. Performance, SEO & Production Build

### Performance Metrics:
- **Build Status**: 34/34 routes statically generated with 0 TypeScript/Next.js warnings.
- **Turbopack**: Fast compilation and Hot Module Replacement (HMR).
- **SEO Ready**: Full metadata titles, descriptions, OpenGraph tags, semantic HTML5 headings, and alt text on every image.

```bash
# Verify production readiness
npm run build
```

---

*Hotel Reliance — Luxury Hospitality in Bokaro Steel City.*
