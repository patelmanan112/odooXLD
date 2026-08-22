import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Image as ImageIcon, Check } from 'lucide-react';

export const Screen4_CreateTrip = () => {
  const { addTrip, setSelectedTripId, destinations, showToast } = useApp();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    destination: '',
    description: '',
    startDate: '',
    endDate: '',
    budget: 1000,
    isPublic: false,
    selectedPlaces: []
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePlaceToggle = (placeId) => {
    setFormData(prev => {
      const places = prev.selectedPlaces;
      if (places.includes(placeId)) {
        return { ...prev, selectedPlaces: places.filter(id => id !== placeId) };
      } else {
        return { ...prev, selectedPlaces: [...places, placeId] };
      }
    });
  };

  const handleSubmit = () => {
    const newTrip = {
      id: Date.now().toString(),
      ...formData,
      status: 'planning',
      sections: []
    };
    if (addTrip) addTrip(newTrip);
    if (setSelectedTripId) setSelectedTripId(newTrip.id);
    if (showToast) showToast('Trip created successfully!');
    navigate('/itinerary/builder');
  };

  const calculateProgress = () => {
    let progress = 0;
    if (formData.title) progress += 20;
    if (formData.destination) progress += 20;
    if (formData.startDate && formData.endDate) progress += 30;
    if (formData.selectedPlaces.length > 0) progress += 30;
    return progress;
  };

  // Mock destinations if not provided from context
  const places = destinations || [
    { id: '1', name: 'Eiffel Tower', image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=300&q=80' },
    { id: '2', name: 'Louvre Museum', image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=300&q=80' },
    { id: '3', name: 'Seine River', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=300&q=80' },
  ];

  return (
    <div style={{ background: '#F5F3EF', minHeight: '100vh', padding: '32px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '32px' }}>
        
        {/* Left Sidebar */}
        <div style={{ width: '280px', background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', height: 'fit-content' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '24px', color: '#1E293B' }}>Create a Trip</h2>
          
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '15px', top: '16px', bottom: '16px', width: '2px', background: '#E2E8F0', zIndex: 0 }}></div>
            
            {[1, 2, 3].map((num) => (
              <div key={num} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '32px', position: 'relative', zIndex: 1 }}>
                <div style={{ 
                  width: '32px', height: '32px', borderRadius: '50%', 
                  background: step >= num ? '#E85D26' : '#E2E8F0',
                  color: step >= num ? 'white' : '#64748B',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 'bold', fontSize: '14px', flexShrink: 0,
                  transition: 'background 0.3s'
                }}>
                  {num}
                </div>
                <div style={{ marginLeft: '16px', paddingTop: '6px' }}>
                  <div style={{ fontWeight: '600', color: step >= num ? '#1E293B' : '#94A3B8' }}>
                    {num === 1 ? 'Trip Basics' : num === 2 ? 'Dates & Budget' : 'Pick Places'}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
                    {num === 1 ? 'Name and destination' : num === 2 ? 'When and how much' : 'Add some spots'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          <div style={{ background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>Trip Basics</h3>
                  
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Trip Name</label>
                    <input 
                      type="text" name="title" value={formData.title} onChange={handleChange}
                      placeholder="e.g. Summer in Paris"
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '16px' }}
                    />
                  </div>
                  
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Destination</label>
                    <div style={{ position: 'relative' }}>
                      <MapPin style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} size={20} />
                      <input 
                        type="text" name="destination" value={formData.destination} onChange={handleChange}
                        placeholder="Where are you going?"
                        style={{ width: '100%', padding: '12px 16px 12px 48px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '16px' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Description</label>
                    <textarea 
                      name="description" value={formData.description} onChange={handleChange}
                      placeholder="What's the vibe?"
                      rows="4"
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '16px', resize: 'vertical' }}
                    />
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>Dates & Budget</h3>
                  
                  <div style={{ display: 'flex', gap: '20px', marginBottom: '24px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Start Date</label>
                      <input 
                        type="date" name="startDate" value={formData.startDate} onChange={handleChange}
                        style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '16px' }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>End Date</label>
                      <input 
                        type="date" name="endDate" value={formData.endDate} onChange={handleChange}
                        style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '16px' }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Budget (USD)</label>
                    <input 
                      type="range" name="budget" min="100" max="10000" step="100"
                      value={formData.budget} onChange={handleChange}
                      style={{ width: '100%', accentColor: '#E85D26' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '14px', color: '#64748B' }}>
                      <span>$100</span>
                      <span style={{ fontWeight: 'bold', color: '#1E293B', fontSize: '16px' }}>${formData.budget}</span>
                      <span>$10,000+</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input 
                      type="checkbox" name="isPublic" id="isPublic" 
                      checked={formData.isPublic} onChange={handleChange}
                      style={{ width: '18px', height: '18px', accentColor: '#E85D26' }}
                    />
                    <label htmlFor="isPublic" style={{ fontSize: '15px', color: '#1E293B' }}>Make this trip public for others to see</label>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>Pick Places</h3>
                  <p style={{ color: '#64748B', marginBottom: '24px' }}>Select some top spots to get started.</p>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
                    {places.map(place => (
                      <div 
                        key={place.id} 
                        onClick={() => handlePlaceToggle(place.id)}
                        style={{ 
                          height: '140px', borderRadius: '12px', overflow: 'hidden', position: 'relative', cursor: 'pointer',
                          border: formData.selectedPlaces.includes(place.id) ? '3px solid #E85D26' : '3px solid transparent'
                        }}
                      >
                        <img src={place.image} alt={place.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.8))', padding: '12px' }}>
                          <span style={{ color: 'white', fontWeight: '500', fontSize: '14px' }}>{place.name}</span>
                        </div>
                        {formData.selectedPlaces.includes(place.id) && (
                          <div style={{ position: 'absolute', top: '8px', right: '8px', background: '#E85D26', color: 'white', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Check size={14} color="#fff" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px', paddingTop: '24px', borderTop: '1px solid #E2E8F0' }}>
              <button 
                onClick={() => setStep(prev => Math.max(1, prev - 1))}
                disabled={step === 1}
                style={{ padding: '10px 24px', borderRadius: '8px', border: '1px solid #E2E8F0', background: 'white', color: step === 1 ? '#CBD5E1' : '#1E293B', cursor: step === 1 ? 'not-allowed' : 'pointer', fontWeight: '500' }}
              >
                Back
              </button>
              
              {step < 3 ? (
                <button 
                  onClick={() => setStep(prev => Math.min(3, prev + 1))}
                  style={{ padding: '10px 32px', borderRadius: '8px', background: '#E85D26', color: 'white', border: 'none', cursor: 'pointer', fontWeight: '600' }}
                >
                  Next Step
                </button>
              ) : (
                <button 
                  onClick={handleSubmit}
                  style={{ padding: '10px 32px', borderRadius: '8px', background: '#E85D26', color: 'white', border: 'none', cursor: 'pointer', fontWeight: '600' }}
                >
                  Create Trip
                </button>
              )}
            </div>
          </div>

          {/* Live Preview Card */}
          <div style={{ width: '360px', alignSelf: 'center', marginTop: '16px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#64748B', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Live Preview</h4>
            <div style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}>
              <div style={{ height: '160px', background: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                {formData.destination ? (
                  <div style={{ width: '100%', height: '100%', background: 'linear-gradient(45deg, #E85D26, #FF9B71)' }}></div>
                ) : (
                  <ImageIcon color="#94A3B8" size={32} />
                )}
                <div style={{ position: 'absolute', bottom: '12px', left: '16px', background: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                  {formData.budget ? `$${formData.budget}` : 'Budget'}
                </div>
              </div>
              <div style={{ padding: '20px' }}>
                <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1E293B', marginBottom: '8px' }}>
                  {formData.title || 'Untitled Trip'}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', color: '#64748B', fontSize: '14px', marginBottom: '16px' }}>
                  <MapPin size={16} style={{ marginRight: '6px' }} />
                  {formData.destination || 'Nowhere yet'}
                </div>
                
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748B', marginBottom: '6px', fontWeight: '500' }}>
                    <span>Completion</span>
                    <span>{calculateProgress()}%</span>
                  </div>
                  <div style={{ height: '6px', background: '#F1F5F9', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${calculateProgress()}%`, background: '#E85D26', transition: 'width 0.3s' }}></div>
                  </div>
                </div>

              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};
