import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AppProvider, useApp } from './context/AppContext';
import { GlobalNavbar } from './components/navigation/GlobalNavbar';
import { TripNavigation } from './components/navigation/TripNavigation';
import { DemoSwitcher } from './components/DemoSwitcher';
import { Loader, Plane } from 'lucide-react';

import { LandingPage } from './pages/LandingPage';
import { Login } from './screens/Login';
import { Register } from './screens/Register';
import { Dashboard } from './screens/Dashboard';
import { CreateTrip } from './screens/CreateTrip';
import { BuildItinerary } from './screens/BuildItinerary';
import { TripListing } from './screens/TripListing';
import { ProfileSettings } from './screens/ProfileSettings';
import { SearchExplorer } from './screens/SearchExplorer';
import { ItineraryViewBudget } from './screens/ItineraryViewBudget';
import { Community } from './screens/Community';
import { CalendarView } from './screens/CalendarView';
import { AdminAnalytics } from './screens/AdminAnalytics';
import { JourneyView } from './screens/JourneyView';

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
          top: '76px',
          right: '24px',
          backgroundColor: '#1A1A2E',
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: '12px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.25)',
          fontWeight: 700,
          fontSize: '0.88rem',
          zIndex: 9999,
          border: '1px solid #E85D26',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          {toastMessage}
        </div>
      )}

      {/* Floating Top Navigation for Authenticated App */}
      {!isPublicPage && <GlobalNavbar />}

      <div className="main-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%' }}>
        <main className="screen-wrapper" style={{ flex: 1, padding: isPublicPage ? '0' : '80px 24px 40px 24px', maxWidth: '100%', margin: '0', width: '100%' }}>
          {/* Contextual Trip Navigation if viewing trip screens */}
          {!isPublicPage && isTripViewPage && <TripNavigation />}

          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
              <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
              
              <Route path="/" element={<LandingPage />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/trips/new" element={<ProtectedRoute><CreateTrip /></ProtectedRoute>} />
              <Route path="/itinerary/builder" element={<ProtectedRoute><BuildItinerary /></ProtectedRoute>} />
              <Route path="/trips" element={<ProtectedRoute><TripListing /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfileSettings /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><ProfileSettings /></ProtectedRoute>} />
              <Route path="/explore" element={<ProtectedRoute><SearchExplorer /></ProtectedRoute>} />
              <Route path="/itinerary/view" element={<ProtectedRoute><ItineraryViewBudget /></ProtectedRoute>} />
              <Route path="/journal" element={<ProtectedRoute><Community /></ProtectedRoute>} />
              <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
              <Route path="/calendar" element={<ProtectedRoute><CalendarView /></ProtectedRoute>} />
              <Route path="/journey" element={<ProtectedRoute><JourneyView /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute><AdminAnalytics /></ProtectedRoute>} />
              
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
