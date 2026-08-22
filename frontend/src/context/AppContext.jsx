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

export const initialTrips = [];

export const initialDestinations = [];

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

  
  const fetchBackendData = async () => {
    if (!token) return;
    try {
      const tripsData = await apiFetch('/api/trips');
      const formattedTrips = tripsData.data.map(t => ({
        id: t.id,
        name: t.title,
        destination: t.title,
        dates: t.startDate && t.endDate ? `${new Date(t.startDate).toLocaleDateString()} - ${new Date(t.endDate).toLocaleDateString()}` : 'TBD',
        durationDays: t.startDate && t.endDate ? Math.ceil((new Date(t.endDate) - new Date(t.startDate)) / (1000 * 60 * 60 * 24)) : 0,
        status: t.status === 'DRAFT' ? 'Draft' : t.status === 'UPCOMING' ? 'Upcoming' : t.status === 'ONGOING' ? 'Ongoing' : 'Completed',
        progressPct: 50,
        estimatedBudget: parseFloat(t.estimatedBudget || 0),
        spentBudget: parseFloat(t.spentBudget || 0),
        coverPhoto: t.coverPhoto || 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80',
        stops: t.stops ? t.stops.map(s => s.city.name) : [],
        categoryBreakdown: { flights: 0, hotels: 0, food: 0, activities: 0, transport: 0 },
        days: t.stops ? t.stops.map(s => ({
          dayNum: s.stopOrder,
          title: `Stop in ${s.city.name}`,
          date: new Date(s.startDate).toLocaleDateString(),
          activities: s.tripActivities ? s.tripActivities.map(ta => ({
            time: ta.time || 'TBD',
            title: ta.activity.name,
            category: ta.activity.category,
            cost: parseFloat(ta.activity.estimatedCost),
            icon: 'MapPin',
            level: ta.activity.effortLevel === 'HIGH' ? 'High' : ta.activity.effortLevel === 'LOW' ? 'Low' : 'Moderate'
          })) : []
        })) : []
      }));
      setTrips(formattedTrips);
      if (formattedTrips.length > 0 && (!selectedTripId || !formattedTrips.find(t => t.id === selectedTripId))) {
        setSelectedTripId(formattedTrips[0].id);
      }

      const citiesData = await apiFetch('/api/cities');
      const formattedDestinations = citiesData.data.map((c, i) => ({
        id: c.id,
        name: c.name,
        country: c.country,
        type: 'Popular',
        duration: '3 Days',
        cost: '₹15,000',
        popular: i < 4,
        image: c.imageUrl || 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=600&q=80',
        saved: false
      }));
      setDestinations(formattedDestinations);
    } catch (err) {
      console.error('Failed to load backend data:', err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchBackendData();
    } else {
      setTrips([]);
      setDestinations([]);
    }
  }, [isAuthenticated, token]);

  const [trips, setTrips] = useState([]);

  const [destinations, setDestinations] = useState([]);
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
      showToast(`Welcome, ${formattedUser.name}! Logged in with Google.`);
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

  
  const addTrip = async (newTrip) => {
    try {
      const payload = {
        title: newTrip.name || newTrip.title || 'New Trip',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 5*24*60*60*1000).toISOString(),
        estimatedBudget: newTrip.estimatedBudget || 50000,
        status: (newTrip.status || 'DRAFT').toUpperCase(),
        coverPhoto: newTrip.coverPhoto || 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80'
      };
      const data = await apiFetch('/api/trips', { method: 'POST', body: JSON.stringify(payload) });
      showToast(`Trip "${payload.title}" created successfully! 🎉`);
      fetchBackendData();
    } catch (err) {
      showToast('Error creating trip: ' + err.message);
    }
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
