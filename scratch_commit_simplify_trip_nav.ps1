$ErrorActionPreference = "Continue"

Write-Host "=== Committing Simplified Trip Navigation ==="

git add frontend/src/components/navigation/TripNavigation.jsx
git add frontend/src/App.jsx

git commit -m "refactor(navigation): simplify trip navigation header with back link to My Trips, 3 primary tabs (Overview, Itinerary, Budget) and More dropdown"

Write-Host "`nPushing to origin/manan..."
git push origin manan

Write-Host "`n=== Done ==="
