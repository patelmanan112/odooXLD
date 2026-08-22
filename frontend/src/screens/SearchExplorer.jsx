import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Star, Plus, RotateCcw, Filter, Check } from 'lucide-react';

const CATEGORIES = ['Adventure', 'Food', 'Water Sports', 'Sightseeing', 'Culture'];
const DURATIONS = ['All', 'Under 2hrs', 'Half Day', 'Full Day'];
const RATINGS = [
  { label: 'All', val: 0 },
  { label: '3+ Stars', val: 3.0 },
  { label: '4+ Stars', val: 4.0 },
  { label: '4.8+ Stars', val: 4.8 },
];

const INITIAL_ACTIVITIES = [
  {
    id: 'exp-1',
    title: 'Scuba Diving at Grande Island',
    category: 'Water Sports',
    location: 'Goa, India',
    price: 3500,
    priceDisplay: '₹3,500',
    duration: 'Half Day',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80',
    desc: 'Explore underwater coral reefs and marine life with certified PADI instructors.'
  },
  {
    id: 'exp-2',
    title: 'Old Goa Heritage Walking Tour',
    category: 'Culture',
    location: 'Goa, India',
    price: 1200,
    priceDisplay: '₹1,200',
    duration: 'Under 2hrs',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80',
    desc: 'Guided walk through Portuguese architecture, ancient churches, and museums.'
  },
  {
    id: 'exp-3',
    title: 'Tokyo Street Food & Izakaya Crawl',
    category: 'Food',
    location: 'Shibuya, Tokyo',
    price: 4500,
    priceDisplay: '₹4,500',
    duration: 'Half Day',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80',
    desc: 'Taste authentic ramen, yakitori, and local drinks hidden in Tokyo alleyways.'
  },
  {
    id: 'exp-4',
    title: 'Kyoto Fushimi Inari Sunset Hike',
    category: 'Sightseeing',
    location: 'Kyoto, Japan',
    price: 2200,
    priceDisplay: '₹2,200',
    duration: 'Half Day',
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80',
    desc: 'Walk through thousands of vermilion torii gates up Mount Inari at sunset.'
  },
  {
    id: 'exp-5',
    title: 'Seine River Cruise with Dinner',
    category: 'Food',
    location: 'Paris, France',
    price: 8500,
    priceDisplay: '₹8,500',
    duration: 'Under 2hrs',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80',
    desc: 'Gourmet 3-course French dining along the illuminated Parisian monuments.'
  },
  {
    id: 'exp-6',
    title: 'Colosseum & Roman Forum VIP Access',
    category: 'Culture',
    location: 'Rome, Italy',
    price: 6200,
    priceDisplay: '₹6,200',
    duration: 'Half Day',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80',
    desc: 'Skip-the-line access to the ancient Arena Floor and gladiators quarters.'
  },
  {
    id: 'exp-7',
    title: 'Mount Batur Sunrise Trekking & Hot Spring',
    category: 'Adventure',
    location: 'Bali, Indonesia',
    price: 3800,
    priceDisplay: '₹3,800',
    duration: 'Full Day',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80',
    desc: 'Early morning hike to watch sunrise over active volcano followed by volcanic hot springs.'
  },
  {
    id: 'exp-8',
    title: 'Solang Valley Paragliding & ATV Ride',
    category: 'Adventure',
    location: 'Manali, India',
    price: 4200,
    priceDisplay: '₹4,200',
    duration: 'Half Day',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
    desc: 'Soar over Himalayan snow-capped peaks and power through mountain ATV trails.'
  }
];

export const SearchExplorer = () => {
  const { selectedTrip, updateTrip, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('All');
  const [minRating, setMinRating] = useState(0);
  const [addedIds, setAddedIds] = useState([]);

  const handleCategoryToggle = (cat) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setMinPrice('');
    setMaxPrice('');
    setSelectedDuration('All');
    setMinRating(0);
    if (showToast) showToast('Filters cleared!');
  };

  const filteredResults = useMemo(() => {
    return INITIAL_ACTIVITIES.filter(item => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesQuery =
          item.title.toLowerCase().includes(q) ||
          item.location.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.desc.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }

      if (selectedCategories.length > 0) {
        if (!selectedCategories.includes(item.category)) return false;
      }

      if (minPrice !== '' && !isNaN(Number(minPrice))) {
        if (item.price < Number(minPrice)) return false;
      }

      if (maxPrice !== '' && !isNaN(Number(maxPrice))) {
        if (item.price > Number(maxPrice)) return false;
      }

      if (selectedDuration !== 'All') {
        if (item.duration !== selectedDuration) return false;
      }

      if (minRating > 0) {
        if (item.rating < minRating) return false;
      }

      return true;
    });
  }, [searchQuery, selectedCategories, minPrice, maxPrice, selectedDuration, minRating]);

  const handleAdd = (item) => {
    setAddedIds(prev => [...prev, item.id]);

    if (selectedTrip) {
      const copy = { ...selectedTrip };
      const days = [...(copy.days || [])];
      if (days.length === 0) {
        days.push({
          id: `day-${Date.now()}`,
          dayNum: 1,
          title: `Day 1: ${copy.destination || 'Exploration'}`,
          date: copy.startDate || new Date().toISOString().split('T')[0],
          activities: []
        });
      }
      const day1 = { ...days[0] };
      const activities = [...(day1.activities || [])];
      activities.push({
        id: `act-${Date.now()}`,
        time: '02:00 PM',
        title: item.title,
        category: item.category,
        cost: item.price,
        notes: `Added from Explore (${item.location})`
      });
      day1.activities = activities;
      days[0] = day1;
      copy.days = days;

      if (updateTrip) updateTrip(copy);
      if (showToast) showToast(`Added "${item.title}" to ${copy.name || 'your trip'}! 🎉`);
    } else {
      if (showToast) showToast(`Added "${item.title}"! Create a trip to save your activities.`);
    }
  };

  return (
    <div style={{ backgroundColor: '#F5F3EF', minHeight: '100vh', padding: '32px 24px 60px', boxSizing: 'border-box' }}>
      <div style={{ maxWidth: '1320px', margin: '0 auto', position: 'relative' }}>

        {/* ── LEFT SIDEBAR FILTERS (NON-SCROLLABLE FIXED) ── */}
        <div style={{
          position: 'fixed',
          top: '84px',
          width: '260px',
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          padding: '20px',
          zIndex: 50,
          border: '1px solid #EDE9E2',
          boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
          boxSizing: 'border-box'
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

        {/* ── RIGHT MAIN CONTENT (INDENTED 288px SO SEARCH BAR & CARDS NEVER OVERLAP FILTER CARD) ── */}
        <div style={{ marginLeft: '288px', width: 'calc(100% - 288px)', display: 'flex', flexDirection: 'column', gap: '28px' }}>

          {/* Page Header & Search Bar */}
          <div>
            <p style={{ fontSize: '0.78rem', fontWeight: 700, color: '#E85D26', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
              Catalog Explorer
            </p>
            <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.2rem', fontWeight: 800, color: '#1A1A2E', marginBottom: '16px' }}>
              Find Experiences & Activities
            </h1>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
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

          {/* Experience Grid */}
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
                    <ResultCard item={item} isAdded={addedIds.includes(item.id)} handleAdd={handleAdd} />
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
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
                  <Search size={40} color="#9CA3AF" />
                </div>
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
  );
};

const ResultCard = ({ item, isAdded, handleAdd }) => {
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
            onClick={() => handleAdd(item)}
            className={isAdded ? "btn btn-outline" : "btn btn-dark"}
            style={{
              padding: '8px 14px',
              borderRadius: '10px',
              fontSize: '0.82rem',
              gap: '4px',
              backgroundColor: isAdded ? '#ECFDF5' : '#1A1A2E',
              color: isAdded ? '#059669' : '#FFFFFF',
              border: isAdded ? '1px solid #A7F3D0' : 'none'
            }}
          >
            {isAdded ? (
              <>
                <Check size={14} color="#059669" /> Added
              </>
            ) : (
              <>
                <Plus size={14} /> Add to Trip
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
