import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  MapPin, 
  ChevronDown, 
  CalendarDays, 
  BookOpen, 
  Settings, 
  LayoutGrid, 
  Sliders, 
  Wallet,
  Clock,
  Navigation,
  Share2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TripNavigation = () => {
  const { selectedTrip, showToast } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const moreRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (moreRef.current && !moreRef.current.contains(e.target)) {
        setShowMoreMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setShowMoreMenu(false);
  }, [location.pathname]);

  const activePath = location.pathname;

  const isOverviewActive = activePath === '/trips';
  const isItineraryActive = activePath === '/itinerary/builder';
  const isBudgetActive = activePath === '/itinerary/view';
  const isJourneyActive = activePath === '/journey';
  const isCalendarActive = activePath === '/calendar';
  const isMoreActive = activePath === '/journal' || activePath === '/profile' || activePath === '/settings';

  const handleShareTrip = () => {
    if (navigator.share) {
      navigator.share({ title: selectedTrip?.name || 'Wanderly Trip', url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Trip link copied to clipboard!');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        border: '1px solid #e2e8f0',
        padding: '20px 24px',
        marginBottom: '28px',
        boxShadow: '0 4px 20px -2px rgba(6, 78, 59, 0.04)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}
    >
      {/* ─── Back Button & Header Metadata ─────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          {/* ← My Trips Back Link */}
          <Link
            to="/trips"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.82rem',
              fontWeight: 700,
              color: '#c8622a',
              textDecoration: 'none',
              marginBottom: '8px',
              transition: 'transform 0.2s ease'
            }}
          >
            <ArrowLeft size={15} />
            <span>My Trips</span>
          </Link>

          {/* Trip Title & Subtitle */}
          <h2 style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: 'clamp(1.3rem, 2.5vw, 1.7rem)',
            fontWeight: 800,
            color: '#0f172a',
            lineHeight: 1.15,
            margin: 0
          }}>
            {selectedTrip ? selectedTrip.name : 'My Travel Workspace'}
          </h2>

          {selectedTrip && (
            <p style={{ fontSize: '0.84rem', color: '#64748b', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={14} color="#c8622a" />
              <span>{selectedTrip.destination}</span>
              <span style={{ color: '#cbd5e1' }}>•</span>
              <Clock size={14} color="#64748b" />
              <span>{selectedTrip.dates} ({selectedTrip.durationDays || 7} days)</span>
            </p>
          )}
        </div>

        {selectedTrip?.status && (
          <span className="badge badge-emerald" style={{ fontSize: '0.72rem', padding: '6px 12px' }}>
            {selectedTrip.status}
          </span>
        )}
      </div>

      {/* ─── Primary Tabs: Overview, Itinerary, Budget, Journey, Calendar, More ▾ ──── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        paddingTop: '12px',
        borderTop: '1px solid #f1f5f9',
        overflowX: 'auto',
        maxWidth: '100%'
      }}>
        {/* Tab 1: Overview */}
        <Link
          to="/trips"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '12px',
            fontSize: '0.86rem',
            fontWeight: isOverviewActive ? 700 : 600,
            color: isOverviewActive ? '#ffffff' : '#64748b',
            backgroundColor: isOverviewActive ? '#064e3b' : '#f8fafc',
            border: isOverviewActive ? '1px solid #064e3b' : '1px solid #e2e8f0',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            transition: 'all 0.2s ease'
          }}
        >
          <LayoutGrid size={15} color={isOverviewActive ? '#ffffff' : '#64748b'} />
          <span>Overview</span>
        </Link>

        {/* Tab 2: Itinerary */}
        <Link
          to="/itinerary/builder"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '12px',
            fontSize: '0.86rem',
            fontWeight: isItineraryActive ? 700 : 600,
            color: isItineraryActive ? '#ffffff' : '#64748b',
            backgroundColor: isItineraryActive ? '#064e3b' : '#f8fafc',
            border: isItineraryActive ? '1px solid #064e3b' : '1px solid #e2e8f0',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            transition: 'all 0.2s ease'
          }}
        >
          <Sliders size={15} color={isItineraryActive ? '#ffffff' : '#64748b'} />
          <span>Itinerary</span>
        </Link>

        {/* Tab 3: Budget */}
        <Link
          to="/itinerary/view"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '12px',
            fontSize: '0.86rem',
            fontWeight: isBudgetActive ? 700 : 600,
            color: isBudgetActive ? '#ffffff' : '#64748b',
            backgroundColor: isBudgetActive ? '#064e3b' : '#f8fafc',
            border: isBudgetActive ? '1px solid #064e3b' : '1px solid #e2e8f0',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            transition: 'all 0.2s ease'
          }}
        >
          <Wallet size={15} color={isBudgetActive ? '#ffffff' : '#64748b'} />
          <span>Budget</span>
        </Link>

        {/* Tab 4: Journey */}
        <Link
          to="/journey"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '12px',
            fontSize: '0.86rem',
            fontWeight: isJourneyActive ? 700 : 600,
            color: isJourneyActive ? '#ffffff' : '#64748b',
            backgroundColor: isJourneyActive ? '#064e3b' : '#f8fafc',
            border: isJourneyActive ? '1px solid #064e3b' : '1px solid #e2e8f0',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            transition: 'all 0.2s ease'
          }}
        >
          <Navigation size={15} color={isJourneyActive ? '#ffffff' : '#64748b'} />
          <span>Journey</span>
        </Link>

        {/* Tab 5: Calendar */}
        <Link
          to="/calendar"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '12px',
            fontSize: '0.86rem',
            fontWeight: isCalendarActive ? 700 : 600,
            color: isCalendarActive ? '#ffffff' : '#64748b',
            backgroundColor: isCalendarActive ? '#064e3b' : '#f8fafc',
            border: isCalendarActive ? '1px solid #064e3b' : '1px solid #e2e8f0',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            transition: 'all 0.2s ease'
          }}
        >
          <CalendarDays size={15} color={isCalendarActive ? '#ffffff' : '#64748b'} />
          <span>Calendar</span>
        </Link>

        {/* Tab 6: More ▾ Dropdown */}
        <div style={{ position: 'relative' }} ref={moreRef}>
          <button
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 18px',
              borderRadius: '12px',
              fontSize: '0.86rem',
              fontWeight: 800,
              color: isMoreActive ? '#ffffff' : '#c8622a',
              backgroundColor: isMoreActive ? '#c8622a' : '#f5e6da',
              border: '1.5px solid #c8622a',
              boxShadow: '0 2px 8px rgba(200, 98, 42, 0.15)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              fontFamily: 'inherit',
              transition: 'all 0.2s ease'
            }}
            aria-expanded={showMoreMenu}
            aria-label="More navigation options"
          >
            <span>More</span>
            <ChevronDown size={15} color={isMoreActive ? '#ffffff' : '#c8622a'} style={{ transform: showMoreMenu ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }} />
          </button>

          {/* More Menu Popover */}
          <AnimatePresence>
            {showMoreMenu && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                style={{
                  position: 'absolute',
                  top: '44px',
                  right: 0,
                  width: '200px',
                  backgroundColor: '#ffffff',
                  borderRadius: '14px',
                  boxShadow: '0 12px 32px rgba(0,0,0,0.12)',
                  border: '1px solid #e2e8f0',
                  padding: '6px',
                  zIndex: 100
                }}
              >
                <Link
                  to="/journal"
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '10px 12px', borderRadius: '8px',
                    fontSize: '0.84rem', fontWeight: 600, color: location.pathname === '/journal' ? '#064e3b' : '#334155',
                    textDecoration: 'none', backgroundColor: location.pathname === '/journal' ? '#ecfdf5' : 'transparent'
                  }}
                  className="more-dropdown-item"
                >
                  <BookOpen size={16} color="#64748b" />
                  <span>Trip Journal</span>
                </Link>

                <Link
                  to="/profile"
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '10px 12px', borderRadius: '8px',
                    fontSize: '0.84rem', fontWeight: 600, color: location.pathname === '/profile' ? '#064e3b' : '#334155',
                    textDecoration: 'none', backgroundColor: location.pathname === '/profile' ? '#ecfdf5' : 'transparent'
                  }}
                  className="more-dropdown-item"
                >
                  <Settings size={16} color="#64748b" />
                  <span>Trip Settings</span>
                </Link>

                <button
                  onClick={handleShareTrip}
                  style={{
                    width: '100%',
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '10px 12px', borderRadius: '8px',
                    fontSize: '0.84rem', fontWeight: 600, color: '#334155',
                    background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left'
                  }}
                  className="more-dropdown-item"
                >
                  <Share2 size={16} color="#64748b" />
                  <span>Share Trip</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <style>{`
        .more-dropdown-item:hover { background-color: #f8fafc; }
      `}</style>
    </motion.div>
  );
};
