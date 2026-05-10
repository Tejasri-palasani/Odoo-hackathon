import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../GlobalContext';
import { Send, ArrowLeft } from 'lucide-react';
import TripCard from '../components/TripCard';
import './PublishTripPage.css';

const PublishTripPage = () => {
  const { completedTrips, communityPosts, setCommunityPosts, userProfile, addToast } = useGlobalContext();
  const [selectedTrips, setSelectedTrips] = useState([]);
  const navigate = useNavigate();

  const toggleTripSelection = (tripId) => {
    setSelectedTrips(prev => 
      prev.includes(tripId) ? prev.filter(id => id !== tripId) : [...prev, tripId]
    );
  };

  const handlePostToCommunity = () => {
    if (selectedTrips.length === 0) {
      addToast('Please select at least one trip to publish.', 'error');
      return;
    }

    const tripsToPost = completedTrips.filter(t => selectedTrips.includes(t.id));
    const newPosts = tripsToPost.map(trip => ({
      id: Date.now() + Math.random(),
      author: userProfile.name,
      avatar: userProfile.avatar,
      title: `Just returned from ${trip.destination}! Highly recommend checking it out.`,
      likes: 0,
      comments: 0,
      category: trip.category,
      image: trip.image
    }));
    
    setCommunityPosts([...newPosts, ...communityPosts]);
    setSelectedTrips([]); 
    addToast(`Successfully published ${newPosts.length} trip(s) to the Community!`, 'success');
    navigate('/'); // Redirect back to dashboard after publishing
  };

  return (
    <div className="publish-page-container">
      <div className="publish-header glass-card">
        <button className="icon-btn-small" onClick={() => navigate(-1)}>
          <ArrowLeft size={24} />
        </button>
        <div className="publish-header-text">
          <h1>Publish to Community</h1>
          <p className="text-secondary">Select the completed trips you want to share with the travel community.</p>
        </div>
        <button 
          className="btn-primary publish-btn" 
          onClick={handlePostToCommunity}
          disabled={selectedTrips.length === 0}
        >
          <Send size={18} /> Publish {selectedTrips.length > 0 ? `(${selectedTrips.length})` : ''}
        </button>
      </div>

      <div className="publish-grid mt-8">
        {completedTrips.length > 0 ? (
          completedTrips.map(trip => (
            <TripCard 
              key={trip.id} 
              trip={trip} 
              type="completed" 
              showPostAction={true} 
              isSelected={selectedTrips.includes(trip.id)}
              onSelect={() => toggleTripSelection(trip.id)}
            />
          ))
        ) : (
          <div className="empty-state glass-card" style={{gridColumn: '1 / -1'}}>
            <p>You don't have any completed trips yet.</p>
            <p className="text-secondary">Plan a trip, complete it, and then share your experience here!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublishTripPage;
