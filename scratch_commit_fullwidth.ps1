$ErrorActionPreference = "Continue"

Write-Host "=== Committing Full-Width Dashboard Layout ==="

git add frontend/src/components/navigation/GlobalNavbar.jsx
git add frontend/src/screens/Screen3_Dashboard.jsx
git add frontend/src/App.jsx
git add frontend/src/index.css

git commit -m "style(layout): expand dashboard and navbar to 100% full screen width, removing side margin gaps"

Write-Host "`nPushing to origin/manan..."
git push origin manan

Write-Host "`n=== Done ==="
