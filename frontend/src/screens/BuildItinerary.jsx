import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Calendar } from 'lucide-react';

const CATEGORY_COLORS = {
  Flight: '#3B82F6', // blue
  Hotel: '#A855F7', // purple
  Food: '#22C55E', // green
  Transport: '#EAB308', // yellow
  Sightseeing: '#F97316' // orange
};

export const BuildItinerary = () => {
  const { selectedTrip, showToast } = useApp();
  const navigate = useNavigate();

  // Mock data if selectedTrip doesn't have sections
  const initialSections = selectedTrip?.sections?.length > 0 ? selectedTrip.sections : [
    {
      id: 's1',
      title: 'Day 1: Arrival & Explorer',
      date: '2024-06-10',
      budget: 200,
      activities: [
        { id: 'a1', category: 'Flight', time: '10:00 AM', name: 'Flight to Paris', cost: 450 },
        { id: 'a2', category: 'Hotel', time: '02:00 PM', name: 'Check-in at Le Meurice', cost: 0 },
        { id: 'a3', category: 'Sightseeing', time: '04:00 PM', name: 'Eiffel Tower Tour', cost: 35 },
      ]
    },
    {
      id: 's2',
      title: 'Day 2: Museum Hopping',
      date: '2024-06-11',
      budget: 150,
      activities: [
        { id: 'a4', category: 'Food', time: '09:00 AM', name: 'Breakfast at Café de Flore', cost: 25 },
        { id: 'a5', category: 'Sightseeing', time: '11:00 AM', name: 'Louvre Museum', cost: 20 },
      ]
    }
  ];

  const [sections, setSections] = useState(initialSections);
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);

  const activeSection = sections[activeSectionIndex];

  const handleAddSection = () => {
    const newSection = {
      id: Date.now().toString(),
      title: `Day ${sections.length + 1}: New Day`,
      date: '',
      budget: 0,
      activities: []
    };
    setSections([...sections, newSection]);
    setActiveSectionIndex(sections.length);
  };

  const handleAddActivity = () => {
    const newActivity = {
      id: Date.now().toString(),
      category: 'Sightseeing',
      time: '12:00 PM',
      name: 'New Activity',
      cost: 0
    };
    
    setSections(prev => {
      const newSections = [...prev];
      newSections[activeSectionIndex].activities.push(newActivity);
      return newSections;
    });
  };

  const handleDeleteActivity = (activityId) => {
    setSections(prev => {
      const newSections = [...prev];
      newSections[activeSectionIndex].activities = newSections[activeSectionIndex].activities.filter(a => a.id !== activityId);
      return newSections;
    });
  };

  const handleFinish = () => {
    if (showToast) showToast('Itinerary saved!');
    navigate('/itinerary/view');
  };

  const totalCost = sections.reduce((acc, section) => {
    return acc + section.activities.reduce((sum, act) => sum + act.cost, 0);
  }, 0);
  
  const totalBudget = selectedTrip?.budget || 2000;
  const budgetRemaining = totalBudget - totalCost;

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 120px)', background: '#F5F3EF', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* Left Panel */}
      <div style={{ 
        width: '240px', 
        borderRight: '1px solid #E2E8F0', 
        display: 'flex', 
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: 'calc(100vh - 120px)'
      }}>
        <div style={{ padding: '24px 16px', borderBottom: '1px solid #E2E8F0' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1E293B', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {selectedTrip?.title || 'Summer in Paris'}
          </h2>
          <div style={{ fontSize: '13px', color: '#64748B', marginTop: '4px' }}>Itinerary Builder</div>
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 0' }}>
          {sections.map((section, index) => (
            <div 
              key={section.id}
              onClick={() => setActiveSectionIndex(index)}
              style={{
                padding: '12px 16px',
                cursor: 'pointer',
                borderLeft: activeSectionIndex === index ? '4px solid #E85D26' : '4px solid transparent',
                background: activeSectionIndex === index ? 'white' : 'transparent',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}
            >
              <div style={{ fontWeight: activeSectionIndex === index ? '600' : '500', color: activeSectionIndex === index ? '#1E293B' : '#475569', fontSize: '15px' }}>
                Day {index + 1}
              </div>
              <div style={{ fontSize: '12px', color: '#94A3B8' }}>{section.title.split(': ')[1] || section.title}</div>
            </div>
          ))}
          
          <button 
            onClick={handleAddSection}
            style={{ 
              margin: '16px', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '8px', 
              color: '#E85D26', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: '500', fontSize: '14px' 
            }}
          >
            <Plus size={16} /> Add Section
          </button>
        </div>

        <div style={{ padding: '24px 16px', borderTop: '1px solid #E2E8F0', background: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
            <span style={{ color: '#64748B' }}>Total Cost</span>
            <span style={{ fontWeight: '600', color: '#1E293B' }}>${totalCost}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
            <span style={{ color: '#64748B' }}>Remaining</span>
            <span style={{ fontWeight: '600', color: budgetRemaining >= 0 ? '#22C55E' : '#EF4444' }}>${budgetRemaining}</span>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div style={{ flex: 1, background: 'white', padding: '40px', overflowY: 'auto', position: 'relative' }}>
        
        {activeSection ? (
          <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '100px' }}>
            
            {/* Section Header */}
            <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <input 
                  type="text" 
                  value={activeSection.title}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSections(prev => {
                      const newSections = [...prev];
                      newSections[activeSectionIndex].title = val;
                      return newSections;
                    });
                  }}
                  style={{ fontSize: '28px', fontWeight: 'bold', color: '#1E293B', border: 'none', outline: 'none', width: '100%', background: 'transparent', marginBottom: '8px' }}
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#64748B', fontSize: '14px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={16} /> {activeSection.date || 'No date set'}</span>
                </div>
              </div>
              <div style={{ background: '#F1F5F9', padding: '6px 12px', borderRadius: '16px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>
                Budget: ${activeSection.budget}
              </div>
            </div>

            {/* Activities Timeline */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {activeSection.activities.map((activity, idx) => (
                <div key={activity.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 0', borderBottom: '1px solid #F1F5F9' }}>
                  <div style={{ width: '80px', fontSize: '14px', fontWeight: '500', color: '#64748B', flexShrink: 0 }}>
                    {activity.time}
                  </div>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: CATEGORY_COLORS[activity.category] || '#CBD5E1', flexShrink: 0 }}></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', color: '#1E293B', fontSize: '16px', marginBottom: '4px' }}>{activity.name}</div>
                    <div style={{ fontSize: '13px', color: '#94A3B8' }}>{activity.category}</div>
                  </div>
                  <div style={{ fontWeight: '600', color: '#475569', fontSize: '15px' }}>
                    ${activity.cost}
                  </div>
                  <button 
                    onClick={() => handleDeleteActivity(activity.id)}
                    style={{ background: 'transparent', border: 'none', color: '#CBD5E1', cursor: 'pointer', padding: '8px' }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              
              <button 
                onClick={handleAddActivity}
                style={{ 
                  marginTop: '16px', padding: '16px', border: '2px dashed #E2E8F0', borderRadius: '12px', background: 'transparent',
                  color: '#64748B', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#F8FAFC'}
                onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <Plus size={18} /> Add Activity
              </button>
            </div>
            
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94A3B8' }}>
            No sections added yet.
          </div>
        )}

        {/* Floating Button */}
        <button 
          onClick={handleFinish}
          style={{
            position: 'fixed',
            bottom: '40px',
            right: '40px',
            background: '#E85D26',
            color: 'white',
            padding: '16px 32px',
            borderRadius: '30px',
            fontWeight: 'bold',
            fontSize: '16px',
            border: 'none',
            boxShadow: '0 10px 25px -5px rgba(232, 93, 38, 0.4)',
            cursor: 'pointer',
            transition: 'transform 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          View Final Itinerary
        </button>

      </div>
    </div>
  );
};
