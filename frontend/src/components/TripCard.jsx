import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, DollarSign, MapPin, CheckSquare, Square } from 'lucide-react';
import { getDefaultImage } from '../utils';
import './Cards.css';
import './TripCardSelection.css';

const TripCard = ({ trip, type, showPostAction, isSelected, onSelect }) => {
  const navigate = useNavigate();
  const { id, destination, budget, duration, status, image, category } = trip;
  const imageUrl = image || getDefaultImage(category);
  const isCompleted = type === 'completed';

  const handleCardClick = () => {
    if (showPostAction && onSelect) {
      onSelect();
    } else {
      if (isCompleted) {
        navigate(`/completed/${id}`);
      } else {
        navigate(`/wishlist/${id}`);
      }
    }
  };

  return (
    <div className={`trip-card glass-card ${isCompleted ? 'glowing-border' : ''}`} onClick={handleCardClick} style={{cursor: 'pointer'}}>
      <div className="card-img-container">
        <img src={imageUrl} alt={destination} className="card-img" loading="lazy" />
        
        {showPostAction && (
          <div className={`selection-checkbox glass ${isSelected ? 'selected' : ''}`}>
            {isSelected ? <CheckSquare size={20} className="icon-inline" /> : <Square size={20} />}
          </div>
        )}

        <div className="status-badge glass">
          {status}
        </div>
      </div>
      <div className="card-content">
        <h3 className="card-title"><MapPin size={18} className="icon-inline"/> {destination}</h3>
        <div className="card-details">
          <span className="detail-item"><DollarSign size={16}/> {budget}</span>
          <span className="detail-item"><Calendar size={16}/> {duration}</span>
        </div>
      </div>
    </div>
  );
};

export default TripCard;
