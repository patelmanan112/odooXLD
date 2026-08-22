import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plus, ArrowRight, Sparkles, Heart, MapPin,
  Calendar, Wallet, Globe, TrendingUp, Plane, Star
} from 'lucide-react';

/* ─── helpers ────────────────────────────────── */
const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 5)  return 'Good Night';
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
};

const getDaysUntil = (dateStr) => {
  if (!dateStr) return null;
  const raw = dateStr.split(' - ')[0].trim();
  const target = new Date(raw);
  const today  = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.ceil((target - today) / 86400000);
  return diff;
};

/* ─── tiny sub-components ────────────────────── */
const Chip = ({ children, color = '#E85D26', bg = '#FEF0E7' }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: 4,
    padding: '4px 10px', borderRadius: 6,
    fontSize: '0.73rem', fontWeight: 700,
    backgroundColor: bg, color,
  }}>
    {children}
  </span>
);

/* ═══════════════════════════════════════════════
   DASHBOARD
═══════════════════════════════════════════════ */
export const Dashboard = () => {
  const { user, trips, destinations, toggleSaveDestination, setSelectedTripId, showToast } = useApp();
  const navigate = useNavigate();
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const greeting  = getGreeting();
  const firstName = user?.name?.split(' ')[0] || 'Traveler';
  const nextTrip  = trips?.[0] ?? null;
  const daysAway  = getDaysUntil(nextTrip?.dates);
  const totalBudgetSpent = trips?.reduce((s, t) => s + (t.spentBudget || 0), 0) ?? 0;
  const savedCount = destinations?.filter(d => d.saved).length ?? 0;

  const spentPct = nextTrip
    ? Math.min(100, Math.round((nextTrip.spentBudget / (nextTrip.estimatedBudget || 1)) * 100))
    : 0;

  const handleAI = (e) => {
    e.preventDefault();
    if (!aiPrompt.trim()) { showToast('Tell me where you want to go'); return; }
    setAiLoading(true);
    showToast(`Building your itinerary for "${aiPrompt}"…`);
    setTimeout(() => { setAiLoading(false); navigate('/itinerary/builder'); }, 1200);
  };

  /* card hover util */
  const hov = {
    transition: 'box-shadow 0.2s ease, transform 0.2s ease',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      style={{ display: 'flex', flexDirection: 'column', gap: 32, paddingBottom: 80 }}
    >

      {/* ════════════════════════════════════════
          SECTION 1 · GREETING + QUICK STATS
      ════════════════════════════════════════ */}
      <section style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20 }}>
        <div>
          <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#E85D26', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>
            {greeting}
          </p>
          <h1 style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: 'clamp(2rem, 4vw, 2.8rem)',
            fontWeight: 900,
            color: '#1A1A2E',
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
          }}>
            {firstName},<br />
            <span style={{ color: '#9CA3AF', fontWeight: 500 }}>where to next?</span>
          </h1>
        </div>

        {/* quick stat pills */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {[
            { icon: Plane,   val: trips?.length ?? 0,                   label: 'Trips Planned' },
            { icon: Wallet,  val: `₹${(totalBudgetSpent/1000).toFixed(0)}k`, label: 'Total Spent' },
            { icon: Heart,   val: savedCount,                           label: 'Saved Places' },
          ].map(({ icon: Icon, val, label }) => (
            <div key={label} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 18px', borderRadius: 12,
              backgroundColor: '#FFFFFF',
              border: '1px solid #EDE9E2',
              boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
            }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: '#FEF0E7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={16} color="#E85D26" />
              </div>
              <div>
                <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.1rem', fontWeight: 800, color: '#1A1A2E', lineHeight: 1 }}>{val}</p>
                <p style={{ fontSize: '0.72rem', color: '#9CA3AF', fontWeight: 600, marginTop: 2 }}>{label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════
          SECTION 2 · HERO TRIP CARD + AI + BUDGET  (3-col bento)
      ════════════════════════════════════════ */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gridTemplateRows: 'auto',
        gap: 16,
      }}>

        {/* ── HERO: Next Trip ─────────────────── */}
        <motion.div
          whileHover={{ y: -4 }}
          onClick={() => nextTrip ? (setSelectedTripId(nextTrip.id), navigate('/itinerary/view')) : navigate('/trips/new')}
          style={{
            gridColumn: 'span 2',
            position: 'relative',
            borderRadius: 24,
            overflow: 'hidden',
            minHeight: 320,
            cursor: 'pointer',
            ...hov,
          }}
        >
          {/* background photo */}
          <img
            src={nextTrip?.coverPhoto || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80'}
            alt="Next trip"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
          {/* gradient scrim */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.65) 100%)' }} />

          {/* content */}
          <div style={{ position: 'relative', zIndex: 2, padding: 32, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            {/* top row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Chip color="#fff" bg="rgba(255,255,255,0.2)">
                {nextTrip ? `${nextTrip.status}` : 'No trips yet'}
              </Chip>
              {nextTrip && (
                <div style={{
                  backdropFilter: 'blur(10px)',
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: 12,
                  padding: '6px 14px',
                  color: '#fff', fontWeight: 700, fontSize: '0.82rem',
                }}>
                  {nextTrip.destination}
                </div>
              )}
            </div>

            {/* bottom content */}
            <div>
              {daysAway !== null && daysAway > 0 && (
                <div style={{ marginBottom: 12 }}>
                  <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', fontWeight: 600, marginBottom: 4 }}>Departing in</p>
                  <p style={{
                    fontFamily: 'Outfit, sans-serif',
                    fontSize: 'clamp(3rem, 8vw, 5rem)',
                    fontWeight: 900,
                    color: '#fff',
                    lineHeight: 1,
                    letterSpacing: '-0.04em',
                  }}>
                    {daysAway}
                    <span style={{ fontSize: '1.5rem', fontWeight: 500, marginLeft: 8, opacity: 0.8 }}>days</span>
                  </p>
                </div>
              )}
              <h2 style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: 'clamp(1.4rem, 3vw, 2rem)',
                fontWeight: 800,
                color: '#ffffff',
                marginBottom: 8,
              }}>
                {nextTrip?.name || 'Plan your next trip'}
              </h2>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {nextTrip ? (
                  <>
                    <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.75)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Calendar size={13} /> {nextTrip.dates}
                    </span>
                    <span style={{ color: 'rgba(255,255,255,0.4)' }}>·</span>
                    <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.75)' }}>
                      {nextTrip.durationDays} days
                    </span>
                  </>
                ) : (
                  <span style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.75)' }}>
                    Create your first itinerary →
                  </span>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── COLUMN: Budget + AI stacked ────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>

          {/* Budget card */}
          <div style={{
            backgroundColor: '#1A1A2E', borderRadius: 20, padding: '24px',
            flex: '0 0 auto',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <p style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '0.95rem', color: '#CBD5E1' }}>
                Budget
              </p>
              <Chip color="#34D399" bg="rgba(52,211,153,0.12)">
                {nextTrip ? nextTrip.status : '—'}
              </Chip>
            </div>

            {nextTrip ? (
              <>
                <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.8rem', fontWeight: 900, color: '#fff', marginBottom: 4 }}>
                  ₹{(nextTrip.spentBudget || 0).toLocaleString('en-IN')}
                </p>
                <p style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: 14 }}>
                  of ₹{(nextTrip.estimatedBudget || 0).toLocaleString('en-IN')} budget
                </p>
                {/* progress bar */}
                <div style={{ height: 6, backgroundColor: '#2D2D4A', borderRadius: 9999, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', width: `${spentPct}%`,
                    background: spentPct > 85 ? '#F87171' : 'linear-gradient(90deg, #E85D26, #F97316)',
                    borderRadius: 9999,
                    transition: 'width 0.8s ease',
                  }} />
                </div>
                <p style={{ fontSize: '0.74rem', color: '#94A3B8', marginTop: 6, textAlign: 'right' }}>{spentPct}% used</p>
              </>
            ) : (
              <p style={{ color: '#64748B', fontSize: '0.88rem' }}>No active trip</p>
            )}
          </div>

          {/* AI Generator card */}
          <div style={{
            backgroundColor: '#FFFFFF', border: '1px solid #EDE9E2',
            borderRadius: 20, padding: '22px', flex: 1,
            boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg, #E85D26, #F97316)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={15} color="#fff" />
              </div>
              <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.95rem', fontWeight: 800, color: '#1A1A2E' }}>
                AI Itinerary
              </p>
            </div>
            <form onSubmit={handleAI} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input
                type="text"
                value={aiPrompt}
                onChange={e => setAiPrompt(e.target.value)}
                placeholder="5 days in Kyoto under ₹40k…"
                style={{
                  padding: '10px 14px', borderRadius: 10, border: '1.5px solid #E2DDD5',
                  fontSize: '0.88rem', fontFamily: 'inherit', outline: 'none',
                  backgroundColor: '#FAFAF8', color: '#1A1A2E',
                }}
                onFocus={e => e.target.style.borderColor = '#E85D26'}
                onBlur={e => e.target.style.borderColor = '#E2DDD5'}
              />
              <button
                type="submit"
                disabled={aiLoading}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  padding: '10px 14px', borderRadius: 10, border: 'none', cursor: 'pointer',
                  backgroundColor: aiLoading ? '#F3F4F6' : '#E85D26',
                  color: aiLoading ? '#9CA3AF' : '#fff',
                  fontWeight: 700, fontSize: '0.88rem', fontFamily: 'inherit',
                  transition: 'background 0.2s',
                }}
              >
                {aiLoading ? 'Building…' : (<><Sparkles size={14} /> Generate Plan</>)}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          SECTION 3 · YOUR TRIPS (horizontal scroll)
      ════════════════════════════════════════ */}
      {trips && trips.length > 0 && (
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <p style={{ fontSize: '0.76rem', fontWeight: 700, color: '#E85D26', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>My Travel Plans</p>
              <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.6rem', fontWeight: 800, color: '#1A1A2E' }}>Upcoming Trips</h2>
            </div>
            <button
              onClick={() => navigate('/trips')}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                backgroundColor: 'transparent', border: 'none', cursor: 'pointer',
                fontSize: '0.88rem', fontWeight: 700, color: '#E85D26',
              }}
            >
              View all <ArrowRight size={15} />
            </button>
          </div>

          {/* horizontal scroll strip */}
          <div style={{
            display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 4,
            scrollbarWidth: 'none', msOverflowStyle: 'none',
          }}>
            {trips.map(trip => {
              const pct = Math.min(100, Math.round(((trip.spentBudget || 0) / (trip.estimatedBudget || 1)) * 100));
              return (
                <motion.div
                  key={trip.id}
                  whileHover={{ y: -5 }}
                  onClick={() => { setSelectedTripId(trip.id); navigate('/itinerary/view'); }}
                  style={{
                    minWidth: 240, width: 240, flexShrink: 0,
                    borderRadius: 20, overflow: 'hidden',
                    border: '1px solid #EDE9E2',
                    backgroundColor: '#fff',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    cursor: 'pointer',
                    ...hov,
                  }}
                >
                  {/* image */}
                  <div style={{ position: 'relative', height: 140 }}>
                    <img
                      src={trip.coverPhoto}
                      alt={trip.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 60%)' }} />
                    <div style={{ position: 'absolute', top: 10, left: 10 }}>
                      <Chip
                        color={trip.status === 'Ongoing' ? '#059669' : '#D97706'}
                        bg={trip.status === 'Ongoing' ? '#ECFDF5' : '#FFFBEB'}
                      >
                        {trip.status}
                      </Chip>
                    </div>
                  </div>

                  {/* content */}
                  <div style={{ padding: '14px 16px 16px' }}>
                    <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1rem', fontWeight: 800, color: '#1A1A2E', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {trip.name}
                    </h3>
                    <p style={{ fontSize: '0.78rem', color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 12 }}>
                      <MapPin size={11} /> {trip.destination}
                    </p>
                    {/* budget progress */}
                    <div style={{ height: 4, backgroundColor: '#F3F4F6', borderRadius: 9999, overflow: 'hidden', marginBottom: 5 }}>
                      <div style={{ height: '100%', width: `${pct}%`, backgroundColor: '#E85D26', borderRadius: 9999 }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>Budget used</span>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#E85D26' }}>{pct}%</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Create new trip card */}
            <motion.div
              whileHover={{ y: -5 }}
              onClick={() => navigate('/trips/new')}
              style={{
                minWidth: 180, width: 180, flexShrink: 0,
                borderRadius: 20, border: '2px dashed #D1CBC2',
                backgroundColor: '#FAFAF8', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10,
                padding: 20, ...hov,
              }}
            >
              <div style={{ width: 44, height: 44, borderRadius: '50%', backgroundColor: '#FEF0E7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Plus size={20} color="#E85D26" />
              </div>
              <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '0.9rem', color: '#1A1A2E', textAlign: 'center' }}>
                New Trip
              </span>
            </motion.div>
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════
          SECTION 4 · EXPLORE DESTINATIONS
      ════════════════════════════════════════ */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <p style={{ fontSize: '0.76rem', fontWeight: 700, color: '#E85D26', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Discover</p>
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.6rem', fontWeight: 800, color: '#1A1A2E' }}>Top Destinations</h2>
          </div>
          <button
            onClick={() => navigate('/explore')}
            style={{ display: 'flex', alignItems: 'center', gap: 5, backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.88rem', fontWeight: 700, color: '#E85D26' }}
          >
            Browse all <ArrowRight size={15} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
          {(destinations || [
            { id: 'f1', name: 'Kyoto',   country: 'Japan',     type: 'Heritage', cost: '₹60k', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80', rating: 4.9 },
            { id: 'f2', name: 'Goa',     country: 'India',     type: 'Beaches',  cost: '₹15k', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80', rating: 4.7 },
            { id: 'f3', name: 'Bali',    country: 'Indonesia', type: 'Trending', cost: '₹35k', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80', rating: 4.8 },
            { id: 'f4', name: 'Maldives',country: 'Maldives',  type: 'Beaches',  cost: '₹90k', image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=600&q=80', rating: 5.0 },
          ]).slice(0, 6).map((dest) => (
            <motion.div
              key={dest.id}
              whileHover={{ y: -6 }}
              onClick={() => navigate('/explore')}
              style={{
                position: 'relative', borderRadius: 20, overflow: 'hidden',
                aspectRatio: '3/4', cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                ...hov,
              }}
            >
              <img
                src={dest.image}
                alt={dest.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              {/* scrim */}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.05) 55%)' }} />

              {/* type badge top-left */}
              <div style={{ position: 'absolute', top: 12, left: 12 }}>
                <Chip color="#fff" bg="rgba(0,0,0,0.35)">{dest.type}</Chip>
              </div>

              {/* save button top-right */}
              <button
                onClick={e => { e.stopPropagation(); if (toggleSaveDestination) toggleSaveDestination(dest.id); }}
                style={{
                  position: 'absolute', top: 10, right: 10,
                  width: 32, height: 32, borderRadius: '50%',
                  backgroundColor: 'rgba(255,255,255,0.85)',
                  border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Heart size={15} color={dest.saved ? '#E85D26' : '#9CA3AF'} fill={dest.saved ? '#E85D26' : 'none'} />
              </button>

              {/* bottom content */}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '14px 16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div>
                    <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.15rem', fontWeight: 800, color: '#fff', marginBottom: 2 }}>
                      {dest.name}
                    </h3>
                    <p style={{ fontSize: '0.76rem', color: 'rgba(255,255,255,0.75)', display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Globe size={11} /> {dest.country}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '0.78rem', fontWeight: 700, color: '#FCD34D', display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Star size={11} fill="#FCD34D" color="#FCD34D" /> {dest.rating || '4.8'}
                    </p>
                    <p style={{ fontSize: '0.74rem', color: 'rgba(255,255,255,0.7)', marginTop: 1 }}>{dest.cost}</p>
                  </div>
                </div>

                {/* Plan CTA */}
                <button
                  onClick={e => { e.stopPropagation(); navigate('/trips/new'); }}
                  style={{
                    marginTop: 10, width: '100%',
                    padding: '8px', borderRadius: 9, border: 'none', cursor: 'pointer',
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    backdropFilter: 'blur(8px)',
                    color: '#fff', fontWeight: 700, fontSize: '0.8rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(232,93,38,0.85)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)'}
                >
                  Plan a trip here <ArrowRight size={13} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════
          EMPTY STATE: No trips yet
      ════════════════════════════════════════ */}
      {(!trips || trips.length === 0) && (
        <section style={{
          textAlign: 'center', padding: '48px 24px',
          backgroundColor: '#FFFFFF', borderRadius: 24,
          border: '2px dashed #E2DDD5',
        }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}><Plane size={40} color="#9CA3AF" /></div>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.6rem', fontWeight: 800, color: '#1A1A2E', marginBottom: 8 }}>
            Your first adventure awaits
          </h2>
          <p style={{ color: '#9CA3AF', fontSize: '0.95rem', maxWidth: 380, margin: '0 auto 24px' }}>
            Start planning your itinerary, track your budget, and explore destinations — all in one place.
          </p>
          <button onClick={() => navigate('/trips/new')} className="btn btn-primary" style={{ fontSize: '1rem', padding: '13px 28px' }}>
            <Plus size={18} /> Create My First Trip
          </button>
        </section>
      )}

    </motion.div>
  );
};
