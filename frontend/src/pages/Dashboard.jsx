import React, { useState, useEffect } from 'react';
import HeroSection from '../components/HeroSection';
import Carousel from '../components/Carousel';
import TripCard from '../components/TripCard';
import TrendingCard from '../components/TrendingCard';
import CommunityCard from '../components/CommunityCard';
import { useGlobalContext } from '../GlobalContext';
import { useNavigate } from 'react-router-dom';
import { Send } from 'lucide-react';

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const { completedTrips, wishlistTrips, trendingTrips, communityPosts, setCommunityPosts, userProfile } = useGlobalContext();
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate initial loading for smooth UX
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div style={{ width: '100%' }}>
        <HeroSection />
        <div style={{ display: 'flex', gap: '1.5rem', padding: '1rem' }}>
          {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ width: '320px', height: '350px' }}></div>)}
        </div>
      </div>
    );
  }

  const handlePublishNavigation = () => {
    navigate('/publish');
  };

  return (
    <main style={{ width: '100%', position: 'relative' }}>
      <HeroSection />
      


      {/* Trips Section */}
      <Carousel 
        title="Completed Trips" 
        isGlowing={true}
        actionButton={
          <button className="btn-secondary btn-small" onClick={handlePublishNavigation}>
            <Send size={16} /> Publish Trip
          </button>
        }
      >
        {completedTrips.map(trip => (
          <TripCard 
            key={trip.id} 
            trip={trip} 
            type="completed" 
          />
        ))}
      </Carousel>

      <Carousel title="Wishlist Trips">
        {wishlistTrips.map(trip => (
          <TripCard key={trip.id} trip={trip} type="wishlist" />
        ))}
      </Carousel>

      {/* Trending Section */}
      <Carousel title="Trending Trips">
        {trendingTrips.map(trip => (
          <TrendingCard key={trip.id} trip={trip} />
        ))}
      </Carousel>

      {/* Community Section */}
      <Carousel title="Community">
        {communityPosts.map(post => (
          <CommunityCard key={post.id} post={post} />
        ))}
      </Carousel>
    </main>
  );
}

export default Dashboard;
