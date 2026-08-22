import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Sparkles, 
  MapPin, 
  Calendar, 
  ArrowRight, 
  Compass, 
  Heart, 
  Clock, 
  Layers, 
  Globe,
  Plane
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Screen3_Dashboard = () => {
  const { user, trips, destinations, toggleSaveDestination, setSelectedTripId, showToast } = useApp();
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] = useState('All');
  const [aiPrompt, setAiPrompt] = useState('');

  const filterCategories = ['All', 'Beaches', 'Mountains', 'Cities', 'Adventure', 'Heritage'];

  const filteredDestinations = activeCategory === 'All' 
    ? destinations.slice(0, 4) 
    : destinations.filter(d => d.type === activeCategory || (activeCategory === 'Beaches' && d.name === 'Goa')).slice(0, 4);

  const userName = user?.name ? user.name.split(' ')[0] : 'Traveler';

  const handleGenerateAiPlan = (e) => {
    e.preventDefault();
    if (!aiPrompt.trim()) {
      showToast('Please type a prompt e.g. "5 day trip to Goa under ₹20,000"');
      return;
    }
    showToast(`AI generating itinerary for: "${aiPrompt}" ✨`);
    setTimeout(() => navigate('/itinerary/builder'), 600);
  };

  const handleTripClick = (tripId) => {
    setSelectedTripId(tripId);
    navigate('/itinerary/view');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '32px', width: '100%', maxWidth: '100%', margin: '0', paddingBottom: '40px' }}
    >
      {/* ─── Hero Banner Workspace ─────────────────────────────── */}
      <div style={{
        position: 'relative',
        minHeight: '260px',
        borderRadius: '24px',
        backgroundImage: `linear-gradient(100deg, rgba(14, 14, 12, 0.88) 0%, rgba(6, 78, 59, 0.65) 50%, rgba(0, 0, 0, 0.3) 100%), url('https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '32px clamp(24px, 4vw, 48px)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '24px',
        color: '#ffffff',
        boxShadow: '0 16px 40px rgba(6, 78, 59, 0.15)',
        overflow: 'hidden'
      }}>
        <div style={{ flex: '1 1 320px', zIndex: 2 }}>
          <p style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#a7f3d0', marginBottom: '8px' }}>
            ✦ Good morning, {userName} 👋
          </p>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: '16px' }}>
            Where are we<br />going next?
          </h1>
          <button 
            onClick={() => navigate('/trips/new')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              backgroundColor: '#c8622a',
              color: '#ffffff',
              border: 'none',
              borderRadius: '9999px',
              fontSize: '0.9rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(200, 98, 42, 0.35)',
              transition: 'all 0.2s ease'
            }}
          >
            <span>Plan New Trip</span>
            <Plus size={18} />
          </button>
        </div>

        {/* AI Quick Generator Box */}
        <div style={{
          flex: '1 1 320px',
          maxWidth: '420px',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(16px)',
          borderRadius: '20px',
          padding: '20px 24px',
          color: '#0f172a',
          boxShadow: '0 12px 36px rgba(0,0,0,0.2)',
          border: '1px solid rgba(255,255,255,0.6)',
          zIndex: 2
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <Sparkles size={18} color="#c8622a" />
            <span style={{ fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#c8622a' }}>
              AI Itinerary Builder
            </span>
          </div>
          <form onSubmit={handleGenerateAiPlan} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input
              type="text"
              placeholder="e.g. 5 days in Rajasthan under ₹30,000..."
              value={aiPrompt}
              onChange={e => setAiPrompt(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                fontSize: '0.88rem',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
                outline: 'none',
                fontFamily: 'inherit'
              }}
            />
            <button
              type="submit"
              className="btn btn-primary"
              style={{ padding: '8px 16px', fontSize: '0.84rem', justifyContent: 'center', backgroundColor: '#064e3b' }}
            >
              <span>Generate AI Plan</span>
              <ArrowRight size={16} />
            </button>
          </form>
        </div>
      </div>

      {/* ─── Section: Upcoming Journeys ─────────────────────────────── */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#c8622a' }}>
              ✦ Journeys
            </span>
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
              Your Upcoming Trips
            </h2>
          </div>
          {trips && trips.length > 0 && (
            <button 
              onClick={() => navigate('/trips')}
              style={{ fontSize: '0.88rem', fontWeight: 700, color: '#c8622a', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              View All ({trips.length}) <ArrowRight size={16} />
            </button>
          )}
        </div>

        {/* Trips Grid / Carousel */}
        {trips && trips.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
            {trips.map(trip => (
              <motion.div
                key={trip.id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                onClick={() => handleTripClick(trip.id)}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '20px',
                  border: '1px solid #e2e8f0',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  boxShadow: '0 4px 20px -2px rgba(6, 78, 59, 0.06)'
                }}
              >
                <div style={{ position: 'relative', height: '160px', overflow: 'hidden' }}>
                  <img 
                    src={trip.coverPhoto || 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80'} 
                    alt={trip.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                  <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(6, 78, 59, 0.9)', color: '#ffffff', fontSize: '0.72rem', fontWeight: 700, padding: '4px 10px', borderRadius: '100px' }}>
                    {trip.status}
                  </div>
                </div>
                <div style={{ padding: '20px' }}>
                  <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#c8622a', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
                    {trip.dates}
                  </p>
                  <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
                    {trip.name}
                  </h3>
                  <p style={{ fontSize: '0.84rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '16px' }}>
                    <MapPin size={14} color="#64748b" />
                    {trip.destination}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #f1f5f9', fontSize: '0.8rem', color: '#64748b' }}>
                    <span>Budget Spent: <strong style={{ color: '#064e3b' }}>₹{(trip.spentBudget || 0).toLocaleString('en-IN')}</strong></span>
                    <span>{trip.durationDays || 7} Days</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div style={{
            padding: '48px 24px',
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            border: '1.5px dashed #cbd5e1',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#f5e6da', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c8622a' }}>
              <Plane size={24} />
            </div>
            <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.3rem', fontWeight: 800, color: '#0f172a' }}>
              No journeys planned yet
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#64748b', maxWidth: '380px' }}>
              Your next adventure starts here. Pick a destination or let AI build your perfect itinerary.
            </p>
            <button 
              onClick={() => navigate('/trips/new')}
              className="btn btn-primary"
              style={{ marginTop: '8px', backgroundColor: '#c8622a' }}
            >
              <Plus size={16} />
              <span>Plan Your First Trip</span>
            </button>
          </div>
        )}
      </div>

      {/* ─── Section: Explore Destinations (Places Worth Going To) ───────── */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <div>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#c8622a' }}>
              ✦ Discover
            </span>
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
              Places Worth Going To
            </h2>
          </div>

          {/* Category Filter Pills */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', maxWidth: '100%', paddingBottom: '4px' }}>
            {filterCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '6px 16px',
                  borderRadius: '100px',
                  fontSize: '0.82rem',
                  fontWeight: activeCategory === cat ? 700 : 600,
                  backgroundColor: activeCategory === cat ? '#064e3b' : '#ffffff',
                  color: activeCategory === cat ? '#ffffff' : '#64748b',
                  border: '1px solid #e2e8f0',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Asymmetric Destination Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {filteredDestinations.map(d => (
            <motion.div
              key={d.id}
              whileHover={{ y: -4 }}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '20px',
                border: '1px solid #e2e8f0',
                overflow: 'hidden',
                position: 'relative',
                boxShadow: '0 4px 20px -2px rgba(6, 78, 59, 0.06)'
              }}
            >
              <div style={{ position: 'relative', height: '180px' }}>
                <img src={d.image} alt={d.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button
                  onClick={() => toggleSaveDestination(d.id)}
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <Heart size={16} color={d.saved ? '#ef4444' : '#64748b'} fill={d.saved ? '#ef4444' : 'none'} />
                </button>
              </div>
              <div style={{ padding: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>{d.name}</h3>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#064e3b' }}>★ {d.rating}</span>
                </div>
                <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '12px' }}>{d.country} • {d.cost}</p>
                <button 
                  onClick={() => navigate('/trips/new')}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0',
                    backgroundColor: '#f8fafc',
                    color: '#064e3b',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Plan Trip Here →
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
