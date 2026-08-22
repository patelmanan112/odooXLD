import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Image as ImageIcon, Check, Search, Compass, Loader } from 'lucide-react';

/* ── Famous Global Destinations & Landmark Images ── */
const MAP_DESTINATIONS = [
  {
    id: 'rome',
    name: 'Rome, Italy',
    lat: 41.9028,
    lng: 12.4964,
    x: '52%',
    y: '38%',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1000&q=80',
    spots: ['Colosseum & Arena Floor', 'Trevi Fountain', 'Vatican Museums', 'Pantheon']
  },
  {
    id: 'mumbai',
    name: 'Mumbai, India',
    lat: 19.0760,
    lng: 72.8777,
    x: '67%',
    y: '53%',
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1000&q=80',
    spots: ['Gateway of India', 'Marine Drive Promenade', 'Elephanta Caves', 'Colaba Market']
  },
  {
    id: 'tokyo',
    name: 'Tokyo, Japan',
    lat: 35.6762,
    lng: 139.6503,
    x: '82%',
    y: '42%',
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1000&q=80',
    spots: ['Shibuya Crossing', 'Fushimi Inari Shrine', 'Senso-ji Temple', 'Meiji Shrine']
  },
  {
    id: 'goa',
    name: 'Goa, India',
    lat: 15.2993,
    lng: 74.1240,
    x: '68%',
    y: '55%',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1000&q=80',
    spots: ['Grande Island Scuba', 'Old Goa Basilica', 'Baga Beach Watersports', 'Fort Aguada']
  },
  {
    id: 'paris',
    name: 'Paris, France',
    lat: 48.8566,
    lng: 2.3522,
    x: '48%',
    y: '34%',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1000&q=80',
    spots: ['Eiffel Tower Summit', 'Louvre Museum', 'Seine River Cruise', 'Montmartre']
  },
  {
    id: 'bali',
    name: 'Bali, Indonesia',
    lat: -8.4095,
    lng: 115.1889,
    x: '78%',
    y: '62%',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1000&q=80',
    spots: ['Mount Batur Sunrise', 'Ubud Monkey Forest', 'Tanah Lot Temple', 'Tegallalang Terraces']
  },
  {
    id: 'manali',
    name: 'Manali, Himachal Pradesh',
    lat: 32.2432,
    lng: 77.1892,
    x: '67%',
    y: '45%',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1000&q=80',
    spots: ['Solang Valley Paragliding', 'Hadimba Temple', 'Rohtang Pass', 'Jogini Falls']
  },
  {
    id: 'jaipur',
    name: 'Jaipur, Rajasthan',
    lat: 26.9124,
    lng: 75.7873,
    x: '66%',
    y: '48%',
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1000&q=80',
    spots: ['Hawa Mahal', 'Amber Fort', 'Jaipur City Palace', 'Jantar Mantar']
  }
];

/* ── City Spots Catalog for Offline / Backup Filtering ── */
const ALL_CITY_SPOTS = [
  // ROME
  { id: 'rome-1', cityName: 'Rome', name: 'Colosseum & Arena Floor', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80' },
  { id: 'rome-2', cityName: 'Rome', name: 'Trevi Fountain Evening Walk', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80' },
  { id: 'rome-3', cityName: 'Rome', name: 'Vatican Museums & Sistine Chapel', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80' },
  { id: 'rome-4', cityName: 'Rome', name: 'Pantheon & Piazza Navona', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80' },

  // MUMBAI
  { id: 'mum-1', cityName: 'Mumbai', name: 'Gateway of India', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=600&q=80' },
  { id: 'mum-2', cityName: 'Mumbai', name: 'Marine Drive Queen’s Necklace', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=600&q=80' },
  { id: 'mum-3', cityName: 'Mumbai', name: 'Elephanta Caves Boat Tour', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=600&q=80' },
  { id: 'mum-4', cityName: 'Mumbai', name: 'Colaba Causeway Shopping', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=600&q=80' },

  // TOKYO
  { id: 'tok-1', cityName: 'Tokyo', name: 'Shibuya Scramble Crossing', image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80' },
  { id: 'tok-2', cityName: 'Tokyo', name: 'Senso-ji Temple Asakusa', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80' },
  { id: 'tok-3', cityName: 'Tokyo', name: 'Meiji Shrine Harajuku', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80' },
  { id: 'tok-4', cityName: 'Tokyo', name: 'Akihabara Electric Town', image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80' },

  // GOA
  { id: 'goa-1', cityName: 'Goa', name: 'Grande Island Scuba Diving', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80' },
  { id: 'goa-2', cityName: 'Goa', name: 'Old Goa Heritage Basilica', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80' },
  { id: 'goa-3', cityName: 'Goa', name: 'Baga Beach Parasailing', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80' },

  // PARIS
  { id: 'par-1', cityName: 'Paris', name: 'Eiffel Tower Summit', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80' },
  { id: 'par-2', cityName: 'Paris', name: 'Louvre Museum Tour', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80' },
  { id: 'par-3', cityName: 'Paris', name: 'Seine Dinner Cruise', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80' },

  // BALI
  { id: 'bali-1', cityName: 'Bali', name: 'Mount Batur Sunrise Trek', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80' },
  { id: 'bali-2', cityName: 'Bali', name: 'Ubud Sacred Monkey Forest', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80' },
  { id: 'bali-3', cityName: 'Bali', name: 'Tanah Lot Sunset Temple', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80' }
];

export const CreateTrip = () => {
  const { addTrip, setSelectedTripId, showToast } = useApp();
  const navigate = useNavigate();

  const todayStr = new Date().toISOString().split('T')[0];

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    destination: 'Rome, Italy',
    description: '',
    startDate: todayStr,
    endDate: todayStr,
    budget: 50000,
    isPublic: false,
    selectedPlaces: [],
    coverPhoto: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1000&q=80'
  });

  const [locationSearch, setLocationSearch] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  /* ── City-Specific Places fetched dynamically from Backend DB ── */
  const [backendPlaces, setBackendPlaces] = useState([]);
  const [placesLoading, setPlacesLoading] = useState(false);

  /* Fetch places whenever destination changes */
  useEffect(() => {
    const fetchPlacesForDestination = async () => {
      if (!formData.destination) return;
      setPlacesLoading(true);
      const cityName = formData.destination.split(',')[0].trim();

      try {
        const { apiFetch } = await import('../utils/api.js');
        const data = await apiFetch(`/api/cities/places?city=${encodeURIComponent(cityName)}`);
        const resList = Array.isArray(data) ? data : (data?.data || []);

        if (resList.length > 0) {
          setBackendPlaces(resList);
        } else {
          // Dynamic city fallback filter
          const filtered = ALL_CITY_SPOTS.filter(p =>
            p.cityName.toLowerCase().includes(cityName.toLowerCase()) ||
            cityName.toLowerCase().includes(p.cityName.toLowerCase())
          );
          setBackendPlaces(filtered.length > 0 ? filtered : ALL_CITY_SPOTS.filter(p => p.cityName === 'Rome'));
        }
      } catch (err) {
        const filtered = ALL_CITY_SPOTS.filter(p =>
          p.cityName.toLowerCase().includes(cityName.toLowerCase()) ||
          cityName.toLowerCase().includes(p.cityName.toLowerCase())
        );
        setBackendPlaces(filtered.length > 0 ? filtered : ALL_CITY_SPOTS.filter(p => p.cityName === 'Rome'));
      } finally {
        setPlacesLoading(false);
      }
    };

    fetchPlacesForDestination();
  }, [formData.destination]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      let updated = { ...prev, [name]: value };
      if (name === 'startDate' && value && value < todayStr) {
        updated.startDate = todayStr;
        showToast?.('Start date cannot be in the past');
      }
      if (updated.endDate && updated.startDate && updated.endDate < updated.startDate) {
        updated.endDate = updated.startDate;
        showToast?.('End date cannot be before start date');
      }
      return updated;
    });
  };

  /* ── Select Location from Map or Search ── */
  const handleSelectLocation = (loc) => {
    setFormData(prev => ({
      ...prev,
      destination: loc.name,
      coverPhoto: loc.image,
      title: prev.title || `Trip to ${loc.name.split(',')[0]}`,
      selectedPlaces: []
    }));
    setLocationSearch(loc.name);
    setShowSearchDropdown(false);
    showToast?.(`Destination set to ${loc.name}! Loaded popular spots.`);
  };

  const handlePlaceToggle = (place) => {
    setFormData(prev => {
      const places = prev.selectedPlaces;
      const isSelected = places.includes(place.id);
      const updatedPlaces = isSelected ? places.filter(id => id !== place.id) : [...places, place.id];
      
      return {
        ...prev,
        selectedPlaces: updatedPlaces,
        coverPhoto: place.image || prev.coverPhoto
      };
    });
  };

  const handleSubmit = () => {
    const newTrip = {
      id: `trip-${Date.now()}`,
      name: formData.title || `Trip to ${formData.destination || 'Destination'}`,
      title: formData.title || `Trip to ${formData.destination || 'Destination'}`,
      destination: formData.destination || 'Destination',
      startDate: formData.startDate,
      endDate: formData.endDate,
      dates: `${formData.startDate} - ${formData.endDate}`,
      estimatedBudget: Number(formData.budget) || 50000,
      spentBudget: 0,
      isPublic: formData.isPublic,
      status: 'Upcoming',
      coverPhoto: formData.coverPhoto || 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80',
      days: []
    };
    if (addTrip) addTrip(newTrip);
    if (setSelectedTripId) setSelectedTripId(newTrip.id);
    if (showToast) showToast('Trip created successfully! 🎉');
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

  /* Filter map search suggestions */
  const searchSuggestions = MAP_DESTINATIONS.filter(d =>
    d.name.toLowerCase().includes(locationSearch.toLowerCase()) ||
    d.spots.some(s => s.toLowerCase().includes(locationSearch.toLowerCase()))
  );

  return (
    <div style={{ background: '#F5F3EF', minHeight: '100vh', padding: '32px' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'flex', gap: '32px' }}>
        
        {/* Left Sidebar */}
        <div style={{ width: '280px', background: 'white', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', height: 'fit-content' }}>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '20px', fontWeight: 'bold', marginBottom: '24px', color: '#1E293B' }}>Create a Trip</h2>
          
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
                    {num === 1 ? 'Trip Basics & Map' : num === 2 ? 'Dates & Budget' : 'Pick Places'}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
                    {num === 1 ? 'Destination & Map' : num === 2 ? 'When and how much' : 'Spots in ' + (formData.destination.split(',')[0] || 'City')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          <div style={{ background: 'white', borderRadius: '20px', padding: '32px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>Trip Basics & Interactive Map</h3>
                  
                  {/* Trip Name */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>Trip Name</label>
                    <input 
                      type="text" name="title" value={formData.title} onChange={handleChange}
                      placeholder="e.g. Vacation to Rome"
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1.5px solid #E2E8F0', fontSize: '16px', outline: 'none' }}
                    />
                  </div>
                  
                  {/* Location Search with Autocomplete */}
                  <div style={{ marginBottom: '24px', position: 'relative' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>
                      Destination / Location Search
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#E85D26' }} size={20} />
                      <input 
                        type="text"
                        value={locationSearch || formData.destination}
                        onChange={(e) => {
                          setLocationSearch(e.target.value);
                          setShowSearchDropdown(true);
                          setFormData(prev => ({ ...prev, destination: e.target.value }));
                        }}
                        onFocus={() => setShowSearchDropdown(true)}
                        placeholder="Search location (e.g. Rome, Mumbai, Tokyo, Goa, Paris, Bali)..."
                        style={{ width: '100%', padding: '12px 16px 12px 48px', borderRadius: '10px', border: '1.5px solid #E2E8F0', fontSize: '16px', outline: 'none', boxSizing: 'border-box' }}
                      />
                    </div>

                    {/* Autocomplete Dropdown */}
                    {showSearchDropdown && searchSuggestions.length > 0 && (
                      <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #EDE9E2',
                        borderRadius: '14px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                        zIndex: 100,
                        marginTop: '6px',
                        maxHeight: '220px',
                        overflowY: 'auto'
                      }}>
                        {searchSuggestions.map(loc => (
                          <div
                            key={loc.id}
                            onClick={() => handleSelectLocation(loc)}
                            style={{
                              padding: '12px 16px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              cursor: 'pointer',
                              borderBottom: '1px solid #F3F4F6',
                              transition: 'background 0.15s ease'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.background = '#FEF0E7'}
                            onMouseOut={(e) => e.currentTarget.style.background = '#FFFFFF'}
                          >
                            <img src={loc.image} alt={loc.name} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                            <div>
                              <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#1A1A2E' }}>{loc.name}</div>
                              <div style={{ fontSize: '0.76rem', color: '#9CA3AF' }}>Spots: {loc.spots.join(', ')}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Visual Interactive Map Canvas Widget */}
                  <div style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <label style={{ fontSize: '13px', fontWeight: '700', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Compass size={16} color="#E85D26" /> Interactive World Map (Click Pin to Select)
                      </label>
                      <span style={{ fontSize: '0.78rem', color: '#E85D26', fontWeight: 700 }}>
                        Active: {formData.destination}
                      </span>
                    </div>

                    <div style={{
                      position: 'relative',
                      height: '240px',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      backgroundColor: '#1E293B',
                      backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)',
                      backgroundSize: '16px 16px',
                      border: '2px solid #EDE9E2'
                    }}>
                      {/* World Map Overlay Graphic */}
                      <div style={{ position: 'absolute', inset: 0, opacity: 0.15, background: 'url("https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1200&q=80")', backgroundSize: 'cover' }} />

                      {/* Map Pins */}
                      {MAP_DESTINATIONS.map(loc => {
                        const isSelected = formData.destination.toLowerCase().includes(loc.name.split(',')[0].toLowerCase());
                        return (
                          <div
                            key={loc.id}
                            onClick={() => handleSelectLocation(loc)}
                            title={`Select ${loc.name}`}
                            style={{
                              position: 'absolute',
                              left: loc.x,
                              top: loc.y,
                              transform: 'translate(-50%, -100%)',
                              cursor: 'pointer',
                              zIndex: isSelected ? 10 : 5,
                              transition: 'transform 0.2s ease'
                            }}
                          >
                            <div style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center'
                            }}>
                              <div style={{
                                backgroundColor: isSelected ? '#E85D26' : '#FFFFFF',
                                color: isSelected ? '#FFFFFF' : '#1A1A2E',
                                padding: '4px 8px',
                                borderRadius: '8px',
                                fontSize: '0.72rem',
                                fontWeight: 800,
                                whiteSpace: 'nowrap',
                                boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                                border: isSelected ? '1.5px solid #FFFFFF' : '1px solid #CBD5E1',
                                marginBottom: '2px'
                              }}>
                                {loc.name.split(',')[0]}
                              </div>
                              <MapPin size={isSelected ? 24 : 18} color={isSelected ? '#E85D26' : '#FFFFFF'} fill={isSelected ? '#E85D26' : '#334155'} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>Description</label>
                    <textarea 
                      name="description" value={formData.description} onChange={handleChange}
                      placeholder="What's the vibe of this trip?"
                      rows="3"
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1.5px solid #E2E8F0', fontSize: '16px', resize: 'vertical', outline: 'none' }}
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
                  <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>Dates & Budget</h3>
                  
                  <div style={{ display: 'flex', gap: '20px', marginBottom: '24px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Start Date (From Today Onward)</label>
                      <input 
                        type="date" name="startDate" min={todayStr} value={formData.startDate} onChange={handleDateChange}
                        style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '16px' }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>End Date (After Start Date)</label>
                      <input 
                        type="date" name="endDate" min={formData.startDate || todayStr} value={formData.endDate} onChange={handleDateChange}
                        style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '16px' }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Estimated Budget (INR - ₹)</label>
                    <input 
                      type="range" name="budget" min="5000" max="500000" step="5000"
                      value={formData.budget} onChange={handleChange}
                      style={{ width: '100%', accentColor: '#E85D26' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '14px', color: '#64748B' }}>
                      <span>₹5,000</span>
                      <span style={{ fontWeight: 'bold', color: '#1E293B', fontSize: '16px' }}>₹{Number(formData.budget).toLocaleString('en-IN')}</span>
                      <span>₹5,00,000+</span>
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
                      Popular Spots in {formData.destination.split(',')[0]}
                    </h3>
                    {placesLoading && (
                      <span style={{ fontSize: '0.8rem', color: '#E85D26', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Loader size={14} className="animate-spin" /> Loading DB places...
                      </span>
                    )}
                  </div>
                  <p style={{ color: '#64748B', marginBottom: '24px' }}>
                    Showing authentic spots for <strong>{formData.destination}</strong> from database. Click to select spots for your itinerary.
                  </p>
                  
                  {backendPlaces.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
                      {backendPlaces.map(place => {
                        const isSelected = formData.selectedPlaces.includes(place.id);
                        return (
                          <div 
                            key={place.id} 
                            onClick={() => handlePlaceToggle(place)}
                            style={{ 
                              height: '140px', borderRadius: '14px', overflow: 'hidden', position: 'relative', cursor: 'pointer',
                              border: isSelected ? '3px solid #E85D26' : '1px solid #EDE9E2',
                              boxShadow: isSelected ? '0 4px 12px rgba(232, 93, 38, 0.25)' : 'none',
                              transition: 'transform 0.15s ease'
                            }}
                          >
                            <img src={place.image} alt={place.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.85))', padding: '12px' }}>
                              <span style={{ color: 'white', fontWeight: '700', fontSize: '13px', display: 'block', lineHeight: 1.2 }}>{place.name}</span>
                              {place.estimatedCost ? (
                                <span style={{ color: '#FCD34D', fontSize: '11px', fontWeight: 600 }}>₹{Number(place.estimatedCost).toLocaleString('en-IN')}</span>
                              ) : null}
                            </div>
                            {isSelected && (
                              <div style={{ position: 'absolute', top: '8px', right: '8px', background: '#E85D26', color: 'white', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Check size={14} color="#fff" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#9CA3AF' }}>
                      No spots found for {formData.destination}. Try searching for Rome, Mumbai, Tokyo, Goa, Paris, or Bali!
                    </div>
                  )}
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
              
              {/* Card Image */}
              <div style={{ height: '180px', position: 'relative', backgroundColor: '#E2E8F0' }}>
                <img
                  src={formData.coverPhoto}
                  alt={formData.destination}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' }} />
                
                <div style={{ position: 'absolute', bottom: '12px', left: '16px', background: '#FFFFFF', color: '#1A1A2E', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '800' }}>
                  {formData.budget ? `₹${Number(formData.budget).toLocaleString('en-IN')}` : 'Budget'}
                </div>
              </div>

              <div style={{ padding: '20px' }}>
                <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '22px', fontWeight: 'bold', color: '#1E293B', marginBottom: '8px' }}>
                  {formData.title || 'Untitled Trip'}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', color: '#64748B', fontSize: '14px', marginBottom: '16px' }}>
                  <MapPin size={16} color="#E85D26" style={{ marginRight: '6px' }} />
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
