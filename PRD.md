# SpaceSync — Product Requirements Document

**A co-working & event space booking platform**
Stack: Next.js (App Router) + TypeScript · MongoDB · Better Auth · Tailwind CSS · GSAP · Recharts

Deadline: **13 July, 8:00 PM**

---

## 1. Concept Summary

SpaceSync lets people discover and book work/event spaces (co-working desks, meeting rooms, event halls, studios). Three roles:

- **User (Renter)** — browses spaces, views details, books a time slot, leaves reviews after booking.
- **Host** — lists their own spaces (pending admin approval), manages their listings and incoming bookings.
- **Admin** — approves/rejects new space listings, manages users, views platform-wide stats.

No payment gateway required (not in requirements) — booking creates a request with status `pending → confirmed → completed/cancelled`, host confirms manually. This keeps scope realistic for a 3-day build.

---

## 2. Color System (max 3 primary + neutral)

Keep this locked everywhere — no exceptions, no extra accent colors.

| Role | Hex | Usage |
|---|---|---|
| **Primary** — Indigo | `#4F46E5` | Buttons, active nav, links, primary CTAs |
| **Secondary** — Amber | `#F59E0B` | Highlights, ratings, badges, secondary CTAs |
| **Accent** — Teal | `#0D9488` | Success states, confirmed badges, chart accents |
| **Neutral** | `#0F172A` (text) / `#F8FAFC` (bg) / `#E2E8F0` (borders) | Layout, cards, typography |

Dark neutral text on light neutral background. One accent per UI moment — don't mix all 3 in a single card.

**Typography:** `Inter` (body) + `Space Grotesk` (headings) via `next/font/google`. Rounded corners `rounded-xl` everywhere, consistent shadow `shadow-sm` on cards, consistent `border border-neutral-200`.

---

## 3. Tech Stack Decisions

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 15 (App Router) | Server components for public pages, client components for interactive bits |
| Language | TypeScript | strict mode on |
| Styling | Tailwind CSS v4 | utility-only, no CSS modules |
| Animation | GSAP + `@gsap/react` (`useGSAP` hook) | hero entrance, card hover/stagger, cursor-following blob, scroll-triggered sections (`ScrollTrigger`) |
| Auth | Better Auth | email/password + session cookie; `role` as `additionalFields` (`user` / `host` / `admin`) |
| Database | MongoDB (native driver or Mongoose) | Mongoose recommended for schema safety with TS |
| Charts | Recharts | host/admin dashboards |
| Image handling | Image URL input (no upload service required) — or imgBB if you want real uploads, optional |
| Deployment | Vercel (frontend+API routes) + MongoDB Atlas | free tier is enough |

---

## 4. Data Models (TypeScript interfaces + Mongoose schemas)

### `User`
```ts
interface User {
  _id: string;
  name: string;
  email: string;
  image?: string;
  role: "user" | "host" | "admin";
  createdAt: Date;
}
```

### `Space`
```ts
interface Space {
  _id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  images: string[];          // min 2-3 for gallery requirement
  category: "Co-working" | "Meeting Room" | "Event Hall" | "Studio";
  location: string;
  city: string;
  pricePerHour: number;
  capacity: number;
  amenities: string[];       // ["WiFi","Projector","Parking",...]
  rating: number;            // avg, computed from reviews
  reviewCount: number;
  status: "pending" | "approved" | "rejected";
  hostId: string;            // ref User
  createdAt: Date;
}
```

### `Booking`
```ts
interface Booking {
  _id: string;
  spaceId: string;
  userId: string;
  date: string;              // "2026-07-15"
  startTime: string;         // "10:00"
  endTime: string;           // "12:00"
  totalPrice: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: Date;
}
```

### `Review`
```ts
interface Review {
  _id: string;
  spaceId: string;
  userId: string;
  bookingId: string;         // only allowed if booking.status === "completed"
  rating: number;            // 1-5
  comment: string;
  createdAt: Date;
}
```

---

## 5. Route Map — Frontend Pages

### Public (logged out — min 3 nav routes)
| Route | Purpose |
|---|---|
| `/` | Landing page (hero + 7 sections) |
| `/explore` | Browse all spaces — search/filter/sort/pagination |
| `/spaces/[id]` | Space details (public) |
| `/about` | About page |
| `/contact` | Contact page |
| `/login` | Login |
| `/register` | Register |

### Logged in (min 5 nav routes — adds these)
| Route | Purpose |
|---|---|
| `/dashboard` | Role-aware dashboard home (redirects based on role) |
| `/dashboard/bookings` | User: my bookings history |
| `/items/add` | Host: add new space (protected, host+admin only) |
| `/items/manage` | Host: manage my spaces (protected) |
| `/dashboard/host/bookings` | Host: incoming booking requests, confirm/cancel |
| `/dashboard/admin/approvals` | Admin: approve/reject pending spaces |
| `/dashboard/admin/users` | Admin: manage users |
| `/profile` | Edit profile |

### Extra required pages (2+)
- `/help` — FAQ / support
- `/privacy` — privacy policy
- `/blog` (optional bonus) — simple static posts about workspace productivity

---

## 6. Route Map — Backend (Next.js API Routes)

All under `/app/api/...`, typed with `NextRequest`/`NextResponse`.

```
POST   /api/auth/[...all]          → Better Auth handler (register/login/session)

GET    /api/spaces                 → list spaces (query: page, limit, category, city,
                                       minPrice, maxPrice, sort, search) — only status=approved
GET    /api/spaces/[id]            → single space detail (public)
POST   /api/spaces                 → create space (protected: host/admin) — status="pending"
PATCH  /api/spaces/[id]             → edit own space (protected: owner host or admin)
DELETE /api/spaces/[id]             → delete own space (protected: owner host or admin)
PATCH  /api/spaces/[id]/status       → approve/reject (protected: admin only)

GET    /api/spaces/[id]/related     → related spaces (same category/city)

POST   /api/bookings               → create booking (protected: user)
GET    /api/bookings/me            → my bookings (protected: user)
GET    /api/bookings/host           → bookings for host's spaces (protected: host)
PATCH  /api/bookings/[id]/status     → confirm/cancel/complete (protected: host)

POST   /api/reviews                → add review (protected: only if booking completed)
GET    /api/reviews/space/[id]      → reviews for a space (public)

GET    /api/users                  → list users (protected: admin)
PATCH  /api/users/[id]/role          → change role (protected: admin, self-guard)
DELETE /api/users/[id]              → delete user (protected: admin, self-guard)

GET    /api/stats/host              → host dashboard chart data (protected: host)
GET    /api/stats/admin             → admin dashboard chart data (protected: admin)
```

**Auth/role middleware pattern** (same as your BiblioDropp JWT approach, adapted for Better Auth session):
```ts
// lib/auth-guard.ts
export async function requireRole(req: NextRequest, allowed: Role[]) { ... }
```
Read session server-side via Better Auth's `auth.api.getSession({ headers })`, check `session.user.role` against `allowed` — no extra DB roundtrip needed if role is embedded in the session/JWT.

---

## 7. Page-by-Page Requirement Mapping

### Landing Page (`/`)
1. **Navbar** — logo, Explore, About, Contact (+ Dashboard, Add Space, My Bookings, Manage Spaces, Profile when logged in) — sticky, full-width, responsive drawer on mobile.
2. **Hero** (60-70vh) — GSAP entrance animation (staggered text + floating space photos), search bar CTA, "Explore Spaces" button.
3. **Sections (7 minimum):**
   - Featured Categories (Co-working / Meeting / Event / Studio — icon cards)
   - Featured Spaces (top-rated, card grid)
   - How It Works (3-step: Search → Book → Work)
   - Platform Statistics (animated counters via GSAP: spaces listed, cities, bookings made)
   - Testimonials (renter reviews carousel)
   - Why SpaceSync / Features (verified hosts, instant booking, flexible hours)
   - Newsletter signup / CTA banner
4. **Footer** — logo+tagline, quick links, contact info, social icons, copyright.

### Explore Page (`/explore`)
- Search bar (title/location text search)
- Filters: category (dropdown), city (dropdown), price range (slider/min-max), capacity
- Sort: price low-high, high-low, rating, newest
- Pagination (server-side, page/limit query params) or infinite scroll
- Card grid: 4/row desktop, 2/row tablet, 1/row mobile
- Skeleton loaders while `useTransition`/fetch is pending

### Space Details (`/spaces/[id]`)
- Image gallery (carousel, min 2-3 images)
- Overview section (full description)
- Key info/specs (capacity, price/hr, amenities list with icons, location + embeddable map link)
- Reviews section (avg rating, list of reviews)
- Related spaces (same category/city, card row)
- Sticky "Book Now" panel with date/time picker

### Add Space (`/items/add`) — protected: host, admin
Form fields: title, short description, full description, category, city, location, price/hour, capacity, amenities (multi-select chips), image URLs (min 2). Submit → status forced to `"pending"`.

### Manage Spaces (`/items/manage`) — protected: host
Table/grid: thumbnail, title, status badge (pending/approved/rejected), price, actions (View, Edit, Delete).

### Auth Pages
- `/login`, `/register` — Better Auth email/password, validation (zod), demo login button (prefills `demo.user@spacesync.com` or `demo.host@...`), clean split-screen layout.

### Dashboards
- **User:** upcoming/past bookings, leave review after completed booking.
- **Host:** overview stats (Recharts: bookings over time, revenue estimate), manage spaces, incoming booking requests (confirm/cancel).
- **Admin:** pending approvals queue, user management table (role change, delete with self-guard), platform stats charts.

---

## 8. Demo Credentials (seed these in DB)

```
Admin:  admin@spacesync.com   / Admin@123
Host:   host@spacesync.com    / Host@123
User:   user@spacesync.com    / User@123
```

---

## 9. GSAP Usage Plan (keep it purposeful, not decorative overload)

- Hero: text stagger-in + subtle floating image parallax on load
- Explore/Landing cards: scroll-triggered fade+slide-up stagger (`ScrollTrigger.batch`)
- Stats counter section: number count-up on scroll into view
- Page transitions: simple fade (optional, skip if time-constrained)
- Avoid overusing on Add/Manage forms — keep utility pages fast and plain

---

## 10. Realistic 3-Day Plan (given 13 July 8PM deadline)

**Day 1 (today, evening→night):** TS crash patterns (see below) + project scaffold + Better Auth setup + models + seed script + auth pages working end to end.

**Day 2:** Landing page (all 7 sections + GSAP) + Explore page (filters/sort/pagination/skeleton) + Space Details page.

**Day 3:** Add/Manage Space pages + Booking flow + Host/Admin dashboards + Reviews + polish/responsive pass + deploy + write README + record demo creds.

Cut list if you run out of time (in order of what to drop first): blog page → newsletter functionality (make it visual-only) → infinite scroll (use pagination instead) → GSAP on every section (keep only hero + stats).

---

## 11. Minimum TypeScript You Actually Need (since you're new to it)

You already know JS. TS adds:
1. `interface`/`type` for shapes (as modeled above)
2. Typing function params: `function getSpace(id: string): Promise<Space | null>`
3. Typing API route handlers: `(req: NextRequest) => Promise<NextResponse>`
4. React component props: `function SpaceCard({ space }: { space: Space })`
5. `useState<Space[]>([])`, `useState<boolean>(false)`
6. Optional chaining/union types: `role: "user" | "host" | "admin"`
7. `as` casting sparingly (e.g., `params as { id: string }`)

That's ~90% of what you'll touch. Don't go down a generics/utility-types rabbit hole — ship first.

---

## 12. Submission Checklist

- [ ] Live URL (Vercel)
- [ ] GitHub repo link
- [ ] Demo credentials (user/host/admin) in README
- [ ] All routes from Section 5 & 6 working
- [ ] No lorem ipsum anywhere
- [ ] Responsive check: mobile/tablet/desktop
- [ ] All links/buttons functional