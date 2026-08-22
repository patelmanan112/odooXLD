$ErrorActionPreference = "Continue"

Write-Host "=== Committing Dashboard & Navigation Redesign ==="

git add frontend/src/components/navigation/GlobalNavbar.jsx
git add frontend/src/components/navigation/TripNavigation.jsx
git add frontend/src/screens/Screen3_Dashboard.jsx
git add frontend/src/components/DemoSwitcher.jsx
git add frontend/src/App.jsx

git commit -m "feat(dashboard): replace permanent left sidebar with floating GlobalNavbar, contextual TripNavigation, and redesigned workspace"

Write-Host "`nPushing to origin/manan..."
git push origin manan

Write-Host "`n=== Done ==="
