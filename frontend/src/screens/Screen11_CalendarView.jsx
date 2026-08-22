import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin, Clock } from 'lucide-react';

export const Screen11_CalendarView = () => {
  const { selectedTrip, showToast } = useApp();
  const [selectedDay, setSelectedDay] = useState(16);

  // Mock data
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
  const tripDays = [16, 17, 18, 19, 20, 21, 22];
  const today = 12;

  const events = {
    12: [{ id: 1, title: 'Planning meeting', time: '10:00 AM', location: 'Zoom', color: '#4F46E5' }],
    13: [],
    16: [
      { id: 2, title: 'Flight to Tokyo', time: '08:00 AM', location: 'JFK Airport', color: '#E85D26' },
      { id: 3, title: 'Hotel Check-in', time: '03:00 PM', location: 'Shinjuku Prince', color: '#059669' }
    ],
    17: [{ id: 4, title: 'City Tour', time: '09:30 AM', location: 'Tokyo Station', color: '#D97706' }],
    18: [],
    19: [{ id: 5, title: 'Mt Fuji Trip', time: '07:00 AM', location: 'Bus Terminal', color: '#DC2626' }]
  };

  const handleConnectCalendar = () => showToast("Connecting to Google Calendar...");

  return (
    <div style={{ backgroundColor: '#F5F3EF', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif', padding: '40px', display: 'flex', gap: '32px' }}>
      
      {/* Left Column: Calendar Grid */}
      <div style={{ flex: 3, background: '#FFF', borderRadius: '20px', padding: '28px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: '1px solid #E2E8F0' }}>
        
        {/* Calendar Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1A1A2E', margin: 0 }}>Calendar</h2>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '4px' }}><ChevronLeft size={20} color="#64748B" /></button>
              <span style={{ fontWeight: '600', fontSize: '1.1rem', color: '#1A1A2E', minWidth: '130px', textAlign: 'center' }}>January 2024</span>
              <button style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '4px' }}><ChevronRight size={20} color="#64748B" /></button>
            </div>
            
            <div style={{ width: '1px', height: '24px', background: '#E2E8F0' }} />
            
            <button onClick={() => setSelectedDay(today)} style={{ border: '1px solid #E2E8F0', background: '#FFF', padding: '6px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '500', color: '#334155' }}>
              Today
            </button>
            
            <div style={{ display: 'flex', background: '#F1F5F9', padding: '4px', borderRadius: '8px' }}>
              <button style={{ background: '#FFF', border: 'none', padding: '4px 12px', borderRadius: '4px', fontWeight: '500', color: '#1A1A2E', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>Month</button>
              <button style={{ background: 'transparent', border: 'none', padding: '4px 12px', borderRadius: '4px', fontWeight: '500', color: '#64748B', cursor: 'pointer' }}>Week</button>
            </div>
          </div>
        </div>

        {/* Days of week */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '12px', marginBottom: '12px' }}>
          {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(day => (
            <div key={day} style={{ textAlign: 'center', fontSize: '0.75rem', fontWeight: 'bold', color: '#94A3B8', padding: '8px 0' }}>{day}</div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '12px' }}>
          {/* Empty cells for padding */}
          {[1,2].map(i => <div key={`empty-${i}`} />)}
          
          {daysInMonth.map(day => {
            const isTripDay = tripDays.includes(day);
            const isToday = day === today;
            const isSelected = day === selectedDay;
            const dayEvents = events[day] || [];

            return (
              <div 
                key={day}
                onClick={() => setSelectedDay(day)}
                style={{ 
                  minHeight: '90px', 
                  borderRadius: '12px', 
                  padding: '12px',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  background: isToday ? '#1A1A2E' : isTripDay ? '#FFF3EE' : '#F8FAFC',
                  border: isSelected ? '2px solid #E85D26' : '2px solid transparent',
                  color: isToday ? '#FFF' : '#334155',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ fontWeight: isToday || isSelected ? 'bold' : '500', marginBottom: '8px' }}>{day}</div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {dayEvents.slice(0, 2).map((ev, i) => (
                    <div key={i} style={{ 
                      fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', 
                      background: isToday ? 'rgba(255,255,255,0.2)' : `${ev.color}15`, 
                      color: isToday ? '#FFF' : ev.color, 
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: '500'
                    }}>
                      {ev.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && <div style={{ fontSize: '0.7rem', color: '#94A3B8', marginTop: '2px' }}>+{dayEvents.length - 2} more</div>}
                </div>

                {isTripDay && (
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px', backgroundColor: '#E85D26' }} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Column: Event Detail Panel */}
      <div style={{ flex: 1, maxWidth: '320px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        <div style={{ background: '#FFF', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: '1px solid #E2E8F0', flex: 1 }}>
          <h3 style={{ margin: '0 0 24px 0', fontSize: '1.25rem', color: '#1A1A2E', fontWeight: 'bold' }}>
            January {selectedDay}, 2024
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {events[selectedDay] && events[selectedDay].length > 0 ? (
              events[selectedDay].map((ev, i) => (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} key={i} style={{ 
                  padding: '16px', background: '#F8FAFC', borderRadius: '12px', borderLeft: `4px solid ${ev.color}`, display: 'flex', flexDirection: 'column', gap: '8px' 
                }}>
                  <div style={{ fontWeight: '600', color: '#1A1A2E', fontSize: '1rem' }}>{ev.title}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#64748B', fontSize: '0.85rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14} /> {ev.time}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={14} /> {ev.location}</span>
                  </div>
                </motion.div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#94A3B8' }}>
                <CalendarIcon size={32} style={{ marginBottom: '16px', opacity: 0.5 }} />
                <div style={{ fontSize: '0.9rem' }}>No events scheduled</div>
              </div>
            )}
          </div>
        </div>

        <button onClick={handleConnectCalendar} style={{ 
          width: '100%', padding: '16px', background: '#FFF', border: '1px solid #E2E8F0', borderRadius: '20px', 
          color: '#334155', fontWeight: '600', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
        }}>
          <CalendarIcon size={18} color="#4285F4" /> Connect Google Calendar
        </button>

      </div>

    </div>
  );
};
