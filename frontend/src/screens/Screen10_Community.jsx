import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Heart, Share2, Copy, MessageSquare, Plus, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Screen10_Community = () => {
  const { addTrip, setCurrentScreen, showToast } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);

  const communityPosts = [
    {
      id: 'post-1',
      author: 'Aarav Sharma',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      title: 'Ultimate 7-Day Japan Budget Itinerary (Tokyo + Kyoto) 🌸',
      destination: 'Japan',
      budget: '₹75,000',
      likes: 240,
      saves: 112,
      cover: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
      content: 'Just returned from an unforgettable week in Tokyo and Kyoto! Sharing my exact day-by-day food stops, bullet train bookings, and hotel tips below.'
    },
    {
      id: 'post-2',
      author: 'Riya Malhotra',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      title: 'Backpacking North Goa & Secret Beaches Guide 🌴',
      destination: 'Goa',
      budget: '₹18,000',
      likes: 185,
      saves: 94,
      cover: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
      content: 'How to spend 4 days in Goa under ₹20k including scooter rentals, beach shacks, and scuba diving at Grand Island!'
    },
    {
      id: 'post-3',
      author: 'Vikramaditya S.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      title: 'Winter Snow Trekking in Manali & Solang Valley 🏔️',
      destination: 'Himachal Pradesh',
      budget: '₹30,000',
      likes: 310,
      saves: 160,
      cover: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
      content: 'Detailed day-by-day packing guide and paragliding operator reviews for snow lovers heading to Himachal this season.'
    }
  ];

  const handleCopyTrip = (post) => {
    setCopiedId(post.id);
    const clonedTrip = {
      id: `copied-${Date.now()}`,
      name: `Copy of ${post.title.slice(0, 24)}...`,
      destination: post.destination,
      dates: 'Flexible Dates',
      durationDays: 7,
      status: 'Planned',
      progressPct: 0,
      estimatedBudget: 75000,
      spentBudget: 0,
      coverPhoto: post.cover,
      stops: [post.destination],
      categoryBreakdown: { flights: 30000, hotels: 25000, food: 10000, activities: 7000, transport: 3000 },
      days: []
    };
    addTrip(clonedTrip);
    showToast(`Cloned itinerary to "My Trips"! 🎉`);
    setTimeout(() => setCopiedId(null), 2500);
  };

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
          <span className="badge badge-emerald">Screen 10: Community Tab</span>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2rem', fontWeight: 800, color: '#064e3b', marginTop: '4px' }}>
            Travel Community & Public Itineraries 🌐
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Explore verified itineraries shared by fellow travelers and copy them directly to your account
          </p>
        </div>
        <button onClick={() => setShowShareModal(true)} className="btn btn-primary">
          <Plus size={18} /> Share Your Trip
        </button>
      </div>

      {/* Control Bar */}
      <div className="glass-card" style={{ padding: '16px 24px', backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ position: 'relative', width: '320px' }}>
          <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="Search community trips..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '8px 14px 8px 40px', fontSize: '0.88rem', borderRadius: '9999px', border: '1px solid #e2e8f0', outline: 'none' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-secondary" style={{ fontSize: '0.82rem' }}>Trending</button>
          <button className="btn btn-outline" style={{ fontSize: '0.82rem' }}>Most Saved</button>
          <button className="btn btn-outline" style={{ fontSize: '0.82rem' }}>Budget Trips</button>
        </div>
      </div>

      {/* Community Feed List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {communityPosts.map(post => (
          <div key={post.id} className="glass-card" style={{ padding: '24px', backgroundColor: '#ffffff', display: 'grid', gridTemplateColumns: '300px 1fr', gap: '24px', borderRadius: '20px' }}>
            <div style={{ height: '200px', borderRadius: '16px', overflow: 'hidden' }}>
              <img src={post.cover} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <img src={post.avatar} alt={post.author} style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                  <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0f172a' }}>{post.author}</span>
                  <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>• Shared 2 days ago</span>
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#064e3b', marginBottom: '8px' }}>{post.title}</h3>
                <p style={{ color: '#475569', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: '14px' }}>{post.content}</p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '14px' }}>
                <div style={{ display: 'flex', gap: '16px', fontSize: '0.84rem', color: '#64748b' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Heart size={16} color="#ef4444" /> {post.likes}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MessageSquare size={16} /> 42 Comments</span>
                  <span style={{ fontWeight: 700, color: '#047857' }}>Budget: {post.budget}</span>
                </div>

                {/* Copy Trip CTA (Excalidraw Requirement) */}
                <button 
                  onClick={() => handleCopyTrip(post)}
                  className="btn btn-primary" 
                  style={{ padding: '8px 18px', fontSize: '0.84rem' }}
                >
                  {copiedId === post.id ? <Check size={16} /> : <Copy size={16} />}
                  <span>{copiedId === post.id ? 'Copied to My Trips!' : 'Copy Trip'}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Share Trip Modal */}
      {showShareModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '500px', padding: '32px', backgroundColor: '#ffffff', borderRadius: '24px' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#064e3b', marginBottom: '12px' }}>Share Your Itinerary</h3>
            <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '20px' }}>Publish your trip to the Wanderly community so other travelers can view and clone it.</p>
            <div className="input-group">
              <label className="input-label">Select Trip to Share</label>
              <select className="input-field">
                <option>Japan Adventure 🇯🇵</option>
                <option>Goa Getaway 🌴</option>
              </select>
            </div>
            <div className="input-group">
              <label className="input-label">Travel Tips & Recommendations</label>
              <textarea className="input-field" rows={3} placeholder="Share your experience..." />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
              <button onClick={() => setShowShareModal(false)} className="btn btn-outline">Cancel</button>
              <button onClick={() => { showToast('Trip shared publicly to community!'); setShowShareModal(false); }} className="btn btn-primary">Publish Trip</button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
