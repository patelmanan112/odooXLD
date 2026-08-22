import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Layers, ChevronUp, ChevronDown } from 'lucide-react';

export const DemoSwitcher = () => {
  const { currentScreen, setCurrentScreen } = useApp();
  const [collapsed, setCollapsed] = useState(false);

  const screens = [
    { id: 1, name: '1. Login' },
    { id: 2, name: '2. Register' },
    { id: 3, name: '3. Dashboard (Home)' },
    { id: 4, name: '4. Create Trip' },
    { id: 5, name: '5. Build Itinerary' },
    { id: 6, name: '6. My Trips List' },
    { id: 7, name: '7. Profile & Settings' },
    { id: 8, name: '8. Activity Search' },
    { id: 9, name: '9. Itinerary & Budget' },
    { id: 10, name: '10. Community Tab' },
    { id: 11, name: '11. Calendar View' },
    { id: 12, name: '12. Admin Analytics' },
  ];

  return (
    <div style={{
      position: 'fixed',
      bottom: '16px',
      right: '24px',
      zIndex: 999,
      backgroundColor: '#064e3b',
      color: '#ffffff',
      borderRadius: '20px',
      padding: collapsed ? '10px 18px' : '14px 20px',
      boxShadow: '0 12px 40px rgba(6, 78, 59, 0.35)',
      border: '1px solid #047857',
      transition: 'all 0.3s ease',
      maxWidth: '92vw'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        marginBottom: collapsed ? 0 : '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.5px' }}>
          <Layers size={16} color="#34d399" />
          <span>HACKATHON DEMO SWITCHER (12 SCREENS)</span>
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            background: 'none',
            border: 'none',
            color: '#a7f3d0',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          {collapsed ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {!collapsed && (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '6px',
          maxWidth: '680px'
        }}>
          {screens.map(s => {
            const isActive = currentScreen === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setCurrentScreen(s.id)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '9999px',
                  fontSize: '0.76rem',
                  fontWeight: isActive ? 700 : 500,
                  backgroundColor: isActive ? '#34d399' : 'rgba(255, 255, 255, 0.12)',
                  color: isActive ? '#022c22' : '#ffffff',
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
