import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Compass, Star, MapPin, Plus, Eye, DollarSign, Filter, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Screen8_SearchExplorer = () => {
  const { setCurrentScreen, showToast } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedItem, setSelectedItem] = useState(null);

  const sampleActivities = [
    {
      id: 'act-1',
      title: 'Paragliding in Solang Valley',
      city: 'Manali, India',
      category: 'Adventure',
      rating: 4.9,
      reviews: 320,
      price: '₹3,500',
      duration: '45 Mins',
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
      description: 'Soar through the majestic Himalayan mountains with certified paragliding pilots.'
    },
    {
      id: 'act-2',
      title: 'Shibuya Night Food & Ramen Tour',
      city: 'Tokyo, Japan',
      category: 'Food',
      rating: 4.8,
      reviews: 512,
      price: '₹4,500',
      duration: '3 Hours',
      image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80',
      description: 'Guided street food tour tasting authentic ramen, yakitori, and matcha desserts.'
    },
    {
      id: 'act-3',
      title: 'Scuba Diving at Grand Island',
      city: 'Goa, India',
      category: 'Water Sports',
      rating: 4.7,
      reviews: 189,
      price: '₹2,800',
      duration: '4 Hours',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80',
      description: 'Explore vibrant coral reefs and marine life with PADI scuba instructors.'
    },
    {
      id: 'act-4',
      title: 'Fushimi Inari Sunrise Hike',
      city: 'Kyoto, Japan',
      category: 'Sightseeing',
      rating: 5.0,
      reviews: 840,
      price: 'Free',
      duration: '2.5 Hours',
      image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80',
      description: 'Hike through thousands of vermilion torii gates at the iconic shrine.'
    },
    {
      id: 'act-5',
      title: 'Mount Batur Sunrise Volcano Trek',
      city: 'Bali, Indonesia',
      category: 'Adventure',
      rating: 4.8,
      reviews: 410,
      price: '₹2,200',
      duration: '6 Hours',
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80',
      description: 'Trek up an active volcano to watch the sunrise above the clouds in Ubud.'
    },
    {
      id: 'act-6',
      title: 'Eiffel Tower Summit Access & Seine Cruise',
      city: 'Paris, France',
      category: 'Culture',
      rating: 4.9,
      reviews: 1200,
      price: '₹5,800',
      duration: '3.5 Hours',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80',
      description: 'Skip-the-line summit ticket plus romantic 1-hour river cruise.'
    }
  ];

  const filtered = sampleActivities.filter(act => {
    const matchesCat = selectedCategory === 'All' || act.category === selectedCategory;
    const matchesSearch = act.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          act.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span className="badge badge-emerald">Screen 8: Activity & City Search</span>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2rem', fontWeight: 800, color: '#064e3b', marginTop: '4px' }}>
            Explore Destinations & Activities 🔍
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Find popular things to do, tours, and places to add to your itinerary
          </p>
        </div>
      </div>

      {/* Search Header Controls */}
      <div className="glass-card" style={{ padding: '20px 24px', backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ position: 'relative', width: '100%' }}>
          <Search size={20} color="#94a3b8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="Search activities (e.g. Paragliding, Ramen tour, Scuba diving, Tokyo)..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 18px 12px 48px',
              fontSize: '0.95rem',
              borderRadius: '9999px',
              border: '1px solid #cbd5e1',
              outline: 'none'
            }}
          />
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {['All', 'Adventure', 'Food', 'Water Sports', 'Sightseeing', 'Culture'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '8px 16px',
                borderRadius: '9999px',
                fontSize: '0.84rem',
                fontWeight: selectedCategory === cat ? 700 : 500,
                backgroundColor: selectedCategory === cat ? '#064e3b' : '#f1f5f9',
                color: selectedCategory === cat ? '#ffffff' : '#475569',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Activity Results */}
      <div className="grid-responsive-3">
        {filtered.map(act => (
          <div key={act.id} className="glass-card" style={{ backgroundColor: '#ffffff', borderRadius: '18px', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ height: '170px', position: 'relative', overflow: 'hidden' }}>
                <img src={act.image} alt={act.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <span className="badge badge-emerald" style={{ position: 'absolute', top: '12px', left: '12px', backgroundColor: '#064e3b', color: '#ffffff' }}>
                  {act.category}
                </span>
                <div style={{ position: 'absolute', bottom: '12px', right: '12px', backgroundColor: 'rgba(0,0,0,0.75)', color: '#ffffff', padding: '4px 10px', borderRadius: '9999px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Star size={13} fill="#f59e0b" color="#f59e0b" /> {act.rating} ({act.reviews})
                </div>
              </div>

              <div style={{ padding: '18px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>{act.title}</h3>
                <div style={{ fontSize: '0.82rem', color: '#047857', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
                  <MapPin size={14} /> {act.city}
                </div>
                <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.4 }}>{act.description}</p>
              </div>
            </div>

            <div style={{ padding: '16px 18px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#064e3b' }}>{act.price}</div>
                <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Duration: {act.duration}</div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  onClick={() => setSelectedItem(act)}
                  className="btn btn-outline" 
                  style={{ padding: '8px 12px', fontSize: '0.8rem' }}
                >
                  <Eye size={15} /> Details
                </button>
                <button 
                  onClick={() => { showToast(`Added "${act.title}" to your trip itinerary!`); setCurrentScreen(5); }}
                  className="btn btn-primary" 
                  style={{ padding: '8px 14px', fontSize: '0.8rem' }}
                >
                  <Plus size={15} /> Add to Trip
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Details Modal Popover */}
      {selectedItem && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px'
        }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '520px', padding: '28px', backgroundColor: '#ffffff', borderRadius: '24px' }}>
            <img src={selectedItem.image} alt={selectedItem.title} style={{ width: '100%', height: '200px', borderRadius: '16px', objectFit: 'cover', marginBottom: '16px' }} />
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#064e3b', marginBottom: '4px' }}>{selectedItem.title}</h3>
            <div style={{ fontSize: '0.85rem', color: '#047857', fontWeight: 600, marginBottom: '12px' }}>{selectedItem.city} • {selectedItem.duration}</div>
            <p style={{ color: '#475569', fontSize: '0.9rem', marginBottom: '20px', lineHeight: 1.5 }}>{selectedItem.description}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a' }}>{selectedItem.price}</div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => setSelectedItem(null)} className="btn btn-outline">Close</button>
                <button 
                  onClick={() => { showToast(`Added "${selectedItem.title}" to itinerary!`); setSelectedItem(null); setCurrentScreen(5); }} 
                  className="btn btn-primary"
                >
                  Confirm & Add to Trip
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
