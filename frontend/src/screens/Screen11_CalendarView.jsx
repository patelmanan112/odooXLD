import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Plus, 
  MapPin, 
  RefreshCw, 
  CheckCircle2, 
  ExternalLink,
  Layers,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { apiFetch } from '../utils/api';

export const Screen11_CalendarView = () => {
  const { selectedTrip, showToast } = useApp();

  // Dynamic system current date
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonthName = now.toLocaleString('default', { month: 'long' });
  const todayDate = now.getDate();

  const [viewMode, setViewMode] = useState('Month'); // 'Month' | 'Week' | 'Agenda'
  const [selectedDay, setSelectedDay] = useState(todayDate);
  const [googleConnected, setGoogleConnected] = useState(false);
  const [googleEvents, setGoogleEvents] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState(null);

  // Initial Wanderly Trip Events derived from selectedTrip or defaults
  const wanderlyEvents = {
    12: [{ id: 'w-1', title: 'Flight AI-306 to Tokyo', type: 'flight', time: '09:00 AM', source: 'wanderly', location: 'Narita Airport' }],
    13: [
      { id: 'w-2', title: 'Senso-ji Temple Tour', type: 'tour', time: '10:30 AM', source: 'wanderly', location: 'Asakusa, Tokyo' },
      { id: 'w-3', title: 'Shibuya Crossing & Hachiko', type: 'activity', time: '03:00 PM', source: 'wanderly', location: 'Shibuya' }
    ],
    14: [{ id: 'w-4', title: 'Shinkansen Bullet Train to Kyoto', type: 'train', time: '08:00 AM', source: 'wanderly', location: 'Tokyo Station' }],
    15: [{ id: 'w-5', title: 'Fushimi Inari Shrine Hike', type: 'tour', time: '09:30 AM', source: 'wanderly', location: 'Kyoto' }],
    16: [{ id: 'w-6', title: 'Gion Traditional Tea Ceremony', type: 'culture', time: '02:00 PM', source: 'wanderly', location: 'Gion' }],
    17: [{ id: 'w-7', title: 'Osaka Dotonbori Food Tour', type: 'food', time: '06:00 PM', source: 'wanderly', location: 'Osaka' }]
  };

  // Fetch Google Calendar Status & Events
  const fetchCalendarStatus = async () => {
    try {
      const statusData = await apiFetch('/api/calendar/google/status');
      setGoogleConnected(statusData.connected);
      if (statusData.connected) {
        setLastSynced('Just now');
        fetchGoogleEvents();
      }
    } catch (err) {
      // Fallback
    }
  };

  const fetchGoogleEvents = async () => {
    setIsSyncing(true);
    try {
      const data = await apiFetch('/api/calendar/google/events');
      if (data.connected && data.events) {
        setGoogleEvents(data.events);
        setGoogleConnected(true);
        setLastSynced('Just now');
      }
    } catch (err) {
      showToast('Could not sync Google Calendar events.');
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    fetchCalendarStatus();

    // Listen for OAuth popup completion
    const handleMessage = (e) => {
      if (e.data === 'google_calendar_connected') {
        fetchCalendarStatus();
        showToast('Google Calendar connected successfully! 🎉');
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleConnectGoogle = async () => {
    try {
      const data = await apiFetch('/api/calendar/google/connect');
      if (data.url) {
        window.open(data.url, 'Connect Google Calendar', 'width=600,height=700');
      } else {
        fetchGoogleEvents();
      }
    } catch (err) {
      fetchGoogleEvents();
    }
  };

  const handleDisconnectGoogle = async () => {
    try {
      await apiFetch('/api/calendar/google/disconnect', { method: 'POST' });
      setGoogleConnected(false);
      setGoogleEvents([]);
      showToast('Google Calendar disconnected.');
    } catch (err) {
      setGoogleConnected(false);
    }
  };

  // Merge Wanderly + Google events for selected day
  const getCombinedEventsForDay = (day) => {
    const wEvs = wanderlyEvents[day] || [];
    const gEvs = googleEvents.filter(ev => {
      if (!ev.start) return false;
      const d = new Date(ev.start);
      return d.getDate() === day;
    }).map(ev => ({
      id: ev.id,
      title: ev.title,
      type: 'google',
      time: new Date(ev.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: 'google',
      location: ev.location || 'Google Calendar'
    }));

    return [...wEvs, ...gEvs];
  };

  // Determine "Next Up" Event
  const allEventsForSelectedDay = getCombinedEventsForDay(selectedDay);
  const nextUpEvent = allEventsForSelectedDay[0] || (wanderlyEvents[13] ? wanderlyEvents[13][0] : null);

  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', maxWidth: '100%', overflowX: 'hidden' }}
    >
      {/* ─── Header & Mode Controls ─────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#c8622a' }}>
            ✦ Integrated Travel Calendar
          </span>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
            {selectedTrip ? selectedTrip.name : 'Japan Adventure'} Calendar 🗓️
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#64748b', marginTop: '2px' }}>
            System Date: {currentMonthName} {todayDate}, {currentYear} • Trip Period: {selectedTrip?.dates || '12 Oct — 19 Oct 2026'}
          </p>
        </div>

        {/* View Modes & Google Calendar Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Mode Switcher */}
          <div style={{ display: 'flex', backgroundColor: '#f1f5f9', padding: '4px', borderRadius: '12px' }}>
            {['Month', 'Week', 'Agenda'].map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: viewMode === mode ? 700 : 600,
                  backgroundColor: viewMode === mode ? '#064e3b' : 'transparent',
                  color: viewMode === mode ? '#ffffff' : '#64748b',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* Today Button */}
          <button
            onClick={() => { setSelectedDay(todayDate); showToast(`Returned to Today (${currentMonthName} ${todayDate})`); }}
            style={{
              padding: '8px 14px',
              borderRadius: '10px',
              border: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
              fontSize: '0.82rem',
              fontWeight: 700,
              color: '#064e3b',
              cursor: 'pointer'
            }}
          >
            Today
          </button>

          {/* Google Calendar Connection Button */}
          {googleConnected ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={fetchGoogleEvents}
                disabled={isSyncing}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '100px',
                  backgroundColor: '#ecfdf5',
                  color: '#047857',
                  border: '1px solid #34d399',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <CheckCircle2 size={15} color="#047857" />
                <span>Google Calendar Sync ✓</span>
                <RefreshCw size={12} className={isSyncing ? 'spin' : ''} />
              </button>
              <button
                onClick={handleDisconnectGoogle}
                style={{ fontSize: '0.75rem', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={handleConnectGoogle}
              className="btn btn-primary"
              style={{
                padding: '8px 16px',
                fontSize: '0.84rem',
                backgroundColor: '#4285f4',
                background: 'linear-gradient(135deg, #4285f4 0%, #34a853 100%)'
              }}
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" style={{ width: '16px', height: '16px', background: '#fff', borderRadius: '50%', padding: '2px' }} />
              <span>Connect Google Calendar</span>
            </button>
          )}
        </div>
      </div>

      {/* ─── Next Up Card Banner ─────────────────────────── */}
      {nextUpEvent && (
        <div style={{
          backgroundColor: '#faf8f4',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: nextUpEvent.source === 'google' ? '#4285f4' : '#c8622a',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Clock size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: nextUpEvent.source === 'google' ? '#4285f4' : '#c8622a' }}>
                  NEXT UP • {nextUpEvent.time}
                </span>
                <span className={`badge ${nextUpEvent.source === 'google' ? 'badge-blue' : 'badge-emerald'}`} style={{ fontSize: '0.62rem' }}>
                  {nextUpEvent.source === 'google' ? 'Google Calendar' : 'Wanderly'}
                </span>
              </div>
              <h4 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                {nextUpEvent.title}
              </h4>
              <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
                <MapPin size={12} color="#64748b" style={{ display: 'inline', marginRight: 4 }} />
                {nextUpEvent.location}
              </p>
            </div>
          </div>

          {lastSynced && (
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              Last synced: {lastSynced}
            </span>
          )}
        </div>
      )}

      {/* ─── Main Calendar Content Area ─────────────────────────── */}
      {viewMode === 'Month' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {/* Month Calendar Grid */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '24px', flex: 2 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.3rem', fontWeight: 800, color: '#0f172a' }}>
                {currentMonthName} {currentYear}
              </h3>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>
                Click a day to view agenda
              </span>
            </div>

            {/* Weekday Headers */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', fontWeight: 700, fontSize: '0.75rem', color: '#64748b', marginBottom: '10px' }}>
              <span>SUN</span><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span>
            </div>

            {/* Days Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
              {daysInMonth.map(day => {
                const combined = getCombinedEventsForDay(day);
                const isSelected = selectedDay === day;
                const isToday = day === todayDate;
                const isTripDay = day >= 12 && day <= 19;

                return (
                  <div
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    style={{
                      minHeight: '75px',
                      padding: '8px',
                      borderRadius: '12px',
                      backgroundColor: isSelected ? '#ecfdf5' : isTripDay ? '#fffbeb' : '#faf8f4',
                      border: isSelected ? '2px solid #064e3b' : isToday ? '2px solid #c8622a' : '1px solid #e2e8f0',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.82rem', color: isSelected ? '#064e3b' : '#0f172a' }}>
                        {day}
                      </span>
                      {isToday && <span style={{ fontSize: '0.58rem', fontWeight: 800, color: '#c8622a', textTransform: 'uppercase' }}>TODAY</span>}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {combined.slice(0, 2).map((ev, i) => (
                        <div
                          key={i}
                          style={{
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            padding: '2px 6px',
                            borderRadius: '4px',
                            backgroundColor: ev.source === 'google' ? '#dbeafe' : '#d1fae5',
                            color: ev.source === 'google' ? '#1e40af' : '#064e3b',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {ev.title}
                        </div>
                      ))}
                      {combined.length > 2 && (
                        <span style={{ fontSize: '0.6rem', color: '#64748b', fontWeight: 700 }}>+{combined.length - 2} more</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Day Agenda Side Panel */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '24px', flex: 1 }}>
            <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '16px', marginBottom: '20px' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#c8622a' }}>
                Day Agenda
              </span>
              <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                {currentMonthName} {selectedDay}, {currentYear}
              </h3>
            </div>

            {allEventsForSelectedDay.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {allEventsForSelectedDay.map((ev, i) => (
                  <div
                    key={ev.id || i}
                    style={{
                      padding: '14px',
                      borderRadius: '12px',
                      backgroundColor: ev.source === 'google' ? '#f0f9ff' : '#faf8f4',
                      borderLeft: `4px solid ${ev.source === 'google' ? '#4285f4' : '#c8622a'}`
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>{ev.time}</span>
                      <span className={`badge ${ev.source === 'google' ? 'badge-blue' : 'badge-emerald'}`} style={{ fontSize: '0.62rem' }}>
                        {ev.source === 'google' ? 'Google' : 'Wanderly'}
                      </span>
                    </div>
                    <p style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0f172a' }}>{ev.title}</p>
                    <p style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>📍 {ev.location}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '32px 16px', color: '#64748b' }}>
                <p style={{ fontWeight: 700, fontSize: '0.95rem' }}>No events scheduled for Day {selectedDay}</p>
                <p style={{ fontSize: '0.8rem', marginTop: '4px' }}>Enjoy free exploration time!</p>
              </div>
            )}
          </div>
        </div>
      )}

      {viewMode === 'Agenda' && (
        <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '24px' }}>
          <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
            Chronological Trip Agenda
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[12, 13, 14, 15, 16, 17, 19].map(day => {
              const evs = getCombinedEventsForDay(day);
              return (
                <div key={day} style={{ display: 'flex', gap: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px' }}>
                  <div style={{ minWidth: '80px' }}>
                    <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.2rem', color: '#064e3b' }}>{currentMonthName.slice(0, 3)} {day}</span>
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {evs.map((ev, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', backgroundColor: '#faf8f4', borderRadius: '10px' }}>
                        <div>
                          <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a' }}>{ev.title}</span>
                          <span style={{ fontSize: '0.78rem', color: '#64748b', marginLeft: '10px' }}>• {ev.time}</span>
                        </div>
                        <span className={`badge ${ev.source === 'google' ? 'badge-blue' : 'badge-emerald'}`}>{ev.source === 'google' ? 'Google' : 'Wanderly'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {viewMode === 'Week' && (
        <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '24px' }}>
          <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
            Weekly Hourly Schedule (12 Oct — 18 Oct)
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '80px repeat(7, 1fr)', gap: '8px', overflowX: 'auto' }}>
            <div style={{ fontWeight: 700, fontSize: '0.75rem', color: '#64748b' }}>Time</div>
            {['Mon 12', 'Tue 13', 'Wed 14', 'Thu 15', 'Fri 16', 'Sat 17', 'Sun 18'].map(d => (
              <div key={d} style={{ fontWeight: 800, fontSize: '0.8rem', color: '#064e3b', textAlign: 'center' }}>{d}</div>
            ))}

            {['09:00 AM', '11:00 AM', '02:00 PM', '05:00 PM', '08:00 PM'].map((slot, i) => (
              <React.Fragment key={slot}>
                <div style={{ fontSize: '0.75rem', color: '#64748b', padding: '8px 0' }}>{slot}</div>
                {[12, 13, 14, 15, 16, 17, 18].map(day => (
                  <div key={day} style={{ minHeight: '40px', backgroundColor: '#faf8f4', border: '1px solid #f1f5f9', borderRadius: '6px', padding: '4px' }}>
                    {day === 13 && i === 1 && (
                      <div style={{ fontSize: '0.62rem', fontWeight: 700, backgroundColor: '#d1fae5', color: '#064e3b', padding: '2px 4px', borderRadius: '4px' }}>
                        Temple Tour
                      </div>
                    )}
                    {day === 13 && i === 0 && googleConnected && (
                      <div style={{ fontSize: '0.62rem', fontWeight: 700, backgroundColor: '#dbeafe', color: '#1e40af', padding: '2px 4px', borderRadius: '4px' }}>
                        Team Sync
                      </div>
                    )}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};
