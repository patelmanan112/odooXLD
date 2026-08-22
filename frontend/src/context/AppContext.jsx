import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { apiFetch } from '../utils/api';

const AppContext = createContext();

export const ROUTE_MAP = {
  1: '/login',
  2: '/register',
  3: '/dashboard',
  4: '/trips/new',
  5: '/itinerary/builder',
  6: '/trips',
  7: '/profile',
  8: '/explore',
  9: '/itinerary/view',
  10: '/journal',
  11: '/calendar',
  12: '/admin'
};

export const PATH_TO_SCREEN = {
  '/login': 1,
  '/register': 2,
  '/': 3,
  '/dashboard': 3,
  '/trips/new': 4,
  '/itinerary/builder': 5,
  '/trips': 6,
  '/profile': 7,
  '/settings': 7,
  '/explore': 8,
  '/itinerary/view': 9,
  '/journal': 10,
  '/community': 10,
  '/calendar': 11,
  '/admin': 12
};

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
  const navigate = useNavigate();
  const location = useLocation();

  // Auth State
  const [token, setToken] = useState(() => localStorage.getItem('wanderly_token'));
  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem('wanderly_user');
    return cached ? JSON.parse(cached) : null;
  });
  const [authLoading, setAuthLoading] = useState(true);
  const [prefilledEmail, setPrefilledEmail] = useState('');

  // Active Screen mapped to URL
  const currentScreen = PATH_TO_SCREEN[location.pathname] || 3;

  const setCurrentScreen = (screenIdOrPath) => {
    if (typeof screenIdOrPath === 'number') {
      const targetPath = ROUTE_MAP[screenIdOrPath] || '/dashboard';
      navigate(targetPath);
    } else if (typeof screenIdOrPath === 'string') {
      navigate(screenIdOrPath);
    }
  };

  const isAuthenticated = !!token && !!user;

  // Persistent Token Verification on Mount
  useEffect(() => {
    const verifySession = async () => {
      const storedToken = localStorage.getItem('wanderly_token');
      if (!storedToken) {
        setAuthLoading(false);
        return;
      }
      try {
        const data = await apiFetch('/api/auth/me');
        if (data && data.user) {
          setUser(data.user);
        }
      } catch (err) {
        localStorage.removeItem('wanderly_token');
        localStorage.removeItem('wanderly_user');
        setToken(null);
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    };
    verifySession();
  }, []);

  const [trips, setTrips] = useState(initialTrips);
  const [destinations, setDestinations] = useState(initialDestinations);
  const [selectedTripId, setSelectedTripId] = useState('trip-1');
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const checkEmailExist = async (email) => {
    try {
      const data = await apiFetch(`/api/auth/check-email?email=${encodeURIComponent(email)}`);
      return data;
    } catch (err) {
      showToast(err.message || 'Error checking email.');
      return { exists: false };
    }
  };

  const loginUser = async (email, password) => {
    try {
      const data = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      const formattedUser = {
        ...data.user,
        currency: data.user.currency || '₹',
        avatar: data.user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
      };

      localStorage.setItem('wanderly_token', data.token);
      localStorage.setItem('wanderly_user', JSON.stringify(formattedUser));

      setToken(data.token);
      setUser(formattedUser);
      showToast('Logged in successfully! Welcome back.');
      navigate('/dashboard');
      return { success: true };
    } catch (err) {
      showToast(err.message || 'Login failed. Please check your credentials.');
      return { success: false, error: err.message };
    }
  };

  const signupUser = async (signupData) => {
    try {
      const data = await apiFetch('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify(signupData)
      });

      const formattedUser = {
        ...data.user,
        currency: data.user.currency || '₹',
        avatar: data.user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
      };

      localStorage.setItem('wanderly_token', data.token);
      localStorage.setItem('wanderly_user', JSON.stringify(formattedUser));

      setToken(data.token);
      setUser(formattedUser);
      showToast('Account created successfully! Welcome to Wanderly.');
      navigate('/dashboard');
      return { success: true };
    } catch (err) {
      showToast(err.message || 'Registration failed. Please try again.');
      return { success: false, error: err.message };
    }
  };

  const googleLoginUser = async (googlePayload = {}) => {
    try {
      const payload = {
        email: googlePayload.email || 'alex.wanderer@gmail.com',
        name: googlePayload.name || 'Alex Wanderer',
        avatarUrl: googlePayload.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
      };

      const data = await apiFetch('/api/auth/google', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      const formattedUser = {
        ...data.user,
        currency: data.user.currency || '₹',
        avatar: data.user.avatarUrl || payload.avatarUrl
      };

      localStorage.setItem('wanderly_token', data.token);
      localStorage.setItem('wanderly_user', JSON.stringify(formattedUser));

      setToken(data.token);
      setUser(formattedUser);
      showToast(`Welcome, ${formattedUser.name}! Logged in with Google. ✨`);
      navigate('/dashboard');
      return { success: true };
    } catch (err) {
      showToast(err.message || 'Google Sign-In failed. Please try again.');
      return { success: false, error: err.message };
    }
  };


  
  const updateUser = async (updateData) => {
    try {
      const data = await apiFetch('/api/auth/me', {
        method: 'PUT',
        body: JSON.stringify(updateData)
      });
      const formattedUser = {
        ...data.user,
        currency: data.user.currency || ',1',
        avatar: data.user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
      };
      setUser(prev => ({ ...prev, ...formattedUser }));
      localStorage.setItem('wanderly_user', JSON.stringify(formattedUser));
      showToast('Profile updated successfully!');
      return true;
    } catch (error) {
      showToast(error.message || 'Failed to update profile');
      return false;
    }
  };

  const logout = (showNotification = true) => {
    localStorage.removeItem('wanderly_token');
    localStorage.removeItem('wanderly_user');
    setToken(null);
    setUser(null);
    navigate('/');
    if (showNotification) {
      showToast('Logged out successfully.');
    }
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
      token,
      user,
      setUser,
      isAuthenticated,
      authLoading,
      checkEmailExist,
      loginUser,
      signupUser,
      googleLoginUser,
      logout,
      prefilledEmail,
      setPrefilledEmail,
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
