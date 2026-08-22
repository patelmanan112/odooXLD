import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Calendar, Clock, ArrowRight, Train, Plane, Bus, Compass } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Screen13_JourneyView = () => {
  const { selectedTrip } = useApp();

  const stops = selectedTrip?.stops || ['Mumbai', 'Tokyo', 'Kyoto', 'Osaka', 'Tokyo'];

  const getTransportIcon = (index) => {
    if (index === 0) return Plane;
    if (index === 1 || index === 2) return Train;
    return Bus;
  };

  const getTransportLabel = (index) => {
    if (index === 0) return 'Flight AI-306 (8h 45m)';
    if (index === 1) return 'Shinkansen Bullet Train (2h 15m)';
    if (index === 2) return 'Rapid Express (45m)';
    return 'Express Shuttle';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '32px', width: '100%', maxWidth: '100%', overflowX: 'hidden' }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#c8622a' }}>
            ✦ Route & Progression
          </span>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
            Trip Journey & Route Line 🗺️
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#64748b', marginTop: '4px' }}>
            {selectedTrip ? selectedTrip.name : 'Japan Adventure'} • {stops.length} Stops Progression
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <span className="badge badge-emerald" style={{ padding: '8px 14px', fontSize: '0.78rem' }}>
            Total Distance: ~6,840 km
          </span>
        </div>
      </div>

      {/* Main Journey Editorial Timeline */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '24px',
        border: '1px solid #e2e8f0',
        padding: 'clamp(24px, 4vw, 40px)',
        boxShadow: '0 4px 24px -2px rgba(6, 78, 59, 0.06)'
      }}>
        {/* Horizontal Summary Path */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          overflowX: 'auto',
          paddingBottom: '24px',
          marginBottom: '36px',
          borderBottom: '1px solid #f1f5f9'
        }}>
          {stops.map((city, i) => (
            <React.Fragment key={i}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                backgroundColor: i === 0 || i === stops.length - 1 ? '#f5e6da' : '#ecfdf5',
                border: `1px solid ${i === 0 || i === stops.length - 1 ? '#c8622a' : '#047857'}`,
                borderRadius: '100px',
                whiteSpace: 'nowrap',
                fontWeight: 700,
                fontSize: '0.86rem',
                color: i === 0 || i === stops.length - 1 ? '#c8622a' : '#064e3b'
              }}>
                <MapPin size={14} />
                <span>{city}</span>
              </div>
              {i < stops.length - 1 && (
                <ArrowRight size={16} color="#94a3b8" style={{ flexShrink: 0 }} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Vertical Progression Stops */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {stops.map((stopCity, i) => {
            const TransportIcon = getTransportIcon(i);
            const isLast = i === stops.length - 1;

            return (
              <div key={i} style={{ display: 'flex', gap: '24px', position: 'relative' }}>
                {/* Timeline Line & Node */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '32px', flexShrink: 0 }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: i === 0 ? '#c8622a' : '#064e3b',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.85rem',
                    fontWeight: 800,
                    boxShadow: '0 4px 12px rgba(6, 78, 59, 0.2)',
                    zIndex: 2
                  }}>
                    {i + 1}
                  </div>

                  {!isLast && (
                    <div style={{
                      flex: 1,
                      width: '2px',
                      background: 'linear-gradient(to bottom, #064e3b 0%, #cbd5e1 100%)',
                      margin: '8px 0'
                    }} />
                  )}
                </div>

                {/* Stop Content Card */}
                <div style={{ flex: 1, paddingBottom: isLast ? 0 : '40px' }}>
                  <div style={{
                    backgroundColor: '#faf8f4',
                    border: '1px solid #e2e8f0',
                    borderRadius: '16px',
                    padding: '20px 24px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                      <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.3rem', fontWeight: 800, color: '#0f172a' }}>
                        Stop {i + 1}: {stopCity}
                      </h3>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>
                        Day {i + 1} • {['12 Oct', '13 Oct', '14 Oct', '16 Oct', '19 Oct'][i] || 'Upcoming'}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.86rem', color: '#64748b', marginBottom: '14px' }}>
                      {i === 0 ? 'Origin & departure hub' : i === stops.length - 1 ? 'Final return destination' : 'Primary exploration city & cultural activities'}
                    </p>

                    {/* Transport Connection Segment (if not last) */}
                    {!isLast && (
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '6px 12px',
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        color: '#064e3b'
                      }}>
                        <TransportIcon size={14} color="#c8622a" />
                        <span>Next Leg: {getTransportLabel(i)} → {stops[i + 1]}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};
