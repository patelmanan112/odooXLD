import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Phone, MapPin, Globe, Camera, ArrowRight, Check, Loader } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Screen2_Register = () => {
  const { setCurrentScreen, showToast, signupUser, prefilledEmail } = useApp();
  const [formData, setFormData] = useState({
    username: 'manan_patel',
    firstName: 'Manan',
    lastName: 'Patel',
    email: prefilledEmail || 'manan@example.com',
    phone: '+91 98765 43210',
    city: 'Mumbai',
    country: 'India',
    password: 'password123',
    confirmPassword: 'password123',
      avatarUrl: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedStyles, setSelectedStyles] = useState(['Adventure', 'Culture']);

  useEffect(() => {
    if (prefilledEmail) {
      setFormData(prev => ({ ...prev, email: prefilledEmail }));
    }
  }, [prefilledEmail]);

  const travelStyles = ['Backpacker', 'Luxury', 'Adventure', 'Culture', 'Family', 'Solo', 'Budget'];

  
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.size > 1024 * 1024) {
      showToast('Image must be less than 1MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, avatarUrl: reader.result }));
    };
    reader.readAsDataURL(file);
  };


  const toggleStyle = (style) => {
    setSelectedStyles(prev => 
      prev.includes(style) ? prev.filter(s => s !== style) : [...prev, style]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      showToast('Passwords do not match. Please re-enter.');
      return;
    }

    if (formData.password.length < 6) {
      showToast('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);
    const fullName = `${formData.firstName} ${formData.lastName}`.trim();
    const result = await signupUser({ 
        name: fullName, 
        email: formData.email, 
        password: formData.password,
        avatarUrl: formData.avatarUrl,
        phone: formData.phone,
        city: formData.city,
        country: formData.country
      });
    setIsSubmitting(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35 }}
      style={{
        maxWidth: '780px',
        margin: '0 auto',
        padding: '20px'
      }}
    >
      <div className="glass-card" style={{ padding: '40px', backgroundColor: '#ffffff', borderRadius: '24px' }}>
        <div style={{ textTransform: 'uppercase', fontSize: '0.78rem', fontWeight: 800, color: '#047857', letterSpacing: '1px', marginBottom: '4px' }}>
          Screen 2: User Registration
        </div>
        <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2rem', fontWeight: 800, color: '#064e3b', marginBottom: '8px' }}>
          Join Wanderly Travel Platform ✈️
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.92rem', marginBottom: '32px' }}>
          Create your personalized travel planner profile to start organizing multi-city itineraries and budget forecasts.
        </p>

        <form onSubmit={handleSubmit}>
          {/* Avatar Upload Banner */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            padding: '20px',
            borderRadius: '16px',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            marginBottom: '28px'
          }}>
            <div style={{ position: 'relative' }}>
              <img 
                src={formData.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"} 
                alt="Profile Preview" 
                style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #064e3b' }}
              />
              <input type="file" accept="image/*" onChange={handleImageUpload} style={{ opacity: 0, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', cursor: 'pointer', zIndex: 10 }} />
              <button 
                type="button"
                onClick={() => {}}
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  backgroundColor: '#064e3b',
                  color: '#ffffff',
                  border: '2px solid #ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <Camera size={14} />
              </button>
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>Profile Avatar</div>
              <div style={{ fontSize: '0.82rem', color: '#64748b' }}>PNG, JPG or WEBP (Max 5MB)</div>
            </div>
          </div>

          {/* Form Fields Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px 20px' }}>
            <div className="input-group">
              <label className="input-label">Username</label>
              <div style={{ position: 'relative' }}>
                <User size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="text" 
                  className="input-field" 
                  style={{ paddingLeft: '42px' }}
                  value={formData.username}
                  onChange={e => setFormData({ ...formData, username: e.target.value })}
                  required 
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="email" 
                  className="input-field" 
                  style={{ paddingLeft: '42px' }}
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  required 
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">First Name</label>
              <input 
                type="text" 
                className="input-field" 
                value={formData.firstName}
                onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                required 
              />
            </div>

            <div className="input-group">
              <label className="input-label">Last Name</label>
              <input 
                type="text" 
                className="input-field" 
                value={formData.lastName}
                onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                required 
              />
            </div>

            <div className="input-group">
              <label className="input-label">Phone Number</label>
              <div style={{ position: 'relative' }}>
                <Phone size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="text" 
                  className="input-field" 
                  style={{ paddingLeft: '42px' }}
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  required 
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">City</label>
              <div style={{ position: 'relative' }}>
                <MapPin size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="text" 
                  className="input-field" 
                  style={{ paddingLeft: '42px' }}
                  value={formData.city}
                  onChange={e => setFormData({ ...formData, city: e.target.value })}
                  required 
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Country</label>
              <div style={{ position: 'relative' }}>
                <Globe size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="text" 
                  className="input-field" 
                  style={{ paddingLeft: '42px' }}
                  value={formData.country}
                  onChange={e => setFormData({ ...formData, country: e.target.value })}
                  required 
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="password" 
                  className="input-field" 
                  style={{ paddingLeft: '42px' }}
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  required 
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="password" 
                  className="input-field" 
                  style={{ paddingLeft: '42px' }}
                  value={formData.confirmPassword}
                  onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required 
                />
              </div>
            </div>
          </div>

          {/* Travel Preferences */}
          <div style={{ marginTop: '20px', marginBottom: '28px' }}>
            <label className="input-label" style={{ marginBottom: '10px', display: 'block' }}>
              Travel Style Preferences (Select all that apply)
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {travelStyles.map(style => {
                const isSelected = selectedStyles.includes(style);
                return (
                  <button
                    key={style}
                    type="button"
                    onClick={() => toggleStyle(style)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '9999px',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      backgroundColor: isSelected ? '#064e3b' : '#f1f5f9',
                      color: isSelected ? '#ffffff' : '#475569',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {isSelected && <Check size={14} />}
                    {style}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '32px' }}>
            <button 
              type="button"
              onClick={() => setCurrentScreen(1)}
              className="btn btn-outline"
            >
              Back to Login
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ padding: '12px 28px' }}>
              <span>{isSubmitting ? 'Registering...' : 'Complete Registration'}</span>
              {isSubmitting ? <Loader className="spin" size={18} /> : <ArrowRight size={18} />}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};
