import React from 'react';
import { useApp } from '../context/AppContext';

export const Screen10_Community = () => {
  const { addTrip, showToast } = useApp();

  const handleClone = (title) => {
    addTrip?.({ title, status: 'Draft' });
    showToast?.(`Cloned "${title}" to your trips!`);
  };

  const regularPosts = [
    { id: 1, author: 'Alex Chen', avatar: 'https://i.pravatar.cc/150?img=11', title: 'Hidden Gems of Kyoto in Autumn', desc: 'A 5-day itinerary focusing on lesser-known temples and local matcha houses.', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80', likes: 120, comments: 14, budget: '¥85,000' },
    { id: 2, author: 'Priya Sharma', avatar: 'https://i.pravatar.cc/150?img=5', title: 'South Goa Cafe Hopping', desc: 'The ultimate guide to the best aesthetic cafes and workspaces in South Goa.', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80', likes: 342, comments: 56, budget: '₹12,000' },
    { id: 3, author: 'Rohan Gupta', avatar: 'https://i.pravatar.cc/150?img=8', title: 'Manali Winter Expedition', desc: 'Trekking routes, igloo stays, and survival tips for a snow-filled adventure.', image: 'https://images.unsplash.com/photo-1605649487212-4d63b211261d?w=800&q=80', likes: 89, comments: 5, budget: '₹25,000' }
  ];

  return (
    <div style={{ backgroundColor: '#F5F3EF', minHeight: '100vh', padding: '40px', boxSizing: 'border-box' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '24px' }}>
        
        {/* MAIN CONTENT */}
        <div style={{ flex: 1 }}>
          
          {/* FEATURED POST */}
          <div style={{ backgroundColor: '#fff', borderRadius: '24px', display: 'flex', overflow: 'hidden', marginBottom: '32px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <img 
              src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1000&q=80" 
              alt="Featured" 
              style={{ width: '60%', height: '350px', objectFit: 'cover' }} 
            />
            <div style={{ width: '40%', padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <img src="https://i.pravatar.cc/150?img=44" alt="Sarah" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                <div>
                  <div style={{ fontWeight: 'bold', color: '#1A1A2E', fontSize: '0.9rem' }}>Sarah Jenkins</div>
                  <div style={{ color: '#6B7280', fontSize: '0.8rem' }}>2 days ago</div>
                </div>
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#1A1A2E', margin: '0 0 12px', lineHeight: '1.2' }}>Backpacking through the Swiss Alps on a Budget</h2>
              <p style={{ color: '#4B5563', margin: '0 0 24px', fontSize: '0.95rem', lineHeight: '1.5' }}>Discover how to experience the majestic views, scenic trains, and cozy hostels without breaking the bank.</p>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', fontSize: '0.9rem', color: '#4B5563', fontWeight: '500' }}>
                <span>❤️ 240</span>
                <span>💬 42</span>
                <span style={{ paddingLeft: '16px', borderLeft: '1px solid #E5E7EB' }}>Budget: ₹75,000</span>
              </div>
              
              <button onClick={() => handleClone('Swiss Alps Backpacking')} style={{ backgroundColor: '#E85D26', color: '#fff', padding: '14px', borderRadius: '12px', border: 'none', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', textAlign: 'center' }}>Clone This Itinerary</button>
            </div>
          </div>

          {/* FILTER PILLS */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '8px' }}>
            {['Trending', 'Most Saved', 'Budget', 'Solo', 'Family'].map((filter, i) => (
              <button key={filter} style={{ padding: '8px 20px', borderRadius: '20px', border: i === 0 ? 'none' : '1px solid #E5E7EB', backgroundColor: i === 0 ? '#1A1A2E' : '#fff', color: i === 0 ? '#fff' : '#4B5563', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                {filter}
              </button>
            ))}
          </div>

          {/* GRID OF REGULAR POSTS */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {regularPosts.map(post => (
              <div key={post.id} style={{ backgroundColor: '#fff', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <img src={post.image} alt={post.title} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
                <div style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <img src={post.avatar} alt={post.author} style={{ width: '24px', height: '24px', borderRadius: '50%' }} />
                    <span style={{ fontSize: '0.8rem', color: '#6B7280', fontWeight: '500' }}>{post.author}</span>
                  </div>
                  <h3 style={{ margin: '0 0 8px', fontSize: '1.1rem', color: '#1A1A2E', lineHeight: '1.3' }}>{post.title}</h3>
                  <p style={{ margin: '0 0 16px', color: '#4B5563', fontSize: '0.85rem', lineHeight: '1.5', height: '40px', overflow: 'hidden' }}>{post.desc}</p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F3F4F6', paddingTop: '16px' }}>
                    <div style={{ fontSize: '0.8rem', color: '#6B7280', display: 'flex', gap: '12px' }}>
                      <span>❤️ {post.likes}</span>
                      <span>💬 {post.comments}</span>
                    </div>
                    <button onClick={() => handleClone(post.title)} style={{ backgroundColor: '#F3F4F6', color: '#1A1A2E', padding: '6px 12px', borderRadius: '8px', border: 'none', fontWeight: '600', fontSize: '0.8rem', cursor: 'pointer' }}>Clone</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* RIGHT SIDEBAR */}
        <div style={{ width: '300px', flexShrink: 0 }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '24px', padding: '24px', marginBottom: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <h3 style={{ margin: '0 0 20px', fontSize: '1.1rem', color: '#1A1A2E' }}>Trending Destinations</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {['Kyoto, Japan', 'Goa, India', 'Bali, Indonesia', 'Paris, France', 'Reykjavik, Iceland'].map((dest, i) => (
                <div key={dest} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: '#FDE8E0', color: '#E85D26', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.85rem' }}>{i + 1}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', color: '#1A1A2E', fontSize: '0.95rem' }}>{dest}</div>
                    <div style={{ color: '#6B7280', fontSize: '0.8rem' }}>{1200 - (i * 200)} trips</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ backgroundColor: '#fff', borderRadius: '24px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <h3 style={{ margin: '0 0 20px', fontSize: '1.1rem', color: '#1A1A2E' }}>Top Contributors</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { name: 'Elena R.', count: 42, img: '41' },
                { name: 'Marcus T.', count: 38, img: '12' },
                { name: 'Sophie L.', count: 27, img: '23' }
              ].map((user) => (
                <div key={user.name} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img src={`https://i.pravatar.cc/150?img=${user.img}`} alt={user.name} style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', color: '#1A1A2E', fontSize: '0.95rem' }}>{user.name}</div>
                    <div style={{ color: '#E85D26', fontSize: '0.8rem', fontWeight: '500' }}>{user.count} itineraries</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
