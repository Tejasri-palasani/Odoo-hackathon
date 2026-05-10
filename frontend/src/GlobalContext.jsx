import React, { createContext, useState, useContext, useEffect } from 'react';
import { io } from 'socket.io-client';
import './components/Toast.css';

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

// Initial state helpers for persistence
const loadState = (key, defaultState) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultState;
  } catch (e) {
    return defaultState;
  }
};

export const GlobalProvider = ({ children }) => {
  const [completedTrips, setCompletedTrips] = useState([
    { id: 1, destination: 'Paris, France', budget: '$1,500', duration: '5 Days', status: 'Completed', category: 'city', image: 'https://images.unsplash.com/photo-1502602898657-3e9076113334?q=80&w=800&auto=format&fit=crop' },
    { id: 2, destination: 'Swiss Alps', budget: '$2,200', duration: '7 Days', status: 'Completed', category: 'mountain', image: 'https://images.unsplash.com/photo-1531366936337-7c912a458b97?q=80&w=800&auto=format&fit=crop' },
    { id: 3, destination: 'Kyoto, Japan', budget: '$1,800', duration: '10 Days', status: 'Completed', category: 'city', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop' },
    { id: 4, destination: 'Bali, Indonesia', budget: '$1,200', duration: '6 Days', status: 'Completed', category: 'beach' }
  ]);

  const [wishlistTrips, setWishlistTrips] = useState([
    { id: 5, destination: 'Santorini, Greece', budget: '$2,500', duration: '8 Days', status: 'Planned', category: 'beach', image: 'https://images.unsplash.com/photo-1570077188670-e3a53244cb01?q=80&w=800&auto=format&fit=crop' },
    { id: 6, destination: 'Banff, Canada', budget: '$1,400', duration: '5 Days', status: 'Wishlist', category: 'nature', image: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?q=80&w=800&auto=format&fit=crop' }
  ]);

  const [trendingTrips, setTrendingTrips] = useState([
    { id: 1, destination: 'Maldives', cost: '$3,500', rating: '4.9', description: 'Crystal clear waters and overwater bungalows. A perfect relaxation getaway.', category: 'beach', image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=800&auto=format&fit=crop' },
    { id: 2, destination: 'Reykjavik, Iceland', cost: '$2,800', rating: '4.8', description: 'Northern lights and geothermal spas. Adventure awaits.', category: 'nature', image: 'https://images.unsplash.com/photo-1520769945061-0a448c463865?q=80&w=800&auto=format&fit=crop' }
  ]);

  const [communityPosts, setCommunityPosts] = useState([
    { id: 1, author: 'Alex Rivera', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', title: 'Backpacking through Europe: Tips & Tricks', likes: 120, comments: 45, category: 'city', image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=800&auto=format&fit=crop' },
    { id: 2, author: 'Samantha Lee', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', title: 'My 5-day retreat in the mountains', likes: 89, comments: 12, category: 'mountain' }
  ]);
  
  // Dynamic Profile & Settings
  const [userProfile, setUserProfile] = useState(null);
  const [isUserLoading, setIsUserLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/auth/me', {
          credentials: 'include'
        });
        if (response.ok) {
          const data = await response.json();
          setUserProfile(data.user);
        } else {
          setUserProfile(null);
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        setUserProfile(null);
      } finally {
        setIsUserLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Fetch Trips
  const fetchTrips = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/trips', {
        credentials: 'omit' // use browser default for now if CORS allows, else include if cookies needed
      });
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          setCompletedTrips(data.filter(t => t.status === 'Completed'));
          setWishlistTrips(data.filter(t => t.status !== 'Completed'));
        }
      }
    } catch (error) {
      console.error('Failed to fetch trips:', error);
    }
  };

  useEffect(() => {
    if (userProfile) {
      fetchTrips();
      
      const newSocket = io('http://localhost:5000', {
        withCredentials: true
      });
      
      newSocket.on(`new-trip-${userProfile.id}`, (newTrip) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message: `You were invited to trip: ${newTrip.title}`, type: 'success' }]);
        setTimeout(() => {
          setToasts(prev => prev.filter(t => t.id !== id));
        }, 5000);
        fetchTrips();
      });

      return () => newSocket.close();
    }
  }, [userProfile]);

  const [notificationSettings, setNotificationSettings] = useState(() => loadState('notifSettings', {
    email: true, push: true, invites: true, community: false, likes: true,
    reminders: true, alerts: true, budget: false, weekly: false, security: true
  }));

  const [privacySettings, setPrivacySettings] = useState(() => loadState('privacySettings', {
    publicAccount: true, showEmail: false, showHistory: true, searchVisibility: true,
    allowCollab: 'everyone', allowComments: 'everyone'
  }));

  const [languageSettings, setLanguageSettings] = useState(() => loadState('languageSettings', {
    language: 'English', region: 'United States', timezone: 'UTC-05:00', currency: 'USD', dateFormat: 'MM/DD/YYYY'
  }));

  const [savedPosts, setSavedPosts] = useState(() => loadState('savedPosts', []));

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Toast System State
  const [toasts, setToasts] = useState([]);

  // Persist effects
  useEffect(() => { localStorage.setItem('notifSettings', JSON.stringify(notificationSettings)); }, [notificationSettings]);
  useEffect(() => { localStorage.setItem('privacySettings', JSON.stringify(privacySettings)); }, [privacySettings]);
  useEffect(() => { localStorage.setItem('languageSettings', JSON.stringify(languageSettings)); }, [languageSettings]);
  useEffect(() => { localStorage.setItem('savedPosts', JSON.stringify(savedPosts)); }, [savedPosts]);

  // Toast Helper
  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  return (
    <GlobalContext.Provider value={{
      completedTrips, setCompletedTrips,
      wishlistTrips, setWishlistTrips,
      trendingTrips, setTrendingTrips,
      communityPosts, setCommunityPosts,
      userProfile, setUserProfile, isUserLoading,
      isModalOpen, setIsModalOpen,
      notificationSettings, setNotificationSettings,
      privacySettings, setPrivacySettings,
      languageSettings, setLanguageSettings,
      savedPosts, setSavedPosts,
      addToast
    }}>
      {children}
      
      {/* Toast Render Area */}
      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast glass-card ${toast.type}`}>
            {toast.message}
          </div>
        ))}
      </div>
    </GlobalContext.Provider>
  );
};
