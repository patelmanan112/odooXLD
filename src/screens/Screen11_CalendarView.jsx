import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, Plus, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Screen11_CalendarView = () => {
  const { setCurrentScreen, showToast } = useApp();
  const [currentMonth, setCurrentMonth] = useState('October 2026');
  const [selectedDay, setSelectedDay] = useState(13);

  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  const calendarEvents = {
    12: [{ title: 'Flight AI-306 to Tokyo', type: 'flight', time: '09:00 AM', color: '#3b82f6' }],
    13: [
      { title: 'Senso-ji Temple Tour', type: 'tour', time: '10:30 AM', color: '#10b981' },
      { title: 'Shibuya Crossing Walk', type: 'activity', time: '03:00 PM', color: '#f59e0b' }
    ],
    14: [{ title: 'Shinkansen Train to Kyoto', type: 'train', time: '08:00 AM', color: '#8b5cf6' }],
    15: [{ title: 'Fushimi Inari Hike', type: 'tour', time: '09:30 AM', color: '#10b981' }],
    16: [{ title: 'Gion Tea Ceremony', type: 'culture', time: '02:00 PM', color: '#ec4899' }],
    17: [{ title: 'Osaka Street Food Market', type: 'food', time: '06:00 PM', color: '#f59e0b' }],
    19: [{ title: 'Return Flight to Mumbai', type: 'flight', time: '06:00 PM', color: '#3b82f6' }]
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span className="badge badge-emerald">Screen 11: Calendar View</span>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2rem', fontWeight: 800, color: '#064e3b', marginTop: '4px' }}>
            Trip Timeline & Calendar Visualizer 🗓️
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Interactive month calendar mapping your flights, hotels, tours, and activities
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => setCurrentScreen(5)} className="btn btn-primary">
            + Schedule Event
          </button>
        </div>
      </div>

      {/* Calendar Shell Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2.4fr 1fr', gap: '24px' }}>
        
        {/* Month Calendar Grid */}
        <div className="glass-card" style={{ padding: '28px', backgroundColor: '#ffffff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#064e3b' }}>{currentMonth}</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn btn-outline btn-icon" style={{ width: '36px', height: '36px' }}><ChevronLeft size={18} /></button>
              <button className="btn btn-outline btn-icon" style={{ width: '36px', height: '36px' }}><ChevronRight size={18} /></button>
            </div>
          </div>

          {/* Weekday Labels */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', fontWeight: 700, fontSize: '0.82rem', color: '#64748b', marginBottom: '12px' }}>
            <span>SUN</span><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span>
          </div>

          {/* Days Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
            {daysInMonth.map(day => {
              const events = calendarEvents[day] || [];
              const isSelected = selectedDay === day;
              return (
                <div 
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  style={{
                    minHeight: '85px',
                    padding: '8px',
                    borderRadius: '12px',
                    backgroundColor: isSelected ? '#ecfdf5' : '#f8fafc',
                    border: isSelected ? '2px solid #047857' : '1px solid #e2e8f0',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <span style={{ fontWeight: 800, fontSize: '0.85rem', color: isSelected ? '#064e3b' : '#334155' }}>{day}</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {events.map((ev, i) => (
                      <div 
                        key={i} 
                        style={{
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          backgroundColor: ev.color,
                          color: '#ffffff',
                          padding: '2px 6px',
                          borderRadius: '6px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {ev.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Day Agenda Side Panel */}
        <div className="glass-card" style={{ padding: '24px', backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#064e3b', marginBottom: '4px' }}>
              Day {selectedDay} Agenda
            </h3>
            <div style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '20px' }}>
              {selectedDay} October 2026 • Japan Trip
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {(calendarEvents[selectedDay] || []).length > 0 ? (
                calendarEvents[selectedDay].map((ev, i) => (
                  <div key={i} style={{ padding: '14px', borderRadius: '14px', backgroundColor: '#f8fafc', borderLeft: `4px solid ${ev.color}`, borderTop: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>{ev.title}</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={13} /> {ev.time}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>
                  No activities scheduled for this day.
                </div>
              )}
            </div>
          </div>

          <button 
            onClick={() => { showToast('Activity added to day agenda!'); }} 
            className="btn btn-secondary"
            style={{ width: '100%', marginTop: '20px' }}
          >
            <Plus size={16} /> Add Activity to Day {selectedDay}
          </button>
        </div>
      </div>
    </motion.div>
  );
};
