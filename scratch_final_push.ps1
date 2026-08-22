$ErrorActionPreference = "Continue"

Write-Host "=== Synchronizing local branch with origin/manan ==="

git add backend/src/routes/calendar.routes.js
git commit -m "fix(calendar): finalize calendar routes response"

git pull --rebase origin manan
git push origin manan

Write-Host "`n=== Done Pushing ==="
