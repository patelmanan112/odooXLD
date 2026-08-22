import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, MapPin, Calendar, MoreVertical, Edit3, Eye, Trash2, Copy, Share2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Screen6_TripListing = () => {
  const { trips, setTrips, setCurrentScreen, setSelectedTripId, showToast } = useApp();
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Date');

  const filteredTrips = trips.filter(trip => {
    const matchesStatus = filterStatus === 'All' || trip.status === filterStatus;
    const matchesSearch = trip.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          trip.destination.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleDelete = (id, name) => {
    setTrips(trips.filter(t => t.id !== id));
    showToast(`Deleted trip "${name}"`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span className="badge badge-emerald">Screen 6: User Trip Listing</span>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2rem', fontWeight: 800, color: '#064e3b', marginTop: '4px' }}>
            My Saved Trips 🧳
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Manage ongoing, upcoming, and past travel itineraries
          </p>
        </div>
        <button onClick={() => setCurrentScreen(4)} className="btn btn-primary">
          <Plus size={18} />
          <span>Create New Trip</span>
        </button>
      </div>

      {/* Control Bar: Search, Filters, Group By & Sort */}
      <div className="glass-card" style={{ padding: '16px 24px', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#ffffff' }}>
        {/* Search */}
        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="Search trips..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 14px 8px 40px',
              fontSize: '0.88rem',
              borderRadius: '9999px',
              border: '1px solid #e2e8f0',
              outline: 'none'
            }}
          />
        </div>

        {/* Status Filter Tabs */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {['All', 'Ongoing', 'Upcoming', 'Completed'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              style={{
                padding: '6px 14px',
                borderRadius: '9999px',
                fontSize: '0.82rem',
                fontWeight: filterStatus === status ? 700 : 500,
                backgroundColor: filterStatus === status ? '#064e3b' : '#f1f5f9',
                color: filterStatus === status ? '#ffffff' : '#475569',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Sort By Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#475569' }}>
          <span>Sort by:</span>
          <select 
            value={sortBy} 
            onChange={e => setSortBy(e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: '10px',
              border: '1px solid #cbd5e1',
              fontSize: '0.85rem',
              outline: 'none',
              backgroundColor: '#ffffff'
            }}
          >
            <option value="Date">Date Range</option>
            <option value="Budget">Budget</option>
            <option value="Name">Trip Name</option>
          </select>
        </div>
      </div>

      {/* Trips Grid */}
      <div className="grid-responsive-3">
        {filteredTrips.map(trip => (
          <div key={trip.id} className="glass-card" style={{ padding: '20px', backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ position: 'relative', height: '160px', borderRadius: '14px', overflow: 'hidden', marginBottom: '14px' }}>
                <img src={trip.coverPhoto} alt={trip.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <span className="badge badge-emerald" style={{ position: 'absolute', top: '12px', left: '12px', backgroundColor: 'rgba(6, 78, 59, 0.9)', color: '#ffffff' }}>
                  {trip.status}
                </span>
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.78rem',
                  color: '#064e3b',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
                }}>
                  {trip.progressPct}%
                </div>
              </div>

              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>{trip.name}</h3>
              <div style={{ fontSize: '0.85rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <MapPin size={15} color="#047857" /> {trip.destination}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
                <Calendar size={14} /> {trip.dates} ({trip.durationDays} Days)
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', backgroundColor: '#f8fafc', borderRadius: '12px', marginBottom: '14px' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Estimated Budget</span>
                <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#064e3b' }}>₹{trip.estimatedBudget.toLocaleString()}</span>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  onClick={() => { setSelectedTripId(trip.id); setCurrentScreen(9); }}
                  className="btn btn-primary"
                  style={{ flex: 1, padding: '8px', fontSize: '0.82rem' }}
                >
                  <Eye size={15} /> View Itinerary
                </button>
                <button 
                  onClick={() => { setSelectedTripId(trip.id); setCurrentScreen(5); }}
                  className="btn btn-outline"
                  style={{ padding: '8px', borderRadius: '12px' }}
                >
                  <Edit3 size={15} />
                </button>
                <button 
                  onClick={() => handleDelete(trip.id, trip.name)}
                  className="btn btn-outline"
                  style={{ padding: '8px', borderRadius: '12px', color: '#ef4444' }}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
