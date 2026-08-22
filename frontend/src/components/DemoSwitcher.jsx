import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Layers, ChevronUp, ChevronDown } from 'lucide-react';

export const DemoSwitcher = () => {
  const { currentScreen, setCurrentScreen } = useApp();
  const [collapsed, setCollapsed] = useState(true);

  const screens = [
    { id: 1, name: 'Login' },
    { id: 2, name: 'Register' },
    { id: 3, name: 'Dashboard' },
    { id: 4, name: 'Create Trip' },
    { id: 5, name: 'Build Itinerary' },
    { id: 6, name: 'My Trips' },
    { id: 7, name: 'Profile & Settings' },
    { id: 8, name: 'Explore Catalog' },
    { id: 9, name: 'Itinerary View' },
    { id: 10, name: 'Community' },
    { id: 11, name: 'Calendar' },
    { id: 12, name: 'Admin Analytics' },
  ];

  return (
    <div style={{
      position: 'fixed',
      bottom: '16px',
      right: '24px',
      zIndex: 999,
      backgroundColor: '#1A1A2E',
      color: '#ffffff',
      borderRadius: '16px',
      padding: collapsed ? '8px 16px' : '12px 18px',
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.25)',
      border: '1px solid #E85D26',
      transition: 'all 0.25s ease',
      maxWidth: '92vw'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '14px',
        marginBottom: collapsed ? 0 : '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.5px' }}>
          <Layers size={15} color="#E85D26" />
          <span>ROUTE NAVIGATION SWITCHER</span>
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            background: 'none',
            border: 'none',
            color: '#9CA3AF',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          {collapsed ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {!collapsed && (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '6px',
          maxWidth: '640px'
        }}>
          {screens.map(s => {
            const isActive = currentScreen === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setCurrentScreen(s.id)}
                style={{
                  padding: '5px 11px',
                  borderRadius: '8px',
                  fontSize: '0.75rem',
                  fontWeight: isActive ? 700 : 500,
                  backgroundColor: isActive ? '#E85D26' : 'rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {s.name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
