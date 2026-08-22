import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin, Clock, Briefcase, Plus, Plane } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const CalendarView = () => {
  const { trips, selectedTrip, showToast } = useApp();
  const navigate = useNavigate();

  /* ── Auto-Select Active Trip Month ── */
  const [currentDate, setCurrentDate] = useState(() => {
    if (selectedTrip && selectedTrip.startDate) {
      const parts = String(selectedTrip.startDate).split('-');
      if (parts.length === 3) {
        return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, 1);
      }
    }
    if (trips && trips.length > 0 && trips[0].startDate) {
      const parts = String(trips[0].startDate).split('-');
      if (parts.length === 3) {
        return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, 1);
      }
    }
    return new Date();
  });

  const [selectedDayNumber, setSelectedDayNumber] = useState(new Date().getDate());

  /* Auto-align to active trip month */
  useEffect(() => {
    const activeTrip = selectedTrip || (trips && trips.length > 0 ? trips[0] : null);
    if (activeTrip && activeTrip.startDate) {
      const parts = String(activeTrip.startDate).split('-');
      if (parts.length === 3) {
        const tripYear = parseInt(parts[0], 10);
        const tripMonth = parseInt(parts[1], 10) - 1;
        const tripDay = parseInt(parts[2], 10) || 1;
        
        setCurrentDate(new Date(tripYear, tripMonth, 1));
        setSelectedDayNumber(tripDay);
      }
    }
  }, [trips, selectedTrip]);

  const year = currentDate.getFullYear();
  const monthIndex = currentDate.getMonth();

  /* Month Navigation */
  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleToday = () => {
    const now = new Date();
    setCurrentDate(now);
    setSelectedDayNumber(now.getDate());
  };

  /* Number of days in current active month */
  const daysInMonthCount = new Date(year, monthIndex + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, monthIndex, 1).getDay(); // 0 = Sun, 1 = Mon ...
  const startOffset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1; // Mon = 0 ... Sun = 6

  /* ── Parse Real Trips and Activities from Context ── */
  const { activeTripDayNumbers, eventsByDayNumber, totalTripsInMonth } = useMemo(() => {
    const activeDays = new Set();
    const eventsMap = {};
    let monthTripCount = 0;

    if (!trips || trips.length === 0) {
      return { activeTripDayNumbers: activeDays, eventsByDayNumber: eventsMap, totalTripsInMonth: 0 };
    }

    trips.forEach(trip => {
      const sStr = String(trip.startDate || '').split('T')[0];
      const eStr = String(trip.endDate || sStr).split('T')[0];

      if (!sStr) return;

      const [sYear, sMonth, sDay] = sStr.split('-').map(n => parseInt(n, 10));
      const [eYear, eMonth, eDay] = (eStr || sStr).split('-').map(n => parseInt(n, 10));

      if (!sYear || !sMonth || !sDay) return;

      const startDateObj = new Date(sYear, sMonth - 1, sDay);
      const endDateObj = new Date(eYear || sYear, (eMonth || sMonth) - 1, eDay || sDay + 2);

      // Check if trip overlaps current view month/year
      let isTripInCurrentMonth = false;

      for (let dayNum = 1; dayNum <= daysInMonthCount; dayNum++) {
        const thisDateObj = new Date(year, monthIndex, dayNum);

        const tTime = thisDateObj.getTime();
        const sTime = startDateObj.getTime();
        const eTime = endDateObj.getTime();

        if (tTime >= sTime && tTime <= eTime) {
          activeDays.add(dayNum);
          isTripInCurrentMonth = true;

          if (!eventsMap[dayNum]) eventsMap[dayNum] = [];

          // Calculate day index within trip
          const dayIndex = Math.round((tTime - sTime) / 86400000);
          const isStartDay = tTime === sTime;
          const tripDayObj = trip.days ? trip.days[dayIndex] : null;

          if (tripDayObj && tripDayObj.activities && tripDayObj.activities.length > 0) {
            tripDayObj.activities.forEach(act => {
              eventsMap[dayNum].push({
                id: act.id || `act-${Math.random()}`,
                title: act.title || act.name,
                time: act.time || '10:00 AM',
                location: trip.destination || 'Spot',
                category: act.category || 'Sightseeing',
                color: getCategoryColor(act.category),
                tripName: trip.name || trip.title,
                isStartDay
              });
            });
          } else {
            // Main Trip Badge Event under Start Date
            eventsMap[dayNum].push({
              id: `trip-${trip.id}-${dayNum}`,
              title: isStartDay ? `✈️ ${trip.name || trip.title}` : `${trip.name || trip.title} (Day ${dayIndex + 1})`,
              time: 'All Day',
              location: trip.destination || 'Destination',
              category: 'Trip',
              color: '#E85D26',
              tripName: trip.name || trip.title,
              isStartDay
            });
          }
        }
      }

      if (isTripInCurrentMonth) monthTripCount++;
    });

    return { activeTripDayNumbers: activeDays, eventsByDayNumber: eventsMap, totalTripsInMonth: monthTripCount };
  }, [trips, year, monthIndex, daysInMonthCount]);

  const handleConnectCalendar = () => {
    if (showToast) showToast('Google Calendar sync connected! 📅');
  };

  const todayObj = new Date();
  const isCurrentMonthActual = todayObj.getFullYear() === year && todayObj.getMonth() === monthIndex;
  const todayDateNum = isCurrentMonthActual ? todayObj.getDate() : -1;

  const selectedDayEvents = eventsByDayNumber[selectedDayNumber] || [];

  return (
    <div style={{ backgroundColor: '#F5F3EF', minHeight: '100vh', padding: '36px 40px', boxSizing: 'border-box' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', gap: '32px' }}>
        
        {/* Left Column: Calendar Grid */}
        <div style={{ flex: 3, background: '#FFFFFF', borderRadius: '24px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: '1px solid #EDE9E2' }}>
          
          {/* Calendar Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <p style={{ fontSize: '0.78rem', fontWeight: 800, color: '#E85D26', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 2px' }}>
                My Trips Schedule & Sync
              </p>
              <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.8rem', fontWeight: 'bold', color: '#1A1A2E', margin: 0 }}>
                My Trips Calendar
              </h2>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button onClick={handlePrevMonth} style={{ border: '1px solid #EDE9E2', background: '#FAFAF8', borderRadius: '8px', cursor: 'pointer', padding: '6px 10px', display: 'flex', alignItems: 'center' }}>
                  <ChevronLeft size={18} color="#1A1A2E" />
                </button>
                <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: '800', fontSize: '1.15rem', color: '#1A1A2E', minWidth: '160px', textAlign: 'center' }}>
                  {MONTH_NAMES[monthIndex]} {year}
                </span>
                <button onClick={handleNextMonth} style={{ border: '1px solid #EDE9E2', background: '#FAFAF8', borderRadius: '8px', cursor: 'pointer', padding: '6px 10px', display: 'flex', alignItems: 'center' }}>
                  <ChevronRight size={18} color="#1A1A2E" />
                </button>
              </div>
              
              <div style={{ width: '1px', height: '24px', background: '#E2E8F0' }} />
              
              <button onClick={handleToday} className="btn btn-outline" style={{ padding: '6px 16px', borderRadius: '10px', fontSize: '0.85rem' }}>
                Today
              </button>
            </div>
          </div>

          {/* Month Trips Summary Badge */}
          {trips && trips.length > 0 && (
            <div style={{ backgroundColor: '#FEF0E7', border: '1px solid #FDDCC9', borderRadius: '12px', padding: '10px 16px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.85rem', color: '#E85D26', fontWeight: 800 }}>
                ✈️ Showing {totalTripsInMonth} active trip{totalTripsInMonth !== 1 ? 's' : ''} in {MONTH_NAMES[monthIndex]} {year}
              </span>
              <button
                onClick={() => {
                  const firstTrip = trips[0];
                  if (firstTrip.startDate) {
                    const parts = String(firstTrip.startDate).split('-');
                    setCurrentDate(new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, 1));
                    setSelectedDayNumber(parseInt(parts[2], 10) || 1);
                  }
                }}
                style={{ background: 'none', border: 'none', color: '#E85D26', fontSize: '0.78rem', fontWeight: 800, textDecoration: 'underline', cursor: 'pointer' }}
              >
                Jump to Trip Start Date
              </button>
            </div>
          )}

          {/* Days of week header */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '12px', marginBottom: '12px' }}>
            {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(day => (
              <div key={day} style={{ textAlign: 'center', fontSize: '0.78rem', fontWeight: 800, color: '#94A3B8', padding: '8px 0', letterSpacing: '0.05em' }}>
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '12px' }}>
            {/* Empty cells offset */}
            {Array.from({ length: startOffset }).map((_, i) => (
              <div key={`offset-${i}`} />
            ))}
            
            {Array.from({ length: daysInMonthCount }, (_, i) => i + 1).map(dayNum => {
              const isTripDay = activeTripDayNumbers.has(dayNum);
              const isToday = dayNum === todayDateNum;
              const isSelected = dayNum === selectedDayNumber;
              const dayEvents = eventsByDayNumber[dayNum] || [];

              return (
                <div 
                  key={dayNum}
                  onClick={() => setSelectedDayNumber(dayNum)}
                  style={{ 
                    minHeight: '100px', 
                    borderRadius: '14px', 
                    padding: '10px',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    background: isToday ? '#1A1A2E' : isTripDay ? '#FEF0E7' : '#FFFFFF',
                    border: isSelected ? '2.5px solid #E85D26' : '1px solid #EDE9E2',
                    color: isToday ? '#FFFFFF' : '#1A1A2E',
                    boxShadow: isSelected ? '0 4px 14px rgba(232, 93, 38, 0.2)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: isToday || isSelected ? 800 : 600, marginBottom: '6px', fontSize: '0.92rem' }}>
                    {dayNum}
                  </div>
                  
                  {/* Trip Name & Event Badges inside Date Cells */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {dayEvents.slice(0, 2).map((ev, idx) => (
                      <div key={idx} style={{ 
                        fontSize: '0.71rem',
                        padding: '4px 6px',
                        borderRadius: '6px', 
                        backgroundColor: ev.isStartDay ? '#E85D26' : (isToday ? 'rgba(255,255,255,0.25)' : '#1A1A2E'),
                        color: '#FFFFFF', 
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        fontWeight: 800,
                        boxShadow: ev.isStartDay ? '0 2px 6px rgba(232, 93, 38, 0.3)' : 'none'
                      }}>
                        {ev.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div style={{ fontSize: '0.68rem', color: isToday ? '#FCD34D' : '#E85D26', fontWeight: 800 }}>
                        +{dayEvents.length - 2} more
                      </div>
                    )}
                  </div>

                  {isTripDay && (
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px', backgroundColor: '#E85D26' }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Day Events & Quick Actions Panel */}
        <div style={{ flex: 1, maxWidth: '340px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ background: '#FFFFFF', borderRadius: '24px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: '1px solid #EDE9E2', flex: 1 }}>
            <h3 style={{ fontFamily: 'Outfit, sans-serif', margin: '0 0 4px 0', fontSize: '1.25rem', color: '#1A1A2E', fontWeight: 800 }}>
              {MONTH_NAMES[monthIndex]} {selectedDayNumber}, {year}
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#6B7280', margin: '0 0 20px', fontWeight: 600 }}>
              {selectedDayEvents.length} event{selectedDayEvents.length !== 1 ? 's' : ''} from My Trips
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {selectedDayEvents.length > 0 ? (
                selectedDayEvents.map((ev, i) => (
                  <motion.div
                    key={ev.id || i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    style={{ 
                      padding: '14px',
                      background: '#FAFAF8',
                      borderRadius: '14px',
                      borderLeft: `4px solid ${ev.color}`,
                      borderTop: '1px solid #F3F4F6',
                      borderRight: '1px solid #F3F4F6',
                      borderBottom: '1px solid #F3F4F6',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px' 
                    }}
                  >
                    <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, color: '#1A1A2E', fontSize: '0.95rem' }}>
                      {ev.title}
                    </div>
                    {ev.tripName && (
                      <div style={{ fontSize: '0.74rem', color: '#E85D26', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Briefcase size={12} /> {ev.tripName}
                      </div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#64748B', fontSize: '0.8rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={13} color="#9CA3AF" /> {ev.time}</span>
                      {ev.location && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={13} color="#E85D26" /> {ev.location}</span>
                      )}
                    </div>
                  </motion.div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '36px 0', color: '#9CA3AF' }}>
                  <CalendarIcon size={36} color="#CBD5E1" style={{ marginBottom: '12px' }} />
                  <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.98rem', fontWeight: 800, color: '#4B5563', marginBottom: '4px' }}>
                    No trip events for this date
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#9CA3AF', marginBottom: '16px' }}>
                    Select a date with an active trip highlight to view events.
                  </div>
                  <button onClick={() => navigate('/trips/new')} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.82rem' }}>
                    <Plus size={14} /> Create Trip
                  </button>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleConnectCalendar}
            style={{ 
              width: '100%',
              padding: '14px',
              background: '#FFFFFF',
              border: '1.5px solid #EDE9E2',
              borderRadius: '16px', 
              color: '#1A1A2E',
              fontWeight: 800,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}
          >
            <CalendarIcon size={18} color="#4285F4" /> Sync Google Calendar
          </button>

        </div>

      </div>
    </div>
  );
};

/* Category Color Helper */
function getCategoryColor(cat) {
  switch (cat) {
    case 'Flight': return '#3B82F6';
    case 'Stay': return '#8B5CF6';
    case 'Food': return '#10B981';
    case 'Sightseeing': return '#E85D26';
    case 'Transport': return '#F59E0B';
    default: return '#E85D26';
  }
}
