$ErrorActionPreference = "Continue"

Write-Host "=== Committing Login & Register Redesign ==="

git add frontend/src/screens/Screen1_Login.jsx
git add frontend/src/screens/Screen2_Register.jsx
git commit -m "feat(auth): redesign Login and Register screens to match premium Wanderly design system and remove demo data"

Write-Host "`nPushing to origin/manan..."
git push origin manan

Write-Host "`n=== Done ==="
