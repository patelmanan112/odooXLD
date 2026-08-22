import React, { useState } from 'react';
import { Search, Plus, Bell, ChevronDown, User, LogOut, Settings as SettingsIcon } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Header = () => {
  const { user, setCurrentScreen, logout } = useApp();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header style={{
      height: '76px',
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      position: 'sticky',
      top: 0,
      zIndex: 30
    }}>
      {/* Global Search Input */}
      <div style={{ position: 'relative', width: '380px' }}>
        <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
        <input 
          type="text" 
          placeholder="Search destinations, places, activities..." 
          onFocus={() => setCurrentScreen(8)}
          style={{
            width: '100%',
            padding: '10px 16px 10px 42px',
            fontSize: '0.9rem',
            borderRadius: '9999px',
            border: '1px solid #e2e8f0',
            backgroundColor: '#f8fafc',
            outline: 'none',
            fontFamily: 'inherit'
          }}
        />
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
        {/* + New Trip Primary CTA */}
        <button 
          onClick={() => setCurrentScreen(4)}
          className="btn btn-primary"
          style={{ padding: '9px 18px', fontSize: '0.88rem' }}
        >
          <Plus size={18} />
          <span>New Trip</span>
        </button>

        {/* Notification Bell */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            style={{
              width: '40px',
              height: '40px',
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
          >
            <Bell size={19} />
            <span style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#ef4444'
            }}></span>
          </button>

          {showNotifications && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: '48px',
              width: '280px',
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
              border: '1px solid #e2e8f0',
              padding: '16px',
              zIndex: 50
            }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '12px', color: '#064e3b' }}>Notifications</div>
              <div style={{ fontSize: '0.82rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#ecfdf5' }}>
                  🎉 <strong>Japan Trip:</strong> Budget updated with flight deals!
                </div>
                <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#f8fafc' }}>
                  ✈️ <strong>Reminder:</strong> Goa flight leaves in 15 days.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div style={{ position: 'relative' }}>
          <div 
            onClick={() => setShowUserMenu(!showUserMenu)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: '9999px',
              transition: 'background 0.2s'
            }}
          >
            <img 
              src={user.avatar} 
              alt={user.name} 
              style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#0f172a' }}>{user.name}</span>
            <ChevronDown size={16} color="#64748b" />
          </div>

          {showUserMenu && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: '48px',
              width: '200px',
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
              border: '1px solid #e2e8f0',
              padding: '8px',
              zIndex: 50
            }}>
              <button 
                onClick={() => { setCurrentScreen(7); setShowUserMenu(false); }}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  fontSize: '0.88rem',
                  color: '#334155',
                  borderRadius: '8px',
                  textAlign: 'left'
                }}
              >
                <User size={16} /> Profile
              </button>
              <button 
                onClick={() => { setCurrentScreen(7); setShowUserMenu(false); }}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  fontSize: '0.88rem',
                  color: '#334155',
                  borderRadius: '8px',
                  textAlign: 'left'
                }}
              >
                <SettingsIcon size={16} /> Account Settings
              </button>
              <div style={{ height: '1px', backgroundColor: '#e2e8f0', margin: '4px 0' }}></div>
              <button 
                onClick={() => { logout(); setShowUserMenu(false); }}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  fontSize: '0.88rem',
                  color: '#ef4444',
                  borderRadius: '8px',
                  textAlign: 'left'
                }}
              >
                <LogOut size={16} /> Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
