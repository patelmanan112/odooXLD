import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, X, Menu } from 'lucide-react';
import s from './LandingPage.module.css';

const navItems = [
  { label: 'Discover', href: '#discover' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Itinerary', href: '#itinerary' },
  { label: 'Community', href: '#community' },
];

export const LandingNavbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (href) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <nav className={`${s.navbar} ${scrolled ? s.navbarScrolled : ''}`}>
        <Link to="/" className={s.navLogo}>
          <Compass size={20} color="#c8622a" />
          Wander<span>ly</span>
        </Link>

        <ul className={s.navLinks}>
          {navItems.map(item => (
            <li key={item.label}>
              <a
                href={item.href}
                className={s.navLink}
                onClick={e => { e.preventDefault(); handleNavClick(item.href); }}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className={s.navActions}>
          <Link to="/login" className={s.navLoginBtn}>Log In</Link>
          <Link to="/register" className={`${s.btnPrimary} ${s.navCTA}`}>
            Start Planning →
          </Link>
          <button
            className={s.mobileMenuBtn}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              background: '#faf8f4', zIndex: 99,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: '32px'
            }}
          >
            <button
              onClick={() => setMobileOpen(false)}
              style={{ position: 'absolute', top: 24, right: 24, background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <X size={24} />
            </button>
            {navItems.map(item => (
              <a
                key={item.label}
                href={item.href}
                style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1a1714', textDecoration: 'none', fontFamily: 'Outfit, sans-serif' }}
                onClick={e => { e.preventDefault(); handleNavClick(item.href); }}
              >
                {item.label}
              </a>
            ))}
            <Link to="/login" style={{ fontSize: '1rem', fontWeight: 600, color: '#7a7065', textDecoration: 'none' }}>Log In</Link>
            <Link to="/register" className={s.btnPrimary}>Start Planning →</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
