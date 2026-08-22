$ErrorActionPreference = "Continue"

Write-Host "=== Committing Advanced Trip Navigation & Google Calendar Integration ==="

git add backend/src/routes/calendar.routes.js
git add backend/src/app.js
git add frontend/src/components/navigation/TripNavigation.jsx
git add frontend/src/screens/Screen11_CalendarView.jsx
git add frontend/src/screens/Screen13_JourneyView.jsx
git add frontend/src/App.jsx

git commit -m "feat(calendar): implement Google Calendar OAuth integration, Journey progression view, and upgraded trip navigation tabs"

Write-Host "`nPushing to origin/manan..."
git push origin manan

Write-Host "`n=== Done ==="
