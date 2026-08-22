import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

export const Screen7_ProfileSettings = () => {
  const { user, setUser, trips, setSelectedTripId, showToast, updateUser } = useApp();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('Profile Details');
  const [tripSubTab, setTripSubTab] = useState('Preferred');
  
  const [formData, setFormData] = useState({
    fullName: user?.name || 'Jane Doe',
    email: user?.email || 'jane@example.com',
    phone: user?.phone || '+1 234 567 8900',
    city: user?.city || 'San Francisco',
    country: user?.country || 'USA',
    currency: user?.currency || 'USD'
  });

  const handleSaveProfile = () => {
    updateUser?.(formData);
    showToast?.('Profile updated successfully!');
  };

  const handleTripClick = (id) => {
    setSelectedTripId?.(id);
    navigate?.('/trip-details'); // Or setCurrentScreen('Screen2') depending on routing
  };

  const dummyTrips = [
    { id: '1', name: 'Summer in Kyoto', destination: 'Kyoto, Japan', dates: 'Oct 12 - Oct 18', budget: '$2,400', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80', status: 'Preferred' },
    { id: '2', name: 'Swiss Alps Hiking', destination: 'Zermatt, Switzerland', dates: 'Dec 05 - Dec 12', budget: '$3,100', image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800&q=80', status: 'Previous' }
  ];

  return (
    <div style={{ backgroundColor: '#F5F3EF', minHeight: '100vh', padding: '40px', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* LEFT SIDEBAR */}
        <div style={{ width: '300px', backgroundColor: '#fff', borderRadius: '24px', padding: '32px 24px', position: 'sticky', top: '40px', flexShrink: 0, textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <img src={user?.avatar || 'https://i.pravatar.cc/150?img=47'} alt="Avatar" style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 16px' }} />
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.6rem', fontWeight: 'bold', color: '#1A1A2E', margin: '0 0 8px' }}>{formData.fullName}</h2>
          <p style={{ color: '#6B7280', margin: '0 0 16px', fontSize: '0.9rem' }}>{formData.email}</p>
          <div style={{ backgroundColor: '#E85D26', color: '#fff', padding: '4px 12px', borderRadius: '20px', display: 'inline-block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '24px' }}>Pro Traveler</div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px', gap: '8px' }}>
            <div style={{ backgroundColor: '#F9FAFB', padding: '12px 8px', borderRadius: '12px', flex: 1 }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1A1A2E' }}>12</div>
              <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>Trips</div>
            </div>
            <div style={{ backgroundColor: '#F9FAFB', padding: '12px 8px', borderRadius: '12px', flex: 1 }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1A1A2E' }}>7</div>
              <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>Countries</div>
            </div>
            <div style={{ backgroundColor: '#F9FAFB', padding: '12px 8px', borderRadius: '12px', flex: 1 }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1A1A2E' }}>42</div>
              <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>Days</div>
            </div>
          </div>

          <button style={{ width: '100%', padding: '12px', border: '1px solid #E5E7EB', backgroundColor: '#fff', color: '#1A1A2E', borderRadius: '12px', fontWeight: '600', cursor: 'pointer' }}>Edit Profile</button>
        </div>

        {/* RIGHT CONTENT */}
        <div style={{ flex: 1, backgroundColor: '#fff', borderRadius: '24px', padding: '32px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', minHeight: '600px' }}>
          
          {/* TABS */}
          <div style={{ display: 'flex', gap: '32px', borderBottom: '1px solid #E5E7EB', marginBottom: '32px' }}>
            {['Profile Details', 'My Trips', 'Settings'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{ 
                  background: 'none', border: 'none', padding: '0 0 12px 0', fontSize: '1rem', fontWeight: '600', cursor: 'pointer',
                  color: activeTab === tab ? '#E85D26' : '#6B7280',
                  borderBottom: activeTab === tab ? '3px solid #E85D26' : '3px solid transparent'
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* TAB CONTENT */}
          {activeTab === 'Profile Details' && (
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1A1A2E', marginBottom: '24px' }}>Personal Information</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#4B5563', fontSize: '0.9rem', fontWeight: '500' }}>Full Name</label>
                  <input type="text" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #E5E7EB', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#4B5563', fontSize: '0.9rem', fontWeight: '500' }}>Email Address</label>
                  <input type="email" value={formData.email} disabled style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #E5E7EB', boxSizing: 'border-box', backgroundColor: '#F3F4F6', color: '#9CA3AF' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#4B5563', fontSize: '0.9rem', fontWeight: '500' }}>Phone Number</label>
                  <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #E5E7EB', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#4B5563', fontSize: '0.9rem', fontWeight: '500' }}>City</label>
                  <input type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #E5E7EB', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#4B5563', fontSize: '0.9rem', fontWeight: '500' }}>Country</label>
                  <input type="text" value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #E5E7EB', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#4B5563', fontSize: '0.9rem', fontWeight: '500' }}>Currency</label>
                  <select value={formData.currency} onChange={e => setFormData({...formData, currency: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #E5E7EB', boxSizing: 'border-box' }}>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="INR">INR (₹)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>
              </div>
              <button onClick={handleSaveProfile} style={{ backgroundColor: '#1A1A2E', color: '#fff', padding: '12px 24px', borderRadius: '12px', border: 'none', fontWeight: '600', cursor: 'pointer' }}>Save Changes</button>
            </div>
          )}

          {activeTab === 'My Trips' && (
            <div>
              <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                {['Preferred', 'Previous'].map(sub => (
                  <button 
                    key={sub}
                    onClick={() => setTripSubTab(sub)}
                    style={{
                      padding: '8px 16px', borderRadius: '20px', border: 'none', fontWeight: '600', cursor: 'pointer',
                      backgroundColor: tripSubTab === sub ? '#1A1A2E' : '#F3F4F6',
                      color: tripSubTab === sub ? '#fff' : '#4B5563'
                    }}
                  >
                    {sub}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {dummyTrips.filter(t => t.status === tripSubTab).map(trip => (
                  <div key={trip.id} style={{ display: 'flex', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid #E5E7EB' }}>
                    <img src={trip.image} alt={trip.name} style={{ width: '80px', height: '80px', borderRadius: '12px', objectFit: 'cover', marginRight: '16px' }} />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 4px', fontSize: '1.1rem', color: '#1A1A2E' }}>{trip.name}</h4>
                      <div style={{ color: '#6B7280', fontSize: '0.9rem', marginBottom: '4px' }}>{trip.destination}</div>
                      <div style={{ color: '#9CA3AF', fontSize: '0.8rem' }}>{trip.dates}</div>
                    </div>
                    <div style={{ textAlign: 'right', marginRight: '24px' }}>
                      <div style={{ fontWeight: 'bold', color: '#1A1A2E', fontSize: '1.1rem' }}>{trip.budget}</div>
                      <div style={{ color: '#6B7280', fontSize: '0.8rem' }}>Total</div>
                    </div>
                    <button onClick={() => handleTripClick(trip.id)} style={{ padding: '8px 16px', backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', color: '#1A1A2E' }}>View</button>
                  </div>
                ))}
                {dummyTrips.filter(t => t.status === tripSubTab).length === 0 && (
                  <div style={{ color: '#6B7280', padding: '24px 0' }}>No trips found in this category.</div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'Settings' && (
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1A1A2E', marginBottom: '24px' }}>Change Password</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px', marginBottom: '40px' }}>
                <input type="password" placeholder="Current Password" style={{ padding: '12px', borderRadius: '12px', border: '1px solid #E5E7EB' }} />
                <input type="password" placeholder="New Password" style={{ padding: '12px', borderRadius: '12px', border: '1px solid #E5E7EB' }} />
                <input type="password" placeholder="Confirm New Password" style={{ padding: '12px', borderRadius: '12px', border: '1px solid #E5E7EB' }} />
                <button style={{ backgroundColor: '#1A1A2E', color: '#fff', padding: '12px', borderRadius: '12px', border: 'none', fontWeight: '600', cursor: 'pointer', width: 'fit-content' }}>Update Password</button>
              </div>

              <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1A1A2E', marginBottom: '16px' }}>Notifications</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
                {['Email updates on trip status', 'Promotional offers', 'Community mentions'].map((notif, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '400px' }}>
                    <span style={{ color: '#4B5563' }}>{notif}</span>
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                      <input type="checkbox" defaultChecked={i !== 1} style={{ width: '18px', height: '18px', accentColor: '#E85D26' }} />
                    </label>
                  </div>
                ))}
              </div>

              <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#DC2626', marginBottom: '16px' }}>Danger Zone</h3>
              <p style={{ color: '#6B7280', marginBottom: '16px', fontSize: '0.9rem' }}>Once you delete your account, there is no going back. Please be certain.</p>
              <button style={{ backgroundColor: '#FEF2F2', color: '#DC2626', border: '1px solid #F87171', padding: '12px 24px', borderRadius: '12px', fontWeight: '600', cursor: 'pointer' }}>Delete Account</button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
