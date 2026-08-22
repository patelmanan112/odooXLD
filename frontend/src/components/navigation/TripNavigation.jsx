import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutGrid, 
  Calendar, 
  Wallet, 
  BookOpen, 
  MapPin, 
  CalendarDays, 
  Plus, 
  ChevronRight, 
  Sliders
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TripNavigation = () => {
  const { selectedTrip } = useApp();
  const location = useLocation();

  const tripTabs = [
    { label: 'All Trips', path: '/trips', icon: LayoutGrid },
    { label: '+ Create Trip', path: '/trips/new', icon: Plus },
    { label: 'Itinerary Builder', path: '/itinerary/builder', icon: Sliders },
    { label: 'View & Budget', path: '/itinerary/view', icon: Wallet },
    { label: 'Calendar', path: '/calendar', icon: CalendarDays },
    { label: 'Journal', path: '/journal', icon: BookOpen },
  ];

  const isActive = (path) => {
    if (path.includes('#')) {
      return location.hash === '#budget' && location.pathname === '/itinerary/view';
    }
    return location.pathname === path;
  };

  const getActiveTabLabel = () => {
    const activeTab = tripTabs.find(t => isActive(t.path));
    return activeTab ? activeTab.label : 'Workspace';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        padding: '16px 20px',
        marginBottom: '24px',
        boxShadow: '0 4px 20px -2px rgba(6, 78, 59, 0.04)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}
    >
      {/* Breadcrumbs & Trip Info Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        {/* Minimal Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#64748b' }}>
          <Link to="/trips" style={{ color: '#64748b', textDecoration: 'none', fontWeight: 600 }}>Trips</Link>
          <ChevronRight size={14} color="#94a3b8" />
          <span style={{ color: '#064e3b', fontWeight: 700 }}>{selectedTrip?.name || 'My Travel'}</span>
          <ChevronRight size={14} color="#94a3b8" />
          <span style={{ color: '#c8622a', fontWeight: 700 }}>{getActiveTabLabel()}</span>
        </div>

        {selectedTrip && (
          <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
            <MapPin size={12} color="#c8622a" style={{ display: 'inline', marginRight: 4 }} />
            {selectedTrip.destination} • {selectedTrip.dates}
          </div>
        )}
      </div>

      {/* Contextual Tabs Row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflowX: 'auto', maxWidth: '100%', paddingBottom: '2px' }}>
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
                padding: '7px 14px',
                borderRadius: '10px',
                fontSize: '0.84rem',
                fontWeight: active ? 700 : 600,
                color: active ? '#ffffff' : '#64748b',
                backgroundColor: active ? '#064e3b' : '#f8fafc',
                border: active ? '1px solid #064e3b' : '1px solid #e2e8f0',
                textDecoration: 'none',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap'
              }}
            >
              <Icon size={14} color={active ? '#ffffff' : '#64748b'} />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
};
