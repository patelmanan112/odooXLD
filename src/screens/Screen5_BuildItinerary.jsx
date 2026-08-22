import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Clock, DollarSign, Calendar, MapPin, GripVertical, CheckCircle2, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Screen5_BuildItinerary = () => {
  const { selectedTrip, setCurrentScreen, showToast } = useApp();
  
  const [sections, setSections] = useState([
    {
      id: 'sec-1',
      title: 'Section 1: Mumbai to Tokyo Transit & Hotel Check-in',
      description: 'All the necessary information about this section. Travel, hotel booking, and initial arrival activities.',
      dateRange: '12 Oct to 14 Oct 2026',
      sectionBudget: 42000,
      activities: [
        { id: 'a1', time: '09:00 AM', name: 'Flight AI-306 (Mumbai -> Tokyo Haneda)', cost: 30000, category: 'Flight' },
        { id: 'a2', time: '02:00 PM', name: 'Hotel Check-in at Shibuya Sky Hotel', cost: 10000, category: 'Hotel' },
        { id: 'a3', time: '07:00 PM', name: 'Evening Ramen Tour at Ichiran', cost: 2000, category: 'Food' }
      ]
    },
    {
      id: 'sec-2',
      title: 'Section 2: Kyoto Cultural & Temple Tour',
      description: 'Historical shrines, tea ceremonies, and bamboo forest exploration in Kyoto.',
      dateRange: '15 Oct to 17 Oct 2026',
      sectionBudget: 25000,
      activities: [
        { id: 'b1', time: '08:00 AM', name: 'Shinkansen Bullet Train to Kyoto', cost: 7000, category: 'Transport' },
        { id: 'b2', time: '11:00 AM', name: 'Fushimi Inari Shrine Hike', cost: 0, category: 'Sightseeing' },
        { id: 'b3', time: '03:00 PM', name: 'Geisha District & Tea Ceremony', cost: 5000, category: 'Culture' }
      ]
    },
    {
      id: 'sec-3',
      title: 'Section 3: Osaka Food Fest & Departure',
      description: 'Street food in Dotonbori, souvenir shopping, and return flight.',
      dateRange: '18 Oct to 19 Oct 2026',
      sectionBudget: 15000,
      activities: [
        { id: 'c1', time: '10:00 AM', name: 'Dotonbori Street Food Walking Tour', cost: 3000, category: 'Food' },
        { id: 'c2', time: '06:00 PM', name: 'Return Flight to Mumbai', cost: 12000, category: 'Flight' }
      ]
    }
  ]);

  const addActivity = (secId) => {
    setSections(sections.map(sec => {
      if (sec.id === secId) {
        return {
          ...sec,
          activities: [
            ...sec.activities,
            {
              id: `act-${Date.now()}`,
              time: '12:00 PM',
              name: 'New Custom Activity / Sightseeing',
              cost: 1500,
              category: 'Activity'
            }
          ]
        };
      }
      return sec;
    }));
    showToast('Activity added to section!');
  };

  const removeActivity = (secId, actId) => {
    setSections(sections.map(sec => {
      if (sec.id === secId) {
        return {
          ...sec,
          activities: sec.activities.filter(a => a.id !== actId)
        };
      }
      return sec;
    }));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35 }}
      style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}
    >
      {/* Header Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span className="badge badge-emerald">Screen 5: Build Itinerary</span>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2rem', fontWeight: 800, color: '#064e3b', marginTop: '4px' }}>
            Build Itinerary Screen 🛠️
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            {selectedTrip.name} • {selectedTrip.destination}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => setCurrentScreen(8)} className="btn btn-secondary">
            + Search Activities
          </button>
          <button onClick={() => { showToast('Itinerary saved!'); setCurrentScreen(9); }} className="btn btn-primary">
            <span>View Final Itinerary & Budget</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* Sections List */}
      {sections.map((sec, secIdx) => (
        <div key={sec.id} className="glass-card" style={{ padding: '28px', backgroundColor: '#ffffff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#064e3b' }}>{sec.title}</h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>{sec.description}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className="badge badge-gold" style={{ fontSize: '0.82rem', padding: '6px 12px' }}>
                Budget: ₹{sec.sectionBudget.toLocaleString()}
              </span>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={14} /> {sec.dateRange}
              </div>
            </div>
          </div>

          {/* Activity Cards in this section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
            {sec.activities.map((act) => (
              <div 
                key={act.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '12px 16px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '14px',
                  border: '1px solid #e2e8f0'
                }}
              >
                <GripVertical size={18} color="#cbd5e1" style={{ cursor: 'grab' }} />
                <div style={{ width: '80px', fontSize: '0.82rem', fontWeight: 700, color: '#047857', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={14} /> {act.time}
                </div>
                <div style={{ flex: 1, fontWeight: 600, fontSize: '0.9rem', color: '#0f172a' }}>
                  {act.name}
                </div>
                <span className="badge badge-emerald" style={{ fontSize: '0.74rem' }}>{act.category}</span>
                <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a', width: '90px', textAlign: 'right' }}>
                  ₹{act.cost.toLocaleString()}
                </span>
                <button 
                  onClick={() => removeActivity(sec.id, act.id)}
                  style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Add activity to section button */}
          <button 
            onClick={() => addActivity(sec.id)}
            style={{
              width: '100%',
              marginTop: '16px',
              padding: '10px',
              borderRadius: '12px',
              border: '2px dashed #a7f3d0',
              backgroundColor: '#ecfdf5',
              color: '#047857',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Plus size={16} /> Add Activity to this Section
          </button>
        </div>
      ))}
    </motion.div>
  );
};
