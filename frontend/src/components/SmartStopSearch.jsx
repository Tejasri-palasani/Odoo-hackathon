import React, { useState } from 'react';
import { Search, MapPin, DollarSign, Clock, Star, Sparkles } from 'lucide-react';

const MOCK_RECOMMENDATIONS = {
  'Paris': [
    { id: 1, name: 'Louvre Museum', type: 'Museum', rating: 4.8, cost: 20, time: '3-4 hours', img: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=400', tag: 'Must Visit' },
    { id: 2, name: 'Eiffel Tower', type: 'Landmark', rating: 4.9, cost: 28, time: '2 hours', img: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e?q=80&w=400', tag: 'Popular' },
    { id: 3, name: 'Le Marais Walking Tour', type: 'Local Experience', rating: 4.7, cost: 0, time: '2 hours', img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=400', tag: 'Free' },
    { id: 4, name: 'Seine River Cruise', type: 'Romantic', rating: 4.6, cost: 15, time: '1 hour', img: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?q=80&w=400', tag: 'Romantic' }
  ],
  'Lyon': [
    { id: 5, name: 'Vieux Lyon', type: 'Historical', rating: 4.8, cost: 0, time: 'Half Day', img: 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?q=80&w=400', tag: 'Heritage' },
    { id: 6, name: 'Les Halles de Lyon', type: 'Food Market', rating: 4.9, cost: 30, time: '2 hours', img: 'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?q=80&w=400', tag: 'Foodie' }
  ],
  'Nice': [
    { id: 7, name: 'Promenade des Anglais', type: 'Beach', rating: 4.8, cost: 0, time: '2 hours', img: 'https://images.unsplash.com/photo-1533044309907-0fa3413da946?q=80&w=400', tag: 'Scenic' }
  ]
};

const SmartStopSearch = ({ currentCity }) => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const cityRecs = MOCK_RECOMMENDATIONS[currentCity] || MOCK_RECOMMENDATIONS['Paris'];

  const filters = ['All', 'Budget-friendly', 'Premium', 'Romantic', 'Family', 'Free'];

  const filteredRecs = cityRecs.filter(rec => {
    if (searchQuery && !rec.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Budget-friendly' && rec.cost > 20) return false;
    if (activeFilter === 'Free' && rec.cost !== 0) return false;
    if (activeFilter === 'Romantic' && rec.tag !== 'Romantic') return false;
    // Add other filter logic here
    return true;
  });

  return (
    <div className="smart-stop-search">
      <div className="search-header" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input 
            type="text" 
            placeholder={`Search places in ${currentCity}...`} 
            className="auth-input" 
            style={{ paddingLeft: '2.5rem', width: '100%', backgroundColor: 'rgba(0,0,0,0.2)' }}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={16} color="var(--accent-color)" /> AI Suggest
        </button>
      </div>

      <div className="filters-container no-scrollbar" style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '1rem' }}>
        {filters.map(f => (
          <button 
            key={f} 
            className={`tag ${activeFilter === f ? 'bg-primary' : ''}`}
            onClick={() => setActiveFilter(f)}
            style={activeFilter === f ? { background: 'var(--accent-color)', color: '#121212', border: 'none' } : {}}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="suggestions-scroll no-scrollbar" style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem' }}>
        {filteredRecs.length > 0 ? filteredRecs.map(rec => (
          <div key={rec.id} className="suggestion-card glass" style={{ minWidth: '250px', flex: '0 0 auto' }}>
            <div style={{ position: 'relative' }}>
              <img src={rec.img} alt={rec.name} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px 8px 0 0' }} />
              <span style={{ position: 'absolute', top: '10px', right: '10px', background: 'var(--accent-color)', color: '#000', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                {rec.tag}
              </span>
            </div>
            <div style={{ padding: '1rem' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>{rec.name}</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}><Star size={14} color="#f59e0b" /> {rec.rating}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}><DollarSign size={14} /> {rec.cost === 0 ? 'Free' : rec.cost}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}><Clock size={14} /> {rec.time}</span>
              </div>
              <button className="btn-secondary btn-small" style={{ width: '100%' }}>Add to Itinerary</button>
            </div>
          </div>
        )) : (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)', width: '100%' }}>
            No matching places found.
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartStopSearch;
