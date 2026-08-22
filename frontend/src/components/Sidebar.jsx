import React from 'react';
import { 
  Compass, 
  Home, 
  Map, 
  Calendar, 
  Wallet, 
  BookmarkCheck, 
  BookOpen, 
  Settings, 
  Sparkles,
  Plane,
  ShieldAlert,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Sidebar = ({ isOpenMobile, setIsOpenMobile }) => {
  const { currentScreen, setCurrentScreen } = useApp();

  const navItems = [
    { id: 3, label: 'Home', icon: Home },
    { id: 8, label: 'Explore', icon: Compass },
    { id: 6, label: 'Trips', icon: Map },
    { id: 5, label: 'Itinerary', icon: Calendar },
    { id: 9, label: 'Budget', icon: Wallet },
    { id: 4, label: 'Bookings', icon: BookmarkCheck },
    { id: 10, label: 'Journal', icon: BookOpen },
    { id: 11, label: 'Calendar View', icon: Calendar },
    { id: 12, label: 'Admin Panel', icon: ShieldAlert },
    { id: 7, label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (id) => {
    setCurrentScreen(id);
    if (setIsOpenMobile) setIsOpenMobile(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          onClick={() => setIsOpenMobile(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 49
          }}
        />
      )}

      <aside className="sidebar-container" style={{
        width: '260px',
        backgroundColor: '#ffffff',
        borderRight: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 16px',
        height: '100vh',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        flexShrink: 0,
        transition: 'transform 0.3s ease'
      }}>
        {/* Brand Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 12px 24px 12px'
        }}>
          <div 
            onClick={() => handleNavClick(3)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer'
            }}
          >
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: '#064e3b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}>
              <Plane size={20} />
            </div>
            <span style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: '1.45rem',
              fontWeight: 700,
              color: '#064e3b',
              letterSpacing: '-0.5px'
            }}>
              Wanderly
            </span>
          </div>

          {setIsOpenMobile && (
            <button 
              onClick={() => setIsOpenMobile(false)}
              className="mobile-close-btn"
              style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'none' }}
            >
              <X size={22} />
            </button>
          )}
        </div>

        {/* Navigation List */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, overflowY: 'auto' }}>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '11px 16px',
                  borderRadius: '14px',
                  fontSize: '0.94rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? '#ffffff' : '#475569',
                  backgroundColor: isActive ? '#064e3b' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={19} color={isActive ? '#ffffff' : '#64748b'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom Promo Card */}
        <div style={{
          marginTop: '20px',
          padding: '18px 16px',
          borderRadius: '18px',
          background: 'linear-gradient(135deg, #f0fdf4 0%, #d1fae5 100%)',
          border: '1px solid #a7f3d0',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#047857', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            Plan smarter with <Sparkles size={14} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#064e3b', marginBottom: '14px', lineHeight: 1.3 }}>
            AI Trip Planner
          </div>
          <button 
            onClick={() => handleNavClick(4)}
            style={{
              width: '100%',
              padding: '9px 12px',
              borderRadius: '10px',
              backgroundColor: '#ffffff',
              color: '#064e3b',
              fontWeight: 700,
              fontSize: '0.82rem',
              border: '1px solid #6ee7b7',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(6,78,59,0.08)'
            }}
          >
            Try AI Planner
          </button>
        </div>
      </aside>
    </>
  );
};
