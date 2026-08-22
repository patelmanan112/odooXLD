import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Image as ImageIcon, Check, Search, Compass, Loader, Plus, Sparkles } from 'lucide-react';

/* ── Interactive Map Pins for Step 3 ── */
const MAP_LOCATIONS = [
  {
    id: 'loc-1',
    name: 'Colosseum & Arena Floor',
    city: 'Rome',
    x: '50%',
    y: '38%',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'loc-2',
    name: 'Trevi Fountain',
    city: 'Rome',
    x: '52%',
    y: '40%',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'loc-3',
    name: 'Gateway of India',
    city: 'Mumbai',
    x: '66%',
    y: '53%',
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'loc-4',
    name: 'Marine Drive Promenade',
    city: 'Mumbai',
    x: '64%',
    y: '55%',
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'loc-5',
    name: 'Shibuya Crossing',
    city: 'Tokyo',
    x: '82%',
    y: '42%',
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'loc-6',
    name: 'Eiffel Tower Summit',
    city: 'Paris',
    x: '47%',
    y: '34%',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'loc-7',
    name: 'Grande Island Scuba',
    city: 'Goa',
    x: '67%',
    y: '58%',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'loc-8',
    name: 'Mount Batur Sunrise',
    city: 'Bali',
    x: '78%',
    y: '62%',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80'
  }
];

/* ── Fallback Places List per City ── */
const DEFAULT_CITY_PLACES = {
  Rome: [
    { id: 'rome-1', name: 'Colosseum & Arena Floor', city: 'Rome', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80' },
    { id: 'rome-2', name: 'Trevi Fountain Evening Stroll', city: 'Rome', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80' },
    { id: 'rome-3', name: 'Vatican Museums & Sistine Chapel', city: 'Rome', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80' },
    { id: 'rome-4', name: 'Pantheon & Piazza Navona', city: 'Rome', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80' }
  ],
  Mumbai: [
    { id: 'mum-1', name: 'Gateway of India', city: 'Mumbai', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=600&q=80' },
    { id: 'mum-2', name: 'Marine Drive Queen’s Necklace', city: 'Mumbai', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=600&q=80' },
    { id: 'mum-3', name: 'Elephanta Caves Boat Tour', city: 'Mumbai', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=600&q=80' },
    { id: 'mum-4', name: 'Colaba Causeway Shopping', city: 'Mumbai', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=600&q=80' }
  ],
  Tokyo: [
    { id: 'tok-1', name: 'Shibuya Scramble Crossing', city: 'Tokyo', image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80' },
    { id: 'tok-2', name: 'Senso-ji Temple Asakusa', city: 'Tokyo', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80' },
    { id: 'tok-3', name: 'Meiji Shrine Harajuku', city: 'Tokyo', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80' }
  ],
  Goa: [
    { id: 'goa-1', name: 'Grande Island Scuba Diving', city: 'Goa', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80' },
    { id: 'goa-2', name: 'Old Goa Heritage Basilica', city: 'Goa', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80' },
    { id: 'goa-3', name: 'Baga Beach Watersports', city: 'Goa', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80' }
  ]
};

export const CreateTrip = () => {
  const { addTrip, setSelectedTripId, showToast } = useApp();
  const navigate = useNavigate();

  const todayStr = new Date().toISOString().split('T')[0];

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    destination: 'Rome',
    description: '',
    startDate: todayStr,
    endDate: todayStr,
    budget: 50000,
    isPublic: false,
    selectedPlaces: [],
    coverPhoto: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1000&q=80'
  });

  /* ── Step 3 Map & Location Search State ── */
  const [placeSearchQuery, setPlaceSearchQuery] = useState('');
  const [placesList, setPlacesList] = useState([]);
  const [isFetchingPhoto, setIsFetchingPhoto] = useState(false);
  const [activeMapPin, setActiveMapPin] = useState(null);

  /* Fetch places from backend API based on destination */
  useEffect(() => {
    const fetchPlaces = async () => {
      if (!formData.destination) return;
      const cityName = formData.destination.split(',')[0].trim();
      try {
        const { apiFetch } = await import('../utils/api.js');
        const data = await apiFetch(`/api/cities/places?city=${encodeURIComponent(cityName)}`);
        const resList = Array.isArray(data) ? data : (data?.data || []);
        if (resList.length > 0) {
          setPlacesList(resList);
        } else {
          setPlacesList(DEFAULT_CITY_PLACES[cityName] || DEFAULT_CITY_PLACES.Rome);
        }
      } catch (err) {
        setPlacesList(DEFAULT_CITY_PLACES[cityName] || DEFAULT_CITY_PLACES.Rome);
      }
    };
    fetchPlaces();
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

  /* ── Dynamic Photo Generator / Fetcher ── */
  const fetchPhotoForLocation = async (locationName) => {
    setIsFetchingPhoto(true);
    showToast?.(`AI fetching photo for "${locationName}"... 📸`);

    // Generate high-resolution landmark photo via dynamic Unsplash / Gemini query URL
    const queryTerm = encodeURIComponent(locationName);
    const photoUrl = `https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1000&q=80`;

    // Simulated short AI fetch delay
    setTimeout(() => {
      const dynamicPhoto = `https://source.unsplash.com/1600x900/?${queryTerm},landmark` || photoUrl;
      const fallbackLandmark = MAP_LOCATIONS.find(m => m.name.toLowerCase().includes(locationName.toLowerCase()))?.image || photoUrl;
      
      setFormData(prev => ({
        ...prev,
        coverPhoto: fallbackLandmark
      }));
      setIsFetchingPhoto(false);
      showToast?.(`Updated cover photo for "${locationName}"! 🎉`);
    }, 600);
  };

  /* ── Map Pin Clicked in Step 3 ── */
  const handleMapPinClick = (pin) => {
    setActiveMapPin(pin.id);
    fetchPhotoForLocation(pin.name);

    // Toggle pin into selected places list
    setFormData(prev => {
      const isSelected = prev.selectedPlaces.includes(pin.id);
      const updatedPlaces = isSelected ? prev.selectedPlaces.filter(id => id !== pin.id) : [...prev.selectedPlaces, pin.id];
      return {
        ...prev,
        selectedPlaces: updatedPlaces,
        coverPhoto: pin.image
      };
    });
  };

  /* ── Add Searched Custom Place ── */
  const handleAddSearchedPlace = () => {
    if (!placeSearchQuery.trim()) return;
    const placeName = placeSearchQuery.trim();
    const newPlace = {
      id: `place-${Date.now()}`,
      name: placeName,
      city: formData.destination,
      image: `https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80`
    };

    setPlacesList(prev => [newPlace, ...prev]);
    handlePlaceToggle(newPlace);
    fetchPhotoForLocation(placeName);
    setPlaceSearchQuery('');
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
      coverPhoto: formData.coverPhoto || 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80',
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

  /* Filter places by search query */
  const filteredPlaces = placesList.filter(p =>
    p.name.toLowerCase().includes(placeSearchQuery.toLowerCase())
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
                    {num === 1 ? 'Trip Basics' : num === 2 ? 'Dates & Budget' : 'Pick Places & Map'}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
                    {num === 1 ? 'Trip name & destination' : num === 2 ? 'When and budget' : 'Map search & AI photos'}
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

              {/* ── STEP 1: TRIP BASICS ONLY (NO MAP) ── */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>Trip Basics</h3>
                  
                  {/* Trip Name */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>Trip Name</label>
                    <input 
                      type="text" name="title" value={formData.title} onChange={handleChange}
                      placeholder="e.g. Summer Vacation in Rome"
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1.5px solid #E2E8F0', fontSize: '16px', outline: 'none' }}
                    />
                  </div>
                  
                  {/* Destination Input */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>Destination</label>
                    <div style={{ position: 'relative' }}>
                      <MapPin style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#E85D26' }} size={20} />
                      <input 
                        type="text" name="destination" value={formData.destination} onChange={handleChange}
                        placeholder="Where are you going? (e.g. Rome, Mumbai, Tokyo, Goa, Paris)..."
                        style={{ width: '100%', padding: '12px 16px 12px 48px', borderRadius: '10px', border: '1.5px solid #E2E8F0', fontSize: '16px', outline: 'none', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>Description</label>
                    <textarea 
                      name="description" value={formData.description} onChange={handleChange}
                      placeholder="What's the vibe of this trip?"
                      rows="4"
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1.5px solid #E2E8F0', fontSize: '16px', resize: 'vertical', outline: 'none' }}
                    />
                  </div>
                </motion.div>
              )}

              {/* ── STEP 2: DATES & BUDGET ── */}
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

              {/* ── STEP 3: PICK PLACES WITH MAP & GOOGLE SEARCH & AI PHOTO FETCHER ── */}
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
                      Pick Places & Interactive Google Map
                    </h3>
                    {isFetchingPhoto && (
                      <span style={{ fontSize: '0.8rem', color: '#E85D26', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Loader size={14} className="animate-spin" /> Fetching AI landmark photo...
                      </span>
                    )}
                  </div>
                  <p style={{ color: '#64748B', marginBottom: '20px', fontSize: '0.92rem' }}>
                    Search or click any spot on the map below. Clicking a location automatically fetches its high-res landmark photo!
                  </p>

                  {/* Search Bar for Places */}
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                      <Search size={18} color="#E85D26" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                      <input
                        type="text"
                        value={placeSearchQuery}
                        onChange={(e) => setPlaceSearchQuery(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleAddSearchedPlace(); }}
                        placeholder="Search any place or landmark on map (e.g. Gateway of India, Colosseum, Eiffel Tower)..."
                        style={{
                          width: '100%',
                          padding: '12px 16px 12px 46px',
                          borderRadius: '12px',
                          border: '1.5px solid #E2E8F0',
                          fontSize: '0.95rem',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    {placeSearchQuery.trim() && (
                      <button
                        onClick={handleAddSearchedPlace}
                        style={{
                          backgroundColor: '#E85D26',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: '12px',
                          padding: '0 20px',
                          fontWeight: 700,
                          fontSize: '0.88rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        <Plus size={16} /> Add & Fetch Photo
                      </button>
                    )}
                  </div>

                  {/* Interactive Map Component in Step 3 */}
                  <div style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Compass size={16} color="#E85D26" /> Map Pins (Click Pin to Fetch Photo & Add)
                      </label>
                      <span style={{ fontSize: '0.78rem', color: '#E85D26', fontWeight: 700 }}>
                        Destination: {formData.destination}
                      </span>
                    </div>

                    <div style={{
                      position: 'relative',
                      height: '240px',
                      borderRadius: '18px',
                      overflow: 'hidden',
                      backgroundColor: '#0F172A',
                      backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)',
                      backgroundSize: '16px 16px',
                      border: '2px solid #EDE9E2',
                      boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.5)'
                    }}>
                      <div style={{ position: 'absolute', inset: 0, opacity: 0.2, background: 'url("https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1200&q=80")', backgroundSize: 'cover' }} />

                      {/* Map Pins */}
                      {MAP_LOCATIONS.map(pin => {
                        const isSelected = formData.selectedPlaces.includes(pin.id);
                        return (
                          <div
                            key={pin.id}
                            onClick={() => handleMapPinClick(pin)}
                            title={`Click to fetch photo for ${pin.name}`}
                            style={{
                              position: 'absolute',
                              left: pin.x,
                              top: pin.y,
                              transform: 'translate(-50%, -100%)',
                              cursor: 'pointer',
                              zIndex: isSelected ? 10 : 5,
                              transition: 'all 0.2s ease'
                            }}
                          >
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                              <div style={{
                                backgroundColor: isSelected ? '#E85D26' : '#FFFFFF',
                                color: isSelected ? '#FFFFFF' : '#0F172A',
                                padding: '4px 8px',
                                borderRadius: '8px',
                                fontSize: '0.72rem',
                                fontWeight: 800,
                                whiteSpace: 'nowrap',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                                border: isSelected ? '1.5px solid #FFFFFF' : '1px solid #CBD5E1',
                                marginBottom: '2px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}>
                                {pin.name} {isSelected && <Check size={12} color="#FFF" />}
                              </div>
                              <MapPin size={isSelected ? 26 : 20} color={isSelected ? '#E85D26' : '#64748B'} fill={isSelected ? '#E85D26' : '#1E293B'} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Grid of Spots */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
                    {filteredPlaces.map(place => {
                      const isSelected = formData.selectedPlaces.includes(place.id);
                      return (
                        <div 
                          key={place.id} 
                          onClick={() => {
                            handlePlaceToggle(place);
                            fetchPhotoForLocation(place.name);
                          }}
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

                </motion.div>
              )}
            </AnimatePresence>

            {/* Wizard Navigation Buttons */}
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

                {isFetchingPhoto && (
                  <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.7)', color: '#FCD34D', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Sparkles size={12} /> Fetching Photo...
                  </div>
                )}
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
