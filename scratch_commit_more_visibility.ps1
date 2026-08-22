$ErrorActionPreference = "Continue"

Write-Host "=== Committing More Button Visibility Fix ==="

git add frontend/src/components/navigation/TripNavigation.jsx
git commit -m "style(navigation): make More dropdown button highly visible with bold terracotta pill styling"

Write-Host "`nPushing to origin/manan..."
git push origin manan

Write-Host "`n=== Done ==="
