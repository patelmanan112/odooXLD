import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const initialTrips = [
  {
    id: 'trip-1',
    name: 'Japan Adventure',
    destination: 'Japan (Tokyo, Kyoto, Osaka)',
    dates: '12 Oct - 19 Oct 2026',
    durationDays: 7,
    status: 'Upcoming',
    progressPct: 70,
    estimatedBudget: 82000,
    spentBudget: 57400,
    coverPhoto: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
    stops: ['Mumbai', 'Tokyo', 'Kyoto', 'Osaka', 'Tokyo'],
    categoryBreakdown: {
      flights: 30000,
      hotels: 25000,
      food: 12000,
      activities: 10000,
      transport: 5000
    },
    days: [
      {
        dayNum: 1,
        title: 'Arrival in Tokyo',
        date: '12 Oct',
        activities: [
          { time: '09:00', title: 'Breakfast at Café de L\'Ambre', category: 'Food', cost: 1200, icon: 'Utensils', level: 'Low' },
          { time: '10:30', title: 'Senso-ji Temple Tour', category: 'Sightseeing', cost: 0, icon: 'Camera', level: 'Moderate' },
          { time: '13:00', title: 'Lunch at Ichiran Ramen', category: 'Food', cost: 1500, icon: 'Utensils', level: 'Low' },
          { time: '15:00', title: 'Shibuya Crossing & Hachiko Statue', category: 'Activity', cost: 500, icon: 'MapPin', level: 'Moderate' },
          { time: '19:30', title: 'Dinner at Sushi Dai', category: 'Food', cost: 3500, icon: 'Utensils', level: 'Low' }
        ]
      },
      {
        dayNum: 2,
        title: 'Historic Kyoto Exploration',
        date: '13 Oct',
        activities: [
          { time: '08:00', title: 'Shinkansen Bullet Train to Kyoto', category: 'Transport', cost: 7000, icon: 'Train', level: 'Low' },
          { time: '10:30', title: 'Fushimi Inari Shrine Hike', category: 'Adventure', cost: 0, icon: 'Compass', level: 'High' },
          { time: '14:00', title: 'Traditional Tea Ceremony', category: 'Culture', cost: 2500, icon: 'Coffee', level: 'Low' },
          { time: '18:00', title: 'Gion District Evening Walk', category: 'Sightseeing', cost: 0, icon: 'Eye', level: 'Moderate' }
        ]
      }
    ]
  },
  {
    id: 'trip-2',
    name: 'Goa Getaway',
    destination: 'Goa, India',
    dates: '5 Nov - 8 Nov 2026',
    durationDays: 4,
    status: 'Upcoming',
    progressPct: 40,
    estimatedBudget: 25000,
    spentBudget: 10000,
    coverPhoto: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    stops: ['Mumbai', 'North Goa', 'South Goa'],
    categoryBreakdown: {
      flights: 8000,
      hotels: 10000,
      food: 4000,
      activities: 2000,
      transport: 1000
    },
    days: []
  },
  {
    id: 'trip-3',
    name: 'Himachal Escape',
    destination: 'Manali & Solang Valley',
    dates: '20 Dec - 27 Dec 2026',
    durationDays: 8,
    status: 'Upcoming',
    progressPct: 20,
    estimatedBudget: 35000,
    spentBudget: 7000,
    coverPhoto: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
    stops: ['Chandigarh', 'Manali', 'Solang Valley'],
    categoryBreakdown: {
      flights: 12000,
      hotels: 12000,
      food: 5000,
      activities: 4000,
      transport: 2000
    },
    days: []
  },
  {
    id: 'trip-4',
    name: 'Bali Bliss',
    destination: 'Ubud & Seminyak, Indonesia',
    dates: '15 Jan - 22 Jan 2027',
    durationDays: 7,
    status: 'Planned',
    progressPct: 10,
    estimatedBudget: 65000,
    spentBudget: 6500,
    coverPhoto: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
    stops: ['Denpasar', 'Ubud', 'Seminyak'],
    categoryBreakdown: {
      flights: 25000,
      hotels: 20000,
      food: 10000,
      activities: 7000,
      transport: 3000
    },
    days: []
  }
];

export const initialDestinations = [
  { id: 'd1', name: 'Goa', country: 'India', type: 'Beaches', duration: '4 Days', cost: '₹12,000', popular: true, image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80', saved: true },
  { id: 'd2', name: 'Kashmir', country: 'India', type: 'Mountains', duration: '5 Days', cost: '₹18,000', popular: true, image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=600&q=80', saved: false },
  { id: 'd3', name: 'Bali', country: 'Indonesia', type: 'Trending', duration: '6 Days', cost: '₹35,000', popular: true, image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80', saved: true },
  { id: 'd4', name: 'Switzerland', country: 'Europe', type: 'Mountains', duration: '7 Days', cost: '₹85,000', popular: true, image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=600&q=80', saved: true },
  { id: 'd5', name: 'Iceland', country: 'Nordics', type: 'Adventure', duration: '8 Days', cost: '₹1,20,000', popular: false, image: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=600&q=80', saved: true },
  { id: 'd6', name: 'Maldives', country: 'Asia', type: 'Beaches', duration: '5 Days', cost: '₹90,000', popular: false, image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=600&q=80', saved: true },
  { id: 'd7', name: 'New Zealand', country: 'Oceania', type: 'Adventure', duration: '10 Days', cost: '₹1,50,000', popular: false, image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80', saved: true }
];

export const AppProvider = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState(3); // Default Screen 3 (Dashboard)
  const [user, setUser] = useState({
    name: 'Khush Patel',
    email: 'khush.patel@wanderly.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    phone: '+91 98765 43210',
    city: 'Mumbai',
    country: 'India',
    currency: '₹',
    totalBudget: 50000,
    usedBudget: 35000
  });

  const [trips, setTrips] = useState(initialTrips);
  const [destinations, setDestinations] = useState(initialDestinations);
  const [selectedTripId, setSelectedTripId] = useState('trip-1');
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleSaveDestination = (id) => {
    setDestinations(prev =>
      prev.map(d => d.id === id ? { ...d, saved: !d.saved } : d)
    );
    showToast('Saved destinations updated!');
  };

  const addTrip = (newTrip) => {
    setTrips(prev => [newTrip, ...prev]);
    setSelectedTripId(newTrip.id);
    showToast(`Trip "${newTrip.name}" created successfully! 🎉`);
  };

  const selectedTrip = trips.find(t => t.id === selectedTripId) || trips[0];

  return (
    <AppContext.Provider value={{
      currentScreen,
      setCurrentScreen,
      user,
      setUser,
      trips,
      setTrips,
      destinations,
      toggleSaveDestination,
      selectedTrip,
      setSelectedTripId,
      addTrip,
      showToast,
      toastMessage
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
