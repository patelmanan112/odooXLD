$ErrorActionPreference = "Continue"

Write-Host "=== Committing AppContext Syntax Fix ==="

git add frontend/src/context/AppContext.jsx
git commit -m "fix(context): add missing closing brace for updateUser function in AppContext"

Write-Host "`nPushing to origin/manan..."
git push origin manan

Write-Host "`n=== Done ==="
