# 🏢 SpaceSync

**Find your perfect space to work, meet & create.**

SpaceSync is a full-stack co-working and event space booking platform where renters discover and book desks, meeting rooms, event halls, and studios — and hosts list and manage their own spaces. Built with a strict three-role system (User, Host, Admin), server-driven filtering, and a fully typed TypeScript stack across both frontend and backend.

---

## 🔗 Live Links

| Resource | Link |
|---|---|
| 🌐 Live Website | [space-sync-alpha.vercel.app](https://space-sync-alpha.vercel.app) |
| ⚙️ Backend API | [space-sync-server.vercel.app](https://space-sync-server.vercel.app) |
| 📦 Backend Repository | [https://github.com/LingkonDash/space-sync-server](https://github.com/LingkonDash/space-sync-server) |

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Roles & Permissions](#-roles--permissions)
- [Project Structure](#-project-structure)
- [Environment Variables](#-environment-variables)
- [Getting Started](#-getting-started)
- [Demo Credentials](#-demo-credentials)
- [API Reference](#-api-reference)
- [Design System](#-design-system)
- [Author](#-author)

---

## 🧭 Overview

SpaceSync solves a simple, real problem: booking a workspace shouldn't require phone calls, outdated listing photos, or guesswork. The platform connects two sides of the same need —

- **Renters** who need a desk, meeting room, event hall, or studio for an hour, a day, or longer.
- **Hosts** who have space to offer and want real tools to manage it — not just a listing form.

Every space listed goes through an **admin approval step** before it's publicly visible, keeping listings verified and trustworthy. Bookings are request-based (no payment gateway) — a host confirms, cancels, or completes each request, and renters can leave a review once their booking is marked complete.

---

## ✨ Features

**For everyone**
- Fully responsive landing page with animated hero, featured spaces, and platform stats
- Search, filter (category, city, price, capacity), sort, and paginate through all approved spaces
- Public space details page with image gallery, amenities, reviews, and related spaces
- Static About, Contact, Help, and Privacy pages

**For renters (User)**
- Register/login with email or Google, with a demo-login shortcut
- Book a space by date and time slot
- View booking history and leave a review after a completed booking

**For hosts (Host)**
- Add a new space listing (starts as *pending* until admin-approved)
- Manage all owned listings — edit, delete, view status
- View and respond to incoming booking requests (confirm / cancel / complete)
- Host dashboard with booking and revenue-estimate charts (Recharts)

**For admins (Admin)**
- Approve or reject pending space listings
- Manage all users — change roles, remove accounts (with self-guard protections)
- Platform-wide stats dashboard (total spaces, pending approvals, bookings, users)

---

## 🛠 Tech Stack

**Frontend**
- Next.js 15 (App Router) + TypeScript
- Tailwind CSS v4
- Better Auth (email/password + Google OAuth, JWT session)
- GSAP (`ScrollTrigger`) for scroll-reveal and ambient animation
- Recharts for dashboard analytics
- react-toastify for notifications
- react-icons (Feather set) for iconography
- ImgBB for profile photo hosting

**Backend**
- Node.js + Express.js + TypeScript
- MongoDB Atlas (native driver, no ODM)
- `jose-cjs` for JWT verification against Better Auth's JWKS endpoint
- Role-based middleware guarding protected routes

---

## 👥 Roles & Permissions

| Action | User | Host | Admin |
|---|:---:|:---:|:---:|
| Browse & book spaces | ✅ | ✅ | ✅ |
| Leave a review (after completed booking) | ✅ | ✅ | ✅ |
| Add a new space listing | ❌ | ✅ | ✅ |
| Manage own listings | ❌ | ✅ | ✅ (any) |
| Approve / reject listings | ❌ | ❌ | ✅ |
| Manage all users | ❌ | ❌ | ✅ |
| View platform-wide stats | ❌ | ❌ | ✅ |

---

## 🗂 Project Structure

**Frontend** (Next.js App Router)
```
app/
  page.tsx                → Landing page
  explore/page.tsx        → Search, filter, browse spaces
  spaces/[id]/page.tsx    → Space details
  login/  register/       → Auth pages
  dashboard/[role]/       → Role-aware dashboards
  items/add/              → Add space (protected: host, admin)
  items/manage/           → Manage spaces (protected: host, admin)
  about/  contact/  help/ → Static pages
components/
  navbar/  banner/  home/  explore/  shared/
lib/
  core/   → session + fetch helpers
  api/    → typed data-fetching functions
types/
  space.ts  searchParams.ts  auth.ts
```

**Backend** (single-file Express server)
```
index.ts   → Express app, Mongo connection, JWT middleware, all routes
types.ts   → Shared domain + request types
```

---

## 🔑 Environment Variables

**Frontend (`.env.local`)**
```
NEXT_PUBLIC_API_URL=https://space-sync-server.vercel.app
NEXT_PUBLIC_BASE_URL=https://space-sync-alpha.vercel.app
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key
MONGODB_URI=your_mongodb_atlas_connection_string
BETTER_AUTH_SECRET=your_better_auth_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

**Backend (`.env`)**
```
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
NEXT_PUBLIC_BASE_URL=https://space-sync-alpha.vercel.app
```

---

## 🚀 Getting Started

**Clone and install**
```bash
git clone https://github.com/LingkonDash/space-sync-server
cd spacesync-frontend
npm install
```

```bash
git clone https://github.com/LingkonDash/space-sync-server
cd spacesync-backend
npm install
```

**Run locally**
```bash
# Backend
npm run dev

# Frontend (in a separate terminal)
npm run dev
```

Frontend runs on `http://localhost:3000`, backend on `http://localhost:5000` by default.

---

## 🔐 Demo Credentials

| Role | Email | Password |
|---|---|---|
| Admin | `admin@spacesync.com` | `Admin@123` |
| Host | `host@spacesync.com` | `Host@123` |
| User | `user@spacesync.com` | `User@123` |

A **Demo Login** button is available on the login page to auto-fill these credentials.

---

## 📡 API Reference

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/rooms` | Public | Search/filter/sort/paginate approved spaces |
| GET | `/rooms/featured` | Public | Top-rated spaces for the home page |
| GET | `/rooms/:id` | Public | Single space details |
| GET | `/rooms/:id/related` | Public | Related spaces (same category) |
| POST | `/rooms` | Host, Admin | Create a new space (status: pending) |
| PATCH | `/rooms/:id` | Host (own), Admin | Edit a space |
| PATCH | `/rooms/:id/status` | Admin | Approve / reject a listing |
| DELETE | `/rooms/:id` | Host (own), Admin | Delete a space |
| GET | `/rooms/host/mine` | Host, Admin | Host's own listings |
| POST | `/bookings` | User | Create a booking request |
| GET | `/bookings/me` | User | Logged-in user's bookings |
| GET | `/bookings/host` | Host, Admin | Bookings for a host's spaces |
| PATCH | `/bookings/:id/status` | Host, Admin | Confirm / cancel / complete a booking |
| POST | `/reviews` | User | Leave a review (booking must be completed) |
| GET | `/reviews/space/:id` | Public | Reviews for a space |
| GET | `/users` | Admin | List all users |
| PATCH | `/users/:id/role` | Admin | Change a user's role |
| DELETE | `/users/:id` | Admin | Delete a user |
| GET | `/stats/host` | Host, Admin | Host dashboard chart data |
| GET | `/stats/admin` | Admin | Platform-wide stats |

All protected routes require an `Authorization: Bearer <token>` header, verified against Better Auth's JWKS endpoint.

---

## 🎨 Design System

| Color | Hex | Usage |
|---|---|---|
| Primary — Indigo | `#4F46E5` | Buttons, active nav, links, primary CTAs |
| Secondary — Amber | `#F59E0B` | Ratings, highlights, badges |
| Accent — Teal | `#0D9488` | Success states, confirmed badges, chart accents |
| Neutral Text | `#0F172A` | Body copy, headings |
| Neutral Background | `#F8FAFC` | Page background |
| Neutral Border | `#E2E8F0` | Card borders, dividers |

**Typography:** Space Grotesk (headings) + Inter (body)

---

## 👤 Author

**Lingkon Dash**
- GitHub: [github.com/lingkondash](https://github.com/lingkondash)
- LinkedIn: [linkedin.com/in/lingkon-dash](https://linkedin.com/in/lingkon-dash)

---

<p align="center">Built with ☕ and a very tight deadline.</p>