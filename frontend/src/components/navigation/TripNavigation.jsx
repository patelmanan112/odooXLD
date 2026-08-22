import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutGrid, Calendar, Wallet, BookOpen, MapPin, CalendarDays } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TripNavigation = () => {
  const { selectedTrip } = useApp();
  const location = useLocation();

  if (!selectedTrip) return null;

  const tripTabs = [
    { label: 'Overview', path: '/trips', icon: LayoutGrid },
    { label: 'Itinerary', path: '/itinerary/view', icon: Calendar },
    { label: 'Budget', path: '/itinerary/view#budget', icon: Wallet },
    { label: 'Journal', path: '/journal', icon: BookOpen },
    { label: 'Calendar', path: '/calendar', icon: CalendarDays },
  ];

  const isActive = (path) => {
    if (path.includes('#')) {
      return location.hash === '#budget' && location.pathname === '/itinerary/view';
    }
    return location.pathname === path && !location.hash;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        padding: '16px 24px',
        marginBottom: '24px',
        boxShadow: '0 4px 20px -2px rgba(6, 78, 59, 0.04)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}
    >
      {/* Trip Info Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MapPin size={16} color="#c8622a" />
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
            {selectedTrip.name}
          </h2>
          <span className="badge badge-emerald" style={{ fontSize: '0.68rem' }}>{selectedTrip.status || 'Active'}</span>
        </div>
        <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
          {selectedTrip.destination} • {selectedTrip.dates} ({selectedTrip.durationDays || 7} days)
        </p>
      </div>

      {/* Contextual Navigation Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflowX: 'auto', maxWidth: '100%' }}>
        {tripTabs.map(tab => {
          const Icon = tab.icon;
          const active = isActive(tab.path);
          return (
            <Link
              key={tab.label}
              to={tab.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '10px',
                fontSize: '0.85rem',
                fontWeight: active ? 700 : 600,
                color: active ? '#ffffff' : '#64748b',
                backgroundColor: active ? '#064e3b' : 'transparent',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap'
              }}
            >
              <Icon size={15} color={active ? '#ffffff' : '#64748b'} />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
};
