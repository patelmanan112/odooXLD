import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, Plane, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Screen1_Login = () => {
  const { setCurrentScreen, showToast } = useApp();
  const [email, setEmail] = useState('khush.patel@wanderly.com');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    showToast('Logged in successfully! Welcome back.');
    setCurrentScreen(3); // Go to Dashboard
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35 }}
      style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <div className="glass-card" style={{
        width: '100%',
        maxWidth: '460px',
        padding: '40px 36px',
        backgroundColor: '#ffffff',
        borderRadius: '24px'
      }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            backgroundColor: '#064e3b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            margin: '0 auto 16px auto',
            boxShadow: '0 8px 24px rgba(6, 78, 59, 0.25)'
          }}>
            <Plane size={30} />
          </div>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.8rem', fontWeight: 800, color: '#064e3b' }}>
            Welcome Back to Wanderly
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '6px' }}>
            Enter your credentials to manage your travel itineraries
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="email" 
                className="input-field" 
                style={{ paddingLeft: '42px' }}
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="input-label">Password</label>
              <a href="#forgot" onClick={(e) => { e.preventDefault(); showToast('Password reset link sent to your email.'); }} style={{ fontSize: '0.8rem', color: '#047857', fontWeight: 600, textDecoration: 'none' }}>
                Forgot Password?
              </a>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type={showPassword ? 'text' : 'password'} 
                className="input-field" 
                style={{ paddingLeft: '42px', paddingRight: '42px' }}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
            <input type="checkbox" id="remember" defaultChecked style={{ accentColor: '#064e3b', width: '16px', height: '16px' }} />
            <label htmlFor="remember" style={{ fontSize: '0.85rem', color: '#475569' }}>Remember me on this device</label>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px', fontSize: '1rem', borderRadius: '14px' }}>
            <span>Sign In</span>
            <ArrowRight size={18} />
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '24px 0' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }}></div>
          <span style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase' }}>Or continue with</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }}></div>
        </div>

        {/* Social Logins */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-outline" style={{ flex: 1, borderRadius: '12px', padding: '10px' }} onClick={() => setCurrentScreen(3)}>
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" style={{ width: '18px', height: '18px' }} />
            Google
          </button>
          <button className="btn btn-outline" style={{ flex: 1, borderRadius: '12px', padding: '10px' }} onClick={() => setCurrentScreen(3)}>
            <img src="https://www.svgrepo.com/show/511330/apple-173.svg" alt="Apple" style={{ width: '18px', height: '18px' }} />
            Apple
          </button>
        </div>

        {/* Footer Toggle */}
        <div style={{ textAlign: 'center', marginTop: '28px', fontSize: '0.88rem', color: '#64748b' }}>
          Don't have an account?{' '}
          <button 
            onClick={() => setCurrentScreen(2)}
            style={{ color: '#064e3b', fontWeight: 700, border: 'none', background: 'none', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Create an Account
          </button>
        </div>
      </div>
    </motion.div>
  );
};
