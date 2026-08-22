import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const Screen8_SearchExplorer = () => {
  const { setCurrentScreen, showToast } = useApp();
  
  const [searchQuery, setSearchQuery] = useState('');
  
  const categories = ['Adventure', 'Food', 'Water Sports', 'Sightseeing', 'Culture'];
  
  const results = [
    { id: 1, title: 'Scuba Diving at Grande Island', location: 'Goa, India', rating: '4.8', category: 'Water Sports', desc: 'Explore the vibrant underwater life and shipwrecks.', price: '₹2,500', duration: 'Half Day', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80', height: 320 },
    { id: 2, title: 'Old Goa Heritage Walk', location: 'Goa, India', rating: '4.5', category: 'Culture', desc: 'Discover ancient churches and Portuguese architecture.', price: '₹800', duration: 'Under 2hrs', image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f7415e?w=800&q=80', height: 260 },
    { id: 3, title: 'Dudhsagar Trekking', location: 'Goa, India', rating: '4.9', category: 'Adventure', desc: 'Trek through lush forests to the majestic waterfall.', price: '₹1,500', duration: 'Full Day', image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&q=80', height: 340 },
    { id: 4, title: 'Spice Plantation Tour', location: 'Goa, India', rating: '4.6', category: 'Food', desc: 'Walk through spice gardens with an authentic lunch.', price: '₹1,200', duration: 'Half Day', image: 'https://images.unsplash.com/photo-1596423735880-5f2a689b903e?w=800&q=80', height: 280 }
  ];

  const handleAdd = (title) => {
    showToast?.(`Added ${title} to your trip!`);
  };

  return (
    <div style={{ backgroundColor: '#F5F3EF', minHeight: '100vh', padding: '40px', boxSizing: 'border-box' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* TOP SEARCH */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
            <input 
              type="text" 
              placeholder="Search experiences, places, or activities..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ flex: 1, padding: '16px 24px', borderRadius: '16px', border: 'none', fontSize: '1.1rem', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} 
            />
            <button style={{ backgroundColor: '#E85D26', color: '#fff', padding: '0 32px', borderRadius: '16px', border: 'none', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer' }}>Search</button>
          </div>
          <div style={{ color: '#6B7280', fontSize: '0.95rem' }}>
            Showing <strong>124</strong> results for "{searchQuery || 'Goa'}"
          </div>
        </div>

        <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
          
          {/* LEFT SIDEBAR FILTERS */}
          <div style={{ width: '240px', backgroundColor: '#fff', borderRadius: '24px', padding: '24px', position: 'sticky', top: '40px', flexShrink: 0, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <h3 style={{ margin: '0 0 24px', fontSize: '1.2rem', color: '#1A1A2E' }}>Filters</h3>
            
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ margin: '0 0 12px', fontSize: '1rem', color: '#4B5563', fontWeight: '600' }}>Category</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {categories.map(cat => (
                  <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem', color: '#4B5563' }}>
                    <input type="checkbox" style={{ accentColor: '#E85D26' }} /> {cat}
                  </label>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ margin: '0 0 12px', fontSize: '1rem', color: '#4B5563', fontWeight: '600' }}>Price Range</h4>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input type="number" placeholder="Min" style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #E5E7EB' }} />
                <span>-</span>
                <input type="number" placeholder="Max" style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #E5E7EB' }} />
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ margin: '0 0 12px', fontSize: '1rem', color: '#4B5563', fontWeight: '600' }}>Duration</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {['Under 2hrs', 'Half Day', 'Full Day'].map(dur => (
                  <label key={dur} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem', color: '#4B5563' }}>
                    <input type="radio" name="duration" style={{ accentColor: '#E85D26' }} /> {dur}
                  </label>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <h4 style={{ margin: '0 0 12px', fontSize: '1rem', color: '#4B5563', fontWeight: '600' }}>Rating</h4>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['3+', '4+', '5'].map(star => (
                  <button key={star} style={{ flex: 1, padding: '6px', border: '1px solid #E5E7EB', borderRadius: '8px', backgroundColor: '#F9FAFB', cursor: 'pointer', fontSize: '0.8rem', color: '#4B5563' }}>{star} ⭐</button>
                ))}
              </div>
            </div>

            <button style={{ width: '100%', padding: '12px', border: 'none', backgroundColor: '#F3F4F6', color: '#4B5563', borderRadius: '12px', fontWeight: '600', cursor: 'pointer' }}>Clear Filters</button>
          </div>

          {/* RIGHT RESULTS MASONRY */}
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }}>
            {/* Column 1 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {results.filter((_, i) => i % 2 === 0).map(item => (
                <ResultCard key={item.id} item={item} handleAdd={handleAdd} />
              ))}
            </div>
            {/* Column 2 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {results.filter((_, i) => i % 2 !== 0).map(item => (
                <ResultCard key={item.id} item={item} handleAdd={handleAdd} />
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

const ResultCard = ({ item, handleAdd }) => {
  return (
    <div style={{ backgroundColor: '#fff', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', transition: 'transform 0.2s', cursor: 'default' }}>
      <img src={item.image} alt={item.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
      <div style={{ padding: '20px' }}>
        <div style={{ backgroundColor: '#FDE8E0', color: '#E85D26', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold', display: 'inline-block', marginBottom: '12px' }}>{item.category}</div>
        <h4 style={{ margin: '0 0 8px', fontSize: '1.2rem', color: '#1A1A2E' }}>{item.title}</h4>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', fontSize: '0.85rem' }}>
          <span style={{ color: '#6B7280' }}>📍 {item.location}</span>
          <span style={{ fontWeight: 'bold', color: '#F59E0B' }}>⭐ {item.rating}</span>
        </div>
        
        <p style={{ color: '#4B5563', fontSize: '0.9rem', lineHeight: '1.5', margin: '0 0 20px' }}>{item.desc}</p>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid #F3F4F6' }}>
          <div>
            <div style={{ fontWeight: 'bold', color: '#1A1A2E', fontSize: '1.1rem' }}>{item.price}</div>
            <div style={{ color: '#6B7280', fontSize: '0.8rem' }}>{item.duration}</div>
          </div>
          <button onClick={() => handleAdd(item.title)} style={{ backgroundColor: '#1A1A2E', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Add to Trip</button>
        </div>
      </div>
    </div>
  );
};
