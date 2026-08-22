# Wanderly - Project Context & Implementation Changelog

This document provides a comprehensive technical overview of the **Wanderly** codebase, design decisions, data structures, state flow, and recent changes so that all team members remain aligned.

---

## 🚀 Project Overview

- **App Name**: Wanderly (Personalized Intelligent Travel Planning Platform)
- **Goal**: End-to-end multi-city travel planning, day-by-day itinerary builder, automated budget estimator, calendar timeline visualizer, community sharing, and admin analytics dashboard.
- **Tech Stack**:
  - **Framework**: React 19 + Vite
  - **Animations**: Framer Motion (`framer-motion`)
  - **Icons**: Lucide Icons (`lucide-react`)
  - **Effects**: Canvas Confetti (`canvas-confetti`)
  - **Styling**: Modern CSS System with Glassmorphism, CSS Custom Properties, and responsive flex/grid layouts.

---

## 🎨 Design System & Palette

- **Primary Brand Color**: Deep Emerald Green (`#064e3b`)
- **Accent Emeralds**: Vibrant Green (`#047857`), Bright Mint (`#10b981`)
- **Soft Backgrounds**: Light Slate (`#f8fafc`), Mint Tint (`#ecfdf5`), Sage Tint (`#d1fae5`)
- **Category Colors**:
  - Flights / Transport: `#3b82f6` (Blue)
  - Hotels / Stay: `#6366f1` (Indigo)
  - Food & Dining: `#10b981` (Green)
  - Activities: `#f59e0b` (Gold)
  - Transport: `#8b5cf6` (Purple)
- **Typography**: Google Fonts `'Plus Jakarta Sans'` (Body) and `'Outfit'` (Headings).

---

## 🗺️ 12 Screens Mapping (Matching Excalidraw & PRD Specs)

1. `Screen1_Login.jsx` - Authentication, remember me, forgot password, social logins.
2. `Screen2_Register.jsx` - User signup, profile avatar upload, travel style preferences.
3. `Screen3_Dashboard.jsx` - Main landing page, hero banner, upcoming trip cards, active trip step-node path (Mumbai → Tokyo → Kyoto → Osaka → Tokyo) + interactive map visualizer, budget progress bars, AI planner widget, top destinations, saved list.
4. `Screen4_CreateTrip.jsx` - Multi-stop trip creation wizard, dates, target budget, itinerary section manager ("Add another Section").
5. `Screen5_BuildItinerary.jsx` - Interactive day-by-day timeline builder, date ranges (`xxx to yyy`), budget tracker per section, drag/reorder activities.
6. `Screen6_TripListing.jsx` - User trip list (Ongoing, Upcoming, Completed, Drafts) with search, filter, group by, sort, and action menus.
7. `Screen7_ProfileSettings.jsx` - User bio, travel stats badges, preplanned/previous trip tabs, edit personal details, currency toggles, privacy settings.
8. `Screen8_SearchExplorer.jsx` - Activity & city search engine with category filters (Adventure, Food, Culture, Sightseeing), price sliders, and "Add to Trip" modals.
9. `Screen9_ItineraryViewBudget.jsx` - Full trip itinerary view with physical activity ratings, financial breakdown donut & bar charts, overbudget warning alerts.
10. `Screen10_Community.jsx` - Social travel feed, public shared itineraries, "Copy Trip" cloning functionality, share post modal.
11. `Screen11_CalendarView.jsx` - Interactive month & week calendar visualizer, color-coded trip activity chips, expandable day popovers.
12. `Screen12_AdminAnalytics.jsx` - Platform metrics (Users, Trips, Revenues), user management table, popular cities chart, user growth graphs.

---

## 📦 File & Component Architecture

```
CodeBase/
├── index.html                 # App entry html with Google Fonts
├── package.json               # Dependencies & scripts
├── vite.config.js             # Vite configuration
├── context.md                 # Team context & changelog document
└── src/
    ├── main.jsx               # React entry point
    ├── index.css              # Global design system & utility classes
    ├── App.jsx                # Core shell container & state router
    ├── context/
    │   └── AppContext.jsx     # App state (currentScreen, user, trips, destinations, toast)
    ├── components/
    │   ├── Sidebar.jsx        # Left fixed navigation bar
    │   ├── Header.jsx         # Top search, + New Trip CTA, user menu
    │   └── DemoSwitcher.jsx   # Floating hackathon 12-screen toolbar
    └── screens/
        ├── Screen1_Login.jsx
        ├── Screen2_Register.jsx
        ├── Screen3_Dashboard.jsx
        ├── Screen4_CreateTrip.jsx
        ├── Screen5_BuildItinerary.jsx
        ├── Screen6_TripListing.jsx
        ├── Screen7_ProfileSettings.jsx
        ├── Screen8_SearchExplorer.jsx
        ├── Screen9_ItineraryViewBudget.jsx
        ├── Screen10_Community.jsx
        ├── Screen11_CalendarView.jsx
        └── Screen12_AdminAnalytics.jsx
```

---

## 📝 Team Changelog

| Date & Time | Contributor | Summary of Changes |
| :--- | :--- | :--- |
| 2026-08-22 09:50 | Antigravity AI | Updated context.md prior to git push to `https://github.com/patelmanan112/odooXLD`. Completed all 12 screens and configured git remote. |
| 2026-08-22 04:12 | Antigravity AI | Project setup with Vite + React + Framer Motion. Implemented global design system (`index.css`), `AppContext.jsx`, `Sidebar.jsx`, `Header.jsx`, `DemoSwitcher.jsx`, and all 12 requested screens (`Screen1_Login` to `Screen12_AdminAnalytics`). Created `context.md` for shared team context. |

---

## 💡 Guidelines for Teammates

1. **Adding New Features**: Keep component files inside `src/screens/` or `src/components/`.
2. **State Updates**: Use `useApp()` from `src/context/AppContext.jsx` to access global state (e.g. `user`, `trips`, `currentScreen`, `setCurrentScreen`).
3. **Animations**: Use Framer Motion (`<motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>`) for consistent transitions.
4. **Log your changes**: Append a line to the **Team Changelog** table above whenever you modify or add features.
