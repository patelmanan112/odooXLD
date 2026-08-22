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
      style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span className="badge badge-emerald">Screen 12: Admin & Analytics Panel</span>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2rem', fontWeight: 800, color: '#064e3b', marginTop: '4px' }}>
            Admin Dashboard & Analytics 📊
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Platform health, user management, popular city trends, and activity metrics
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
            <div key={i} className="glass-card" style={{ padding: '20px', backgroundColor: '#ffffff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b' }}>{m.label}</span>
                <Icon size={20} color={m.color} />
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>{m.val}</div>
              <div style={{ fontSize: '0.76rem', color: '#10b981', fontWeight: 700, marginTop: '4px' }}>{m.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
        {['Overview', 'Manage Users', 'Popular Cities', 'Popular Activities'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '8px 16px',
              borderRadius: '9999px',
              fontSize: '0.85rem',
              fontWeight: activeTab === tab ? 700 : 500,
              backgroundColor: activeTab === tab ? '#064e3b' : 'transparent',
              color: activeTab === tab ? '#ffffff' : '#64748b',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Manage Users Table */}
      {(activeTab === 'Overview' || activeTab === 'Manage Users') && (
        <div className="glass-card" style={{ padding: '24px', backgroundColor: '#ffffff' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#064e3b', marginBottom: '16px' }}>Manage Registered Users</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b' }}>
                  <th style={{ padding: '12px' }}>User</th>
                  <th style={{ padding: '12px' }}>Email</th>
                  <th style={{ padding: '12px' }}>Joined Date</th>
                  <th style={{ padding: '12px' }}>Trips Count</th>
                  <th style={{ padding: '12px' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {usersList.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px', fontWeight: 700, color: '#0f172a' }}>{u.name}</td>
                    <td style={{ padding: '12px', color: '#64748b' }}>{u.email}</td>
                    <td style={{ padding: '12px', color: '#64748b' }}>{u.joined}</td>
                    <td style={{ padding: '12px', fontWeight: 700, color: '#064e3b' }}>{u.tripsCount} Trips</td>
                    <td style={{ padding: '12px' }}>
                      <span className={`badge ${u.status === 'Active' ? 'badge-emerald' : 'badge-gold'}`}>
                        {u.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      <button onClick={() => showToast(`Inspecting trips for ${u.name}`)} className="btn btn-outline" style={{ padding: '4px 10px', fontSize: '0.78rem' }}>
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
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        
        {/* Popular Cities */}
        <div className="glass-card" style={{ padding: '24px', backgroundColor: '#ffffff' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#064e3b', marginBottom: '16px' }}>Popular Destinations & Cities</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {popularCities.map((c, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', borderRadius: '12px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <span style={{ fontWeight: 700, color: '#0f172a' }}>#{i+1} {c.city}</span>
                <div style={{ display: 'flex', gap: '12px', fontSize: '0.84rem' }}>
                  <span style={{ color: '#047857', fontWeight: 700 }}>{c.trips} Trips</span>
                  <span style={{ color: '#10b981', fontWeight: 800 }}>{c.growth}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Activities */}
        <div className="glass-card" style={{ padding: '24px', backgroundColor: '#ffffff' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#064e3b', marginBottom: '16px' }}>Popular Activities & Trends</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {popularActivities.map((a, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', borderRadius: '12px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#0f172a' }}>{a.name}</div>
                  <div style={{ fontSize: '0.76rem', color: '#64748b' }}>{a.category}</div>
                </div>
                <span style={{ fontWeight: 800, color: '#064e3b', fontSize: '0.88rem' }}>{a.bookings} Bookings</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
