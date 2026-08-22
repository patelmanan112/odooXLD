import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import s from './LandingPage.module.css';

const itinerary = [
  {
    day: 'Day 01',
    city: 'Ahmedabad',
    date: '10 Sep',
    activities: [
      { time: '09:00', name: 'Arrival & Hotel Check-in', cost: null, highlight: false },
      { time: '11:00', name: 'Sabarmati Ashram Visit', cost: '₹80', highlight: true },
      { time: '13:30', name: 'Lunch — Gujarati Thali', cost: '₹350', highlight: false },
      { time: '16:00', name: 'Calico Textile Museum', cost: '₹150', highlight: false },
      { time: '19:30', name: 'Riverfront Evening Walk', cost: null, highlight: false },
    ],
  },
  {
    day: 'Day 02',
    city: 'Udaipur',
    date: '11 Sep',
    activities: [
      { time: '08:30', name: 'Bus to Udaipur', cost: '₹420', highlight: false },
      { time: '12:00', name: 'City Palace Tour', cost: '₹500', highlight: true },
      { time: '14:30', name: 'Lunch at Ambrai Ghat', cost: '₹600', highlight: false },
      { time: '17:00', name: 'Boat Ride — Lake Pichola', cost: '₹300', highlight: true },
      { time: '20:00', name: 'Old City Dinner', cost: '₹700', highlight: false },
    ],
  },
  {
    day: 'Day 03',
    city: 'Jaipur',
    date: '12 Sep',
    activities: [
      { time: '07:00', name: 'Train to Jaipur', cost: '₹580', highlight: false },
      { time: '11:00', name: 'Amber Fort', cost: '₹550', highlight: true },
      { time: '14:00', name: 'Hawa Mahal', cost: '₹200', highlight: false },
      { time: '16:00', name: 'Johri Bazaar Shopping', cost: null, highlight: false },
      { time: '19:00', name: 'Rooftop Dinner — Pink City', cost: '₹900', highlight: true },
    ],
  },
];

export const ItineraryShowcase = () => {
  const [activeDay, setActiveDay] = useState(0);
  const current = itinerary[activeDay];

  return (
    <section id="itinerary" style={{ backgroundColor: '#0e0e0c', padding: 'clamp(64px, 10vw, 120px) clamp(20px, 5vw, 80px)' }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
        <div className={s.itineraryShowcase}>
          {/* Left — text + day selectors */}
          <div>
            <motion.p
              className={s.labelLight}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              05 — Itinerary
            </motion.p>

            <motion.h2
              className={s.displayLg}
              style={{ color: '#ffffff', marginTop: 12, marginBottom: 20 }}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              ONE JOURNEY.<br />EVERY DETAIL.
            </motion.h2>

            <motion.p
              style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, maxWidth: 400, marginBottom: 40 }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Every city, every meal, every moment — organised into a beautiful day-by-day plan you can actually follow.
            </motion.p>

            {/* Day selector tabs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 48 }}>
              {itinerary.map((day, i) => (
                <motion.button
                  key={day.day}
                  onClick={() => setActiveDay(i)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 16,
                    padding: '16px 20px',
                    background: activeDay === i ? 'rgba(200,98,42,0.12)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${activeDay === i ? 'rgba(200,98,42,0.4)' : 'rgba(255,255,255,0.06)'}`,
                    borderRadius: 10, cursor: 'pointer',
                    transition: 'all 0.2s ease', textAlign: 'left'
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 + 0.3 }}
                >
                  <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: activeDay === i ? '#c8622a' : 'rgba(255,255,255,0.3)' }}>
                    {day.day}
                  </span>
                  <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1rem', fontWeight: 700, color: activeDay === i ? '#ffffff' : 'rgba(255,255,255,0.5)' }}>
                    {day.city}
                  </span>
                  <span style={{ marginLeft: 'auto', fontSize: '0.72rem', color: 'rgba(255,255,255,0.25)' }}>{day.date}</span>
                </motion.button>
              ))}
            </div>

            <Link to="/register" className={s.btnPrimary}>
              Build Your Itinerary <ArrowRight size={16} />
            </Link>
          </div>

          {/* Right — Itinerary Panel */}
          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeDay}
                className={s.itineraryPanel}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className={s.itineraryHeader}>
                  <p style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#c8622a', marginBottom: 6 }}>
                    Rajasthan Escape
                  </p>
                  <p className={s.itineraryTripName}>{current.city}</p>
                  <p className={s.itineraryDates}>{current.day} — {current.date}</p>
                </div>

                <div className={s.itineraryTimeline}>
                  {current.activities.map((act, i) => (
                    <motion.div
                      key={act.name}
                      className={`${s.itineraryActivity} ${act.highlight ? s.highlight : ''}`}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.07, duration: 0.35 }}
                    >
                      <span className={s.activityTime}>{act.time}</span>
                      <span className={s.activityDot} style={{ background: act.highlight ? '#c8622a' : undefined }} />
                      <span className={s.activityName}>{act.name}</span>
                      {act.cost && <span className={s.activityCost}>{act.cost}</span>}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};
