# Wanderly - Project Context & Implementation Changelog

This document provides a comprehensive technical overview of the **Wanderly** codebase, design decisions, data structures, state flow, and recent changes so that all team members remain aligned.

---

## 🚀 Project Overview

- **App Name**: Wanderly (Personalized Intelligent Travel Planning Platform)
- **Goal**: End-to-end multi-city travel planning, day-by-day itinerary builder, automated budget estimator, calendar timeline visualizer, community sharing, and admin analytics dashboard.
- **Git Repository**: `https://github.com/patelmanan112/odooXLD`
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

## 📝 Team Changelog

| Date & Time | Contributor | Summary of Changes |
| :--- | :--- | :--- |
| 2026-08-22 10:18 | Antigravity AI | Built Screen 8 (Activity & City Search Explorer) with live autocomplete search, category tags (Adventure, Food, Water Sports, Culture), activity details modal, and "Add to Trip" buttons. |
| 2026-08-22 10:16 | Antigravity AI | Implemented Screen 7 (User Profile & Settings) with profile stats, badges, preplanned trip archives, saved destinations, currency selector, and privacy settings. |
| 2026-08-22 10:14 | Antigravity AI | Built Screen 6 (User Trip Listing / My Trips) with search bar, status filter tabs (Ongoing, Upcoming, Completed), sort dropdown, and action menus. |
| 2026-08-22 10:12 | Antigravity AI | Implemented Screen 4 (Create Trip Wizard with section manager) and Screen 5 (Build Itinerary builder with drag/reorder activities and date ranges). |
| 2026-08-22 10:10 | Antigravity AI | Built Screen 3 (Main Dashboard) featuring hero banner, multi-city step node graph, interactive route map preview, budget category bars, AI planner widget, and top destination filter tabs. |
| 2026-08-22 10:08 | Antigravity AI | Implemented Screen 1 (Login) and Screen 2 (User Registration) with validation, avatar preview, and Framer Motion transitions. |
| 2026-08-22 10:06 | Antigravity AI | Built navigation Sidebar, Header bar with search and CTA, and floating Hackathon 12-Screen Demo Switcher drawer. |
| 2026-08-22 10:04 | Antigravity AI | Implemented AppContext global state container for trips data, user profiles, destination catalogs, and toast notification alerts. |
| 2026-08-22 10:02 | Antigravity AI | Configured Vite + React 19 framework, installed Framer Motion & Lucide icons, created global CSS design system with emerald tokens and typography. |
| 2026-08-22 10:00 | Antigravity AI | Initialized repository documentation, PRD specifications, Excalidraw mockups, and team alignment context file. |

---

## 💡 Guidelines for Teammates

1. **Adding New Features**: Keep component files inside `src/screens/` or `src/components/`.
2. **State Updates**: Use `useApp()` from `src/context/AppContext.jsx` to access global state (e.g. `user`, `trips`, `currentScreen`, `setCurrentScreen`).
3. **Animations**: Use Framer Motion (`<motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>`) for consistent transitions.
4. **Log your changes**: Append a line to the **Team Changelog** table above whenever you modify or add features.
