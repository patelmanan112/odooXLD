import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, MapPin, Calendar, Edit3, Eye, Trash2, ArrowRight, CheckCircle, Clock, Hourglass } from 'lucide-react';
import { useApp } from '../context/AppContext';

const STATUS_CONFIG = {
  Ongoing:   { color: '#059669', bg: '#ECFDF5', label: 'Ongoing',   dot: '#10B981' },
  Upcoming:  { color: '#D97706', bg: '#FFFBEB', label: 'Upcoming',  dot: '#F59E0B' },
  Planned:   { color: '#D97706', bg: '#FFFBEB', label: 'Planned',   dot: '#F59E0B' },
  Draft:     { color: '#6B7280', bg: '#F9FAFB', label: 'Draft',     dot: '#9CA3AF' },
  Completed: { color: '#1D4ED8', bg: '#EFF6FF', label: 'Completed', dot: '#3B82F6' },
};

const TripRow = ({ trip, onView, onEdit, onDelete }) => {
  const cfg = STATUS_CONFIG[trip.status] || STATUS_CONFIG.Draft;
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '14px 16px',
        borderRadius: '14px',
        backgroundColor: '#FFFFFF',
        border: '1px solid #EDE9E2',
        cursor: 'pointer',
        transition: 'box-shadow 0.2s ease',
      }}
      whileHover={{ boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
      onClick={() => onView(trip.id)}
    >
      {/* Cover thumb */}
      <div style={{ width: '64px', height: '52px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0 }}>
        <img
          src={trip.coverPhoto || 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=200&q=80'}
          alt={trip.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      {/* Main info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1rem', fontWeight: 800, color: '#1A1A2E', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {trip.name}
          </h3>
          <span style={{ flexShrink: 0, padding: '3px 8px', borderRadius: '5px', fontSize: '0.72rem', fontWeight: 700, backgroundColor: cfg.bg, color: cfg.color }}>
            {cfg.label}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.8rem', color: '#9CA3AF' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <MapPin size={12} /> {trip.destination}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Calendar size={12} /> {trip.dates}
          </span>
        </div>
      </div>

      {/* Budget */}
      <div style={{ textAlign: 'right', flexShrink: 0, display: 'none' }} className="show-on-wide">
        <p style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1A1A2E' }}>₹{(trip.estimatedBudget || 0).toLocaleString('en-IN')}</p>
        <p style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{trip.durationDays || '?'} days</p>
      </div>

      {/* Progress bar */}
      <div style={{ width: '90px', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>Planned</span>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#E85D26' }}>{trip.progressPct || 0}%</span>
        </div>
        <div style={{ height: '5px', backgroundColor: '#F3F4F6', borderRadius: '9999px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${trip.progressPct || 0}%`, backgroundColor: '#E85D26', borderRadius: '9999px' }} />
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }} onClick={e => e.stopPropagation()}>
        <button
          onClick={() => onView(trip.id)}
          style={{ width: '34px', height: '34px', borderRadius: '8px', border: '1.5px solid #EDE9E2', backgroundColor: '#FFFFFF', color: '#6B7280', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s ease' }}
        >
          <Eye size={15} />
        </button>
        <button
          onClick={() => onEdit(trip.id)}
          style={{ width: '34px', height: '34px', borderRadius: '8px', border: '1.5px solid #EDE9E2', backgroundColor: '#FFFFFF', color: '#6B7280', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s ease' }}
        >
          <Edit3 size={15} />
        </button>
        <button
          onClick={() => onDelete(trip.id, trip.name)}
          style={{ width: '34px', height: '34px', borderRadius: '8px', border: '1.5px solid #FEE2E2', backgroundColor: '#FFF5F5', color: '#EF4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s ease' }}
        >
          <Trash2 size={15} />
        </button>
      </div>
    </motion.div>
  );
};

const SectionGroup = ({ title, icon: Icon, color, trips, onView, onEdit, onDelete, emptyText }) => (
  <div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: color }} />
      <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.05rem', fontWeight: 700, color: '#1A1A2E' }}>
        {title}
      </h2>
      <span style={{ padding: '2px 8px', borderRadius: '9999px', backgroundColor: '#F3F4F6', fontSize: '0.76rem', fontWeight: 700, color: '#6B7280' }}>
        {trips.length}
      </span>
    </div>

    {trips.length > 0 ? (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <AnimatePresence>
          {trips.map(trip => (
            <TripRow
              key={trip.id}
              trip={trip}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </AnimatePresence>
      </div>
    ) : (
      <div style={{ padding: '20px', borderRadius: '14px', border: '1.5px dashed #E2DDD5', textAlign: 'center', color: '#B3AFA8', fontSize: '0.86rem' }}>
        {emptyText}
      </div>
    )}
  </div>
);

export const Screen6_TripListing = () => {
  const { trips, setTrips, setSelectedTripId, showToast } = useApp();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = (trips || []).filter(t => {
    const matchStatus = activeFilter === 'All' || t.status === activeFilter;
    const q = search.toLowerCase();
    const matchSearch = (t.name || '').toLowerCase().includes(q) || (t.destination || '').toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const ongoing   = filtered.filter(t => t.status === 'Ongoing');
  const upcoming  = filtered.filter(t => t.status === 'Upcoming' || t.status === 'Planned' || t.status === 'Draft');
  const completed = filtered.filter(t => t.status === 'Completed');

  const handleView = (id) => { setSelectedTripId(id); navigate('/itinerary/view'); };
  const handleEdit = (id) => { setSelectedTripId(id); navigate('/itinerary/builder'); };
  const handleDelete = (id, name) => {
    setTrips(prev => prev.filter(t => t.id !== id));
    showToast(`Deleted "${name}"`);
  };

  const filterOptions = ['All', 'Ongoing', 'Upcoming', 'Completed'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3 }}
      style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '48px', display: 'flex', flexDirection: 'column', gap: '28px' }}
    >
      {/* ── Page Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <p style={{ fontSize: '0.78rem', fontWeight: 700, color: '#E85D26', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
            My Travel Plans
          </p>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2rem', fontWeight: 800, color: '#1A1A2E' }}>
            All Trips
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#9CA3AF', marginTop: '4px' }}>
            {(trips || []).length} trips saved across all statuses
          </p>
        </div>
        <button onClick={() => navigate('/trips/new')} className="btn btn-primary">
          <Plus size={16} /> Create New Trip
        </button>
      </div>

      {/* ── Search + Filter Bar ── */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1 1 260px', minWidth: '220px' }}>
          <Search size={16} color="#9CA3AF" style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search trips..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field"
            style={{ paddingLeft: '38px', borderRadius: '9px' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '6px', backgroundColor: '#EDE9E2', padding: '4px', borderRadius: '9px' }}>
          {filterOptions.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              style={{
                padding: '6px 14px', borderRadius: '7px', fontSize: '0.84rem',
                fontWeight: activeFilter === f ? 700 : 600,
                backgroundColor: activeFilter === f ? '#FFFFFF' : 'transparent',
                color: activeFilter === f ? '#1A1A2E' : '#6B7280',
                border: 'none', cursor: 'pointer',
                boxShadow: activeFilter === f ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* ── Trip Count Summary Chips ── */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {[
          { label: 'Ongoing',   count: (trips||[]).filter(t => t.status === 'Ongoing').length,   color: '#059669', bg: '#ECFDF5' },
          { label: 'Upcoming',  count: (trips||[]).filter(t => t.status === 'Upcoming' || t.status === 'Planned').length, color: '#D97706', bg: '#FFFBEB' },
          { label: 'Completed', count: (trips||[]).filter(t => t.status === 'Completed').length,  color: '#1D4ED8', bg: '#EFF6FF' },
        ].map(s => (
          <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px', backgroundColor: s.bg, borderRadius: '9px' }}>
            <span style={{ fontWeight: 800, fontSize: '1.1rem', color: s.color }}>{s.count}</span>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: s.color }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* ── Grouped Sections ── */}
      {(activeFilter === 'All' || activeFilter === 'Ongoing') && (
        <SectionGroup
          title="Ongoing Trips"
          color="#10B981"
          trips={ongoing}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          emptyText="No active trips right now."
        />
      )}

      {(activeFilter === 'All' || activeFilter === 'Upcoming') && (
        <SectionGroup
          title="Upcoming Trips"
          color="#F59E0B"
          trips={upcoming}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          emptyText="No upcoming trips planned yet."
        />
      )}

      {(activeFilter === 'All' || activeFilter === 'Completed') && (
        <SectionGroup
          title="Completed Trips"
          color="#3B82F6"
          trips={completed}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          emptyText="No completed trips yet."
        />
      )}

      {/* Empty state */}
      {filtered.length === 0 && (
        <div style={{ padding: '60px 24px', textAlign: 'center', borderRadius: '20px', border: '2px dashed #E2DDD5', backgroundColor: '#FAFAF8' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🧳</div>
          <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.4rem', fontWeight: 800, color: '#1A1A2E', marginBottom: '8px' }}>
            No trips found
          </h3>
          <p style={{ color: '#9CA3AF', fontSize: '0.9rem', marginBottom: '20px' }}>
            {search ? `No results for "${search}"` : "Start planning your next adventure"}
          </p>
          <button onClick={() => navigate('/trips/new')} className="btn btn-primary">
            <Plus size={16} /> Create a Trip
          </button>
        </div>
      )}
    </motion.div>
  );
};
