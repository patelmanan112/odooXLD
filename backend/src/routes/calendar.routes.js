import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

// In-memory token storage per user (for dev/demo; production would use database)
const userCalendarTokens = new Map();

// GET /api/calendar/google/status
router.get('/google/status', authMiddleware, (req, res) => {
  const userId = req.user.userId;
  const isConnected = userCalendarTokens.has(userId);
  res.json({
    connected: isConnected,
    lastSynced: isConnected ? new Date().toISOString() : null
  });
});

// GET /api/calendar/google/connect
router.get('/google/connect', authMiddleware, (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID || 'DEMO_GOOGLE_CLIENT_ID';
  const redirectUri = process.env.GOOGLE_CALENDAR_REDIRECT_URI || `${req.protocol}://${req.get('host')}/api/calendar/google/callback`;
  const scope = encodeURIComponent('https://www.googleapis.com/auth/calendar.readonly');
  
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&access_type=offline&prompt=consent&state=${req.user.userId}`;
  
  res.json({ url: authUrl, configured: Boolean(process.env.GOOGLE_CLIENT_ID) });
});

// GET /api/calendar/google/callback
router.get('/google/callback', async (req, res) => {
  const { code, state: userId } = req.query;
  
  if (!code) {
    return res.status(400).send('OAuth code missing');
  }

  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_CALENDAR_REDIRECT_URI || `${req.protocol}://${req.get('host')}/api/calendar/google/callback`;

    if (clientId && clientSecret) {
      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          grant_type: 'authorization_code'
        })
      });
      const data = await response.json();
      if (data.access_token) {
        userCalendarTokens.set(userId || 'default', data);
      }
    } else {
      // Demo fallback mock connection
      userCalendarTokens.set(userId || 'default', { access_token: 'demo_token', isDemo: true });
    }

    res.send(`
      <html>
        <head><title>Google Calendar Connected</title></head>
        <body style="font-family: sans-serif; text-align: center; padding: 50px; background: #faf8f4;">
          <h2 style="color: #064e3b;">Google Calendar Successfully Connected! 🎉</h2>
          <p>You can close this window and return to Wanderly.</p>
          <script>
            if (window.opener) {
              window.opener.postMessage('google_calendar_connected', '*');
              window.close();
            } else {
              setTimeout(() => { window.location.href = '/calendar'; }, 1500);
            }
          </script>
        </body>
      </html>
    `);
  } catch (err) {
    res.status(500).send(`Error connecting Google Calendar: ${err.message}`);
  }
});

// GET /api/calendar/google/events
router.get('/google/events', authMiddleware, async (req, res) => {
  const userId = req.user.userId;
  const tokenData = userCalendarTokens.get(userId) || userCalendarTokens.get('default');

  if (!tokenData) {
    return res.json({ connected: false, events: [] });
  }

  if (tokenData.isDemo || !process.env.GOOGLE_CLIENT_ID) {
    // Return structured demo events from Google Calendar for display
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    
    return res.json({
      connected: true,
      events: [
        {
          id: 'g-1',
          source: 'google',
          title: 'Team Sync & Product Update',
          start: `${todayStr}T11:00:00.000Z`,
          end: `${todayStr}T11:30:00.000Z`,
          location: 'Google Meet',
          color: '#4285f4'
        },
        {
          id: 'g-2',
          source: 'google',
          title: 'Flight Status & Check-in Reminder',
          start: `${todayStr}T15:00:00.000Z`,
          end: `${todayStr}T15:30:00.000Z`,
          location: 'Terminal 2',
          color: '#34a853'
        }
      ]
    });
  }

  try {
    const timeMin = new Date().toISOString();
    const googleRes = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${encodeURIComponent(timeMin)}&singleEvents=true&orderBy=startTime&maxResults=20`,
      {
        headers: { Authorization: `Bearer ${tokenData.access_token}` }
      }
    );
    const googleData = await googleRes.json();

    const formattedEvents = (googleData.items || []).map(item => ({
      id: item.id,
      source: 'google',
      title: item.summary || 'Google Calendar Event',
      start: item.start?.dateTime || item.start?.date,
      end: item.end?.dateTime || item.end?.date,
      location: item.location || 'Google Calendar',
      color: '#4285f4'
    }));

    res.json({ connected: true, events: formattedEvents });
  } catch (err) {
    res.status(500).json({ error: err.message, connected: true, events: [] });
  }
});

// POST /api/calendar/google/disconnect
router.post('/google/disconnect', authMiddleware, (req, res) => {
  userCalendarTokens.delete(req.user.userId);
  userCalendarTokens.delete('default');
  res.json({ connected: false, message: 'Google Calendar disconnected.' });
});

export default router;
