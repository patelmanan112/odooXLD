import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Users, TrendingUp, MapPin, Compass, MoreVertical, Eye, Ban, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Screen12_AdminAnalytics = () => {
  const { showToast } = useApp();
  const [activeTab, setActiveTab] = useState('Overview');

  const usersList = [
    { id: 'u1', name: 'Khush Patel', email: 'khush.patel@wanderly.com', tripsCount: 14, status: 'Active', joined: 'Jan 2024' },
    { id: 'u2', name: 'Aarav Sharma', email: 'aarav@gmail.com', tripsCount: 8, status: 'Active', joined: 'Mar 2024' },
    { id: 'u3', name: 'Riya Malhotra', email: 'riya.m@outlook.com', tripsCount: 5, status: 'Active', joined: 'Jun 2024' },
    { id: 'u4', name: 'Vikramaditya S.', email: 'vikram@traveler.io', tripsCount: 12, status: 'Active', joined: 'Feb 2024' },
    { id: 'u5', name: 'Neha Gupta', email: 'neha.g@domain.com', tripsCount: 2, status: 'Suspended', joined: 'Jul 2024' }
  ];

  const popularCities = [
    { city: 'Tokyo, Japan', trips: 1420, growth: '+28%' },
    { city: 'Goa, India', trips: 1150, growth: '+15%' },
    { city: 'Kyoto, Japan', trips: 980, growth: '+32%' },
    { city: 'Manali, India', trips: 840, growth: '+10%' },
    { city: 'Bali, Indonesia', trips: 790, growth: '+22%' }
  ];

  const popularActivities = [
    { name: 'Shibuya Ramen Food Tour', category: 'Food', bookings: 640 },
    { name: 'Paragliding in Solang Valley', category: 'Adventure', bookings: 520 },
    { name: 'Fushimi Inari Shrine Hike', category: 'Sightseeing', bookings: 490 },
    { name: 'Scuba Diving at Grand Island', category: 'Water Sports', bookings: 410 }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', maxWidth: '100%', overflowX: 'hidden' }}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
        <div>
          <span className="badge badge-emerald">Screen 12: Admin & Analytics Panel</span>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.8rem', fontWeight: 800, color: '#064e3b', marginTop: '4px' }}>
            Admin Dashboard & Analytics 📊
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.86rem' }}>
            Platform metrics, user management, and popular city trends
          </p>
        </div>
      </div>

      {/* Metric Cards Top Row */}
      <div className="grid-responsive-4">
        {[
          { label: 'Total Registered Users', val: '12,480', sub: '+18% this month', icon: Users, color: '#064e3b' },
          { label: 'Active Trips Planned', val: '4,890', sub: '+24% this month', icon: TrendingUp, color: '#047857' },
          { label: 'Top Destination City', val: 'Tokyo', sub: '1,420 bookings', icon: MapPin, color: '#3b82f6' },
          { label: 'Top Trending Activity', val: 'Paragliding', sub: '520 bookings', icon: Compass, color: '#f59e0b' },
        ].map((m, i) => {
          const Icon = m.icon;
          return (
            <div key={i} className="glass-card" style={{ padding: '16px', backgroundColor: '#ffffff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#64748b' }}>{m.label}</span>
                <Icon size={18} color={m.color} />
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>{m.val}</div>
              <div style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 700, marginTop: '2px' }}>{m.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '6px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        {['Overview', 'Manage Users', 'Popular Cities', 'Popular Activities'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '0.82rem',
              fontWeight: activeTab === tab ? 700 : 500,
              backgroundColor: activeTab === tab ? '#064e3b' : 'transparent',
              color: activeTab === tab ? '#ffffff' : '#64748b',
              border: 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Manage Users Table */}
      {(activeTab === 'Overview' || activeTab === 'Manage Users') && (
        <div className="glass-card" style={{ padding: '20px', backgroundColor: '#ffffff' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#064e3b', marginBottom: '14px' }}>Manage Registered Users</h3>
          <div className="table-responsive-container">
            <table style={{ width: '100%', minWidth: '580px', borderCollapse: 'collapse', fontSize: '0.84rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b' }}>
                  <th style={{ padding: '10px' }}>User</th>
                  <th style={{ padding: '10px' }}>Email</th>
                  <th style={{ padding: '10px' }}>Joined Date</th>
                  <th style={{ padding: '10px' }}>Trips Count</th>
                  <th style={{ padding: '10px' }}>Status</th>
                  <th style={{ padding: '10px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {usersList.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '10px', fontWeight: 700, color: '#0f172a' }}>{u.name}</td>
                    <td style={{ padding: '10px', color: '#64748b' }}>{u.email}</td>
                    <td style={{ padding: '10px', color: '#64748b' }}>{u.joined}</td>
                    <td style={{ padding: '10px', fontWeight: 700, color: '#064e3b' }}>{u.tripsCount} Trips</td>
                    <td style={{ padding: '10px' }}>
                      <span className={`badge ${u.status === 'Active' ? 'badge-emerald' : 'badge-gold'}`} style={{ fontSize: '0.7rem' }}>
                        {u.status}
                      </span>
                    </td>
                    <td style={{ padding: '10px', textAlign: 'right' }}>
                      <button onClick={() => showToast(`Inspecting trips for ${u.name}`)} className="btn btn-outline" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>
                        View Trips
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Popular Cities & Activities Grid */}
      <div className="admin-grid-two">
        
        {/* Popular Cities */}
        <div className="glass-card" style={{ padding: '20px', backgroundColor: '#ffffff' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#064e3b', marginBottom: '14px' }}>Popular Destinations & Cities</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {popularCities.map((c, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderRadius: '12px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.86rem' }}>#{i+1} {c.city}</span>
                <div style={{ display: 'flex', gap: '10px', fontSize: '0.8rem' }}>
                  <span style={{ color: '#047857', fontWeight: 700 }}>{c.trips} Trips</span>
                  <span style={{ color: '#10b981', fontWeight: 800 }}>{c.growth}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Activities */}
        <div className="glass-card" style={{ padding: '20px', backgroundColor: '#ffffff' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#064e3b', marginBottom: '14px' }}>Popular Activities & Trends</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {popularActivities.map((a, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderRadius: '12px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.86rem' }}>{a.name}</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{a.category}</div>
                </div>
                <span style={{ fontWeight: 800, color: '#064e3b', fontSize: '0.82rem' }}>{a.bookings} Bookings</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
