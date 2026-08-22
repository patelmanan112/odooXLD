import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Compass, 
  MapPin, 
  Plus, 
  Search, 
  Bell, 
  User, 
  Settings, 
  ShieldAlert, 
  LogOut, 
  ChevronDown, 
  Menu, 
  X,
  Sparkles,
  Calendar,
  Wallet
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const GlobalNavbar = () => {
  const { user, logout, toastMessage, trips } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns on route change
  useEffect(() => {
    setShowProfileMenu(false);
    setShowNotifications(false);
    setMobileOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: 'Explore', path: '/explore' },
    { label: 'My Trips', path: '/trips' },
    { label: 'Community', path: '/community' },
  ];

  const isActive = (path) => location.pathname === path;

  const userFirstName = user?.name ? user.name.split(' ')[0] : 'Traveler';
  const userAvatar = user?.avatarUrl || user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';
  const isAdmin = user?.role === 'ADMIN' || user?.isAdmin;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?q=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/explore');
    }
  };

  return (
    <header style={{
      position: 'sticky',
      top: '12px',
      zIndex: 100,
      padding: '0 24px',
      margin: '0 auto',
      maxWidth: '1440px',
      width: '100%',
      pointerEvents: 'none' // allow click through container
    }}>
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{
          pointerEvents: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 20px',
          backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.88)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderRadius: '16px',
          border: '1px solid rgba(226, 232, 240, 0.8)',
          boxShadow: scrolled 
            ? '0 12px 36px -4px rgba(6, 78, 59, 0.12)' 
            : '0 4px 20px -2px rgba(6, 78, 59, 0.06)',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Left: Brand Logo & Main Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          <Link 
            to="/dashboard" 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              textDecoration: 'none',
              color: '#064e3b'
            }}
          >
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '10px',
              backgroundColor: '#064e3b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(6, 78, 59, 0.25)'
            }}>
              <Compass size={20} />
            </div>
            <span style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: '1.35rem',
              fontWeight: 800,
              color: '#0f172a',
              letterSpacing: '-0.02em'
            }}>
              Wander<span style={{ color: '#c8622a' }}>ly</span>
            </span>
          </Link>

          {/* Desktop Global Navigation Links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '6px' }} className="desktop-nav-links">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  position: 'relative',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  fontSize: '0.88rem',
                  fontWeight: isActive(link.path) ? 700 : 600,
                  color: isActive(link.path) ? '#064e3b' : '#64748b',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  backgroundColor: isActive(link.path) ? '#ecfdf5' : 'transparent'
                }}
              >
                {link.label}
                {isActive(link.path) && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    style={{
                      position: 'absolute',
                      bottom: '-2px',
                      left: '14px',
                      right: '14px',
                      height: '2px',
                      backgroundColor: '#c8622a',
                      borderRadius: '2px'
                    }}
                  />
                )}
              </Link>
            ))}
          </nav>
        </div>

        {/* Center/Right Search Bar & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Quick Search */}
          <form onSubmit={handleSearchSubmit} className="desktop-search-form" style={{ position: 'relative', width: '220px' }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search places..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 36px',
                fontSize: '0.84rem',
                borderRadius: '9999px',
                border: '1px solid #e2e8f0',
                backgroundColor: '#f8fafc',
                outline: 'none',
                fontFamily: 'inherit',
                transition: 'all 0.2s ease'
              }}
              onFocus={e => { e.target.style.borderColor = '#c8622a'; e.target.style.backgroundColor = '#ffffff'; }}
              onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.backgroundColor = '#f8fafc'; }}
            />
          </form>

          {/* Primary CTA: + Plan Trip */}
          <Link
            to="/trips/new"
            className="btn btn-primary"
            style={{
              padding: '8px 18px',
              fontSize: '0.85rem',
              fontWeight: 700,
              backgroundColor: '#c8622a',
              background: 'linear-gradient(135deg, #c8622a 0%, #e8855a 100%)',
              color: '#ffffff',
              borderRadius: '9999px',
              boxShadow: '0 4px 14px rgba(200, 98, 42, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              textDecoration: 'none'
            }}
          >
            <Plus size={16} />
            <span>Plan Trip</span>
          </Link>

          {/* Notifications Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => { setShowNotifications(!showNotifications); setShowProfileMenu(false); }}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#475569',
                position: 'relative'
              }}
              aria-label="Notifications"
            >
              <Bell size={17} />
              <span style={{
                position: 'absolute',
                top: '6px',
                right: '6px',
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: '#c8622a'
              }} />
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    position: 'absolute',
                    top: '46px',
                    right: 0,
                    width: '300px',
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    boxShadow: '0 16px 40px rgba(0,0,0,0.12)',
                    border: '1px solid #e2e8f0',
                    padding: '16px',
                    zIndex: 200
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a' }}>Notifications</span>
                    <span className="badge badge-emerald" style={{ fontSize: '0.68rem' }}>2 New</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ padding: '8px 10px', backgroundColor: '#f8fafc', borderRadius: '10px', fontSize: '0.8rem' }}>
                      <p style={{ fontWeight: 700, color: '#0f172a' }}>Trip Reminder ✈️</p>
                      <p style={{ color: '#64748b', marginTop: '2px' }}>Japan Adventure is coming up in 3 weeks!</p>
                    </div>
                    <div style={{ padding: '8px 10px', backgroundColor: '#f8fafc', borderRadius: '10px', fontSize: '0.8rem' }}>
                      <p style={{ fontWeight: 700, color: '#0f172a' }}>Community Highlight 🌟</p>
                      <p style={{ color: '#64748b', marginTop: '2px' }}>Priya liked your Rajasthan itinerary.</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile Menu Trigger */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 10px 4px 4px',
                borderRadius: '9999px',
                border: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <img
                src={userAvatar}
                alt={userFirstName}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  objectFit: 'cover'
                }}
              />
              <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0f172a' }} className="hide-on-mobile">
                {userFirstName}
              </span>
              <ChevronDown size={14} color="#64748b" />
            </button>

            {/* Profile Dropdown */}
            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    position: 'absolute',
                    top: '46px',
                    right: 0,
                    width: '220px',
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    boxShadow: '0 16px 40px rgba(0,0,0,0.12)',
                    border: '1px solid #e2e8f0',
                    padding: '8px',
                    zIndex: 200
                  }}
                >
                  <div style={{ padding: '10px 12px', borderBottom: '1px solid #f1f5f9', marginBottom: '4px' }}>
                    <p style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a' }}>{user?.name || 'Traveler'}</p>
                    {user?.email && (
                      <p style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '2px', wordBreak: 'break-all' }}>
                        {user.email}
                      </p>
                    )}
                  </div>

                  <Link
                    to="/profile"
                    style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '10px 12px', borderRadius: '10px',
                      fontSize: '0.86rem', fontWeight: 600, color: '#334155',
                      textDecoration: 'none', transition: 'background 0.15s ease'
                    }}
                    className="dropdown-item"
                  >
                    <User size={16} color="#64748b" />
                    <span>Profile & Account</span>
                  </Link>

                  <Link
                    to="/settings"
                    style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '10px 12px', borderRadius: '10px',
                      fontSize: '0.86rem', fontWeight: 600, color: '#334155',
                      textDecoration: 'none', transition: 'background 0.15s ease'
                    }}
                    className="dropdown-item"
                  >
                    <Settings size={16} color="#64748b" />
                    <span>Preferences</span>
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '10px 12px', borderRadius: '10px',
                        fontSize: '0.86rem', fontWeight: 600, color: '#b45309',
                        textDecoration: 'none', backgroundColor: '#fef3c7'
                      }}
                    >
                      <ShieldAlert size={16} color="#b45309" />
                      <span>Admin Analytics</span>
                    </Link>
                  )}

                  <div style={{ height: '1px', backgroundColor: '#f1f5f9', margin: '4px 0' }} />

                  <button
                    onClick={logout}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '10px 12px', borderRadius: '10px',
                      fontSize: '0.86rem', fontWeight: 600, color: '#ef4444',
                      background: 'none', border: 'none', cursor: 'pointer',
                      textAlign: 'left'
                    }}
                    className="dropdown-item"
                  >
                    <LogOut size={16} color="#ef4444" />
                    <span>Log Out</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#0f172a',
              padding: '6px'
            }}
            className="mobile-hamburger-btn"
            aria-label="Toggle Navigation"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              pointerEvents: 'auto',
              marginTop: '8px',
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              padding: '16px',
              boxShadow: '0 16px 40px rgba(0,0,0,0.12)',
              overflow: 'hidden'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Link to="/explore" style={{ padding: '10px', fontWeight: 700, color: '#0f172a', textDecoration: 'none' }}>Explore</Link>
              <Link to="/trips" style={{ padding: '10px', fontWeight: 700, color: '#0f172a', textDecoration: 'none' }}>My Trips</Link>
              <Link to="/community" style={{ padding: '10px', fontWeight: 700, color: '#0f172a', textDecoration: 'none' }}>Community</Link>
              <Link to="/trips/new" style={{ padding: '10px', fontWeight: 700, color: '#c8622a', textDecoration: 'none' }}>+ Plan New Trip</Link>
              <div style={{ height: '1px', backgroundColor: '#e2e8f0', margin: '4px 0' }} />
              <Link to="/profile" style={{ padding: '10px', fontSize: '0.9rem', color: '#64748b', textDecoration: 'none' }}>Profile & Account</Link>
              {isAdmin && <Link to="/admin" style={{ padding: '10px', fontSize: '0.9rem', color: '#b45309', textDecoration: 'none' }}>Admin Panel</Link>}
              <button onClick={logout} style={{ padding: '10px', fontSize: '0.9rem', color: '#ef4444', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', fontWeight: 600 }}>Log Out</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 868px) {
          .desktop-nav-links, .desktop-search-form, .hide-on-mobile { display: none !important; }
          .mobile-hamburger-btn { display: flex !important; }
        }
        .dropdown-item:hover { background-color: #f8fafc; }
      `}</style>
    </header>
  );
};
