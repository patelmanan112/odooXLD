import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { LandingNavbar } from '../components/landing/LandingNavbar';
import { HeroSection } from '../components/landing/HeroSection';
import { DestinationShowcase } from '../components/landing/DestinationShowcase';
import { ProblemSection } from '../components/landing/ProblemSection';
import { HowItWorks } from '../components/landing/HowItWorks';
import { ItineraryShowcase } from '../components/landing/ItineraryShowcase';
import { BudgetShowcase } from '../components/landing/BudgetShowcase';
import { CommunityShowcase } from '../components/landing/CommunityShowcase';
import { FinalCTA } from '../components/landing/FinalCTA';

export const LandingPage = () => {
  const { isAuthenticated, authLoading } = useApp();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  // Set page title
  useEffect(() => {
    document.title = 'Wanderly — Plan the Journey. Live the Story.';
    return () => { document.title = 'Wanderly'; };
  }, []);

  if (authLoading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundColor: '#faf8f4', fontFamily: 'Outfit, sans-serif', fontSize: '1.2rem',
        fontWeight: 700, color: '#c8622a', letterSpacing: '0.08em'
      }}>
        WANDERLY
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div style={{ backgroundColor: '#faf8f4', overflowX: 'hidden' }}>
      {/* Scroll progress bar */}
      <motion.div
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, height: '2px',
          background: '#c8622a', transformOrigin: '0%', scaleX, zIndex: 999
        }}
      />

      <LandingNavbar />
      <HeroSection />
      <DestinationShowcase />
      <ProblemSection />
      <HowItWorks />
      <ItineraryShowcase />
      <BudgetShowcase />
      <CommunityShowcase />
      <FinalCTA />
    </div>
  );
};
