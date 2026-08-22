import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, Loader, Compass, Camera, Upload } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import { useApp } from '../context/AppContext';

const REGISTER_HERO_IMAGE = 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80';

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } }
};
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

export const Screen2_Register = () => {
  const { showToast, signupUser, googleLoginUser, prefilledEmail } = useApp();
  const navigate = useNavigate();

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        showToast('Verifying Google credentials...');
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
        });
        const googleUser = await res.json();
        await googleLoginUser({
          email: googleUser.email,
          name: googleUser.name,
          avatarUrl: googleUser.picture
        });
      } catch (err) {
        showToast('Failed to fetch Google user profile.');
      }
    },
    onError: () => {
      showToast('Google Sign-In was cancelled or failed.');
    }
  });

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: prefilledEmail || '',
    phone: '',
    city: '',
    country: '',
    password: '',
    confirmPassword: '',
    avatarUrl: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (prefilledEmail) {
      setFormData(prev => ({ ...prev, email: prefilledEmail }));
    }
  }, [prefilledEmail]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      showToast('Please fill in all required fields.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      showToast('Passwords do not match. Please re-enter.');
      return;
    }

    if (formData.password.length < 6) {
      showToast('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);
    const fullName = `${formData.firstName} ${formData.lastName}`.trim() || formData.email.split('@')[0];
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
    <div style={{
      minHeight: '100vh',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      backgroundColor: '#faf8f4',
      fontFamily: "'Plus Jakarta Sans', sans-serif"
    }}>
      {/* ─── Left: Image Panel ─────────────────────────────── */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <motion.img
          src={REGISTER_HERO_IMAGE}
          alt="Goa Beach, India"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          initial={{ scale: 1.06 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(14,14,12,0.78) 0%, rgba(14,14,12,0.25) 50%, transparent 100%)'
        }} />

        {/* Brand mark */}
        <div style={{ position: 'absolute', top: 32, left: 36, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Compass size={18} color="#c8622a" />
          <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
            Wander<span style={{ color: '#c8622a' }}>ly</span>
          </span>
        </div>

        {/* Bottom caption */}
        <div style={{ position: 'absolute', bottom: 44, left: 36, right: 36 }}>
          <p style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginBottom: 10 }}>
            Wanderly Community
          </p>
          <h2 style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: 'clamp(1.8rem, 3.5vw, 3rem)',
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: '-0.03em',
            color: '#ffffff',
            marginBottom: 14
          }}>
            EVERY JOURNEY<br />BEGINS WITH<br />A PLACE.
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, maxWidth: 320 }}>
            Join thousands of travelers shaping itineraries and creating lasting memories.
          </p>

          {/* Location pill */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            marginTop: 20,
            padding: '6px 14px',
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 100,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#c8622a' }} />
            <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>Goa, India</span>
          </div>
        </div>
      </div>

      {/* ─── Right: Auth Panel ─────────────────────────────── */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 'clamp(40px, 5vw, 64px) clamp(32px, 5vw, 64px)',
        overflowY: 'auto'
      }}>
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          style={{ maxWidth: 440, width: '100%', margin: '0 auto' }}
        >
          {/* Header */}
          <motion.div variants={fadeUp} style={{ marginBottom: 28 }}>
            <p style={{
              fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.16em',
              textTransform: 'uppercase', color: '#c8622a', marginBottom: 10
            }}>
              Get Started
            </p>
            <h1 style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: 'clamp(1.6rem, 2.5vw, 2.3rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: '#1a1714',
              lineHeight: 1.05,
              marginBottom: 8
            }}>
              Create your account.
            </h1>
            <p style={{ fontSize: '0.88rem', color: '#7a7065', lineHeight: 1.5 }}>
              Start planning and building your dream itineraries.
            </p>
          </motion.div>

          {/* Form */}
          <motion.form variants={fadeUp} onSubmit={handleSubmit}>
            {/* Avatar Upload Selection */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
              <div style={{ position: 'relative', width: 56, height: 56, borderRadius: '50%', overflow: 'hidden', background: '#f3ede4', border: '1.5px solid rgba(26,23,20,0.1)', flexShrink: 0 }}>
                <img
                  src={formData.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
                  alt="Profile Avatar"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ opacity: 0, position: 'absolute', inset: 0, cursor: 'pointer', zIndex: 10 }}
                />
              </div>
              <div>
                <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1a1714', marginBottom: 2 }}>Profile Photo (Optional)</p>
                <p style={{ fontSize: '0.72rem', color: '#7a7065' }}>Click circle to upload image up to 1MB</p>
              </div>
            </div>

            {/* First Name & Last Name */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', color: '#1a1714', marginBottom: 6, textTransform: 'uppercase' }}>
                  First Name
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="Enter first name"
                  style={{
                    width: '100%', padding: '12px 14px',
                    fontSize: '0.9rem', color: '#1a1714',
                    background: '#f3ede4', border: '1.5px solid transparent',
                    borderRadius: 6, outline: 'none', transition: 'all 0.2s', fontFamily: 'inherit', boxSizing: 'border-box'
                  }}
                  onFocus={e => { e.target.style.borderColor = '#c8622a'; e.target.style.background = '#fff'; }}
                  onBlur={e => { e.target.style.borderColor = 'transparent'; e.target.style.background = '#f3ede4'; }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', color: '#1a1714', marginBottom: 6, textTransform: 'uppercase' }}>
                  Last Name
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Enter last name"
                  style={{
                    width: '100%', padding: '12px 14px',
                    fontSize: '0.9rem', color: '#1a1714',
                    background: '#f3ede4', border: '1.5px solid transparent',
                    borderRadius: 6, outline: 'none', transition: 'all 0.2s', fontFamily: 'inherit', boxSizing: 'border-box'
                  }}
                  onFocus={e => { e.target.style.borderColor = '#c8622a'; e.target.style.background = '#fff'; }}
                  onBlur={e => { e.target.style.borderColor = 'transparent'; e.target.style.background = '#f3ede4'; }}
                />
              </div>
            </div>

            {/* Email */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', color: '#1a1714', marginBottom: 6, textTransform: 'uppercase' }}>
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter your email"
                required
                autoComplete="email"
                style={{
                  width: '100%', padding: '12px 14px',
                  fontSize: '0.9rem', color: '#1a1714',
                  background: '#f3ede4', border: '1.5px solid transparent',
                  borderRadius: 6, outline: 'none', transition: 'all 0.2s', fontFamily: 'inherit', boxSizing: 'border-box'
                }}
                onFocus={e => { e.target.style.borderColor = '#c8622a'; e.target.style.background = '#fff'; }}
                onBlur={e => { e.target.style.borderColor = 'transparent'; e.target.style.background = '#f3ede4'; }}
              />
            </div>

            {/* City & Country */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', color: '#1a1714', marginBottom: 6, textTransform: 'uppercase' }}>
                  City
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={e => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Enter city"
                  style={{
                    width: '100%', padding: '12px 14px',
                    fontSize: '0.9rem', color: '#1a1714',
                    background: '#f3ede4', border: '1.5px solid transparent',
                    borderRadius: 6, outline: 'none', transition: 'all 0.2s', fontFamily: 'inherit', boxSizing: 'border-box'
                  }}
                  onFocus={e => { e.target.style.borderColor = '#c8622a'; e.target.style.background = '#fff'; }}
                  onBlur={e => { e.target.style.borderColor = 'transparent'; e.target.style.background = '#f3ede4'; }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', color: '#1a1714', marginBottom: 6, textTransform: 'uppercase' }}>
                  Country
                </label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={e => setFormData({ ...formData, country: e.target.value })}
                  placeholder="Enter country"
                  style={{
                    width: '100%', padding: '12px 14px',
                    fontSize: '0.9rem', color: '#1a1714',
                    background: '#f3ede4', border: '1.5px solid transparent',
                    borderRadius: 6, outline: 'none', transition: 'all 0.2s', fontFamily: 'inherit', boxSizing: 'border-box'
                  }}
                  onFocus={e => { e.target.style.borderColor = '#c8622a'; e.target.style.background = '#fff'; }}
                  onBlur={e => { e.target.style.borderColor = 'transparent'; e.target.style.background = '#f3ede4'; }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', color: '#1a1714', marginBottom: 6, textTransform: 'uppercase' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Create a password (min. 6 chars)"
                  required
                  autoComplete="new-password"
                  style={{
                    width: '100%', padding: '12px 42px 12px 14px',
                    fontSize: '0.9rem', color: '#1a1714',
                    background: '#f3ede4', border: '1.5px solid transparent',
                    borderRadius: 6, outline: 'none', transition: 'all 0.2s', fontFamily: 'inherit', boxSizing: 'border-box'
                  }}
                  onFocus={e => { e.target.style.borderColor = '#c8622a'; e.target.style.background = '#fff'; }}
                  onBlur={e => { e.target.style.borderColor = 'transparent'; e.target.style.background = '#f3ede4'; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#7a7065', display: 'flex' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', color: '#1a1714', marginBottom: 6, textTransform: 'uppercase' }}>
                Confirm Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Re-enter your password"
                  required
                  autoComplete="new-password"
                  style={{
                    width: '100%', padding: '12px 42px 12px 14px',
                    fontSize: '0.9rem', color: '#1a1714',
                    background: '#f3ede4', border: '1.5px solid transparent',
                    borderRadius: 6, outline: 'none', transition: 'all 0.2s', fontFamily: 'inherit', boxSizing: 'border-box'
                  }}
                  onFocus={e => { e.target.style.borderColor = '#c8622a'; e.target.style.background = '#fff'; }}
                  onBlur={e => { e.target.style.borderColor = 'transparent'; e.target.style.background = '#f3ede4'; }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#7a7065', display: 'flex' }}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '14px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                background: isSubmitting ? '#d4845a' : '#c8622a',
                color: '#ffffff',
                border: 'none',
                borderRadius: 6,
                fontSize: '0.9rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s ease, transform 0.2s ease',
                fontFamily: 'inherit',
                marginBottom: 20
              }}
              onMouseEnter={e => { if (!isSubmitting) e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              {isSubmitting
                ? <><Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> Creating account...</>
                : <>Start Planning <ArrowRight size={16} /></>
              }
            </button>
          </motion.form>

          {/* Divider */}
          <motion.div variants={fadeUp} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(26,23,20,0.1)' }} />
            <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#7a7065', letterSpacing: '0.08em', textTransform: 'uppercase' }}>or sign up with</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(26,23,20,0.1)' }} />
          </motion.div>

          {/* Social */}
          <motion.div variants={fadeUp} style={{ display: 'flex', gap: 12, marginBottom: 28 }}>
            <button
              type="button"
              onClick={() => handleGoogleLogin()}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '12px',
                background: 'transparent',
                border: '1.5px solid rgba(26,23,20,0.12)',
                borderRadius: 6,
                fontSize: '0.85rem', fontWeight: 600, color: '#1a1714',
                cursor: 'pointer', fontFamily: 'inherit',
                transition: 'border-color 0.2s ease'
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#c8622a'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(26,23,20,0.12)'}
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" style={{ width: 16, height: 16 }} />
              Continue with Google
            </button>
          </motion.div>

          {/* Login link */}
          <motion.p variants={fadeUp} style={{ textAlign: 'center', fontSize: '0.88rem', color: '#7a7065' }}>
            Already have an account?{' '}
            <Link
              to="/login"
              style={{ color: '#c8622a', fontWeight: 700, textDecoration: 'none' }}
              onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
              onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
            >
              Log in →
            </Link>
          </motion.p>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};
