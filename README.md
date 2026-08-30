# Hotel Reliance Frontend

This is a premium, frontend-only, modular web application built for **Hotel Reliance** in Bokaro Steel City, Jharkhand, India. 

The application is structured to serve as a robust, scalable Next.js UI foundation that can be easily connected to a database, authentication server, and payment gateway in the future without restructuring the frontend folder layout.

---

## 1. Technology Stack

- **Framework**: Next.js (App Router, dynamic page conventions, SEO metadata)
- **Programming Language**: TypeScript (strict typing, interfaces)
- **Styling**: Tailwind CSS v4 (configured via modern utility themes inside `globals.css`)
- **Library**: React (Client/Server component optimizations)
- **Icons**: Lucide React for consistent vector symbols
- **Linter**: ESLint

---

## 2. Directory Architecture

```text
hotel-reliance/
│
├── app/                      # Next.js App Router folders
│   ├── layout.tsx            # Global layout wrapper (Fonts, Nav, Footer, SEO)
│   ├── page.tsx              # Homepage composition
│   ├── globals.css           # Styling system & Tailwind V4 overrides
│   │
│   ├── rooms/                # Rooms search & dynamic routing
│   │   ├── page.tsx          # Rooms catalog list
│   │   ├── loading.tsx       # Rooms list loading fallback
│   │   ├── error.tsx         # Rooms list error boundary
│   │   └── [roomSlug]/       
│   │       ├── page.tsx      # Room dynamic details page
│   │       ├── loading.tsx   # Room detail loading fallback
│   │       └── not-found.tsx # Room details 404 handler
│   │
│   ├── about/                # About Us page
│   ├── banquet/              # Meeting and event banquets page
│   ├── restaurant/           # Kwality Restaurant dining page
│   ├── places/               # Local Bokaro attractions guide
│   ├── contact/              # Contact info & message enquiry form
│   │
│   └── booking/              # Stay reservation wizard
│       ├── page.tsx          # Multi-step booking client flow
│       ├── loading.tsx       # Booking wizard loading fallback
│       └── confirmation/     
│           └── page.tsx      # Reservation confirmation invoice
│
├── components/               # Modular frontend blocks
│   ├── layout/               # Navbar, MobileMenu, Footer, FloatingWhatsApp, BackToTop
│   ├── ui/                   # Reusable UI primitives (Button, Container, Modal, Skeleton)
│   ├── home/                 # Individual homepage section blocks
│   ├── rooms/                # Card, Grid, Gallery details modules
│   ├── banquet/              # Venue summaries, Enquiry forms
│   ├── contact/              # Enquiry message forms
│   └── booking/              # Date selector, guest counters, confirmations
│
├── data/                     # Externalized mock database files (Rooms, navigation, FAQs)
├── lib/                      # Standard validation rules, mock API endpoints, formatters
├── types/                    # TypeScript interfaces
└── public/                   # Static photo vectors and images
```

---

## 3. Installation & Run Guides

Ensure you have [Node.js](https://nodejs.org) installed.

### 1. Install Dependencies
```bash
npm install
```

### 2. Launch Local Dev Server
```bash
npm run dev
```
Open `http://localhost:3000` to preview in browser.

### 3. Build & Compile for Production
```bash
npm run build
```

### 4. Run Compiled Production Server
```bash
npm start
```

---

## 4. Operational Instructions & Content Updates

### How to update Hotel details
Open [data/hotel.ts](file:///c:/Users/deepa/OneDrive/Desktop/hotel%20reliance/data/hotel.ts) to update phone numbers, emails, addresses, and coordinates. The entire website reads from this file to ensure zero duplication of facts.

### How to add a new Room category
1. Save room thumbnail photographs in `public/images/rooms/<new-slug>/`.
2. Open [data/rooms.ts](file:///c:/Users/deepa/OneDrive/Desktop/hotel%20reliance/data/rooms.ts).
3. Append a new object complying with the `Room` interface:
```typescript
{
  id: "super-deluxe-room",
  slug: "super-deluxe",
  name: "Super Deluxe Room",
  description: "Brief visual summary...",
  longDescription: "Detailed paragraphs...",
  images: ["/images/rooms/super-deluxe/main.jpg"],
  amenities: ["King Bed", "Wi-Fi", "Minibar"],
  occupancy: 2,
  bedType: "King Bed",
  price: null, // Set to a number when live rates are loaded
  featured: true
}
```

---

## 5. Future Backend Connection Notes

The frontend uses simulated async operations to match network call boundaries. Connecting a real API is straightforward:

- **Rooms Retrieval**:
  Replace calls to `roomsData` in dynamic detail pages with `fetch('/api/rooms')` requests returning the room objects.
- **Availability Checker**:
  Open [lib/booking.ts](file:///c:/Users/deepa/OneDrive/Desktop/hotel%20reliance/lib/booking.ts). Swap out the return statement in `checkAvailability()` with a database query verifying active dates.
- **Booking Creation**:
  Replace `createBooking()` mock return with an HTTP POST request sending `BookingState` to `/api/reservations`. On success, pass the generated invoice reference code to `/booking/confirmation`.
- **Contact Forms**:
  Replace the mock setTimeout in `ContactForm.tsx` and `BanquetEnquiry.tsx` with a fetch post to email or webhook endpoints.
