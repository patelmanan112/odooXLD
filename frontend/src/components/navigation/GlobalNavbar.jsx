import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Compass, Plus, Search, User, Settings, ShieldAlert, LogOut, ChevronDown, Menu, X, Bell, Map, Users, Calendar, LayoutGrid } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const GlobalNavbar = () => {
  const { user, logout, toastMessage } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const profileRef = useRef(null);

  const isAdmin = user?.role === 'ADMIN' || user?.isAdmin;
  const userFirstName = user?.name?.split(' ')[0] || 'Traveler';
  const userAvatar = user?.avatarUrl || user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'T')}&background=E85D26&color=fff&size=80`;

  const navLinks = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutGrid },
    { label: 'My Trips', path: '/trips', icon: Map },
    { label: 'Explore', path: '/explore', icon: Compass },
    { label: 'Community', path: '/community', icon: Users },
    { label: 'Calendar', path: '/calendar', icon: Calendar },
  ];

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      width: '100%',
      height: '60px',
      zIndex: 1000,
      backgroundColor: '#FFFFFF',
      borderBottom: '1px solid #EDE9E2',
      boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    }}>
      <div style={{
        width: '100%',
        padding: '0 32px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '24px',
      }}>
        {/* Logo */}
        <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '9px', textDecoration: 'none', flexShrink: 0 }}>
          <div style={{
            width: '34px', height: '34px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #E85D26, #F97316)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
          }}>
            <Compass size={19} />
          </div>
          <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.35rem', fontWeight: 800, color: '#1A1A2E', letterSpacing: '-0.02em' }}>
            Wanderly
          </span>
        </Link>

        {/* Center Nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className="desktop-nav-links">
          {navLinks.map(link => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '7px 14px', borderRadius: '8px',
                  fontSize: '0.875rem', fontWeight: active ? 700 : 600,
                  color: active ? '#E85D26' : '#6B7280',
                  textDecoration: 'none',
                  backgroundColor: active ? '#FEF0E7' : 'transparent',
                  transition: 'all 0.15s ease',
                }}
              >
                <Icon size={15} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <Link
            to="/trips/new"
            className="btn btn-primary"
            style={{ padding: '8px 16px', fontSize: '0.85rem', borderRadius: '8px', gap: '5px' }}
          >
            <Plus size={15} /> Plan Trip
          </Link>

          {/* Profile */}
          <div style={{ position: 'relative' }} ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '5px 10px 5px 5px',
                borderRadius: '8px', border: '1.5px solid #EDE9E2',
                backgroundColor: profileOpen ? '#F5F3EF' : '#FFFFFF',
                cursor: 'pointer', transition: 'all 0.15s ease',
              }}
            >
              <img
                src={userAvatar} alt={userFirstName}
                style={{ width: '28px', height: '28px', borderRadius: '6px', objectFit: 'cover' }}
              />
              <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#1A1A2E' }} className="hide-on-mobile">
                {userFirstName}
              </span>
              <ChevronDown size={14} color="#9CA3AF" />
            </button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  style={{
                    position: 'absolute', top: '46px', right: 0,
                    width: '220px', backgroundColor: '#FFFFFF',
                    borderRadius: '14px', border: '1px solid #EDE9E2',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                    padding: '8px', zIndex: 200,
                  }}
                >
                  <div style={{ padding: '10px 12px 12px', borderBottom: '1px solid #F3F4F6', marginBottom: '6px' }}>
                    <p style={{ fontWeight: 800, fontSize: '0.9rem', color: '#1A1A2E' }}>{user?.name || 'Traveler'}</p>
                    <p style={{ fontSize: '0.76rem', color: '#9CA3AF', marginTop: '2px' }}>{user?.email}</p>
                  </div>

                  <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '9px', padding: '9px 12px', borderRadius: '8px', fontSize: '0.86rem', fontWeight: 600, color: '#374151', textDecoration: 'none' }}>
                    <User size={15} color="#6B7280" /> My Profile
                  </Link>

                  {isAdmin && (
                    <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: '9px', padding: '9px 12px', borderRadius: '8px', fontSize: '0.86rem', fontWeight: 600, color: '#E85D26', textDecoration: 'none', backgroundColor: '#FEF0E7' }}>
                      <ShieldAlert size={15} color="#E85D26" /> Admin Panel
                    </Link>
                  )}

                  <div style={{ height: '1px', backgroundColor: '#F3F4F6', margin: '6px 0' }} />

                  <button
                    onClick={logout}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: '9px',
                      padding: '9px 12px', borderRadius: '8px',
                      fontSize: '0.86rem', fontWeight: 600, color: '#EF4444',
                      background: 'none', border: 'none', cursor: 'pointer',
                    }}
                  >
                    <LogOut size={15} color="#EF4444" /> Log Out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};
