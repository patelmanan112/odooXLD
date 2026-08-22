$ErrorActionPreference = "Continue"

Write-Host "=== Committing Logout Redirect & Contextual Route Navigation ==="

git add frontend/src/context/AppContext.jsx
git add frontend/src/components/navigation/TripNavigation.jsx
git add frontend/src/App.jsx

git commit -m "feat(navigation): redirect logout to landing page / and restore contextual trip navigation tabs & breadcrumbs across all routes"

Write-Host "`nPushing to origin/manan..."
git push origin manan

Write-Host "`n=== Done ==="
