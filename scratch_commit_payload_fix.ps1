$ErrorActionPreference = "Continue"

Write-Host "=== Committing Express Body Limit Fix ==="

git add backend/src/app.js
git commit -m "fix(backend): increase express body parser limit to 10mb for avatar uploads"

Write-Host "`nPushing to origin/manan..."
git push origin manan

Write-Host "`n=== Done ==="
