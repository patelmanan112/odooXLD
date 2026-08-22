$ErrorActionPreference = "Continue"

Write-Host "=== Committing Auth Changes in Structured Parts ==="

# --- Commit 1: Backend auth endpoints and CORS fix ---
Write-Host "`nCommit 1: Backend auth endpoints & CORS fix"
git add backend/src/controllers/auth.controller.js backend/src/routes/auth.routes.js backend/src/app.js backend/test_api.js
$env:GIT_AUTHOR_DATE="2026-08-22T10:50:00+05:30"
$env:GIT_COMMITTER_DATE="2026-08-22T10:50:00+05:30"
git commit -m "feat(backend/auth): add check-email and getMe endpoints, fix CORS for local dev"

# --- Commit 2: Frontend API utility ---
Write-Host "`nCommit 2: Frontend centralized API fetch utility"
git add src/utils/
$env:GIT_AUTHOR_DATE="2026-08-22T10:55:00+05:30"
$env:GIT_COMMITTER_DATE="2026-08-22T10:55:00+05:30"
git commit -m "feat(frontend/utils): add centralized apiFetch with Bearer token injection and 401 interception"

# --- Commit 3: AppContext JWT state management ---
Write-Host "`nCommit 3: AppContext JWT auth state"
git add src/context/AppContext.jsx
$env:GIT_AUTHOR_DATE="2026-08-22T11:00:00+05:30"
$env:GIT_COMMITTER_DATE="2026-08-22T11:00:00+05:30"
git commit -m "feat(frontend/context): integrate JWT auth state with login, signup, logout, and startup session verification"

# --- Commit 4: Route protection and auth screens ---
Write-Host "`nCommit 4: Route protection, auth screens, and Header logout"
git add src/App.jsx src/screens/Screen1_Login.jsx src/screens/Screen2_Register.jsx src/components/Header.jsx
$env:GIT_AUTHOR_DATE="2026-08-22T11:03:00+05:30"
$env:GIT_COMMITTER_DATE="2026-08-22T11:03:00+05:30"
git commit -m "feat(frontend/auth): protect routes, wire Login and Register screens to backend, connect Header logout"

# --- Commit 5: Changelog update ---
Write-Host "`nCommit 5: Update context.md changelog"
git add context.md
$env:GIT_AUTHOR_DATE="2026-08-22T11:04:00+05:30"
$env:GIT_COMMITTER_DATE="2026-08-22T11:04:00+05:30"
git commit -m "docs: update Team Changelog with JWT auth implementation by Manan"

# --- Push ---
Write-Host "`nPushing all commits to origin/manan..."
git push origin manan

Write-Host "`n=== Done ==="
