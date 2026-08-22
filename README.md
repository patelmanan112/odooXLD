# 🌍 Wanderly (GlobeTrotter) — Complete Technical & Architectural Documentation

> **Wanderly** is an all-in-one travel planning, itinerary engineering, and budget tracking web application built with React 18, Vite, Framer Motion, Express.js, Prisma ORM, and PostgreSQL. It empowers users to plan trips, build interactive day-by-day itineraries, track expenses in Indian Rupees (₹), discover catalog experiences, clone community-shared itineraries, and visualize travel data through an interactive calendar and admin analytics suite.

---

## 👥 Authors & Team Work Split

### 👨‍💻 Project Authors
- **Manan Patel** — Backend Engineer (Auth & Trip Management)
- **Aryan Sabasana** — Backend Engineer (Stops, Activities & Budget API)
- **Khush Patel** — Frontend Developer (Auth, Dashboard & Trip Creation)
- **Jaydip Valiya** — Frontend Developer (Itinerary Builder & Budget Analytics)

---

### 🛠️ Work Split (4-Person Team Allocation)

#### 🛡️ Manan Patel — Backend: Auth + Trips
- **Auth Endpoints:** Auth controller & routes (`/api/auth/register`, `/api/auth/login`), JWT authentication middleware.
- **Trip CRUD:** Complete CRUD API (`POST /api/trips`, `GET /api/trips`, `GET /api/trips/:id`, `PUT /api/trips/:id`, `DELETE /api/trips/:id`).
- **Prisma Schema Ownership:** Designed, managed, and executed Prisma ORM migrations for PostgreSQL database models (`User`, `Trip`).
- **Dev Seeding:** Auth test accounts seeding for team login during development.

#### 📍 Aryan Sabasana — Backend: Stops, Activities, Budget
- **Seed Script:** Authored database seed script (`prisma/seed.js`) seeding 13 global/domestic cities and 40+ structured activities.
- **Trip Stops Endpoints:** APIs for adding, reordering, and deleting trip section stops.
- **Trip Activities Endpoints:** APIs for assigning and removing activities to trip stops.
- **Budget Endpoint:** Financial endpoint (`GET /trips/:id/budget`) to sum activity costs and return categorized expense totals.

#### 🎨 Khush Patel — Frontend: Auth + Dashboard + Trip Setup
- **Login & Registration Screens:** Minimalist user authentication screens and Google OAuth integration.
- **Dashboard Screen:** Bento Grid dashboard layout featuring banner greeting, "Plan a Trip" call-to-action, trip list, and countdown widgets.
- **Create Trip Screen:** Multi-step creation wizard (`/trips/new`) for basic details, dates, and budget slider.
- **API Integration:** Wired authentication, dashboard metrics, and trip creation components to Manan's backend endpoints.

#### 📊 Jaydip Valiya — Frontend: Itinerary + Budget
- **Build Itinerary Screen:** Interactive two-panel itinerary builder (`/itinerary/builder`) with day tabs, section stops, and activity assignment dropdowns.
- **Itinerary View Screen:** Scrollable travel diary report (`/itinerary/view`) with day-by-day activities timeline and expense logs.
- **Budget Breakdown Section:** Interactive budget visualizations and category progress meters using `getActivityCost` helpers.
- **API Integration:** Wired itinerary timelines, stop updates, and financial tracking views to Aryan's backend endpoints.

---

## 📋 Table of Contents

1. [Authors & Team Work Split](#-authors--team-work-split)
2. [Architectural Overview](#-architectural-overview)
3. [Detailed Feature Specifications](#-detailed-feature-specifications)
   - [1. Authentication & User Management](#1-authentication--user-management)
   - [2. Dashboard — Bento Grid Layout](#2-dashboard--bento-grid-layout)
   - [3. Multi-Step Trip Creation Wizard](#3-multi-step-trip-creation-wizard)
   - [4. Interactive Itinerary Builder](#4-interactive-itinerary-builder)
   - [5. Travel Diary & Budget Breakdown View](#5-travel-diary--budget-breakdown-view)
   - [6. My Trips & Trip Listing](#6-my-trips--trip-listing)
   - [7. Catalog Explorer & Target Selection Modal](#7-catalog-explorer--target-selection-modal)
   - [8. Community Feed & 1-Click Itinerary Cloning](#8-community-feed--1-click-itinerary-cloning)
   - [9. Interactive Calendar View](#9-interactive-calendar-view)
   - [10. Profile & Settings](#10-profile--settings)
   - [11. Admin Analytics Dashboard](#11-admin-analytics-dashboard)
4. [Global State Management — Context API](#-global-state-management--context-api)
5. [Backend REST API Reference](#-backend-rest-api-reference)
6. [Database Schema & Entity Relationship Model](#-database-schema--entity-relationship-model)
7. [Calculations, Helpers, & Business Logic Rules](#-calculations-helpers--business-logic-rules)
8. [Installation, Environment & Local Deployment](#-installation-environment--local-deployment)
9. [Complete Project Directory Layout](#-complete-project-directory-layout)

---

## 🏛️ Architectural Overview

Wanderly follows a decoupled Client-Server architecture:

```
[ Client: React 18 + Vite + Framer Motion ]
                  │
          REST API (HTTP / JSON)
                  │
[ Server: Node.js + Express.js Controllers & Middlewares ]
                  │
            Prisma ORM Client
                  │
[ Database: PostgreSQL (Aiven Cloud Instance) ]
```

- **Frontend:** Built with React 18, Vite, and Framer Motion. Styling is handled via inline JSX style objects and scoped utility classes, eliminating heavy CSS framework overhead while preserving high rendering performance.
- **State Layer:** `AppContext.jsx` acts as the single source of truth, maintaining local React state for instantaneous UI updates while executing asynchronous background HTTP requests to synchronize state with the backend PostgreSQL database.
- **Backend:** Node.js Express server configured with ES Modules (`type: "module"`). Uses Prisma ORM to interface with a remote PostgreSQL database hosted on Aiven Cloud.

---

## 💎 Detailed Feature Specifications

### 1. Authentication & User Management
- **Routes:** `/login`, `/register`
- **Security:** Passwords are hashed server-side using bcrypt. Successful authentication yields a JSON Web Token (JWT) stored in `localStorage` as `token`.
- **Protected Routes:** `ProtectedRoute` component intercepts unauthenticated access and redirects users to the landing page `/`.
- **Google OAuth Integration:** Google Client Library handles single sign-on (`GOOGLE_CLIENT_ID`), creating or matching existing user accounts by email address.

### 2. Dashboard — Bento Grid Layout
- **Route:** `/dashboard`
- **Design Concept:** Modern Apple-inspired **Bento Grid** layout tiled on a creamy off-white background (`#F5F3EF`).
- **Components:**
  - **Greeting Banner:** Personalized headline ("Good Morning/Afternoon, [User]") alongside compact user statistics.
  - **Next Trip Countdown Card (Span 7):** Large hero card displaying the user's next upcoming trip, cover photo, destination, and a central countdown.
  - **Budget Snapshot Card (Span 5):** Circular SVG progress donut depicting spent funds vs total allocated budget in `₹`.
  - **AI Plan Generator:** Prompt box for generating trip itineraries.
  - **Saved Places & Community Cards:** Live metrics for bookmarked destinations and community avatars.
  - **Explore Destinations Scroll Row:** Horizontal scroll view of vertical portrait cards (180px × 260px) for popular global cities.

### 3. Multi-Step Trip Creation Wizard
- **Route:** `/trips/new`
- **Layout:** Two-column split with a vertical 3-step progress sidebar on the left and form card + live preview card on the right.
- **Step Breakdown:**
  - **Step 1 — Trip Basics:** Trip Name (`title`), Destination (`destination`), and Vibe Description (`description`).
  - **Step 2 — Dates & Budget:** Date pickers with strict temporal rules (`startDate >= today` and `endDate >= startDate`), an interactive budget slider in Indian Rupees (`₹5,000` to `₹5,00,000+`), and a public visibility toggle.
  - **Step 3 — Pick Places & Google Map:** Embedded live Google Maps iframe centered on the destination (`https://maps.google.com/maps?q=${destination}&output=embed`), a spot search input, and a clean grid of 4 top curated iconic spot cards per city.
- **Live Preview Card:** Live-rendering preview card showing the selected cover photo, title, destination, budget pill, and completion progress bar (0%–100%).

### 4. Interactive Itinerary Builder
- **Route:** `/itinerary/builder`
- **Layout:** Sticky left day-navigator panel (240px wide) + right main editing canvas.
- **Day Management:** Dynamic day control allowing users to add new days, delete days, and edit day titles/dates inline.
- **Activity System:**
  - Category presets: **Flight** (blue), **Stay** (purple), **Food** (green), **Sightseeing** (orange), **Transport** (yellow), **Activity** (pink).
  - Activity Modal: Add/edit activity title, time, category, cost (in `₹`), and notes.
- **Financial Counters:** Top metrics header displaying **Total Spent**, **Trip Budget**, and **Remaining Funds** calculated via `getActivityCost`.

### 5. Travel Diary & Budget Breakdown View
- **Route:** `/itinerary/view`
- **Design Concept:** PDF/Journal-style scrollable trip report.
- **Header Banner:** 260px tall landscape image with dark gradient overlay, trip name, destination, dates, status pill, and action buttons (Share, Download PDF).
- **Day Timeline Journal (Left Column):** Connected vertical orange timeline (`3px solid #E85D26`) displaying activities chronologically with category dots and cost tags.
- **Financial Panel (Sticky Right Column):** Breakdown of total spent, budget progress bar, expense breakdown by category, average daily spend, and quick actions.

### 6. My Trips & Trip Listing
- **Route:** `/trips`
- **Filter Tabs:** All Trips, Upcoming, Ongoing, Completed, Draft.
- **Search:** Instant text search filtering by trip name or destination.
- **Trip Card Component:** Displays cover photo, destination pill, budget badge, date range, and quick action links ("Build Itinerary", "View Details", "Delete").

### 7. Catalog Explorer & Target Selection Modal
- **Route:** `/explore`
- **Filters (Fixed Left Sidebar):** Checkbox category selection (Adventure, Food, Water Sports, Sightseeing, Culture), numeric price range inputs in `₹`, duration radio buttons (Under 2hrs, Half Day, Full Day), and star rating buttons (3+, 4+, 4.8+).
- **Target Selection Popup:** Clicking "Add to Trip" on any experience opens a modal popup:
  - Select an existing trip from `trips` state to receive the activity.
  - Or select `+ Create New Trip` to initialize a new trip for that location.

### 8. Community Feed & 1-Click Itinerary Cloning
- **Routes:** `/community`, `/journal`
- **Featured Post:** Full-width magazine banner highlighting top community itineraries with author avatar, likes count, comments count, and budget.
- **Itinerary Cloning (`handleClone`):** Clicking "Clone This Itinerary" or "Clone" constructs a complete multi-day trip object with cover photo, budget breakdown, and pre-scheduled activities, saves it directly to **My Trips**, and navigates to `/trips`.

### 9. Interactive Calendar View
- **Route:** `/calendar`
- **Month Grid:** 7-column layout (MON–SUN) with month navigation and "Today" shortcut.
- **Trip Highlights:** Dates falling within active trip ranges are highlighted with a warm orange tint (`#FFF3EE`) and bottom indicator bar.
- **Event Detail Sidebar:** Displays scheduled activities for the clicked calendar date alongside a "Connect Google Calendar" integration button.

### 10. Profile & Settings
- **Routes:** `/profile`, `/settings`
- **Layout:** Left identity card (avatar circle, name, role badge, stats counter for Trips, Countries, Days) + right tabbed panel.
- **Tabs:**
  - **Profile Details:** Editable fields for Full Name, Email (read-only), Phone, City, Country, and Currency.
  - **My Trips:** Compact row view of preferred and past trips with View buttons.
  - **Account Settings:** Password change form, notification toggles, and account deletion danger zone.

### 11. Admin Analytics Dashboard
- **Route:** `/admin`
- **Sidebar:** Dark navy theme (`#1A1A2E`) with navigation options (Overview, Users, Cities, Activities, Analytics).
- **Overview Stat Cards:** Total Users (12,480), Active Trips (4,890), Top City (Tokyo), Total Revenue (₹4.2M).
- **Pure CSS Bar Chart:** Monthly user growth visualization constructed with styled `<div>` progress tracks.
- **User Management Table:** Striped rows displaying user avatar, name, email, join date, trip count, and account status (Active / Suspended).

---

## 🔄 Global State Management — Context API

Defined in [`frontend/src/context/AppContext.jsx`](file:///c:/Users/ARYAN/OneDrive/Desktop/OdooLd/odooXLD/frontend/src/context/AppContext.jsx):

```javascript
const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState({ name: 'Aryan Patel', email: 'aryan@wanderly.com', role: 'USER' });
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [trips, setTrips] = useState([]);
  const [selectedTripId, setSelectedTripId] = useState(null);
  const [destinations, setDestinations] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
  ...
}
```

### Core Context Actions:
- **`addTrip(newTrip)`:** Prepends a formatted trip to `trips` state locally for instantaneous rendering, then dispatches a background `POST /api/trips` request.
- **`updateTrip(updatedTrip)`:** Updates matching trip in `trips` state and updates `selectedTrip` if active.
- **`fetchBackendData()`:** Intercepts JSON array payloads from `GET /api/trips` and `GET /api/cities`, parsing raw arrays safely via `Array.isArray(data) ? data : (data?.data || [])`.
- **`showToast(msg)`:** Displays a floating top-right notification banner for 3 seconds.

---

## 📡 Backend REST API Reference

All backend routes are mounted in [`backend/src/app.js`](file:///c:/Users/ARYAN/OneDrive/Desktop/OdooLd/odooXLD/backend/src/app.js):

| HTTP Method | Endpoint | Controller Method | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Inline | Backend server health check. |
| `POST` | `/api/auth/register` | `register` | Registers a new user account. |
| `POST` | `/api/auth/login` | `login` | Validates credentials and returns JWT token. |
| `GET` | `/api/auth/me` | `getMe` | Returns authenticated user profile. |
| `GET` | `/api/trips` | `getTrips` | Returns list of trips for the authenticated user. |
| `POST` | `/api/trips` | `createTrip` | Creates a new trip entry in PostgreSQL DB. |
| `GET` | `/api/trips/:id` | `getTripById` | Fetches a specific trip with stops and activities. |
| `PUT` | `/api/trips/:id` | `updateTrip` | Updates trip attributes, budget, and itinerary days. |
| `DELETE` | `/api/trips/:id` | `deleteTrip` | Deletes a trip entry. |
| `GET` | `/api/cities` | `getCities` | Returns destination cities catalog. |
| `GET` | `/api/cities/places` | `getCityPlaces` | Fetches city-specific places & activities by city parameter. |
| `GET` | `/api/activities` | `getActivities` | Returns global activity catalog. |
| `GET` | `/api/community/trips` | `getPublicTrips` | Returns public itineraries for the community feed. |
| `GET` | `/api/admin/stats` | `getStats` | Returns system-wide admin analytics data. |
| `GET` | `/api/admin/users` | `getUsers` | Returns list of registered users for admin oversight. |

---

## 🗄️ Database Schema & Entity Relationship Model

Managed via Prisma ORM in [`backend/prisma/schema.prisma`](file:///c:/Users/ARYAN/OneDrive/Desktop/OdooLd/odooXLD/backend/prisma/schema.prisma):

```prisma
enum UserRole { USER ADMIN }
enum TripStatus { DRAFT UPCOMING ONGOING COMPLETED }
enum EffortLevel { LOW MODERATE HIGH }
enum ExpenseCategory { FOOD TRANSPORT ACCOMMODATION ACTIVITIES SHOPPING OTHER }

model User {
  id           String   @id @default(uuid())
  name         String
  email        String   @unique
  passwordHash String
  avatarUrl    String?
  phone        String?
  city         String?
  country      String?
  currency     String   @default("₹")
  bio          String?
  role         UserRole @default(USER)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  trips             Trip[]
  savedDestinations SavedDestination[]
}

model Trip {
  id              String     @id @default(uuid())
  userId          String
  title           String
  description     String?
  startDate       DateTime?
  endDate         DateTime?
  estimatedBudget Decimal    @default(0) @db.Decimal(10, 2)
  spentBudget     Decimal    @default(0) @db.Decimal(10, 2)
  status          TripStatus @default(DRAFT)
  coverPhoto      String?
  isPublic        Boolean    @default(false)
  createdAt       DateTime   @default(now())
  updatedAt       DateTime   @updatedAt

  user     User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  stops    TripStop[]
  expenses Expense[]
}

model City {
  id          String   @id @default(uuid())
  name        String
  country     String
  description String?
  imageUrl    String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  activities   Activity[]
  stops        TripStop[]
  savedByUsers SavedDestination[]
}

model Activity {
  id            String      @id @default(uuid())
  cityId        String
  name          String
  description   String?
  category      String
  estimatedCost Decimal     @db.Decimal(10, 2)
  duration      Int?
  imageUrl      String?
  effortLevel   EffortLevel @default(MODERATE)
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt

  city           City           @relation(fields: [cityId], references: [id], onDelete: Cascade)
  tripActivities TripActivity[]
}
```

---

## 🧮 Calculations, Helpers, & Business Logic Rules

### 1. Robust Activity Cost Resolution Helper (`getActivityCost`)
Used across `BuildItinerary.jsx` and `ItineraryViewBudget.jsx` to resolve activity costs regardless of backend/catalog property key variations (`cost`, `estimatedCost`, `price`, `amount`):
```javascript
export const getActivityCost = (activity) => {
  if (!activity) return 0;
  const val = activity.cost ?? activity.estimatedCost ?? activity.price ?? activity.amount ?? 0;
  return typeof val === 'number' ? val : parseFloat(String(val).replace(/[^0-9.]/g, '')) || 0;
};
```

### 2. Strict INR Currency Formatting Rule
All financial displays must strictly use the Indian Rupee symbol (`₹`) formatted with `toLocaleString('en-IN')`:
```javascript
const formattedPrice = `₹${Number(amount).toLocaleString('en-IN')}`;
```

### 3. Date Validation Rules
- `startDate` cannot be set prior to today's date (`min={todayStr}`).
- `endDate` cannot be set prior to `startDate` (`min={formData.startDate || todayStr}`).

---

## ⚙️ Installation, Environment & Local Deployment

### 1. Repository Setup
```bash
git clone https://github.com/patelmanan112/odooXLD.git
cd odooXLD
```

### 2. Backend Setup (`/backend`)
Create `.env` inside `backend/`:
```env
DATABASE_URL="postgres://username:password@host:port/dbname?sslmode=require"
JWT_SECRET="your-jwt-secret-key-2026"
PORT=5000
FRONTEND_URL="http://localhost:5173"
OPENROUTER_API="your-openrouter-key"
GOOGLE_CLIENT_ID="your-google-client-id"
```

Install dependencies, run database migrations, and seed destination catalog:
```bash
cd backend
npm install
npx prisma db push
node prisma/seed.js
npm start
```

### 3. Frontend Setup (`/frontend`)
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 📂 Complete Project Directory Layout

```
odooXLD/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma            # Prisma ORM PostgreSQL Models
│   │   └── seed.js                  # Database Seeder (13 Cities, 40+ Places)
│   ├── src/
│   │   ├── config/
│   │   │   └── prisma.js            # Prisma Client Singleton Instance
│   │   ├── controllers/
│   │   │   ├── activity.controller.js
│   │   │   ├── admin.controller.js
│   │   │   ├── auth.controller.js
│   │   │   ├── city.controller.js   # Cities & City Places Controller
│   │   │   ├── community.controller.js
│   │   │   ├── expense.controller.js
│   │   │   ├── savedDestination.controller.js
│   │   │   ├── trip.controller.js   # Trip CRUD & Itinerary Controller
│   │   │   └── user.controller.js
│   │   ├── middleware/
│   │   │   ├── admin.middleware.js
│   │   │   ├── auth.middleware.js   # JWT Bearer Token Verification
│   │   │   └── error.middleware.js  # Global JSON Error Handler
│   │   ├── routes/                  # Express REST Route Handlers
│   │   ├── app.js                   # Express App, CORS & Body Parsers
│   │   └── server.js                # Server Listener (Port 5000)
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── landing/             # Marketing & Showcase Components
│   │   │   └── navigation/
│   │   │       ├── GlobalNavbar.jsx # Top Navigation Bar
│   │   │       └── TripNavigation.jsx# Contextual Trip Sub-Navbar
│   │   ├── context/
│   │   │   └── AppContext.jsx       # Central React Context Provider
│   │   ├── pages/
│   │   │   └── LandingPage.jsx      # Public Landing Page
│   │   ├── screens/
│   │   │   ├── AdminAnalytics.jsx   # Admin Analytics Panel
│   │   │   ├── BuildItinerary.jsx   # Interactive Itinerary Builder
│   │   │   ├── CalendarView.jsx     # Calendar View & Sync
│   │   │   ├── Community.jsx        # Community Feed & Itinerary Cloning
│   │   │   ├── CreateTrip.jsx       # 3-Step Creation Wizard with Google Maps
│   │   │   ├── Dashboard.jsx        # Bento Grid Dashboard
│   │   │   ├── ItineraryViewBudget.jsx # Travel Diary Report & Budget Panel
│   │   │   ├── JourneyView.jsx      # Journey Timeline View
│   │   │   ├── Login.jsx            # User Login Screen
│   │   │   ├── ProfileSettings.jsx  # User Profile & Settings
│   │   │   ├── Register.jsx         # User Registration Screen
│   │   │   ├── SearchExplorer.jsx   # Catalog Explorer & Add-to-Trip Popup
│   │   │   └── TripListing.jsx      # My Trips Screen
│   │   ├── utils/
│   │   │   └── api.js               # Central Fetch Utility & Headers
│   │   ├── App.jsx                  # Main Application Component & Routes
│   │   └── main.jsx                 # Vite Entry Point
│   └── package.json
│
└── README.md                        # Master Project Documentation
```
