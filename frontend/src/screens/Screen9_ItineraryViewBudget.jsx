import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, Calendar, AlertTriangle, PieChart, Plane, Building2, UtensilsCrossed, Compass, Bus, MapPin, ArrowRight, Share2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Screen9_ItineraryViewBudget = () => {
  const { selectedTrip, setCurrentScreen, showToast } = useApp();

  const totalSpent = Object.values(selectedTrip.categoryBreakdown).reduce((a, b) => a + b, 0);
  const budgetRatio = Math.round((totalSpent / selectedTrip.estimatedBudget) * 100);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', maxWidth: '100%', overflowX: 'hidden' }}
    >
      {/* Title Bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
        <div>
          <span className="badge badge-emerald">Screen 9: Itinerary View & Budget Breakdown</span>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.8rem', fontWeight: 800, color: '#064e3b', marginTop: '4px' }}>
            {selectedTrip.name} 🗺️
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.86rem' }}>
            {selectedTrip.destination} • {selectedTrip.dates} ({selectedTrip.durationDays} Days)
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button onClick={() => { showToast('Public share link copied to clipboard!'); }} className="btn btn-outline" style={{ fontSize: '0.82rem' }}>
            <Share2 size={15} /> Share
          </button>
          <button onClick={() => setCurrentScreen(5)} className="btn btn-secondary" style={{ fontSize: '0.82rem' }}>
            Edit Itinerary
          </button>
        </div>
      </div>

      {/* Financial Overview & Alert Banner */}
      <div className="budget-grid-main">
        
        {/* Day-by-Day Detailed Itinerary Layout */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', minWidth: 0 }}>
          <div className="glass-card" style={{ padding: '20px', backgroundColor: '#ffffff' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#064e3b', marginBottom: '16px' }}>
              Day-by-Day Travel Schedule
            </h3>

            {selectedTrip.days.map((day) => (
              <div key={day.dayNum} style={{ marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="badge badge-emerald" style={{ padding: '5px 10px', fontSize: '0.78rem' }}>
                      Day {day.dayNum} • {day.date}
                    </span>
                    <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>{day.title}</h4>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {day.activities.map((act, idx) => (
                    <div 
                      key={idx}
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '8px',
                        padding: '10px 12px',
                        borderRadius: '12px',
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '180px' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.78rem', color: '#047857', minWidth: '55px' }}>{act.time}</span>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.86rem', color: '#0f172a' }}>{act.title}</div>
                          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Category: {act.category}</div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span className={`badge ${act.level === 'High' ? 'badge-gold' : 'badge-emerald'}`} style={{ fontSize: '0.72rem' }}>
                          {act.level} Effort
                        </span>
                        <span style={{ fontWeight: 800, fontSize: '0.88rem', color: '#0f172a' }}>
                          ₹{act.cost.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Analytics & Budget Breakdown Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', minWidth: 0 }}>
          
          {/* Budget Meter */}
          <div className="glass-card" style={{ padding: '20px', backgroundColor: '#ffffff' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#064e3b', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Wallet size={16} /> Financial Breakdown
            </h3>

            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#064e3b' }}>
                ₹{totalSpent.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                Total Allocated / ₹{selectedTrip.estimatedBudget.toLocaleString()}
              </div>

              {/* Progress bar */}
              <div style={{ width: '100%', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '9999px', marginTop: '10px', overflow: 'hidden' }}>
                <div style={{ width: `${budgetRatio}%`, height: '100%', backgroundColor: budgetRatio > 90 ? '#ef4444' : '#064e3b', borderRadius: '9999px' }}></div>
              </div>
              <div style={{ fontSize: '0.74rem', fontWeight: 700, color: budgetRatio > 90 ? '#ef4444' : '#047857', marginTop: '6px' }}>
                {budgetRatio}% of Total Budget Planned
              </div>
            </div>

            {/* Overbudget Warning Alert if applicable */}
            {budgetRatio > 100 && (
              <div style={{ padding: '10px', borderRadius: '12px', backgroundColor: '#fef2f2', border: '1px solid #fca5a5', color: '#b91c1c', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <AlertTriangle size={16} />
                <span><strong>Overbudget Alert:</strong> Exceeds budget by ₹{(totalSpent - selectedTrip.estimatedBudget).toLocaleString()}!</span>
              </div>
            )}

            {/* Category distribution */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.82rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}><Plane size={14} color="#3b82f6" /> Flights</span>
                <strong style={{ color: '#0f172a' }}>₹{selectedTrip.categoryBreakdown.flights.toLocaleString()}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}><Building2 size={14} color="#6366f1" /> Hotels</span>
                <strong style={{ color: '#0f172a' }}>₹{selectedTrip.categoryBreakdown.hotels.toLocaleString()}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}><UtensilsCrossed size={14} color="#10b981" /> Food</span>
                <strong style={{ color: '#0f172a' }}>₹{selectedTrip.categoryBreakdown.food.toLocaleString()}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}><Compass size={14} color="#f59e0b" /> Activities</span>
                <strong style={{ color: '#0f172a' }}>₹{selectedTrip.categoryBreakdown.activities.toLocaleString()}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}><Bus size={14} color="#8b5cf6" /> Transport</span>
                <strong style={{ color: '#0f172a' }}>₹{selectedTrip.categoryBreakdown.transport.toLocaleString()}</strong>
              </div>
            </div>

            <div style={{ marginTop: '16px', padding: '10px', borderRadius: '12px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', textAlign: 'center', fontSize: '0.78rem', color: '#475569' }}>
              Average Cost Per Day: <strong>₹{Math.round(totalSpent / (selectedTrip.durationDays || 1)).toLocaleString()} / Day</strong>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
