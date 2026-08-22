import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Image, Plus, Trash2, Save, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Screen4_CreateTrip = () => {
  const { addTrip, setCurrentScreen, showToast } = useApp();
  const [tripName, setTripName] = useState('Euro Trip 2027 🇪🇺');
  const [destination, setDestination] = useState('Paris, Rome, Barcelona');
  const [startDate, setStartDate] = useState('2027-05-10');
  const [endDate, setEndDate] = useState('2027-05-24');
  const [budget, setBudget] = useState('120000');
  const [description, setDescription] = useState('Exploring historical landmarks, museums, and food markets across Western Europe.');
  const [sections, setSections] = useState([
    { id: 1, name: 'Paris - Louvre & Eiffel Stop', duration: '4 Days', sectionBudget: '40000' },
    { id: 2, name: 'Rome - Colosseum & Vatican Stop', duration: '5 Days', sectionBudget: '45000' },
    { id: 3, name: 'Barcelona - Sagrada Familia Stop', duration: '5 Days', sectionBudget: '35000' }
  ]);

  const addSection = () => {
    setSections([...sections, {
      id: Date.now(),
      name: `New Stop ${sections.length + 1}`,
      duration: '3 Days',
      sectionBudget: '20000'
    }]);
  };

  const removeSection = (id) => {
    setSections(sections.filter(s => s.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTrip = {
      id: `trip-${Date.now()}`,
      name: tripName,
      destination: destination,
      dates: `${startDate} - ${endDate}`,
      durationDays: 14,
      status: 'Upcoming',
      progressPct: 15,
      estimatedBudget: parseInt(budget) || 100000,
      spentBudget: 0,
      coverPhoto: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
      stops: sections.map(s => s.name.split('-')[0].trim()),
      categoryBreakdown: { flights: 40000, hotels: 45000, food: 20000, activities: 10000, transport: 5000 },
      days: []
    };
    addTrip(newTrip);
    setCurrentScreen(5); // Go to Build Itinerary Screen
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35 }}
      style={{ maxWidth: '860px', margin: '0 auto' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <button onClick={() => setCurrentScreen(3)} className="btn btn-outline" style={{ padding: '8px 12px' }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
        <span className="badge badge-emerald">Screen 4: Create Trip</span>
      </div>

      <div className="glass-card" style={{ padding: '36px', backgroundColor: '#ffffff', borderRadius: '24px' }}>
        <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.9rem', fontWeight: 800, color: '#064e3b', marginBottom: '6px' }}>
          Plan a New Trip 🗺️
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '28px' }}>
          Specify your destination, dates, cover photo, and itinerary sections to start planning.
        </p>

        <form onSubmit={handleSubmit}>
          {/* Main Trip Info */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px', marginBottom: '20px' }}>
            <div className="input-group">
              <label className="input-label">Trip Name</label>
              <input 
                type="text" 
                className="input-field" 
                value={tripName} 
                onChange={e => setTripName(e.target.value)} 
                required 
              />
            </div>

            <div className="input-group">
              <label className="input-label">Destination Cities / Places</label>
              <div style={{ position: 'relative' }}>
                <MapPin size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="text" 
                  className="input-field" 
                  style={{ paddingLeft: '42px' }}
                  value={destination} 
                  onChange={e => setDestination(e.target.value)} 
                  required 
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Start Date</label>
              <input 
                type="date" 
                className="input-field" 
                value={startDate} 
                onChange={e => setStartDate(e.target.value)} 
                required 
              />
            </div>

            <div className="input-group">
              <label className="input-label">End Date</label>
              <input 
                type="date" 
                className="input-field" 
                value={endDate} 
                onChange={e => setEndDate(e.target.value)} 
                required 
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Target Budget (₹ INR)</label>
            <input 
              type="number" 
              className="input-field" 
              value={budget} 
              onChange={e => setBudget(e.target.value)} 
              required 
            />
          </div>

          <div className="input-group">
            <label className="input-label">Trip Description & Highlights</label>
            <textarea 
              className="input-field" 
              rows={3} 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
            />
          </div>

          {/* Section Manager (As per Excalidraw Screen 4) */}
          <div style={{ margin: '28px 0', padding: '20px', backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>Itinerary Sections & Stops</h4>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Organize your trip into multi-day city stops</div>
              </div>
              <button 
                type="button" 
                onClick={addSection} 
                className="btn btn-secondary"
                style={{ padding: '8px 14px', fontSize: '0.82rem' }}
              >
                <Plus size={16} /> Add another Section
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {sections.map((sec, idx) => (
                <div 
                  key={sec.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #cbd5e1'
                  }}
                >
                  <span style={{ fontWeight: 800, color: '#064e3b', fontSize: '0.85rem' }}>#{idx + 1}</span>
                  <input 
                    type="text" 
                    className="input-field" 
                    value={sec.name} 
                    onChange={e => {
                      const updated = [...sections];
                      updated[idx].name = e.target.value;
                      setSections(updated);
                    }}
                    style={{ flex: 2 }}
                  />
                  <input 
                    type="text" 
                    className="input-field" 
                    value={sec.duration} 
                    onChange={e => {
                      const updated = [...sections];
                      updated[idx].duration = e.target.value;
                      setSections(updated);
                    }}
                    style={{ flex: 1 }}
                  />
                  <button 
                    type="button" 
                    onClick={() => removeSection(sec.id)}
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button type="button" onClick={() => setCurrentScreen(3)} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ padding: '12px 28px' }}>
              <Save size={18} /> Save & Build Itinerary
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};
