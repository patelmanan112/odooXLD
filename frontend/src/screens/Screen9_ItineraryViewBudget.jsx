import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Share2, Edit3, Download, DollarSign, Clock, Map } from 'lucide-react';

export const Screen9_ItineraryViewBudget = () => {
  const { selectedTrip, setCurrentScreen, showToast } = useApp();
  const navigate = useNavigate();

  // Mock data if selectedTrip is null
  const trip = selectedTrip || {
    name: "Summer in Kyoto",
    destination: "Kyoto, Japan",
    startDate: "2024-06-12",
    endDate: "2024-06-19",
    coverImage: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070&auto=format&fit=crop",
    budget: 2500,
    spent: 1850,
    status: "Upcoming",
    days: [
      {
        id: 1,
        date: "2024-06-12",
        title: "Arrival & Exploring Gion",
        activities: [
          { time: "10:00 AM", title: "Flight Arrival (KIX)", category: "Transport", cost: 0, color: "#4F46E5" },
          { time: "01:00 PM", title: "Check-in at Ryokan", category: "Stay", cost: 450, color: "#059669" },
          { time: "03:30 PM", title: "Gion District Walk", category: "Activity", cost: 0, color: "#D97706" },
          { time: "07:00 PM", title: "Kaiseki Dinner", category: "Food", cost: 120, color: "#DC2626" }
        ]
      },
      {
        id: 2,
        date: "2024-06-13",
        title: "Temples and Bamboo",
        activities: [
          { time: "08:00 AM", title: "Arashiyama Bamboo Grove", category: "Activity", cost: 15, color: "#D97706" },
          { time: "12:30 PM", title: "Noodle Shop Lunch", category: "Food", cost: 25, color: "#DC2626" },
          { time: "02:00 PM", title: "Kinkaku-ji (Golden Pavilion)", category: "Activity", cost: 10, color: "#D97706" }
        ]
      }
    ],
    categories: [
      { name: "Stay", spent: 900, limit: 1000, color: "#059669" },
      { name: "Food", spent: 450, limit: 600, color: "#DC2626" },
      { name: "Activity", spent: 200, limit: 500, color: "#D97706" },
      { name: "Transport", spent: 300, limit: 400, color: "#4F46E5" }
    ]
  };

  const handleShare = () => showToast("Share link copied to clipboard!");
  const handleEdit = () => showToast("Edit mode enabled");
  const handleDownload = () => showToast("Downloading PDF...");

  const totalDays = 8;
  const spentPercent = Math.min((trip.spent / trip.budget) * 100, 100);

  return (
    <div style={{ backgroundColor: '#F5F3EF', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif', paddingBottom: '60px' }}>
      
      {/* Top Header Section */}
      <div style={{ 
        position: 'relative', 
        height: '260px', 
        width: '100%', 
        backgroundImage: `url(${trip.coverImage || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800'})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div style={{ 
          position: 'absolute', inset: 0, 
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.8) 100%)',
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '40px'
        }}>
          
          <div style={{ position: 'absolute', top: '24px', right: '40px', display: 'flex', gap: '12px' }}>
            <button onClick={handleShare} style={{ 
              background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.4)', 
              color: '#FFF', padding: '8px 16px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' 
            }}>
              <Share2 size={16} /> Share
            </button>
            <button onClick={handleEdit} style={{ 
              background: '#FFF', color: '#1A1A2E', border: 'none', 
              padding: '8px 16px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 'bold' 
            }}>
              <Edit3 size={16} /> Edit
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <h1 style={{ color: '#FFF', fontSize: '2.5rem', fontWeight: 'bold', margin: '0 0 8px 0' }}>{trip.name}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#E2E8F0', fontSize: '1rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={16} /> {trip.destination}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={16} /> {trip.startDate} - {trip.endDate}</span>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              {[{label: 'Total Days', val: totalDays}, {label: 'Budget', val: `$${trip.budget}`}, {label: 'Status', val: trip.status}].map((stat, i) => (
                <div key={i} style={{ 
                  background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', padding: '12px 20px', 
                  borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', textAlign: 'center' 
                }}>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{stat.label}</div>
                  <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{stat.val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content: Two Columns */}
      <div style={{ maxWidth: '1200px', margin: '40px auto 0', padding: '0 24px', display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
        
        {/* Left: Timeline Journal */}
        <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '48px' }}>
          {trip.days.map((day, dIdx) => (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: dIdx * 0.1 }} key={day.id}>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <div style={{ background: '#E85D26', color: '#FFF', padding: '6px 16px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.875rem' }}>
                  Day {day.id} • {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
                <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#1A1A2E', fontWeight: '600' }}>{day.title}</h2>
                <div style={{ flex: 1, height: '1px', background: '#E2E8F0', marginLeft: '16px' }} />
              </div>

              <div style={{ position: 'relative', paddingLeft: '32px' }}>
                {/* Vertical Line */}
                <div style={{ position: 'absolute', left: '11px', top: '16px', bottom: '-16px', width: '3px', background: '#E85D26', borderRadius: '2px' }} />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {day.activities.map((act, aIdx) => (
                    <div key={aIdx} style={{ position: 'relative', display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                      {/* Dot */}
                      <div style={{ 
                        position: 'absolute', left: '-25.5px', top: '4px', width: '12px', height: '12px', 
                        borderRadius: '50%', background: '#FFF', border: `3px solid ${act.color}`, zIndex: 2 
                      }} />
                      
                      <div style={{ width: '80px', color: '#64748B', fontSize: '0.9rem', fontWeight: '500', paddingTop: '2px' }}>
                        {act.time}
                      </div>
                      
                      <div style={{ flex: 1, background: '#FFF', padding: '16px', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: '600', color: '#1A1A2E', fontSize: '1.05rem', marginBottom: '8px' }}>{act.title}</div>
                          <div style={{ display: 'inline-block', padding: '4px 10px', background: `${act.color}15`, color: act.color, borderRadius: '6px', fontSize: '0.75rem', fontWeight: '600' }}>
                            {act.category}
                          </div>
                        </div>
                        {act.cost > 0 && (
                          <div style={{ fontWeight: 'bold', color: '#334155' }}>
                            ${act.cost}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </motion.div>
          ))}
        </div>

        {/* Right: Sticky Panel */}
        <div style={{ flex: 1, position: 'sticky', top: '20px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ background: '#FFF', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '1.1rem', color: '#1A1A2E', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <DollarSign size={20} color="#E85D26" /> Budget Breakdown
            </h3>
            
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1A1A2E', lineHeight: '1' }}>${trip.spent}</div>
              <div style={{ color: '#64748B', fontSize: '0.9rem', marginTop: '8px' }}>of ${trip.budget} total budget</div>
            </div>

            <div style={{ height: '8px', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden', marginBottom: '24px' }}>
              <div style={{ height: '100%', width: `${spentPercent}%`, background: spentPercent > 90 ? '#DC2626' : '#E85D26', borderRadius: '4px' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {trip.categories.map((cat, idx) => {
                const p = Math.min((cat.spent / cat.limit) * 100, 100);
                return (
                  <div key={idx}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                      <span style={{ fontWeight: '600', color: '#334155' }}>{cat.name}</span>
                      <span style={{ color: '#64748B' }}>${cat.spent} / ${cat.limit}</span>
                    </div>
                    <div style={{ height: '6px', background: '#F1F5F9', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${p}%`, background: cat.color, borderRadius: '3px' }} />
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#64748B', fontSize: '0.9rem' }}>Avg. Per Day</span>
              <span style={{ fontWeight: 'bold', color: '#1A1A2E', fontSize: '1.1rem' }}>${Math.round(trip.spent / totalDays)}</span>
            </div>
          </div>

          <div style={{ background: '#FFF', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', color: '#1A1A2E' }}>Quick Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button onClick={handleEdit} style={{ width: '100%', padding: '12px', background: '#FFF3EE', color: '#E85D26', border: '1px solid #FFDCD0', borderRadius: '12px', fontWeight: '600', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', transition: 'background 0.2s' }}>
                <Edit3 size={18} /> Edit Itinerary
              </button>
              <button onClick={handleDownload} style={{ width: '100%', padding: '12px', background: '#F8FAFC', color: '#334155', border: '1px solid #E2E8F0', borderRadius: '12px', fontWeight: '600', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', transition: 'background 0.2s' }}>
                <Download size={18} /> Download PDF
              </button>
              <button onClick={handleShare} style={{ width: '100%', padding: '12px', background: '#F8FAFC', color: '#334155', border: '1px solid #E2E8F0', borderRadius: '12px', fontWeight: '600', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', transition: 'background 0.2s' }}>
                <Share2 size={18} /> Share Link
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
