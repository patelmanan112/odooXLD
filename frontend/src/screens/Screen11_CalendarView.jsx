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
      style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', maxWidth: '100%', overflowX: 'hidden' }}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
        <div>
          <span className="badge badge-emerald">Screen 11: Calendar View</span>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.8rem', fontWeight: 800, color: '#064e3b', marginTop: '4px' }}>
            Trip Timeline & Calendar Visualizer 🗓️
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.86rem' }}>
            Interactive month calendar mapping flights, hotels, and activities
          </p>
        </div>
        <div>
          <button onClick={() => setCurrentScreen(5)} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.84rem' }}>
            + Schedule Event
          </button>
        </div>
      </div>

      {/* Calendar Shell Grid */}
      <div className="calendar-grid-main">
        
        {/* Month Calendar Grid */}
        <div className="glass-card" style={{ padding: '20px', backgroundColor: '#ffffff', width: '100%', minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#064e3b' }}>{currentMonth}</h3>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button className="btn btn-outline btn-icon" style={{ width: '32px', height: '32px' }}><ChevronLeft size={16} /></button>
              <button className="btn btn-outline btn-icon" style={{ width: '32px', height: '32px' }}><ChevronRight size={16} /></button>
            </div>
          </div>

          <div style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <div style={{ minWidth: '320px' }}>
              {/* Weekday Labels */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', fontWeight: 700, fontSize: '0.75rem', color: '#64748b', marginBottom: '8px' }}>
                <span>SUN</span><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span>
              </div>

              {/* Days Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
                {daysInMonth.map(day => {
                  const events = calendarEvents[day] || [];
                  const isSelected = selectedDay === day;
                  return (
                    <div 
                      key={day}
                      onClick={() => setSelectedDay(day)}
                      style={{
                        minHeight: '65px',
                        padding: '6px 4px',
                        borderRadius: '10px',
                        backgroundColor: isSelected ? '#ecfdf5' : '#f8fafc',
                        border: isSelected ? '2px solid #047857' : '1px solid #e2e8f0',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}
                    >
                      <span style={{ fontWeight: 800, fontSize: '0.78rem', color: isSelected ? '#064e3b' : '#334155' }}>{day}</span>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        {events.map((ev, i) => (
                          <div 
                            key={i} 
                            style={{
                              fontSize: '0.62rem',
                              fontWeight: 700,
                              backgroundColor: ev.color,
                              color: '#ffffff',
                              padding: '2px 4px',
                              borderRadius: '4px',
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
          </div>
        </div>

        {/* Selected Day Agenda Side Panel */}
        <div className="glass-card" style={{ padding: '20px', backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#064e3b', marginBottom: '4px' }}>
              Day {selectedDay} Agenda
            </h3>
            <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '16px' }}>
              {selectedDay} October 2026 • Japan Trip
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(calendarEvents[selectedDay] || []).length > 0 ? (
                calendarEvents[selectedDay].map((ev, i) => (
                  <div key={i} style={{ padding: '12px', borderRadius: '12px', backgroundColor: '#f8fafc', borderLeft: `4px solid ${ev.color}`, borderTop: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.86rem', color: '#0f172a' }}>{ev.title}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} /> {ev.time}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ padding: '16px', textAlign: 'center', color: '#94a3b8', fontSize: '0.82rem' }}>
                  No activities scheduled for this day.
                </div>
              )}
            </div>
          </div>

          <button 
            onClick={() => { showToast('Activity added to day agenda!'); }} 
            className="btn btn-secondary"
            style={{ width: '100%', marginTop: '16px', fontSize: '0.82rem' }}
          >
            <Plus size={15} /> Add Activity
          </button>
        </div>
      </div>
    </motion.div>
  );
};
