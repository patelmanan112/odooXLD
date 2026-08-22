import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Globe, Shield, Bell, Heart, Award, Camera, Save } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Screen7_ProfileSettings = () => {
  const { user, setUser, destinations, setCurrentScreen, showToast, updateUser } = useApp();
  const [activeTab, setActiveTab] = useState('Profile');
  const [avatar, setAvatar] = useState(user.avatarUrl || user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80');
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    city: user.city,
    country: user.country,
    currency: user.currency || '₹'
  });

  const handleSave = (e) => {
    e.preventDefault();
    setUser({ ...user, ...formData });
    showToast('Profile settings saved successfully!');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35 }}
      style={{ maxWidth: '980px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span className="badge badge-emerald">Screen 7: User Profile & Settings</span>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2rem', fontWeight: 800, color: '#064e3b', marginTop: '4px' }}>
            User Account & Preferences 👤
          </h2>
        </div>
      </div>

      {/* User Header Profile Card */}
      <div className="glass-card" style={{ padding: '28px', backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', gap: '24px' }}>
        <div style={{ position: 'relative' }}>
          <img 
            src={avatar} 
            alt={user.name} 
            style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #064e3b' }} 
          />
          <input type="file" accept="image/*" onChange={handleImageUpload} style={{ opacity: 0, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', cursor: 'pointer', zIndex: 10 }} />
          <button 
            type="button"
            onClick={() => {}}
            style={{ position: 'absolute', bottom: 0, right: 0, width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#064e3b', color: '#ffffff', border: '2px solid #ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <Camera size={14} />
          </button>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>{user.name}</h3>
            <span className="badge badge-gold"><Award size={13} /> GlobeTrotter Gold</span>
          </div>
          <p style={{ color: '#64748b', fontSize: '0.88rem', marginTop: '2px' }}>
            {user.city}, {user.country} • Member since 2024
          </p>

          <div style={{ display: 'flex', gap: '20px', marginTop: '14px', fontSize: '0.84rem' }}>
            <div><strong style={{ color: '#064e3b', fontSize: '1rem' }}>14</strong> <span style={{ color: '#64748b' }}>Trips Created</span></div>
            <div><strong style={{ color: '#064e3b', fontSize: '1rem' }}>8</strong> <span style={{ color: '#64748b' }}>Countries Visited</span></div>
            <div><strong style={{ color: '#064e3b', fontSize: '1rem' }}>7</strong> <span style={{ color: '#64748b' }}>Saved Places</span></div>
          </div>
        </div>
      </div>

      {/* Tabs Row */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
        {['Profile', 'Preplanned Trips', 'Saved Destinations', 'Preferences & Security'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '8px 18px',
              borderRadius: '9999px',
              fontSize: '0.88rem',
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

      {/* Tab Content */}
      {activeTab === 'Profile' && (
        <div className="glass-card" style={{ padding: '32px', backgroundColor: '#ffffff' }}>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '20px' }}>Personal Information</h4>
          <form onSubmit={handleSave}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px 20px' }}>
              <div className="input-group">
                <label className="input-label">Full Name</label>
                <input type="text" className="input-field" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div className="input-group">
                <label className="input-label">Email</label>
                <input type="email" className="input-field" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
              </div>
              <div className="input-group">
                <label className="input-label">Phone</label>
                <input type="text" className="input-field" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
              </div>
              <div className="input-group">
                <label className="input-label">City</label>
                <input type="text" className="input-field" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} />
              </div>
              <div className="input-group">
                <label className="input-label">Country</label>
                <input type="text" className="input-field" value={formData.country} onChange={e => setFormData({ ...formData, country: e.target.value })} />
              </div>
              <div className="input-group">
                <label className="input-label">Preferred Currency</label>
                <select className="input-field" value={formData.currency} onChange={e => setFormData({ ...formData, currency: e.target.value })}>
                  <option value="₹">INR (₹)</option>
                  <option value="$">USD ($)</option>
                  <option value="€">EUR (€)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button type="submit" className="btn btn-primary">
                <Save size={16} /> Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'Saved Destinations' && (
        <div className="glass-card" style={{ padding: '28px', backgroundColor: '#ffffff' }}>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>Your Saved Destinations</h4>
          <div className="grid-responsive-3">
            {destinations.filter(d => d.saved).map(d => (
              <div key={d.id} style={{ borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <img src={d.image} alt={d.name} style={{ width: '100%', height: '120px', objectFit: 'cover' }} />
                <div style={{ padding: '12px' }}>
                  <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>{d.name}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{d.country} • {d.cost}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'Preplanned Trips' && (
        <div className="glass-card" style={{ padding: '28px', backgroundColor: '#ffffff' }}>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>Preplanned & Past Travel Archives</h4>
          <p style={{ color: '#64748b', fontSize: '0.88rem' }}>Access all completed trip logs, photo journals, and expense receipts.</p>
          <button onClick={() => setCurrentScreen(6)} className="btn btn-secondary" style={{ marginTop: '16px' }}>
            Go to My Trips
          </button>
        </div>
      )}

      {activeTab === 'Preferences & Security' && (
        <div className="glass-card" style={{ padding: '28px', backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>Notification & Privacy Preferences</h4>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#0f172a' }}>Email Trip Deal Alerts</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Get notified when flight rates drop for your saved destinations</div>
            </div>
            <input type="checkbox" defaultChecked style={{ accentColor: '#064e3b', width: '18px', height: '18px' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#0f172a' }}>Public Itinerary Sharing</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Allow community members to view and copy your public trips</div>
            </div>
            <input type="checkbox" defaultChecked style={{ accentColor: '#064e3b', width: '18px', height: '18px' }} />
          </div>
        </div>
      )}
    </motion.div>
  );
};
