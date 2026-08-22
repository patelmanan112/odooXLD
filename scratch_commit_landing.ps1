$ErrorActionPreference = "Continue"

Write-Host "=== Committing Landing Page in 3 Parts ==="

# COMMIT 1: CSS Design System + Navbar + Hero
Write-Host "`n[1/3] Design system, Navbar and Hero..."
git add frontend/src/components/landing/LandingPage.module.css
git add frontend/src/components/landing/LandingNavbar.jsx
git add frontend/src/components/landing/HeroSection.jsx
git add frontend/src/pages/LandingPage.jsx
git commit -m "feat(landing): add CSS design system, sticky navbar, and cinematic hero section"

# COMMIT 2: All Section Components
Write-Host "`n[2/3] All landing page sections..."
git add frontend/src/components/landing/DestinationShowcase.jsx
git add frontend/src/components/landing/ProblemSection.jsx
git add frontend/src/components/landing/HowItWorks.jsx
git add frontend/src/components/landing/ItineraryShowcase.jsx
git add frontend/src/components/landing/BudgetShowcase.jsx
git add frontend/src/components/landing/CommunityShowcase.jsx
git add frontend/src/components/landing/FinalCTA.jsx
git commit -m "feat(landing): add destination showcase, itinerary, budget, community, and CTA sections"

# COMMIT 3: App.jsx routing + Profile fix
Write-Host "`n[3/3] Routing and profile screen fix..."
git add frontend/src/App.jsx
git add frontend/src/screens/Screen7_ProfileSettings.jsx
git commit -m "feat(routing): wire landing page to / route and fix profile screen with avatar upload"

# Push
Write-Host "`nPushing to origin/manan..."
git push origin manan

Write-Host "`n=== Done ==="
