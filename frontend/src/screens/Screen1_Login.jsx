import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, Loader, Compass } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import { useApp } from '../context/AppContext';

const HERO_IMAGE = 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80';

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } }
};
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

export const Screen1_Login = () => {
  const { showToast, loginUser, googleLoginUser, checkEmailExist, setPrefilledEmail } = useApp();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [emailChecked, setEmailChecked] = useState(false);

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

  const handleCheckEmail = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address.');
      return;
    }
    setIsCheckingEmail(true);
    const exists = await checkEmailExist(email);
    setIsCheckingEmail(false);
    if (!exists) {
      setPrefilledEmail(email);
      showToast('No account found. Redirecting to registration...');
      navigate('/register');
    } else {
      setEmailChecked(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter your email and password.');
      return;
    }
    setIsSubmitting(true);
    const result = await loginUser(email, password);
    setIsSubmitting(false);
    if (!result.success) {
      const exists = await checkEmailExist(email);
      if (!exists) {
        setPrefilledEmail(email);
        navigate('/register');
      }
    }
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
          src={HERO_IMAGE}
          alt="Udaipur, India — City of Lakes"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          initial={{ scale: 1.06 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(14,14,12,0.72) 0%, rgba(14,14,12,0.2) 50%, transparent 100%)'
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
            ✦ Wanderly
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
            YOUR NEXT<br />JOURNEY<br />STARTS HERE.
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, maxWidth: 300 }}>
            Every great adventure begins with a single destination.
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
            <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>Udaipur, India</span>
          </div>
        </div>
      </div>

      {/* ─── Right: Auth Panel ─────────────────────────────── */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 'clamp(40px, 6vw, 80px) clamp(32px, 5vw, 64px)',
        overflowY: 'auto'
      }}>
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          style={{ maxWidth: 400, width: '100%', margin: '0 auto' }}
        >
          {/* Header */}
          <motion.div variants={fadeUp} style={{ marginBottom: 40 }}>
            <p style={{
              fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.16em',
              textTransform: 'uppercase', color: '#c8622a', marginBottom: 12
            }}>
              ✦ Sign In
            </p>
            <h1 style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: '#1a1714',
              lineHeight: 1.05,
              marginBottom: 10
            }}>
              Welcome back.
            </h1>
            <p style={{ fontSize: '0.9rem', color: '#7a7065', lineHeight: 1.6 }}>
              Continue planning your next adventure.
            </p>
          </motion.div>

          {/* Form */}
          <motion.form variants={fadeUp} onSubmit={emailChecked ? handleSubmit : handleCheckEmail}>
            {/* Email */}
            <div style={{ marginBottom: 20 }}>
              <label style={{
                display: 'block', fontSize: '0.78rem', fontWeight: 700,
                letterSpacing: '0.05em', color: '#1a1714', marginBottom: 8,
                textTransform: 'uppercase'
              }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setEmailChecked(false); }}
                placeholder="Enter your email"
                required
                autoComplete="email"
                style={{
                  width: '100%', padding: '14px 16px',
                  fontSize: '0.95rem', color: '#1a1714',
                  background: '#f3ede4',
                  border: '1.5px solid transparent',
                  borderRadius: 6,
                  outline: 'none',
                  transition: 'border-color 0.2s ease, background 0.2s ease',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box'
                }}
                onFocus={e => { e.target.style.borderColor = '#c8622a'; e.target.style.background = '#fff'; }}
                onBlur={e => { e.target.style.borderColor = 'transparent'; e.target.style.background = '#f3ede4'; }}
              />
            </div>

            {/* Password — only shown after email is verified */}
            {emailChecked && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                style={{ marginBottom: 20 }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.05em', color: '#1a1714', textTransform: 'uppercase' }}>
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => showToast('Password reset link sent to your email.')}
                    style={{ fontSize: '0.78rem', color: '#c8622a', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  >
                    Forgot password?
                  </button>
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                    autoFocus
                    style={{
                      width: '100%', padding: '14px 44px 14px 16px',
                      fontSize: '0.95rem', color: '#1a1714',
                      background: '#f3ede4',
                      border: '1.5px solid transparent',
                      borderRadius: 6,
                      outline: 'none',
                      transition: 'border-color 0.2s ease, background 0.2s ease',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box'
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
              </motion.div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting || isCheckingEmail}
              style={{
                width: '100%',
                padding: '15px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                background: (isSubmitting || isCheckingEmail) ? '#d4845a' : '#c8622a',
                color: '#ffffff',
                border: 'none',
                borderRadius: 6,
                fontSize: '0.9rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                cursor: (isSubmitting || isCheckingEmail) ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s ease, transform 0.2s ease',
                fontFamily: 'inherit',
                marginBottom: 24
              }}
              onMouseEnter={e => { if (!isSubmitting && !isCheckingEmail) e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              {isSubmitting || isCheckingEmail
                ? <><Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> {isCheckingEmail ? 'Checking...' : 'Signing in...'}</>
                : <>{emailChecked ? 'Sign In' : 'Continue'} <ArrowRight size={16} /></>
              }
            </button>
          </motion.form>

          {/* Divider */}
          <motion.div variants={fadeUp} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(26,23,20,0.1)' }} />
            <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#7a7065', letterSpacing: '0.08em', textTransform: 'uppercase' }}>or</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(26,23,20,0.1)' }} />
          </motion.div>

          {/* Social */}
          <motion.div variants={fadeUp} style={{ display: 'flex', gap: 12, marginBottom: 36 }}>
            {[
              { label: 'Google', src: 'https://www.svgrepo.com/show/475656/google-color.svg', action: () => handleGoogleLogin() },
              { label: 'Apple', src: 'https://www.svgrepo.com/show/511330/apple-173.svg', action: () => showToast('Apple authentication is not configured.') },
            ].map(({ label, src, action }) => (
              <button
                key={label}
                type="button"
                onClick={action}
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
                <img src={src} alt={label} style={{ width: 16, height: 16 }} />
                {label}
              </button>
            ))}
          </motion.div>

          {/* Register link */}
          <motion.p variants={fadeUp} style={{ textAlign: 'center', fontSize: '0.88rem', color: '#7a7065' }}>
            Don't have an account?{' '}
            <Link
              to="/register"
              style={{ color: '#c8622a', fontWeight: 700, textDecoration: 'none' }}
              onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
              onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
            >
              Create an account →
            </Link>
          </motion.p>
        </motion.div>
      </div>

      {/* ─── Mobile: image hides on small screens ─── */}
      <style>{`
        @media (max-width: 768px) {
          .login-grid { grid-template-columns: 1fr !important; }
          .login-image-panel { display: none !important; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};
