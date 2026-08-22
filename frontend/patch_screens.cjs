const fs = require('fs');

const commFile = 'c:/Users/MANAN/OneDrive/Desktop/odooXld/frontend/src/screens/Screen10_Community.jsx';
let commContent = fs.readFileSync(commFile, 'utf-8');

commContent = commContent.replace(/import React from 'react';/, "import React, { useState, useEffect } from 'react';\nimport { apiFetch } from '../utils/api';");

const fetchCommCode = `
  const [publicTrips, setPublicTrips] = useState([]);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await apiFetch('/api/community/trips');
        if (res.data) setPublicTrips(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTrips();
  }, []);

  const featuredPost = publicTrips.length > 0 ? publicTrips[0] : null;
  const regularPosts = publicTrips.length > 1 ? publicTrips.slice(1) : [];

  const handleClone = (trip) => {
    const newTrip = {
      id: \`cloned-\${Date.now()}\`,
      name: \`Copy of \${trip.title}\`,
      destination: trip.title,
      dates: 'TBD',
      durationDays: 5,
      status: 'Planned',
      progressPct: 0,
      estimatedBudget: trip.estimatedBudget || 50000,
      spentBudget: 0,
      coverPhoto: trip.coverPhoto || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1000&q=80',
      stops: [],
      categoryBreakdown: { flights: 0, hotels: 0, food: 0, activities: 0, transport: 0 },
      days: []
    };
    addTrip?.(newTrip);
  };
`;

commContent = commContent.replace(/const handleClone =[\s\S]*?\];/m, fetchCommCode);

// Fix featured post jsx
commContent = commContent.replace(
  /\{\/\* FEATURED POST \*\/\}.*?<div style=\{\{ display: 'flex', gap: '12px'/ms,
  \`{/* FEATURED POST */}
          {featuredPost && (
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
                  <div style={{ fontWeight: 'bold', color: '#1A1A2E', fontSize: '0.9rem' }}>{featuredPost.user?.name || 'Wanderly User'}</div>
                  <div style={{ color: '#6B7280', fontSize: '0.8rem' }}>Recent</div>
                </div>
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#1A1A2E', margin: '0 0 12px', lineHeight: '1.2' }}>{featuredPost.title}</h2>
              <p style={{ color: '#4B5563', margin: '0 0 24px', fontSize: '0.95rem', lineHeight: '1.5' }}>{featuredPost.description || 'Check out this amazing itinerary!'}</p>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', fontSize: '0.9rem', color: '#4B5563', fontWeight: '500' }}>
                <span>❤️ {Math.floor(Math.random() * 500) + 50}</span>
                <span>💬 {Math.floor(Math.random() * 50) + 5}</span>
                <span style={{ paddingLeft: '16px', borderLeft: '1px solid #E5E7EB' }}>Budget: ₹{featuredPost.estimatedBudget || 0}</span>
              </div>
              
              <button onClick={() => handleClone(featuredPost)} style={{ backgroundColor: 'var(--accent-terracotta)', color: 'var(--text-main)', padding: '14px', borderRadius: '12px', border: 'none', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', textAlign: 'center' }}>Clone This Itinerary</button>
            </div>
          </div>
          )}

          <div style={{ display: 'flex', gap: '12px'\`
);

// Fix regular posts jsx
commContent = commContent.replace(
  /\{regularPosts\.map\(post => \([\s\S]*?\)\)\}/m,
  \`{regularPosts.map(post => (
              <div key={post.id} style={{ backgroundColor: '#fff', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <img src={post.coverPhoto || 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80'} alt={post.title} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
                <div style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <img src={post.user?.avatarUrl || 'https://i.pravatar.cc/150?img=11'} alt={post.user?.name} style={{ width: '24px', height: '24px', borderRadius: '50%' }} />
                    <span style={{ fontSize: '0.8rem', color: '#6B7280', fontWeight: '500' }}>{post.user?.name || 'Wanderly User'}</span>
                  </div>
                  <h3 style={{ margin: '0 0 8px', fontSize: '1.1rem', color: '#1A1A2E', lineHeight: '1.3' }}>{post.title}</h3>
                  <p style={{ margin: '0 0 16px', color: '#4B5563', fontSize: '0.85rem', lineHeight: '1.5', height: '40px', overflow: 'hidden' }}>{post.description || 'Check out this itinerary.'}</p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F3F4F6', paddingTop: '16px' }}>
                    <div style={{ fontSize: '0.8rem', color: '#6B7280', display: 'flex', gap: '12px' }}>
                      <span>❤️ {Math.floor(Math.random() * 200) + 10}</span>
                    </div>
                    <button onClick={() => handleClone(post)} style={{ backgroundColor: '#F3F4F6', color: '#1A1A2E', padding: '6px 12px', borderRadius: '8px', border: 'none', fontWeight: '600', fontSize: '0.8rem', cursor: 'pointer' }}>Clone</button>
                  </div>
                </div>
              </div>
            ))}\`
);

fs.writeFileSync(commFile, commContent, 'utf-8');

const exploreFile = 'c:/Users/MANAN/OneDrive/Desktop/odooXld/frontend/src/screens/Screen8_SearchExplorer.jsx';
let exploreContent = fs.readFileSync(exploreFile, 'utf-8');

exploreContent = exploreContent.replace(/import React, \{ useState \} from 'react';/, "import React, { useState, useEffect } from 'react';\nimport { apiFetch } from '../utils/api';");

const fetchExploreCode = \`
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await apiFetch('/api/activities');
        if (Array.isArray(res)) setActivities(res);
      } catch (err) {
        console.error(err);
      }
    };
    fetchActivities();
  }, []);

  const results = activities;
\`;

exploreContent = exploreContent.replace(/const results = \[\s*\{[\s\S]*?\];/m, fetchExploreCode);

fs.writeFileSync(exploreFile, exploreContent, 'utf-8');

console.log('Updated Community and Explore screens successfully.');
