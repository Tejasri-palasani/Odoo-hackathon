import React from 'react';
import { TrendingUp, Star } from 'lucide-react';
import { getDefaultImage } from '../utils';
import './Cards.css';

const TrendingCard = ({ trip }) => {
  const { destination, cost, rating, description, image, category } = trip;
  const imageUrl = image || getDefaultImage(category);

  return (
    <div className="trending-card glass-card">
      <div className="card-img-container">
        <img src={imageUrl} alt={destination} className="card-img" loading="lazy" />
        <div className="trending-badge glass">
          <TrendingUp size={14} className="icon-inline"/> Trending
        </div>
        <div className="rating-badge glass">
          <Star size={14} className="icon-inline text-yellow"/> {rating}
        </div>
      </div>
      <div className="card-content">
        <h3 className="card-title">{destination}</h3>
        <p className="card-desc">{description}</p>
        <div className="card-footer">
          <span className="cost-tag">{cost}</span>
          <button className="btn-primary btn-small">Explore</button>
        </div>
      </div>
    </div>
  );
};

export default TrendingCard;
