import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Star, Plus, RotateCcw, Filter, Check } from 'lucide-react';

const INITIAL_ACTIVITIES = [
  { id: 1, title: 'Scuba Diving at Grande Island', location: 'Goa, India', rating: 4.8, category: 'Water Sports', desc: 'Explore vibrant underwater marine life and historic shipwrecks with certified PADI divers.', price: 2500, priceDisplay: '₹2,500', duration: 'Half Day', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80' },
  { id: 2, title: 'Old Goa Heritage Walk', location: 'Goa, India', rating: 4.5, category: 'Culture', desc: 'Discover ancient churches, cathedrals, and classic Portuguese colonial architecture.', price: 800, priceDisplay: '₹800', duration: 'Under 2hrs', image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f7415e?w=800&q=80' },
  { id: 3, title: 'Dudhsagar Waterfalls Trekking', location: 'Goa, India', rating: 4.9, category: 'Adventure', desc: 'Trek through lush Western Ghats tropical forests to the majestic four-tiered waterfall.', price: 1500, priceDisplay: '₹1,500', duration: 'Full Day', image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&q=80' },
  { id: 4, title: 'Tropical Spice Plantation & Culinary Lunch', location: 'Goa, India', rating: 4.6, category: 'Food', desc: 'Guided aromatic spice garden walk followed by an authentic traditional buffet lunch.', price: 1200, priceDisplay: '₹1,200', duration: 'Half Day', image: 'https://images.unsplash.com/photo-1596423735880-5f2a689b903e?w=800&q=80' },
  { id: 5, title: 'Paragliding in Solang Valley', location: 'Manali, India', rating: 4.9, category: 'Adventure', desc: 'Soar through Himalayan mountain air with experienced tandem paragliding pilots.', price: 3500, priceDisplay: '₹3,500', duration: 'Under 2hrs', image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80' },
  { id: 6, title: 'Shibuya Night Street Food & Ramen Tour', location: 'Tokyo, Japan', rating: 4.8, category: 'Food', desc: 'Guided night walking tour tasting authentic tonkotsu ramen, yakitori, and matcha.', price: 4500, priceDisplay: '₹4,500', duration: 'Half Day', image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&q=80' },
  { id: 7, title: 'Fushimi Inari Torii Shrine Sunrise Hike', location: 'Kyoto, Japan', rating: 5.0, category: 'Sightseeing', desc: 'Hike through thousands of vibrant red torii gates up the sacred Inari mountain.', price: 0, priceDisplay: 'Free', duration: 'Under 2hrs', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80' },
  { id: 8, title: 'Eiffel Tower Summit Access & Seine River Cruise', location: 'Paris, France', rating: 4.9, category: 'Sightseeing', desc: 'Panoramic views from the Eiffel Tower summit combined with a scenic 1-hour river cruise.', price: 5800, priceDisplay: '₹5,800', duration: 'Half Day', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80' },
  { id: 9, title: 'Mount Batur Sunrise Volcano Trek', location: 'Bali, Indonesia', rating: 4.7, category: 'Adventure', desc: 'Early morning guided trek up an active volcano to watch the sunrise above cloud level.', price: 2200, priceDisplay: '₹2,200', duration: 'Full Day', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80' },
  { id: 10, title: 'Traditional Tea Ceremony & Geisha District Walk', location: 'Kyoto, Japan', rating: 4.7, category: 'Culture', desc: 'Immerse in Japanese tea art in a historic Gion teahouse with traditional sweets.', price: 3200, priceDisplay: '₹3,200', duration: 'Under 2hrs', image: 'https://images.unsplash.com/photo-1578469550956-0e16b69c6a3d?w=800&q=80' },
];

const CATEGORIES = ['Adventure', 'Food', 'Water Sports', 'Sightseeing', 'Culture'];
const DURATIONS = ['All', 'Under 2hrs', 'Half Day', 'Full Day'];
const RATINGS = [
  { label: 'All', val: 0 },
  { label: '3+ Stars', val: 3.0 },
  { label: '4+ Stars', val: 4.0 },
  { label: '4.8+ Stars', val: 4.8 },
];

export const Screen8_SearchExplorer = () => {
  const { showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('All');
  const [minRating, setMinRating] = useState(0);

  // Toggle category check
  const handleCategoryToggle = (cat) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  // Reset all filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setMinPrice('');
    setMaxPrice('');
    setSelectedDuration('All');
    setMinRating(0);
    showToast('Filters cleared!');
  };

  // Filtered dataset computed cleanly
  const filteredResults = useMemo(() => {
    return INITIAL_ACTIVITIES.filter(item => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesQuery =
          item.title.toLowerCase().includes(q) ||
          item.location.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.desc.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }

      // 2. Categories
      if (selectedCategories.length > 0) {
        if (!selectedCategories.includes(item.category)) return false;
      }

      // 3. Min Price
      if (minPrice !== '' && !isNaN(Number(minPrice))) {
        if (item.price < Number(minPrice)) return false;
      }

      // 4. Max Price
      if (maxPrice !== '' && !isNaN(Number(maxPrice))) {
        if (item.price > Number(maxPrice)) return false;
      }

      // 5. Duration
      if (selectedDuration !== 'All') {
        if (item.duration !== selectedDuration) return false;
      }

      // 6. Rating
      if (minRating > 0) {
        if (item.rating < minRating) return false;
      }

      return true;
    });
  }, [searchQuery, selectedCategories, minPrice, maxPrice, selectedDuration, minRating]);

  const handleAdd = (title) => {
    showToast(`Added "${title}" to your trip!`);
  };

  return (
    <div style={{ backgroundColor: '#F5F3EF', minHeight: '100vh', padding: '32px 24px 60px', boxSizing: 'border-box' }}>
      <div style={{ maxWidth: '1320px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>

        {/* ══ TOP HEADER & SEARCH ════════════════════════════ */}
        <div>
          <p style={{ fontSize: '0.78rem', fontWeight: 700, color: '#E85D26', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
            Catalog Explorer
          </p>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.2rem', fontWeight: 800, color: '#1A1A2E', marginBottom: '16px' }}>
            Find Experiences & Activities
          </h1>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
              <Search size={18} color="#9CA3AF" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search experiences, destinations, or categories (e.g. Scuba, Tokyo, Food)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 20px 14px 48px',
                  borderRadius: '14px',
                  border: '1.5px solid #EDE9E2',
                  fontSize: '0.98rem',
                  fontFamily: 'inherit',
                  backgroundColor: '#FFFFFF',
                  outline: 'none',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="btn btn-outline"
                style={{ borderRadius: '14px', padding: '0 20px' }}
              >
                Clear Search
              </button>
            )}
          </div>

          <div style={{ color: '#6B7280', fontSize: '0.88rem', marginTop: '12px' }}>
            Showing <strong>{filteredResults.length}</strong> result{filteredResults.length !== 1 ? 's' : ''}
            {searchQuery ? ` matching "${searchQuery}"` : ''}
          </div>
        </div>

        {/* ══ MAIN LAYOUT: SIDEBAR + RESULTS ════════════════════ */}
        <div style={{ display: 'flex', gap: '28px', alignItems: 'flex-start', flexWrap: 'wrap' }}>

          {/* ── LEFT SIDEBAR FILTERS ────────────────────────── */}
          <div style={{
            width: '260px',
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            padding: '24px',
            position: 'sticky',
            top: '84px',
            zIndex: 10,
            flexShrink: 0,
            border: '1px solid #EDE9E2',
            boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
            maxHeight: 'calc(100vh - 104px)',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontFamily: 'Outfit, sans-serif', margin: 0, fontSize: '1.15rem', color: '#1A1A2E', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Filter size={16} color="#E85D26" /> Filters
              </h3>
              {(selectedCategories.length > 0 || minPrice !== '' || maxPrice !== '' || selectedDuration !== 'All' || minRating > 0 || searchQuery !== '') && (
                <button
                  onClick={handleClearFilters}
                  style={{ background: 'none', border: 'none', color: '#E85D26', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <RotateCcw size={12} /> Reset
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div style={{ marginBottom: '22px', borderBottom: '1px solid #F3F4F6', paddingBottom: '18px' }}>
              <h4 style={{ margin: '0 0 12px', fontSize: '0.86rem', color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Category</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {CATEGORIES.map(cat => {
                  const isChecked = selectedCategories.includes(cat);
                  return (
                    <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.88rem', color: isChecked ? '#1A1A2E' : '#4B5563', fontWeight: isChecked ? 700 : 500 }}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleCategoryToggle(cat)}
                        style={{ accentColor: '#E85D26', width: '16px', height: '16px', cursor: 'pointer' }}
                      />
                      {cat}
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Price Range Filter */}
            <div style={{ marginBottom: '22px', borderBottom: '1px solid #F3F4F6', paddingBottom: '18px' }}>
              <h4 style={{ margin: '0 0 12px', fontSize: '0.86rem', color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Price Range (₹)</h4>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #E2DDD5', fontSize: '0.85rem', outline: 'none', backgroundColor: '#FAFAF8' }}
                />
                <span style={{ color: '#9CA3AF' }}>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #E2DDD5', fontSize: '0.85rem', outline: 'none', backgroundColor: '#FAFAF8' }}
                />
              </div>
            </div>

            {/* Duration Filter */}
            <div style={{ marginBottom: '22px', borderBottom: '1px solid #F3F4F6', paddingBottom: '18px' }}>
              <h4 style={{ margin: '0 0 12px', fontSize: '0.86rem', color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Duration</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {DURATIONS.map(dur => (
                  <label key={dur} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.88rem', color: selectedDuration === dur ? '#1A1A2E' : '#4B5563', fontWeight: selectedDuration === dur ? 700 : 500 }}>
                    <input
                      type="radio"
                      name="duration"
                      checked={selectedDuration === dur}
                      onChange={() => setSelectedDuration(dur)}
                      style={{ accentColor: '#E85D26', width: '16px', height: '16px', cursor: 'pointer' }}
                    />
                    {dur}
                  </label>
                ))}
              </div>
            </div>

            {/* Rating Filter */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ margin: '0 0 12px', fontSize: '0.86rem', color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Minimum Rating</h4>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {RATINGS.map(r => (
                  <button
                    key={r.label}
                    onClick={() => setMinRating(r.val)}
                    style={{
                      flex: 1,
                      minWidth: '50px',
                      padding: '7px 4px',
                      border: '1px solid',
                      borderColor: minRating === r.val ? '#E85D26' : '#EDE9E2',
                      borderRadius: '8px',
                      backgroundColor: minRating === r.val ? '#FEF0E7' : '#FAFAF8',
                      color: minRating === r.val ? '#E85D26' : '#4B5563',
                      fontWeight: minRating === r.val ? 800 : 600,
                      cursor: 'pointer',
                      fontSize: '0.78rem',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear button */}
            <button
              onClick={handleClearFilters}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #E2DDD5',
                backgroundColor: '#FAFAF8',
                color: '#374151',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              Clear All Filters
            </button>
          </div>

          {/* ── RIGHT RESULTS MASONRY / GRID ──────────────────────── */}
          <div style={{ flex: 1, minWidth: '300px' }}>
            <AnimatePresence mode="popLayout">
              {filteredResults.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px', alignItems: 'start' }}>
                  {filteredResults.map(item => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.25 }}
                    >
                      <ResultCard item={item} handleAdd={handleAdd} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                /* Empty state when filters return 0 results */
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    padding: '60px 24px',
                    textAlign: 'center',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '20px',
                    border: '2px dashed #EDE9E2'
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}><Search size={40} color="#9CA3AF" /></div>
                  <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.4rem', fontWeight: 800, color: '#1A1A2E', marginBottom: '8px' }}>
                    No matching experiences found
                  </h3>
                  <p style={{ color: '#9CA3AF', fontSize: '0.9rem', marginBottom: '20px' }}>
                    Try adjusting your filters, expanding your price range, or searching for a different destination.
                  </p>
                  <button onClick={handleClearFilters} className="btn btn-primary">
                    Reset All Filters
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
};

const ResultCard = ({ item, handleAdd }) => {
  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      borderRadius: '20px',
      overflow: 'hidden',
      border: '1px solid #EDE9E2',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      display: 'flex',
      flexDirection: 'column',
      transition: 'box-shadow 0.2s ease, transform 0.2s ease'
    }}>
      <div style={{ position: 'relative', height: '180px' }}>
        <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', top: '12px', left: '12px', backgroundColor: '#FEF0E7', color: '#E85D26', border: '1px solid #FDDCC9', padding: '4px 10px', borderRadius: '8px', fontSize: '0.73rem', fontWeight: 800 }}>
          {item.category}
        </div>
        <div style={{ position: 'absolute', top: '12px', right: '12px', backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', color: '#FCD34D', padding: '4px 8px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '3px' }}>
          <Star size={12} fill="#FCD34D" color="#FCD34D" /> {item.rating}
        </div>
      </div>

      <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between', gap: '14px' }}>
        <div>
          <h4 style={{ fontFamily: 'Outfit, sans-serif', margin: '0 0 6px', fontSize: '1.05rem', fontWeight: 800, color: '#1A1A2E', lineHeight: 1.3 }}>
            {item.title}
          </h4>
          <div style={{ color: '#6B7280', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
            <MapPin size={12} color="#E85D26" /> {item.location}
          </div>
          <p style={{ color: '#64748B', fontSize: '0.84rem', lineHeight: '1.45', margin: 0 }}>
            {item.desc}
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '14px', borderTop: '1px solid #F3F4F6' }}>
          <div>
            <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, color: '#1A1A2E', fontSize: '1.05rem' }}>
              {item.priceDisplay}
            </div>
            <div style={{ color: '#9CA3AF', fontSize: '0.74rem' }}>
              {item.duration}
            </div>
          </div>
          <button
            onClick={() => handleAdd(item.title)}
            className="btn btn-dark"
            style={{ padding: '8px 14px', borderRadius: '10px', fontSize: '0.82rem', gap: '4px' }}
          >
            <Plus size={14} /> Add to Trip
          </button>
        </div>
      </div>
    </div>
  );
};
