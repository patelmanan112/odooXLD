import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AppProvider, useApp } from './context/AppContext';
import { GlobalNavbar } from './components/navigation/GlobalNavbar';
import { TripNavigation } from './components/navigation/TripNavigation';
import { DemoSwitcher } from './components/DemoSwitcher';
import { Loader, Plane } from 'lucide-react';

import { LandingPage } from './pages/LandingPage';
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
import { Screen13_JourneyView } from './screens/Screen13_JourneyView';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, authLoading } = useApp();

  if (authLoading) return null;
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, authLoading } = useApp();

  if (authLoading) return null;
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

const AppContent = () => {
  const { authLoading, toastMessage } = useApp();
  const location = useLocation();

  const isPublicPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/';
  const isTripViewPage = 
    location.pathname.startsWith('/itinerary') || 
    location.pathname === '/journey' || 
    location.pathname === '/calendar' || 
    location.pathname === '/journal';

  if (authLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#faf8f4',
        fontFamily: 'Plus Jakarta Sans, sans-serif'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '20px',
          backgroundColor: '#064e3b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          marginBottom: '20px',
          boxShadow: '0 10px 25px rgba(6, 78, 59, 0.3)'
        }}>
          <Plane size={32} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#064e3b', fontWeight: 700, fontSize: '1.1rem' }}>
          <Loader className="spin" size={20} />
          <span>Verifying authentication...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#faf8f4' }}>
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

      {/* Floating Top Navigation for Authenticated App */}
      {!isPublicPage && <GlobalNavbar />}

      <div className="main-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%' }}>
        <main className="screen-wrapper" style={{ flex: 1, padding: isPublicPage ? '0' : '20px 24px 40px 24px', maxWidth: '100%', margin: '0', width: '100%' }}>
          {/* Contextual Trip Navigation if viewing trip screens */}
          {!isPublicPage && isTripViewPage && <TripNavigation />}

          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/login" element={<PublicRoute><Screen1_Login /></PublicRoute>} />
              <Route path="/register" element={<PublicRoute><Screen2_Register /></PublicRoute>} />
              
              <Route path="/" element={<LandingPage />} />
              <Route path="/dashboard" element={<ProtectedRoute><Screen3_Dashboard /></ProtectedRoute>} />
              <Route path="/trips/new" element={<ProtectedRoute><Screen4_CreateTrip /></ProtectedRoute>} />
              <Route path="/itinerary/builder" element={<ProtectedRoute><Screen5_BuildItinerary /></ProtectedRoute>} />
              <Route path="/trips" element={<ProtectedRoute><Screen6_TripListing /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Screen7_ProfileSettings /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Screen7_ProfileSettings /></ProtectedRoute>} />
              <Route path="/explore" element={<ProtectedRoute><Screen8_SearchExplorer /></ProtectedRoute>} />
              <Route path="/itinerary/view" element={<ProtectedRoute><Screen9_ItineraryViewBudget /></ProtectedRoute>} />
              <Route path="/journal" element={<ProtectedRoute><Screen10_Community /></ProtectedRoute>} />
              <Route path="/community" element={<ProtectedRoute><Screen10_Community /></ProtectedRoute>} />
              <Route path="/calendar" element={<ProtectedRoute><Screen11_CalendarView /></ProtectedRoute>} />
              <Route path="/journey" element={<ProtectedRoute><Screen13_JourneyView /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute><Screen12_AdminAnalytics /></ProtectedRoute>} />
              
              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
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
