import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Trash2, Calendar, Clock, DollarSign, Edit3, ArrowLeft, Check,
  Plane, Hotel, Utensils, Camera, Train, Compass, X, Sparkles, AlertCircle
} from 'lucide-react';

/* ─── Category colors & icons ────────────── */
const CATEGORIES = [
  { name: 'Flight',      color: '#4F46E5', bg: '#EEF2FF', icon: Plane },
  { name: 'Stay',        color: '#7C3AED', bg: '#F5F3FF', icon: Hotel },
  { name: 'Food',        color: '#059669', bg: '#ECFDF5', icon: Utensils },
  { name: 'Sightseeing', color: '#D97706', bg: '#FFFBEB', icon: Camera },
  { name: 'Transport',   color: '#2563EB', bg: '#EFF6FF', icon: Train },
  { name: 'Activity',    color: '#E85D26', bg: '#FEF0E7', icon: Compass },
];

const getCatMeta = (name) => {
  return CATEGORIES.find(c => c.name.toLowerCase() === (name || '').toLowerCase()) || CATEGORIES[5];
};

export const BuildItinerary = () => {
  const { selectedTrip, updateTrip, showToast } = useApp();
  const navigate = useNavigate();

  const destName = selectedTrip?.destination || selectedTrip?.name || selectedTrip?.title || 'Destination';
  const tripBudget = selectedTrip?.estimatedBudget || 50000;

  /* ── Initial Sections (Days) ── */
  const defaultDays = [
    {
      id: 'day-1',
      dayNum: 1,
      title: `Day 1: Arrival & Exploring ${destName}`,
      date: selectedTrip?.startDate ? new Date(selectedTrip.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      activities: [
        { id: 'act-1', time: '10:00 AM', title: `Arrival Flight at ${destName}`, category: 'Flight', cost: 12000, notes: 'Terminal 2 arrival' },
        { id: 'act-2', time: '02:00 PM', title: `Check-in at Hotel`, category: 'Stay', cost: 8500, notes: 'Confirmation #8821' },
        { id: 'act-3', time: '06:30 PM', title: `Welcome Dinner`, category: 'Food', cost: 1800, notes: 'Local cuisine tasting' },
      ]
    },
    {
      id: 'day-2',
      dayNum: 2,
      title: `Day 2: Highlights & Culture Walk`,
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      activities: [
        { id: 'act-4', time: '09:00 AM', title: 'Guided Heritage Tour', category: 'Sightseeing', cost: 1500, notes: 'Meet guide at city center' },
        { id: 'act-5', time: '01:00 PM', title: 'Street Food & Cafe Lunch', category: 'Food', cost: 800, notes: 'Famous local spots' },
      ]
    }
  ];

  const initialDays = selectedTrip?.days && selectedTrip.days.length > 0 ? selectedTrip.days : defaultDays;

  const [days, setDays] = useState(initialDays);
  const [activeDayIndex, setActiveDayIndex] = useState(0);

  /* ── Form Modal state ── */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingActivityId, setEditingActivityId] = useState(null);
  const [formTime, setFormTime] = useState('10:00 AM');
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('Sightseeing');
  const [formCost, setFormCost] = useState('');
  const [formNotes, setFormNotes] = useState('');

  /* ── Robust Cost Parser ── */
  const parseCost = (val) => {
    if (val === null || val === undefined || val === '') return 0;
    if (typeof val === 'number') return isNaN(val) ? 0 : val;
    const cleaned = String(val).replace(/[^0-9.]/g, '');
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  };

  const activeDay = days[activeDayIndex] || days[0];

  /* ── Cost calculations ── */
  const totalCost = days.reduce((sum, day) => {
    return sum + (day.activities || []).reduce((s, act) => s + parseCost(act.cost), 0);
  }, 0);

  const budgetRemaining = tripBudget - totalCost;

  /* ── Day Handlers ── */
  const handleAddDay = () => {
    const nextNum = days.length + 1;
    const newDay = {
      id: `day-${Date.now()}`,
      dayNum: nextNum,
      title: `Day ${nextNum}: New Exploration`,
      date: new Date(Date.now() + (nextNum - 1) * 86400000).toISOString().split('T')[0],
      activities: []
    };
    setDays([...days, newDay]);
    setActiveDayIndex(days.length);
    showToast(`Added Day ${nextNum}`);
  };

  const handleDeleteDay = (dayId, e) => {
    e.stopPropagation();
    if (days.length <= 1) {
      showToast('Itinerary must have at least 1 day');
      return;
    }
    const updated = days.filter(d => d.id !== dayId).map((d, idx) => ({ ...d, dayNum: idx + 1 }));
    setDays(updated);
    setActiveDayIndex(Math.max(0, activeDayIndex - 1));
    showToast('Day removed');
  };

  /* ── Activity Modal Handlers ── */
  const openAddActivityModal = (presetCategory = 'Sightseeing') => {
    setEditingActivityId(null);
    setFormTime('11:00 AM');
    setFormTitle('');
    setFormCategory(presetCategory);
    setFormCost('');
    setFormNotes('');
    setIsModalOpen(true);
  };

  const openEditActivityModal = (activity) => {
    setEditingActivityId(activity.id);
    setFormTime(activity.time || '10:00 AM');
    setFormTitle(activity.title || activity.name || '');
    setFormCategory(activity.category || 'Sightseeing');
    setFormCost(activity.cost || '');
    setFormNotes(activity.notes || '');
    setIsModalOpen(true);
  };

  const handleSaveActivity = (e) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      showToast('Please enter an activity title');
      return;
    }

    const activityData = {
      id: editingActivityId || `act-${Date.now()}`,
      time: formTime,
      title: formTitle,
      category: formCategory,
      cost: parseCost(formCost),
      notes: formNotes
    };

    setDays(prevDays => {
      const copy = [...prevDays];
      const currentDay = { ...copy[activeDayIndex] };
      const currentActivities = [...(currentDay.activities || [])];

      if (editingActivityId) {
        // Edit existing
        const idx = currentActivities.findIndex(a => a.id === editingActivityId);
        if (idx !== -1) currentActivities[idx] = activityData;
      } else {
        // Add new
        currentActivities.push(activityData);
      }

      currentDay.activities = currentActivities;
      copy[activeDayIndex] = currentDay;
      return copy;
    });

    setIsModalOpen(false);
    showToast(editingActivityId ? 'Activity updated' : 'Activity added to timeline');
  };

  const handleDeleteActivity = (actId) => {
    setDays(prevDays => {
      const copy = [...prevDays];
      const currentDay = { ...copy[activeDayIndex] };
      currentDay.activities = (currentDay.activities || []).filter(a => a.id !== actId);
      copy[activeDayIndex] = currentDay;
      return copy;
    });
    showToast('Activity deleted');
  };

  /* ── Save & View Final Itinerary ── */
  const handleSaveAndFinish = () => {
    const categoryBreakdown = {
      flights: 0,
      hotels: 0,
      stay: 0,
      food: 0,
      activities: 0,
      transport: 0,
      sightseeing: 0
    };

    days.forEach(day => {
      (day.activities || []).forEach(act => {
        const catKey = (act.category || 'activities').toLowerCase();
        const cost = parseCost(act.cost);
        categoryBreakdown[catKey] = (categoryBreakdown[catKey] || 0) + cost;
      });
    });

    const tripId = selectedTrip?.id || `trip-${Date.now()}`;

    const updatedTrip = {
      id: tripId,
      name: selectedTrip?.name || selectedTrip?.title || `Trip to ${destName}`,
      title: selectedTrip?.title || selectedTrip?.name || `Trip to ${destName}`,
      destination: destName,
      startDate: selectedTrip?.startDate || (days[0]?.date || new Date().toISOString().split('T')[0]),
      endDate: selectedTrip?.endDate || (days[days.length - 1]?.date || new Date().toISOString().split('T')[0]),
      dates: selectedTrip?.dates || `${days[0]?.date || 'Day 1'} - ${days[days.length - 1]?.date || 'Day N'}`,
      durationDays: days.length,
      days: days,
      spentBudget: totalCost,
      estimatedBudget: tripBudget,
      coverPhoto: selectedTrip?.coverPhoto || 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80',
      categoryBreakdown,
      status: selectedTrip?.status || 'Upcoming'
    };

    if (updateTrip) {
      updateTrip(updatedTrip);
    }
    showToast('Itinerary saved successfully!');
    setTimeout(() => {
      navigate('/itinerary/view');
    }, 50);
  };

  return (
    <div style={{ backgroundColor: '#F5F3EF', minHeight: '100vh', paddingBottom: '80px' }}>

      {/* ══ TOP BAR HEADER ══════════════════════════════ */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #EDE9E2',
        padding: '16px 28px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            onClick={() => navigate('/trips')}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 14px', borderRadius: '8px', border: '1px solid #EDE9E2',
              backgroundColor: '#FAFAF8', color: '#6B7280', fontSize: '0.84rem', fontWeight: 600, cursor: 'pointer'
            }}
          >
            <ArrowLeft size={15} /> Trips
          </button>
          <div>
            <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.3rem', fontWeight: 800, color: '#1A1A2E', margin: 0 }}>
              {selectedTrip?.name || `Itinerary for ${destName}`}
            </h1>
            <p style={{ fontSize: '0.78rem', color: '#9CA3AF', margin: 0 }}>
              {destName} • {days.length} Days Planned
            </p>
          </div>
        </div>

        {/* Financial Counter & CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '0.72rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
              Spent / Budget
            </p>
            <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.15rem', fontWeight: 800, color: '#1A1A2E', margin: 0 }}>
              ₹{totalCost.toLocaleString('en-IN')}
              <span style={{ fontSize: '0.85rem', color: '#9CA3AF', fontWeight: 500 }}> / ₹{tripBudget.toLocaleString('en-IN')}</span>
            </p>
          </div>

          <button
            onClick={handleSaveAndFinish}
            className="btn btn-primary"
            style={{ padding: '10px 22px', fontSize: '0.9rem', borderRadius: '10px', gap: '6px' }}
          >
            <Check size={16} /> Save & View Itinerary
          </button>
        </div>
      </div>

      {/* ══ TWO PANEL LAYOUT: SIDEBAR + MAIN EDITOR ════════════════════ */}
      <div style={{ maxWidth: '1280px', margin: '24px auto 0', padding: '0 24px', display: 'flex', gap: '24px', alignItems: 'flex-start' }}>

        {/* ── LEFT SIDEBAR NAVIGATOR (260px) ────────────────────────── */}
        <div style={{
          width: '260px',
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          padding: '20px',
          border: '1px solid #EDE9E2',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.05rem', fontWeight: 800, color: '#1A1A2E', margin: 0 }}>
              Trip Days
            </h3>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#E85D26', backgroundColor: '#FEF0E7', padding: '2px 8px', borderRadius: '6px' }}>
              {days.length} Days
            </span>
          </div>

          {/* Days List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {days.map((day, idx) => {
              const isActive = activeDayIndex === idx;
              const actCount = (day.activities || []).length;
              return (
                <div
                  key={day.id}
                  onClick={() => setActiveDayIndex(idx)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    border: isActive ? '1.5px solid #E85D26' : '1.5px solid #EDE9E2',
                    backgroundColor: isActive ? '#FEF0E7' : '#FAFAF8',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    justify: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.92rem', fontWeight: isActive ? 800 : 700, color: isActive ? '#E85D26' : '#1A1A2E', margin: '0 0 2px' }}>
                      Day {day.dayNum || idx + 1}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: '#9CA3AF', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '150px' }}>
                      {day.title.replace(/^Day \d+:?\s*/i, '') || 'New Day'}
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#6B7280', backgroundColor: '#FFFFFF', padding: '2px 6px', borderRadius: '4px', border: '1px solid #EDE9E2' }}>
                      {actCount}
                    </span>
                    {days.length > 1 && (
                      <button
                        onClick={(e) => handleDeleteDay(day.id, e)}
                        title="Remove Day"
                        style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', padding: '2px' }}
                      >
                        <Trash2 size={13} color="#EF4444" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={handleAddDay}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '10px',
              border: '1.5px dashed #E85D26',
              backgroundColor: '#FEF0E7',
              color: '#E85D26',
              fontFamily: 'Outfit, sans-serif',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Plus size={16} /> Add Day {days.length + 1}
          </button>

          {/* Budget tracker box */}
          <div style={{ marginTop: '8px', paddingTop: '16px', borderTop: '1px solid #F3F4F6' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px' }}>
              <span style={{ color: '#6B7280', fontWeight: 600 }}>Remaining</span>
              <span style={{ fontWeight: 800, color: budgetRemaining >= 0 ? '#059669' : '#EF4444' }}>
                ₹{Math.abs(budgetRemaining).toLocaleString('en-IN')} {budgetRemaining < 0 ? 'over' : ''}
              </span>
            </div>
            <div style={{ height: '6px', backgroundColor: '#F3F4F6', borderRadius: '9999px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${Math.min(100, (totalCost / tripBudget) * 100)}%`,
                backgroundColor: budgetRemaining < 0 ? '#EF4444' : '#E85D26',
                borderRadius: '9999px',
                transition: 'width 0.4s ease'
              }} />
            </div>
          </div>
        </div>

        {/* ── RIGHT MAIN DAY EDITOR ────────────────────────── */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {activeDay && (
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              padding: '28px',
              border: '1px solid #EDE9E2',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}>

              {/* Day Header Inputs */}
              <div style={{ marginBottom: '24px', borderBottom: '1px solid #F3F4F6', paddingBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
                  <input
                    type="text"
                    value={activeDay.title}
                    onChange={(e) => {
                      const val = e.target.value;
                      setDays(prev => {
                        const copy = [...prev];
                        copy[activeDayIndex] = { ...copy[activeDayIndex], title: val };
                        return copy;
                      });
                    }}
                    style={{
                      fontFamily: 'Outfit, sans-serif',
                      fontSize: '1.5rem',
                      fontWeight: 800,
                      color: '#1A1A2E',
                      border: 'none',
                      outline: 'none',
                      backgroundColor: 'transparent',
                      width: '100%',
                      maxWidth: '500px'
                    }}
                    placeholder="Day Title (e.g. Day 1: Arrival & Exploration)"
                  />

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#FAFAF8', border: '1px solid #EDE9E2', borderRadius: '8px', padding: '6px 12px' }}>
                    <Calendar size={14} color="#9CA3AF" />
                    <input
                      type="date"
                      value={activeDay.date || ''}
                      onChange={(e) => {
                        const d = e.target.value;
                        setDays(prev => {
                          const copy = [...prev];
                          copy[activeDayIndex] = { ...copy[activeDayIndex], date: d };
                          return copy;
                        });
                      }}
                      style={{ border: 'none', outline: 'none', backgroundColor: 'transparent', fontSize: '0.84rem', fontFamily: 'inherit', color: '#1A1A2E' }}
                    />
                  </div>
                </div>
              </div>

              {/* Quick Add Preset Bar */}
              <div style={{ marginBottom: '28px' }}>
                <p style={{ fontSize: '0.78rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>
                  Quick Add Activity
                </p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {CATEGORIES.map(cat => {
                    const Icon = cat.icon;
                    return (
                      <button
                        key={cat.name}
                        onClick={() => openAddActivityModal(cat.name)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '7px 14px',
                          borderRadius: '8px',
                          border: `1px solid ${cat.color}30`,
                          backgroundColor: cat.bg,
                          color: cat.color,
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          transition: 'transform 0.15s ease'
                        }}
                      >
                        <Icon size={14} /> + {cat.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Activities Timeline List */}
              <div style={{ position: 'relative', paddingLeft: '28px' }}>
                {/* Vertical timeline line */}
                <div style={{
                  position: 'absolute',
                  left: '6px',
                  top: '12px',
                  bottom: '12px',
                  width: '3px',
                  backgroundColor: '#FEF0E7',
                  borderRadius: '9999px'
                }} />

                {(activeDay.activities || []).length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {activeDay.activities.map((act) => {
                      const meta = getCatMeta(act.category);
                      const Icon = meta.icon;
                      return (
                        <div
                          key={act.id}
                          style={{
                            position: 'relative',
                            display: 'flex',
                            gap: '14px',
                            alignItems: 'flex-start'
                          }}
                        >
                          {/* Timeline Dot */}
                          <div style={{
                            position: 'absolute',
                            left: '-28px',
                            top: '10px',
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            backgroundColor: '#FFFFFF',
                            border: `3px solid ${meta.color}`,
                            zIndex: 2
                          }} />

                          {/* Time */}
                          <div style={{ width: '70px', fontSize: '0.78rem', fontWeight: 700, color: '#9CA3AF', paddingTop: '8px', flexShrink: 0 }}>
                            {act.time}
                          </div>

                          {/* Card Content */}
                          <div style={{
                            flex: 1,
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #EDE9E2',
                            borderRadius: '14px',
                            padding: '14px 18px',
                            display: 'flex',
                            justify: 'space-between',
                            alignItems: 'center',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.03)'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: meta.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <Icon size={18} color={meta.color} />
                              </div>
                              <div>
                                <p style={{ fontWeight: 700, fontSize: '0.96rem', color: '#1A1A2E', margin: '0 0 4px' }}>
                                  {act.title || act.name}
                                </p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <span style={{ fontSize: '0.7rem', fontWeight: 700, backgroundColor: meta.bg, color: meta.color, padding: '2px 6px', borderRadius: '4px' }}>
                                    {act.category}
                                  </span>
                                  {act.notes && (
                                    <span style={{ fontSize: '0.78rem', color: '#9CA3AF' }}>
                                      • {act.notes}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                              <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1rem', fontWeight: 800, color: '#1A1A2E' }}>
                                {act.cost > 0 ? `₹${Number(act.cost).toLocaleString('en-IN')}` : 'Free'}
                              </span>
                              <div style={{ display: 'flex', gap: '4px' }}>
                                <button
                                  onClick={() => openEditActivityModal(act)}
                                  style={{ padding: '6px', borderRadius: '6px', border: '1px solid #EDE9E2', backgroundColor: '#FAFAF8', color: '#6B7280', cursor: 'pointer' }}
                                  title="Edit Activity"
                                >
                                  <Edit3 size={14} />
                                </button>
                                <button
                                  onClick={() => handleDeleteActivity(act.id)}
                                  style={{ padding: '6px', borderRadius: '6px', border: '1px solid #FEE2E2', backgroundColor: '#FFF5F5', color: '#EF4444', cursor: 'pointer' }}
                                  title="Delete Activity"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  /* Empty state for day */
                  <div style={{ padding: '40px 20px', textAlign: 'center', border: '2px dashed #E2DDD5', borderRadius: '16px', backgroundColor: '#FAFAF8' }}>
                    <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.1rem', fontWeight: 800, color: '#1A1A2E', margin: '0 0 6px' }}>
                      No activities added for Day {activeDay.dayNum || activeDayIndex + 1}
                    </p>
                    <p style={{ fontSize: '0.85rem', color: '#9CA3AF', margin: '0 0 16px' }}>
                      Use the quick-add buttons above or create a custom activity.
                    </p>
                    <button
                      onClick={() => openAddActivityModal()}
                      className="btn btn-primary"
                      style={{ padding: '8px 18px', fontSize: '0.84rem' }}
                    >
                      <Plus size={15} /> Add First Activity
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ══ INTERACTIVE ADD / EDIT ACTIVITY MODAL ════════════════════ */}
      <AnimatePresence>
        {isModalOpen && (
          <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
            backdropFilter: 'blur(4px)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                width: '100%',
                maxWidth: '480px',
                padding: '24px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                border: '1px solid #EDE9E2'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.2rem', fontWeight: 800, color: '#1A1A2E', margin: 0 }}>
                  {editingActivityId ? 'Edit Activity' : 'Add Activity'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', padding: '4px' }}
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveActivity} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                {/* Title */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>
                    Activity Title *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Scuba Diving Session, Kaiseki Dinner..."
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: '1.5px solid #E2DDD5',
                      fontSize: '0.9rem',
                      fontFamily: 'inherit',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                    required
                  />
                </div>

                {/* Category & Time */}
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>
                      Category
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        border: '1.5px solid #E2DDD5',
                        fontSize: '0.9rem',
                        fontFamily: 'inherit',
                        backgroundColor: '#FFFFFF',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    >
                      {CATEGORIES.map(c => (
                        <option key={c.name} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>
                      Time
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 10:00 AM"
                      value={formTime}
                      onChange={(e) => setFormTime(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        border: '1.5px solid #E2DDD5',
                        fontSize: '0.9rem',
                        fontFamily: 'inherit',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                {/* Cost */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>
                    Cost (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={formCost}
                    onChange={(e) => setFormCost(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: '1.5px solid #E2DDD5',
                      fontSize: '0.9rem',
                      fontFamily: 'inherit',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                {/* Notes */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>
                    Notes / Details (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Reservation confirmation #9812..."
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: '1.5px solid #E2DDD5',
                      fontSize: '0.9rem',
                      fontFamily: 'inherit',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="btn btn-outline"
                    style={{ flex: 1, padding: '10px' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ flex: 1, padding: '10px' }}
                  >
                    {editingActivityId ? 'Update Activity' : 'Save Activity'}
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
