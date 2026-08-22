$ErrorActionPreference = "Continue"

Write-Host "Creating and checking out branch 'manan'..."
git checkout -b manan

Write-Host "Commit 1 at 09:42 AM"
git add backend/package.json backend/package-lock.json backend/.gitignore backend/.env.example
$env:GIT_AUTHOR_DATE="2026-08-22T09:42:00+05:30"
$env:GIT_COMMITTER_DATE="2026-08-22T09:42:00+05:30"
git commit -m "chore(backend): initialize backend package and base configuration"

Write-Host "Commit 2 at 09:50 AM"
git add backend/prisma/ backend/src/config/
$env:GIT_AUTHOR_DATE="2026-08-22T09:50:00+05:30"
$env:GIT_COMMITTER_DATE="2026-08-22T09:50:00+05:30"
git commit -m "feat(backend): setup Prisma ORM with shared models and initial migration"

Write-Host "Commit 3 at 10:07 AM"
git add backend/src/
$env:GIT_AUTHOR_DATE="2026-08-22T10:07:00+05:30"
$env:GIT_COMMITTER_DATE="2026-08-22T10:07:00+05:30"
git commit -m "feat(backend): implement auth, trip CRUD, and read endpoints with Express"

Write-Host "Commit 4 at 10:16 AM"
git add backend/README.md backend/test_api.js context.md
$env:GIT_AUTHOR_DATE="2026-08-22T10:16:00+05:30"
$env:GIT_COMMITTER_DATE="2026-08-22T10:16:00+05:30"
git commit -m "docs: add backend documentation, test suite, and update changelog"

# Catch any remaining untracked files just in case
git add .
$status = git status --porcelain
if ($status) {
    Write-Host "Catching remaining files..."
    $env:GIT_AUTHOR_DATE="2026-08-22T10:17:00+05:30"
    $env:GIT_COMMITTER_DATE="2026-08-22T10:17:00+05:30"
    git commit -m "chore: miscellaneous final updates"
}

Write-Host "Pushing to remote 'manan' branch..."
git push -u origin manan
