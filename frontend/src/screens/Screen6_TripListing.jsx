import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Plus, MapPin, Calendar, Edit3, Eye, Trash2,
  ArrowRight, Plane, Clock, CheckCircle2, LayoutGrid, List
} from 'lucide-react';
import { useApp } from '../context/AppContext';

/* ─── Status config ──────────────────────── */
const S = {
  Ongoing:   { color: '#059669', bg: '#ECFDF5', border: '#A7F3D0', dot: '#10B981', emoji: '🛫' },
  Upcoming:  { color: '#D97706', bg: '#FFFBEB', border: '#FDE68A', dot: '#F59E0B', emoji: '📅' },
  Planned:   { color: '#D97706', bg: '#FFFBEB', border: '#FDE68A', dot: '#F59E0B', emoji: '📅' },
  Draft:     { color: '#6B7280', bg: '#F9FAFB', border: '#E5E7EB', dot: '#9CA3AF', emoji: '📝' },
  Completed: { color: '#1D4ED8', bg: '#EFF6FF', border: '#BFDBFE', dot: '#3B82F6', emoji: '✅' },
};

/* ─── CARD VIEW ──────────────────────────── */
const TripCard = ({ trip, index, onView, onEdit, onDelete }) => {
  const cfg = S[trip.status] || S.Draft;
  const spentPct = trip.estimatedBudget
    ? Math.min(100, Math.round(((trip.spentBudget || 0) / trip.estimatedBudget) * 100))
    : 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        overflow: 'hidden',
        border: '1px solid #EDE9E2',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'box-shadow 0.2s ease, transform 0.2s ease',
      }}
      whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(0,0,0,0.1)' }}
      onClick={() => onView(trip.id)}
    >
      {/* ── Cover Image ── */}
      <div style={{ position: 'relative', height: 180, flexShrink: 0 }}>
        <img
          src={trip.coverPhoto || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80'}
          alt={trip.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        {/* gradient */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 55%)' }} />

        {/* status chip */}
        <div style={{ position: 'absolute', top: 12, left: 12 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '5px 11px', borderRadius: 8,
            fontSize: '0.75rem', fontWeight: 700,
            backgroundColor: cfg.bg, color: cfg.color,
            border: `1px solid ${cfg.border}`,
          }}>
            {cfg.emoji} {cfg.label || trip.status}
          </span>
        </div>

        {/* action buttons */}
        <div
          style={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: 6 }}
          onClick={e => e.stopPropagation()}
        >
          <button
            onClick={() => onEdit(trip.id)}
            title="Edit"
            style={{
              width: 32, height: 32, borderRadius: 8,
              backgroundColor: 'rgba(255,255,255,0.9)',
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#374151', backdropFilter: 'blur(4px)',
            }}
          >
            <Edit3 size={14} />
          </button>
          <button
            onClick={() => onDelete(trip.id, trip.name)}
            title="Delete"
            style={{
              width: 32, height: 32, borderRadius: 8,
              backgroundColor: 'rgba(239,68,68,0.9)',
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', backdropFilter: 'blur(4px)',
            }}
          >
            <Trash2 size={14} />
          </button>
        </div>

        {/* duration pill bottom-right */}
        <div style={{ position: 'absolute', bottom: 10, right: 12 }}>
          <span style={{ backgroundColor: 'rgba(0,0,0,0.55)', color: '#fff', fontSize: '0.73rem', fontWeight: 700, padding: '4px 9px', borderRadius: 6, backdropFilter: 'blur(4px)' }}>
            {trip.durationDays || '?'} days
          </span>
        </div>
      </div>

      {/* ── Card Body ── */}
      <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
        {/* title */}
        <div>
          <h3 style={{
            fontFamily: 'Outfit, sans-serif', fontSize: '1.1rem', fontWeight: 800,
            color: '#1A1A2E', marginBottom: 5,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {trip.name}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: '0.8rem', color: '#6B7280', display: 'flex', alignItems: 'center', gap: 5 }}>
              <MapPin size={12} color="#E85D26" /> {trip.destination}
            </span>
            <span style={{ fontSize: '0.8rem', color: '#6B7280', display: 'flex', alignItems: 'center', gap: 5 }}>
              <Calendar size={12} color="#E85D26" /> {trip.dates}
            </span>
          </div>
        </div>

        {/* budget bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: '0.75rem', color: '#9CA3AF', fontWeight: 600 }}>Budget Used</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: spentPct > 85 ? '#EF4444' : '#E85D26' }}>
              ₹{(trip.spentBudget || 0).toLocaleString('en-IN')}
              <span style={{ color: '#9CA3AF', fontWeight: 400 }}> / ₹{(trip.estimatedBudget || 0).toLocaleString('en-IN')}</span>
            </span>
          </div>
          <div style={{ height: 5, backgroundColor: '#F3F4F6', borderRadius: 9999, overflow: 'hidden' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${spentPct}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              style={{
                height: '100%',
                background: spentPct > 85
                  ? '#EF4444'
                  : 'linear-gradient(90deg, #E85D26, #F97316)',
                borderRadius: 9999,
              }}
            />
          </div>
        </div>

        {/* stops pills */}
        {trip.stops && trip.stops.length > 0 && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {trip.stops.slice(0, 3).map((stop, i) => (
              <span key={i} style={{
                padding: '3px 9px', borderRadius: 6,
                backgroundColor: '#F5F3EF', color: '#6B7280',
                fontSize: '0.73rem', fontWeight: 600,
              }}>
                {stop}
              </span>
            ))}
            {trip.stops.length > 3 && (
              <span style={{ padding: '3px 9px', borderRadius: 6, backgroundColor: '#F5F3EF', color: '#9CA3AF', fontSize: '0.73rem' }}>
                +{trip.stops.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* CTA */}
        <button
          onClick={e => { e.stopPropagation(); onView(trip.id); }}
          style={{
            marginTop: 'auto',
            width: '100%', padding: '10px',
            borderRadius: 10, border: 'none', cursor: 'pointer',
            backgroundColor: '#1A1A2E', color: '#fff',
            fontWeight: 700, fontSize: '0.85rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            transition: 'background 0.15s ease',
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#E85D26'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = '#1A1A2E'}
        >
          <Eye size={15} /> View Itinerary
        </button>
      </div>
    </motion.div>
  );
};

/* ─── LIST ROW VIEW ──────────────────────── */
const TripRow = ({ trip, index, onView, onEdit, onDelete }) => {
  const cfg = S[trip.status] || S.Draft;
  const spentPct = trip.estimatedBudget
    ? Math.min(100, Math.round(((trip.spentBudget || 0) / trip.estimatedBudget) * 100))
    : 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 16 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
      onClick={() => onView(trip.id)}
      style={{
        display: 'grid',
        gridTemplateColumns: '72px 1fr auto auto auto',
        alignItems: 'center',
        gap: 16,
        padding: '14px 20px',
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        border: '1px solid #EDE9E2',
        cursor: 'pointer',
        transition: 'box-shadow 0.15s ease',
      }}
      whileHover={{ boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
    >
      {/* thumb */}
      <div style={{ width: 72, height: 56, borderRadius: 10, overflow: 'hidden', flexShrink: 0 }}>
        <img src={trip.coverPhoto || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=200&q=80'}
          alt={trip.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>

      {/* info */}
      <div style={{ minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.98rem', fontWeight: 800, color: '#1A1A2E', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {trip.name}
          </h3>
          <span style={{ flexShrink: 0, padding: '2px 8px', borderRadius: 5, fontSize: '0.7rem', fontWeight: 700, backgroundColor: cfg.bg, color: cfg.color }}>
            {trip.status}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 12, fontSize: '0.78rem', color: '#9CA3AF' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><MapPin size={11} /> {trip.destination}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Calendar size={11} /> {trip.dates}</span>
        </div>
      </div>

      {/* budget */}
      <div style={{ textAlign: 'right', minWidth: 110 }}>
        <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.95rem', fontWeight: 800, color: '#1A1A2E' }}>
          ₹{(trip.estimatedBudget || 0).toLocaleString('en-IN')}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
          <div style={{ flex: 1, height: 4, backgroundColor: '#F3F4F6', borderRadius: 9999, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${spentPct}%`, backgroundColor: '#E85D26', borderRadius: 9999 }} />
          </div>
          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#E85D26', whiteSpace: 'nowrap' }}>{spentPct}%</span>
        </div>
      </div>

      {/* days */}
      <div style={{ textAlign: 'center', minWidth: 50 }}>
        <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.1rem', fontWeight: 800, color: '#1A1A2E' }}>{trip.durationDays || '?'}</p>
        <p style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>days</p>
      </div>

      {/* actions */}
      <div style={{ display: 'flex', gap: 6 }} onClick={e => e.stopPropagation()}>
        <button onClick={() => onView(trip.id)}
          style={{ width: 34, height: 34, borderRadius: 8, border: '1.5px solid #EDE9E2', backgroundColor: '#FAFAF8', color: '#6B7280', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Eye size={14} />
        </button>
        <button onClick={() => onEdit(trip.id)}
          style={{ width: 34, height: 34, borderRadius: 8, border: '1.5px solid #EDE9E2', backgroundColor: '#FAFAF8', color: '#6B7280', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Edit3 size={14} />
        </button>
        <button onClick={() => onDelete(trip.id, trip.name)}
          style={{ width: 34, height: 34, borderRadius: 8, border: '1.5px solid #FEE2E2', backgroundColor: '#FFF5F5', color: '#EF4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Trash2 size={14} />
        </button>
      </div>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════
   MAIN SCREEN
═══════════════════════════════════════════ */
export const Screen6_TripListing = () => {
  const { trips, setTrips, setSelectedTripId, showToast } = useApp();
  const navigate = useNavigate();

  const [search, setSearch]       = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [viewMode, setViewMode]   = useState('grid'); // 'grid' | 'list'

  const allTrips = trips || [];

  const TABS = [
    { label: 'All',       count: allTrips.length },
    { label: 'Ongoing',   count: allTrips.filter(t => t.status === 'Ongoing').length },
    { label: 'Upcoming',  count: allTrips.filter(t => t.status === 'Upcoming' || t.status === 'Planned' || t.status === 'Draft').length },
    { label: 'Completed', count: allTrips.filter(t => t.status === 'Completed').length },
  ];

  const filtered = allTrips.filter(t => {
    const q = search.toLowerCase();
    const matchSearch = (t.name || '').toLowerCase().includes(q) || (t.destination || '').toLowerCase().includes(q);
    if (!matchSearch) return false;
    if (activeTab === 'All') return true;
    if (activeTab === 'Ongoing')   return t.status === 'Ongoing';
    if (activeTab === 'Upcoming')  return t.status === 'Upcoming' || t.status === 'Planned' || t.status === 'Draft';
    if (activeTab === 'Completed') return t.status === 'Completed';
    return true;
  });

  const handleView   = id => { setSelectedTripId(id); navigate('/itinerary/view'); };
  const handleEdit   = id => { setSelectedTripId(id); navigate('/itinerary/builder'); };
  const handleDelete = (id, name) => {
    setTrips(prev => prev.filter(t => t.id !== id));
    showToast(`"${name}" deleted`);
  };

  /* quick summary numbers for header bar */
  const totalBudget = allTrips.reduce((s, t) => s + (t.estimatedBudget || 0), 0);
  const totalDays   = allTrips.reduce((s, t) => s + (t.durationDays || 0), 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{ display: 'flex', flexDirection: 'column', gap: 28, paddingBottom: 60 }}
    >
      {/* ══ HEADER ══════════════════════════════ */}
      <div style={{
        background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2D4A 100%)',
        borderRadius: 24, padding: '32px 36px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: 24,
      }}>
        <div>
          <p style={{ fontSize: '0.78rem', fontWeight: 700, color: '#E85D26', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>
            My Travel Plans
          </p>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(1.8rem,4vw,2.4rem)', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em', marginBottom: 16 }}>
            All Trips
          </h1>
          {/* 3 quick stats */}
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {[
              { val: allTrips.length,                        label: 'Total Trips',   icon: Plane },
              { val: `${totalDays}d`,                        label: 'Days Planned',  icon: Clock },
              { val: `₹${(totalBudget/1000).toFixed(0)}k`,  label: 'Total Budget',  icon: CheckCircle2 },
            ].map(({ val, label, icon: Icon }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(232,93,38,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={17} color="#E85D26" />
                </div>
                <div>
                  <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.2rem', fontWeight: 900, color: '#FFFFFF', lineHeight: 1 }}>{val}</p>
                  <p style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: 2 }}>{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => navigate('/trips/new')}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '13px 24px', borderRadius: 12, border: 'none', cursor: 'pointer',
            backgroundColor: '#E85D26', color: '#fff',
            fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '0.95rem',
            boxShadow: '0 4px 16px rgba(232,93,38,0.45)',
            transition: 'transform 0.15s ease',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <Plus size={18} /> Plan New Trip
        </button>
      </div>

      {/* ══ CONTROLS: TABS + SEARCH + VIEW TOGGLE ══ */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 2, backgroundColor: '#EDE9E2', padding: '4px', borderRadius: 11, flex: '0 0 auto' }}>
          {TABS.map(tab => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(tab.label)}
              style={{
                padding: '7px 14px', borderRadius: 8,
                fontSize: '0.84rem', fontWeight: activeTab === tab.label ? 700 : 600,
                backgroundColor: activeTab === tab.label ? '#FFFFFF' : 'transparent',
                color: activeTab === tab.label ? '#1A1A2E' : '#6B7280',
                border: 'none', cursor: 'pointer',
                boxShadow: activeTab === tab.label ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.15s ease',
                display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              {tab.label}
              {tab.count > 0 && (
                <span style={{
                  width: 18, height: 18, borderRadius: '50%', fontSize: '0.65rem', fontWeight: 800,
                  backgroundColor: activeTab === tab.label ? '#E85D26' : '#D1C9BE',
                  color: activeTab === tab.label ? '#fff' : '#6B7280',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 220px', minWidth: 180 }}>
          <Search size={15} color="#9CA3AF" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search trips or destinations…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field"
            style={{ paddingLeft: 38, borderRadius: 10, fontSize: '0.88rem' }}
          />
        </div>

        {/* View toggle */}
        <div style={{ display: 'flex', gap: 2, backgroundColor: '#EDE9E2', padding: 4, borderRadius: 9 }}>
          {[
            { mode: 'grid', Icon: LayoutGrid },
            { mode: 'list', Icon: List },
          ].map(({ mode, Icon }) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              style={{
                width: 34, height: 34, borderRadius: 7, border: 'none', cursor: 'pointer',
                backgroundColor: viewMode === mode ? '#FFFFFF' : 'transparent',
                color: viewMode === mode ? '#E85D26' : '#9CA3AF',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: viewMode === mode ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              <Icon size={16} />
            </button>
          ))}
        </div>
      </div>

      {/* ══ RESULTS COUNT ══ */}
      {search && (
        <p style={{ fontSize: '0.85rem', color: '#9CA3AF' }}>
          {filtered.length} result{filtered.length !== 1 ? 's' : ''} for <strong style={{ color: '#1A1A2E' }}>"{search}"</strong>
        </p>
      )}

      {/* ══ TRIP GRID / LIST ══ */}
      <AnimatePresence mode="popLayout">
        {filtered.length > 0 ? (
          viewMode === 'grid' ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: 20,
              }}
            >
              {filtered.map((trip, i) => (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  index={i}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}

              {/* New trip card */}
              <motion.div
                whileHover={{ y: -4 }}
                onClick={() => navigate('/trips/new')}
                style={{
                  borderRadius: 20, border: '2px dashed #D1CBC2',
                  backgroundColor: '#FAFAF8', cursor: 'pointer',
                  minHeight: 280,
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', gap: 12,
                }}
              >
                <div style={{ width: 52, height: 52, borderRadius: '50%', backgroundColor: '#FEF0E7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Plus size={24} color="#E85D26" />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1rem', color: '#1A1A2E' }}>Plan a new trip</p>
                  <p style={{ fontSize: '0.8rem', color: '#9CA3AF', marginTop: 4 }}>Click to get started</p>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
            >
              {/* list header */}
              <div style={{
                display: 'grid', gridTemplateColumns: '72px 1fr auto auto auto',
                gap: 16, padding: '8px 20px',
                fontSize: '0.72rem', fontWeight: 700, color: '#9CA3AF',
                textTransform: 'uppercase', letterSpacing: '0.06em',
              }}>
                <span />
                <span>Trip</span>
                <span style={{ textAlign: 'right', minWidth: 110 }}>Budget</span>
                <span style={{ textAlign: 'center', minWidth: 50 }}>Days</span>
                <span style={{ minWidth: 110 }}>Actions</span>
              </div>

              {filtered.map((trip, i) => (
                <TripRow
                  key={trip.id}
                  trip={trip}
                  index={i}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </motion.div>
          )
        ) : (
          /* ── Empty State ── */
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              padding: '64px 24px', textAlign: 'center',
              borderRadius: 24, border: '2px dashed #E2DDD5',
              backgroundColor: '#FAFAF8',
            }}
          >
            <div style={{ fontSize: '3.5rem', marginBottom: 16 }}>🧳</div>
            <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.5rem', fontWeight: 800, color: '#1A1A2E', marginBottom: 8 }}>
              {search ? 'No trips match your search' : 'No trips yet'}
            </h3>
            <p style={{ color: '#9CA3AF', fontSize: '0.9rem', maxWidth: 380, margin: '0 auto 24px' }}>
              {search
                ? `Try a different search term or clear the filter.`
                : `Start building your travel history — plan your first adventure.`}
            </p>
            {!search && (
              <button onClick={() => navigate('/trips/new')} className="btn btn-primary" style={{ fontSize: '0.95rem', padding: '12px 26px' }}>
                <Plus size={17} /> Create My First Trip
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
