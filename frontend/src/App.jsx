import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DemoSwitcher } from './components/DemoSwitcher';

import { Screen1_Login } from './screens/Screen1_Login';
import { Screen2_Register } from './screens/Screen2_Register';
import { Screen3_Dashboard } from './screens/Screen3_Dashboard';
import { Screen4_CreateTrip } from './screens/Screen4_CreateTrip';
import { Screen5_BuildItinerary } from './screens/Screen5_BuildItinerary';
import { Screen6_TripListing } from './screens/Screen6_TripListing';
import { Screen7_ProfileSettings } from './screens/Screen7_ProfileSettings';
import { Screen8_SearchExplorer } from './screens/Screen8_SearchExplorer';
import { Screen9_ItineraryViewBudget } from './screens/Screen9_ItineraryViewBudget';
import { Screen10_Community } from './screens/Screen10_Community';
import { Screen11_CalendarView } from './screens/Screen11_CalendarView';
import { Screen12_AdminAnalytics } from './screens/Screen12_AdminAnalytics';

const AppContent = () => {
  const { currentScreen, toastMessage } = useApp();

  const renderScreen = () => {
    switch (currentScreen) {
      case 1: return <Screen1_Login key="s1" />;
      case 2: return <Screen2_Register key="s2" />;
      case 3: return <Screen3_Dashboard key="s3" />;
      case 4: return <Screen4_CreateTrip key="s4" />;
      case 5: return <Screen5_BuildItinerary key="s5" />;
      case 6: return <Screen6_TripListing key="s6" />;
      case 7: return <Screen7_ProfileSettings key="s7" />;
      case 8: return <Screen8_SearchExplorer key="s8" />;
      case 9: return <Screen9_ItineraryViewBudget key="s9" />;
      case 10: return <Screen10_Community key="s10" />;
      case 11: return <Screen11_CalendarView key="s11" />;
      case 12: return <Screen12_AdminAnalytics key="s12" />;
      default: return <Screen3_Dashboard key="s3" />;
    }
  };

  // Auth screens (1 & 2) render full-page without sidebar/header for immersive auth design
  const isAuthScreen = currentScreen === 1 || currentScreen === 2;

  return (
    <div className="app-container">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '24px',
          backgroundColor: '#064e3b',
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: '14px',
          boxShadow: '0 8px 24px rgba(6, 78, 59, 0.3)',
          fontWeight: 600,
          fontSize: '0.88rem',
          zIndex: 1000,
          border: '1px solid #10b981'
        }}>
          {toastMessage}
        </div>
      )}

      {!isAuthScreen && <Sidebar />}

      <div className="main-content">
        {!isAuthScreen && <Header />}
        
        <main className="screen-wrapper">
          <AnimatePresence mode="wait">
            {renderScreen()}
          </AnimatePresence>
        </main>
      </div>

      <DemoSwitcher />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
