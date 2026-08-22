import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import {
  MapPin, Calendar, Share2, Edit3, Download,
  DollarSign, Clock, ArrowLeft, Wallet, CheckCircle2,
  Plane, Utensils, Camera, Train, Compass, Coffee, Eye,
  Hotel, Bus
} from 'lucide-react';

/* ─── category → color + icon ─────────────── */
const CAT = {
  Flight:      { color: '#4F46E5', bg: '#EEF2FF', icon: Plane },
  Transport:   { color: '#4F46E5', bg: '#EEF2FF', icon: Train },
  Hotel:       { color: '#7C3AED', bg: '#F5F3FF', icon: Hotel },
  Stay:        { color: '#7C3AED', bg: '#F5F3FF', icon: Hotel },
  Food:        { color: '#059669', bg: '#ECFDF5', icon: Utensils },
  Sightseeing: { color: '#D97706', bg: '#FFFBEB', icon: Camera },
  Activity:    { color: '#D97706', bg: '#FFFBEB', icon: Compass },
  Adventure:   { color: '#DC2626', bg: '#FEF2F2', icon: Compass },
  Culture:     { color: '#E85D26', bg: '#FEF0E7', icon: Coffee },
  default:     { color: '#6B7280', bg: '#F9FAFB', icon: Eye },
};

const getCat = (category) => CAT[category] || CAT.default;

/* ─── Dot on timeline ──────────────────────── */
const Dot = ({ color }) => (
  <div style={{
    position: 'absolute', left: -20, top: 6,
    width: 12, height: 12, borderRadius: '50%',
    backgroundColor: '#fff', border: `3px solid ${color}`,
    zIndex: 2, flexShrink: 0,
  }} />
);

export const Screen9_ItineraryViewBudget = () => {
  const { selectedTrip, showToast, setCurrentScreen } = useApp();
  const navigate = useNavigate();

  /* ── If no trip selected, show a friendly message ── */
  if (!selectedTrip) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 24px' }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}><Map size={48} color="#9CA3AF" /></div>
        <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.6rem', fontWeight: 800, color: '#1A1A2E', marginBottom: 8 }}>
          No trip selected
        </h2>
        <p style={{ color: '#9CA3AF', marginBottom: 24 }}>Go to My Trips and click a trip to view its itinerary.</p>
        <button onClick={() => navigate('/trips')} className="btn btn-primary">
          <ArrowLeft size={16} /> Go to My Trips
        </button>
      </div>
    );
  }

  const trip = selectedTrip;

  /* ── Derive financials from real trip fields ── */
  const estimatedBudget = trip.estimatedBudget || 0;
  const spentBudget     = trip.spentBudget || 0;
  const spentPct        = estimatedBudget > 0
    ? Math.min(100, Math.round((spentBudget / estimatedBudget) * 100))
    : 0;
  const remaining       = estimatedBudget - spentBudget;

  /* ── Build category breakdown from days.activities ── */
  const days = trip.days || [];
  const allActivities = days.flatMap(d => d.activities || []);

  // Group by category for the breakdown bars
  const catTotals = {};
  allActivities.forEach(act => {
    const cat = act.category || 'Other';
    catTotals[cat] = (catTotals[cat] || 0) + (act.cost || 0);
  });

  // Also use categoryBreakdown if available (richer data)
  const catBreakdown = trip.categoryBreakdown
    ? Object.entries(trip.categoryBreakdown).map(([name, spent]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        spent,
        color: getCat(name.charAt(0).toUpperCase() + name.slice(1)).color,
      }))
    : Object.entries(catTotals).map(([name, spent]) => ({
        name,
        spent,
        color: getCat(name).color,
      }));

  const totalCatSpent = catBreakdown.reduce((s, c) => s + c.spent, 0) || spentBudget || 1;
  const avgPerDay = days.length > 0 ? Math.round(spentBudget / days.length) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{ display: 'flex', flexDirection: 'column', gap: 0, paddingBottom: 60 }}
    >

      {/* ══ HERO HEADER ══════════════════════════════ */}
      <div style={{
        position: 'relative',
        height: 280,
        borderRadius: 24,
        overflow: 'hidden',
        marginBottom: 32,
        flexShrink: 0,
      }}>
        <img
          src={trip.coverPhoto || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1400&q=80'}
          alt={trip.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.75) 100%)' }} />

        {/* back button */}
        <button
          onClick={() => navigate('/trips')}
          style={{
            position: 'absolute', top: 20, left: 24,
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '7px 14px', borderRadius: 8,
            backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.3)',
            color: '#fff', fontWeight: 700, fontSize: '0.84rem', cursor: 'pointer',
          }}
        >
          <ArrowLeft size={15} /> My Trips
        </button>

        {/* action buttons */}
        <div style={{ position: 'absolute', top: 20, right: 24, display: 'flex', gap: 8 }}>
          <button
            onClick={() => showToast('Share link copied!')}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', fontSize: '0.84rem', fontWeight: 600, cursor: 'pointer' }}
          >
            <Share2 size={14} /> Share
          </button>
          <button
            onClick={() => navigate('/itinerary/builder')}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, backgroundColor: '#FFFFFF', color: '#1A1A2E', fontSize: '0.84rem', fontWeight: 700, border: 'none', cursor: 'pointer' }}
          >
            <Edit3 size={14} /> Edit
          </button>
        </div>

        {/* trip info */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(1.6rem,4vw,2.2rem)', fontWeight: 900, color: '#fff', marginBottom: 8, letterSpacing: '-0.02em' }}>
              {trip.name}
            </h1>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'rgba(255,255,255,0.85)', fontSize: '0.88rem' }}>
                <MapPin size={14} /> {trip.destination}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'rgba(255,255,255,0.85)', fontSize: '0.88rem' }}>
                <Calendar size={14} /> {trip.dates}
              </span>
            </div>
          </div>

          {/* stat pills */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[
              { label: 'Duration',  val: `${trip.durationDays || days.length || '?'} days` },
              { label: 'Budget',    val: `₹${estimatedBudget.toLocaleString('en-IN')}` },
              { label: 'Status',    val: trip.status || 'Upcoming' },
            ].map(s => (
              <div key={s.label} style={{
                backgroundColor: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 10, padding: '8px 14px', color: '#fff', textAlign: 'center',
              }}>
                <p style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>{s.label}</p>
                <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1rem', fontWeight: 800 }}>{s.val}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ TWO-COLUMN BODY ══════════════════════════ */}
      <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start' }}>

        {/* ── LEFT: Day Timeline ────────────────────── */}
        <div style={{ flex: 2, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 40 }}>

          {days.length > 0 ? days.map((day, dIdx) => (
            <motion.div
              key={day.dayNum || dIdx}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: dIdx * 0.08 }}
            >
              {/* Day header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                <div style={{
                  backgroundColor: '#E85D26', color: '#fff',
                  padding: '5px 14px', borderRadius: 8,
                  fontFamily: 'Outfit, sans-serif', fontSize: '0.82rem', fontWeight: 800,
                  flexShrink: 0,
                }}>
                  Day {day.dayNum || (dIdx + 1)}
                </div>
                {day.date && (
                  <span style={{ fontSize: '0.82rem', color: '#9CA3AF', fontWeight: 600 }}>
                    {day.date}
                  </span>
                )}
                <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.1rem', fontWeight: 800, color: '#1A1A2E', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {day.title}
                </h2>
                <div style={{ height: 1, flex: 1, backgroundColor: '#EDE9E2' }} />
              </div>

              {/* Activities timeline */}
              <div style={{ position: 'relative', paddingLeft: 28 }}>
                {/* vertical line */}
                <div style={{
                  position: 'absolute', left: 5, top: 10, bottom: 10,
                  width: 3, backgroundColor: '#FEE2D5', borderRadius: 9999,
                }} />

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {(day.activities || []).map((act, aIdx) => {
                    const cat = getCat(act.category);
                    const Icon = cat.icon;
                    return (
                      <motion.div
                        key={act.time + aIdx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: dIdx * 0.08 + aIdx * 0.04 }}
                        style={{ position: 'relative', display: 'flex', gap: 14, alignItems: 'flex-start' }}
                      >
                        <Dot color={cat.color} />

                        {/* time */}
                        <div style={{ width: 72, flexShrink: 0, fontSize: '0.78rem', fontWeight: 700, color: '#9CA3AF', paddingTop: 4 }}>
                          {act.time}
                        </div>

                        {/* activity card */}
                        <div style={{
                          flex: 1,
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #EDE9E2',
                          borderRadius: 14,
                          padding: '12px 16px',
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ width: 34, height: 34, borderRadius: 9, backgroundColor: cat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <Icon size={16} color={cat.color} />
                            </div>
                            <div>
                              <p style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1A1A2E', marginBottom: 3 }}>{act.title}</p>
                              <span style={{
                                padding: '2px 8px', borderRadius: 5,
                                backgroundColor: cat.bg, color: cat.color,
                                fontSize: '0.7rem', fontWeight: 700,
                              }}>
                                {act.category}
                              </span>
                            </div>
                          </div>

                          {act.cost > 0 && (
                            <div style={{ textAlign: 'right', flexShrink: 0 }}>
                              <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.95rem', fontWeight: 800, color: '#1A1A2E' }}>
                                ₹{act.cost.toLocaleString('en-IN')}
                              </p>
                            </div>
                          )}
                          {act.cost === 0 && (
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669', backgroundColor: '#ECFDF5', padding: '3px 8px', borderRadius: 5 }}>
                              Free
                            </span>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )) : (
            /* No days yet */
            <div style={{ textAlign: 'center', padding: '48px 24px', backgroundColor: '#FFFFFF', borderRadius: 20, border: '2px dashed #E2DDD5' }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}><Calendar size={40} color="#9CA3AF" /></div>
              <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.3rem', fontWeight: 800, color: '#1A1A2E', marginBottom: 8 }}>
                No itinerary built yet
              </h3>
              <p style={{ color: '#9CA3AF', fontSize: '0.9rem', marginBottom: 20 }}>
                Start adding days and activities to your trip.
              </p>
              <button onClick={() => navigate('/itinerary/builder')} className="btn btn-primary">
                <Edit3 size={16} /> Build Itinerary
              </button>
            </div>
          )}
        </div>

        {/* ── RIGHT: Sticky Financial Panel ─────────── */}
        <div style={{ flex: '0 0 300px', position: 'sticky', top: 20, display: 'flex', flexDirection: 'column', gap: 16, alignSelf: 'flex-start' }}>

          {/* Budget card */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: 20, padding: 24, border: '1px solid #EDE9E2', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, backgroundColor: '#FEF0E7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Wallet size={16} color="#E85D26" />
              </div>
              <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1rem', fontWeight: 800, color: '#1A1A2E' }}>Budget Breakdown</h3>
            </div>

            {/* big number */}
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontSize: '0.75rem', color: '#9CA3AF', marginBottom: 4 }}>Total Spent</p>
              <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2rem', fontWeight: 900, color: '#1A1A2E', lineHeight: 1 }}>
                ₹{spentBudget.toLocaleString('en-IN')}
              </p>
              <p style={{ fontSize: '0.8rem', color: '#9CA3AF', marginTop: 4 }}>
                of ₹{estimatedBudget.toLocaleString('en-IN')} budget
              </p>
            </div>

            {/* overall bar */}
            <div style={{ height: 8, backgroundColor: '#F3F4F6', borderRadius: 9999, overflow: 'hidden', marginBottom: 6 }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${spentPct}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                style={{
                  height: '100%',
                  background: spentPct > 85 ? '#EF4444' : 'linear-gradient(90deg, #E85D26, #F97316)',
                  borderRadius: 9999,
                }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
              <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{spentPct}% used</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: remaining >= 0 ? '#059669' : '#EF4444' }}>
                ₹{Math.abs(remaining).toLocaleString('en-IN')} {remaining >= 0 ? 'left' : 'over'}
              </span>
            </div>

            {/* per-category bars */}
            {catBreakdown.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {catBreakdown.map((cat, i) => {
                  const pct = Math.min(100, Math.round((cat.spent / totalCatSpent) * 100));
                  return (
                    <div key={i}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151' }}>{cat.name}</span>
                        <span style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>₹{cat.spent.toLocaleString('en-IN')}</span>
                      </div>
                      <div style={{ height: 5, backgroundColor: '#F3F4F6', borderRadius: 9999, overflow: 'hidden' }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.8, delay: i * 0.1 }}
                          style={{ height: '100%', backgroundColor: cat.color, borderRadius: 9999 }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* avg per day */}
            {days.length > 0 && (
              <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.82rem', color: '#9CA3AF' }}>Avg. per day</span>
                <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1rem', fontWeight: 800, color: '#1A1A2E' }}>
                  ₹{avgPerDay.toLocaleString('en-IN')}
                </span>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, border: '1px solid #EDE9E2', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.95rem', fontWeight: 800, color: '#1A1A2E', marginBottom: 14 }}>Quick Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button
                onClick={() => navigate('/itinerary/builder')}
                style={{ width: '100%', padding: '11px 14px', borderRadius: 10, backgroundColor: '#FEF0E7', color: '#E85D26', border: '1px solid #FDDCC9', fontWeight: 700, fontSize: '0.86rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}
              >
                <Edit3 size={15} /> Edit Itinerary
              </button>
              <button
                onClick={() => showToast('Downloading PDF...')}
                style={{ width: '100%', padding: '11px 14px', borderRadius: 10, backgroundColor: '#F9FAFB', color: '#374151', border: '1px solid #E5E7EB', fontWeight: 700, fontSize: '0.86rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}
              >
                <Download size={15} /> Download PDF
              </button>
              <button
                onClick={() => showToast('Share link copied!')}
                style={{ width: '100%', padding: '11px 14px', borderRadius: 10, backgroundColor: '#F9FAFB', color: '#374151', border: '1px solid #E5E7EB', fontWeight: 700, fontSize: '0.86rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}
              >
                <Share2 size={15} /> Share Link
              </button>
            </div>
          </div>

          {/* Stops */}
          {trip.stops && trip.stops.length > 0 && (
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, border: '1px solid #EDE9E2' }}>
              <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.95rem', fontWeight: 800, color: '#1A1A2E', marginBottom: 14 }}>Stops</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {trip.stops.map((stop, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: i < trip.stops.length - 1 ? 12 : 0 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: i === 0 || i === trip.stops.length - 1 ? '#E85D26' : '#CBD5E1', border: '2px solid #fff', outline: `2px solid ${i === 0 || i === trip.stops.length - 1 ? '#E85D26' : '#CBD5E1'}` }} />
                      {i < trip.stops.length - 1 && <div style={{ width: 2, height: 20, backgroundColor: '#E2DDD5', marginTop: 2 }} />}
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: i === 0 || i === trip.stops.length - 1 ? 700 : 500, color: i === 0 || i === trip.stops.length - 1 ? '#1A1A2E' : '#6B7280' }}>
                      {stop}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
