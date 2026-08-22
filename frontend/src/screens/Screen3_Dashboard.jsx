import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Plane, 
  Building2, 
  UtensilsCrossed, 
  Compass, 
  Bus, 
  Sparkles, 
  MapPin, 
  Heart, 
  ChevronRight, 
  MoreVertical
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Screen3_Dashboard = () => {
  const { user, trips, destinations, toggleSaveDestination, setCurrentScreen, setSelectedTripId, showToast } = useApp();
  const [activeTab, setActiveTab] = useState('All');
  const [aiPrompt, setAiPrompt] = useState('');

  const filterTabs = ['All', 'Beaches', 'Mountains', 'Cities', 'Adventure', 'Heritage', 'Family'];

  const filteredDestinations = activeTab === 'All' 
    ? destinations.slice(0, 4) 
    : destinations.filter(d => d.type === activeTab || (activeTab === 'Beaches' && d.name === 'Goa')).slice(0, 4);

  const handleGenerateAiPlan = (e) => {
    e.preventDefault();
    if (!aiPrompt) {
      showToast('Please type a prompt e.g. "5 day trip to Goa under ₹20,000"');
      return;
    }
    showToast(`AI generating itinerary for: "${aiPrompt}" ✨`);
    setTimeout(() => setCurrentScreen(5), 800);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', maxWidth: '100%', overflowX: 'hidden' }}
    >
      {/* Top Main Section Grid (Banner + Side Panels) */}
      <div className="dashboard-grid-2">
        
        {/* Left Column: Hero Banner */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', minWidth: 0 }}>
          <div style={{
            minHeight: '220px',
            borderRadius: '24px',
            backgroundImage: `linear-gradient(90deg, rgba(6, 78, 59, 0.88) 0%, rgba(6, 78, 59, 0.55) 50%, rgba(0, 0, 0, 0.2) 100%), url('https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1400&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            padding: '24px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            color: '#ffffff',
            position: 'relative',
            boxShadow: '0 12px 30px rgba(6, 78, 59, 0.15)'
          }}>
            <div style={{ flex: 1, minWidth: '220px' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#a7f3d0', marginBottom: '6px' }}>
                Good morning, {user.name.split(' ')[0]} 👋
              </div>
              <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.1rem', fontWeight: 800, lineHeight: 1.15, marginBottom: '16px' }}>
                Where are we<br />going next?
              </h1>
              <button 
                onClick={() => setCurrentScreen(4)}
                className="btn btn-primary"
                style={{ backgroundColor: '#ffffff', color: '#064e3b', fontWeight: 700 }}
              >
                <span>Plan New Trip</span>
                <Plus size={18} />
              </button>
            </div>

            {/* Banner Floating Trip Card */}
            <div style={{
              width: '100%',
              maxWidth: '280px',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              padding: '16px',
              color: '#0f172a',
              boxShadow: '0 10px 30px rgba(0,0,0,0.18)',
              border: '1px solid rgba(255,255,255,0.4)'
            }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>
                Upcoming Trip
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#064e3b', marginBottom: '2px' }}>
                Japan Adventure
              </div>
              <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '12px' }}>
                12 Oct – 19 Oct 2026 • 7 Days
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>₹82,000</div>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Estimated Budget</div>
                </div>
                {/* 70% Circular Progress */}
                <div style={{ position: 'relative', width: '40px', height: '40px' }}>
                  <svg width="40" height="40" viewBox="0 0 42 42">
                    <circle cx="21" cy="21" r="16" fill="none" stroke="#e2e8f0" strokeWidth="4" />
                    <circle 
                      cx="21" cy="21" r="16" fill="none" stroke="#047857" strokeWidth="4" 
                      strokeDasharray="100" strokeDashoffset="30" strokeLinecap="round" 
                      transform="rotate(-90 21 21)"
                    />
                  </svg>
                  <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.68rem', fontWeight: 800, color: '#047857' }}>
                    70%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Row: Upcoming Trips Stack & Active Trip Itinerary Flow */}
          <div className="dashboard-grid-sub">
            
            {/* Upcoming Trips List Card */}
            <div className="glass-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>Upcoming Trips</h3>
                <button onClick={() => setCurrentScreen(6)} style={{ background: 'none', border: 'none', color: '#047857', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>
                  View all
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {trips.map(trip => (
                  <div 
                    key={trip.id}
                    onClick={() => { setSelectedTripId(trip.id); setCurrentScreen(9); }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px',
                      borderRadius: '14px',
                      backgroundColor: '#ffffff',
                      border: '1px solid #f1f5f9',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease shadow'
                    }}
                  >
                    <img src={trip.coverPhoto} alt={trip.name} style={{ width: '44px', height: '44px', borderRadius: '12px', objectFit: 'cover' }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.86rem', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {trip.name}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                        {trip.dates}
                      </div>
                    </div>
                    {/* Ring Badge */}
                    <div style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      border: '2px solid #047857',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.66rem',
                      fontWeight: 800,
                      color: '#047857',
                      backgroundColor: '#ecfdf5',
                      flexShrink: 0
                    }}>
                      {trip.progressPct}%
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Trip Itinerary & Route Map Panel */}
            <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#064e3b' }}>Japan Adventure</h3>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Multi-City Route Planner</div>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button onClick={() => setCurrentScreen(5)} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.76rem' }}>
                    View Itinerary
                  </button>
                  <button style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><MoreVertical size={16} /></button>
                </div>
              </div>

              {/* Multi-City Node Flow Graph */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                backgroundColor: '#f8fafc',
                borderRadius: '14px',
                border: '1px solid #e2e8f0',
                marginBottom: '14px',
                overflowX: 'auto',
                WebkitOverflowScrolling: 'touch'
              }}>
                {['Mumbai', 'Tokyo', 'Kyoto', 'Osaka', 'Tokyo'].map((city, idx, arr) => (
                  <React.Fragment key={idx}>
                    <div style={{ textAlign: 'center', flexShrink: 0 }}>
                      <div style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        backgroundColor: idx === 1 ? '#064e3b' : '#ffffff',
                        color: idx === 1 ? '#ffffff' : '#475569',
                        border: '1.5px solid #cbd5e1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 4px auto',
                        fontSize: '0.78rem',
                        fontWeight: 700
                      }}>
                        {idx === 0 ? <Plane size={13} /> : city.slice(0, 1)}
                      </div>
                      <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#334155' }}>{city}</span>
                    </div>
                    {idx < arr.length - 1 && <span style={{ color: '#cbd5e1', fontWeight: 700, padding: '0 4px' }}>→</span>}
                  </React.Fragment>
                ))}
              </div>

              {/* Timeline Items & Map Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#047857', marginBottom: '4px' }}>Day 2 • 13 Oct</div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a', marginBottom: '6px' }}>Tokyo</div>
                  <div style={{ fontSize: '0.76rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div>⏰ 09:00 Breakfast at Café de L'Ambre</div>
                    <div>⛩️ 10:30 Senso-ji Temple</div>
                    <div>🍜 13:00 Lunch at Ichiran Ramen</div>
                    <div>🚶 15:00 Shibuya Crossing</div>
                    <div>🍣 19:30 Dinner at Sushi Dai</div>
                  </div>
                </div>

                {/* Simulated Interactive Map */}
                <div style={{
                  height: '130px',
                  borderRadius: '16px',
                  backgroundImage: `url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=500&q=80')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  border: '1px solid #cbd5e1'
                }}>
                  {/* Pin Markers */}
                  <div style={{ position: 'absolute', top: '25%', left: '30%', color: '#064e3b' }}><MapPin size={20} fill="#10b981" /></div>
                  <div style={{ position: 'absolute', top: '55%', left: '60%', color: '#064e3b' }}><MapPin size={20} fill="#10b981" /></div>
                  <div style={{ position: 'absolute', bottom: '20%', right: '20%', color: '#064e3b' }}><MapPin size={20} fill="#10b981" /></div>
                  <div style={{
                    position: 'absolute',
                    bottom: '8px',
                    right: '8px',
                    backgroundColor: '#ffffff',
                    padding: '3px 8px',
                    borderRadius: '9999px',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                  }}>
                    🗺️ Route Map
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Budget & AI Widgets */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', minWidth: 0 }}>
          
          {/* Trip Budget Breakdown Card */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>Trip Budget</h3>
              <button onClick={() => setCurrentScreen(9)} style={{ background: 'none', border: 'none', color: '#047857', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>
                View Details
              </button>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#064e3b', display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                ₹35,000 <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 500 }}>/ ₹50,000</span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '9999px', marginTop: '6px', overflow: 'hidden' }}>
                <div style={{ width: '70%', height: '100%', backgroundColor: '#064e3b', borderRadius: '9999px' }}></div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem' }}>
              {[
                { label: 'Flights', amount: '₹15,000', pct: '30%', icon: Plane, color: '#3b82f6' },
                { label: 'Hotels', amount: '₹10,000', pct: '20%', icon: Building2, color: '#6366f1' },
                { label: 'Food', amount: '₹5,000', pct: '10%', icon: UtensilsCrossed, color: '#10b981' },
                { label: 'Activities', amount: '₹3,000', pct: '6%', icon: Compass, color: '#f59e0b' },
                { label: 'Transport', amount: '₹2,000', pct: '4%', icon: Bus, color: '#8b5cf6' },
              ].map((c, i) => {
                const IconComponent = c.icon;
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <IconComponent size={14} color={c.color} />
                      <span style={{ color: '#475569' }}>{c.label}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', fontWeight: 600, color: '#0f172a' }}>
                      <span>{c.amount}</span>
                      <span style={{ color: '#94a3b8', fontSize: '0.74rem', width: '28px', textAlign: 'right' }}>{c.pct}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Can I afford this? Banner */}
            <div style={{
              marginTop: '16px',
              padding: '10px 12px',
              borderRadius: '14px',
              backgroundColor: '#ecfdf5',
              border: '1px solid #a7f3d0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer'
            }}
            onClick={() => showToast('Affordability Calculator: Current plan is within safety margin!')}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#064e3b' }}>Can I afford this?</div>
                <div style={{ fontSize: '0.72rem', color: '#047857' }}>Add an activity to see impact</div>
              </div>
              <ChevronRight size={16} color="#047857" />
            </div>
          </div>

          {/* AI Trip Planner Prompt Widget */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Sparkles size={18} color="#f59e0b" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>AI Trip Planner</h3>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '12px' }}>
              Plan your trip in seconds with custom prompts.
            </p>

            <form onSubmit={handleGenerateAiPlan}>
              <input 
                type="text" 
                placeholder="e.g. 5 day trip to Goa under ₹20,000" 
                value={aiPrompt}
                onChange={e => setAiPrompt(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  fontSize: '0.84rem',
                  marginBottom: '10px',
                  outline: 'none',
                  fontFamily: 'inherit'
                }}
              />
              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '9px' }}>
                <Sparkles size={15} />
                <span>Generate Plan</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Section: Explore Top Destinations & Saved List */}
      <div className="dashboard-grid-bottom">
        
        {/* Explore Top Destinations Cards */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>Explore Top Destinations</h3>
          </div>

          {/* Category Filter Pills */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', flexWrap: 'wrap' }}>
            {filterTabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '9999px',
                  fontSize: '0.78rem',
                  fontWeight: activeTab === tab ? 700 : 500,
                  backgroundColor: activeTab === tab ? '#064e3b' : '#f1f5f9',
                  color: activeTab === tab ? '#ffffff' : '#475569',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Cards Grid */}
          <div className="grid-responsive-4">
            {filteredDestinations.map(d => (
              <div 
                key={d.id}
                style={{
                  height: '190px',
                  borderRadius: '18px',
                  backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.85) 100%), url('${d.image}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  padding: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  color: '#ffffff',
                  position: 'relative',
                  cursor: 'pointer',
                  overflow: 'hidden'
                }}
                onClick={() => setCurrentScreen(8)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="badge badge-emerald" style={{ backgroundColor: '#10b981', color: '#ffffff', border: 'none', fontSize: '0.7rem' }}>
                    {d.popular ? 'Popular' : 'Trending'}
                  </span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleSaveDestination(d.id); }}
                    style={{ background: 'none', border: 'none', color: d.saved ? '#ef4444' : '#ffffff', cursor: 'pointer' }}
                  >
                    <Heart size={18} fill={d.saved ? '#ef4444' : 'none'} />
                  </button>
                </div>

                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '2px' }}>{d.name}</h4>
                  <div style={{ fontSize: '0.74rem', color: '#cbd5e1' }}>
                    {d.duration} • {d.cost}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Saved Destinations Sidebar */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>Saved Destinations</h3>
            <button onClick={() => setCurrentScreen(8)} style={{ background: 'none', border: 'none', color: '#047857', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>
              View all
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {destinations.filter(d => d.saved).slice(0, 3).map(d => (
              <div 
                key={d.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px',
                  borderRadius: '14px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0'
                }}
              >
                <img src={d.image} alt={d.name} style={{ width: '42px', height: '42px', borderRadius: '10px', objectFit: 'cover' }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.86rem', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.name}</div>
                  <div style={{ fontSize: '0.74rem', color: '#64748b' }}>{d.type}</div>
                </div>
                <button 
                  onClick={() => toggleSaveDestination(d.id)}
                  style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                >
                  <Heart size={16} fill="#ef4444" />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </motion.div>
  );
};
