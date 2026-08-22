import React from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

export const Community = () => {
  const { addTrip, showToast } = useApp();
  const navigate = useNavigate();

  const handleClone = (post) => {
    const postTitle = typeof post === 'string' ? post : post.title;
    const postCover = typeof post === 'object' ? (post.coverPhoto || post.image) : 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1000&q=80';
    const postBudget = typeof post === 'object' ? (post.estimatedBudget || post.budget || 75000) : 75000;
    const cleanBudget = typeof postBudget === 'number' ? postBudget : parseFloat(String(postBudget).replace(/[^0-9.]/g, '')) || 75000;

    const clonedTrip = {
      id: `trip-${Date.now()}`,
      name: `Cloned: ${postTitle}`,
      title: `Cloned: ${postTitle}`,
      destination: postTitle.replace(/^Cloned:\s*/i, ''),
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
      dates: `${new Date().toLocaleDateString()} - ${new Date(Date.now() + 5 * 86400000).toLocaleDateString()}`,
      durationDays: 5,
      estimatedBudget: cleanBudget,
      spentBudget: 25800,
      coverPhoto: postCover,
      status: 'Upcoming',
      days: [
        {
          id: `day-1`,
          dayNum: 1,
          title: 'Day 1: Arrival & Exploration',
          date: new Date().toISOString().split('T')[0],
          activities: [
            { id: `act-1`, time: '10:00 AM', title: `Arrival Flight`, category: 'Flight', cost: 12000, notes: 'Cloned itinerary' },
            { id: `act-2`, time: '02:00 PM', title: 'Hotel Check-in', category: 'Stay', cost: 8500, notes: 'Cloned itinerary' },
            { id: `act-3`, time: '06:00 PM', title: 'Welcome Tasting Dinner', category: 'Food', cost: 1800, notes: 'Cloned itinerary' }
          ]
        },
        {
          id: `day-2`,
          dayNum: 2,
          title: 'Day 2: Guided Tour & Landmarks',
          date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
          activities: [
            { id: `act-4`, time: '09:30 AM', title: 'City Landmark Sightseeing', category: 'Sightseeing', cost: 3500, notes: 'Cloned itinerary' }
          ]
        }
      ]
    };

    if (addTrip) addTrip(clonedTrip);
    if (showToast) showToast(`Cloned "${postTitle}" to My Trips! 🎉`);
    navigate('/trips');
  };

  const [publicTrips, setPublicTrips] = React.useState([]);

  React.useEffect(() => {
    const fetchTrips = async () => {
      try {
        const { apiFetch } = await import('../utils/api.js');
        const res = await apiFetch('/api/community/trips');
        if (res.data) setPublicTrips(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTrips();
  }, []);

  const featuredPost = publicTrips.length > 0 ? publicTrips[0] : {
    title: 'Swiss Alps Backpacking',
    description: 'Discover how to experience the majestic views of Zermatt, Interlaken, and Grindelwald.',
    estimatedBudget: 75000,
    coverPhoto: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1000&q=80',
    user: { name: 'Sarah Jenkins', avatarUrl: 'https://i.pravatar.cc/150?img=44' }
  };
  
  const regularPosts = publicTrips.length > 1 ? publicTrips.slice(1).map(p => ({
    id: p.id,
    author: p.user?.name || 'User',
    avatar: p.user?.avatarUrl || 'https://i.pravatar.cc/150?img=11',
    title: p.title,
    desc: p.description || 'Awesome trip.',
    image: p.coverPhoto || 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80',
    likes: 120, comments: 14, budget: `₹${p.estimatedBudget || 50000}`
  })) : [
    {
      id: 'p1',
      author: 'Manan Patel',
      avatar: 'https://i.pravatar.cc/150?img=12',
      title: 'Goa Coastal Getaway',
      desc: 'Sun, sand, and serene beaches across North and South Goa.',
      image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80',
      likes: 184, comments: 28, budget: '₹35,000'
    },
    {
      id: 'p2',
      author: 'Aarav Sharma',
      avatar: 'https://i.pravatar.cc/150?img=33',
      title: 'Tokyo & Kyoto 7-Day Blitz',
      desc: 'High-speed bullet trains, neon streets, and tranquil Zen gardens.',
      image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&q=80',
      likes: 240, comments: 45, budget: '₹95,000'
    }
  ];

  return (
    <div style={{ backgroundColor: '#F5F3EF', minHeight: '100vh', padding: '40px', boxSizing: 'border-box' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '24px' }}>
        
        {/* MAIN CONTENT */}
        <div style={{ flex: 1 }}>
          
          {/* FEATURED POST */}
          <div style={{ backgroundColor: '#fff', borderRadius: '24px', display: 'flex', overflow: 'hidden', marginBottom: '32px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <img 
                src={featuredPost.coverPhoto || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1000&q=80"} 
                alt="Featured" 
                style={{ width: '60%', height: '350px', objectFit: 'cover' }} 
              />
              <div style={{ width: '40%', padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <img src={featuredPost.user?.avatarUrl || "https://i.pravatar.cc/150?img=44"} alt="Author" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                  <div>
                    <div style={{ fontWeight: 'bold', color: '#1A1A2E', fontSize: '0.9rem' }}>{featuredPost.user?.name || "Sarah Jenkins"}</div>
                    <div style={{ color: '#6B7280', fontSize: '0.8rem' }}>2 days ago</div>
                  </div>
                </div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#1A1A2E', margin: '0 0 12px', lineHeight: '1.2' }}>{featuredPost.title}</h2>
                <p style={{ color: '#4B5563', margin: '0 0 24px', fontSize: '0.95rem', lineHeight: '1.5' }}>{featuredPost.description || 'Check out this amazing itinerary.'}</p>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', fontSize: '0.9rem', color: '#4B5563', fontWeight: '500' }}>
                  <span>❤️ 240</span>
                  <span>💬 42</span>
                  <span style={{ paddingLeft: '16px', borderLeft: '1px solid #E5E7EB' }}>Budget: ₹{(featuredPost.estimatedBudget || 75000).toLocaleString('en-IN')}</span>
                </div>
                
                <button
                  onClick={() => handleClone(featuredPost)}
                  style={{ backgroundColor: '#E85D26', color: '#fff', padding: '14px', borderRadius: '12px', border: 'none', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', textAlign: 'center' }}
                >
                  Clone This Itinerary
                </button>
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
                      <span>Likes: {post.likes}</span>
                      <span>Comments: {post.comments}</span>
                    </div>
                    <button
                      onClick={() => handleClone(post)}
                      style={{ backgroundColor: '#1A1A2E', color: '#FFFFFF', padding: '8px 16px', borderRadius: '8px', border: 'none', fontWeight: '600', fontSize: '0.82rem', cursor: 'pointer' }}
                    >
                      Clone Itinerary
                    </button>
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
                  <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: '#FEF0E7', color: '#E85D26', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.85rem' }}>{i + 1}</div>
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
