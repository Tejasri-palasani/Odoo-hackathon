import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useGlobalContext } from '../GlobalContext';
import { MapPin, Calendar, Users, Share2, Copy, RefreshCw, Plus, Check, MoreVertical, Search, Lightbulb } from 'lucide-react';
import './ChecklistWorkspace.css';

const ChecklistWorkspace = () => {
  const { wishlistTrips, completedTrips, userProfile } = useGlobalContext();
  const [activeTrip, setActiveTrip] = useState(null);
  const [checklist, setChecklist] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const allTrips = [...wishlistTrips, ...completedTrips];
  const filteredTrips = allTrips.filter(t => t.destination.toLowerCase().includes(searchQuery.toLowerCase()));

  useEffect(() => {
    if (allTrips.length > 0 && !activeTrip) {
      handleSelectTrip(allTrips[0]);
    }
  }, [allTrips]);

  const handleSelectTrip = async (trip) => {
    setActiveTrip(trip);
    try {
      const res = await fetch(`http://localhost:5000/api/checklists/${trip.id}`, { credentials: 'include' });
      const data = await res.json();
      if (!data.checklist) {
        // Create new
        const createRes = await fetch(`http://localhost:5000/api/checklists/${trip.id}`, {
          method: 'POST',
          credentials: 'include'
        });
        const createData = await createRes.json();
        setChecklist(createData.checklist);
      } else {
        setChecklist(data.checklist);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleItem = async (categoryId, itemId, currentState) => {
    // Optimistic UI update
    const updatedCategories = checklist.categories.map(c => {
      if (c.id === categoryId) {
        return {
          ...c, items: c.items.map(i => i.id === itemId ? { ...i, isCompleted: !currentState } : i)
        };
      }
      return c;
    });
    setChecklist({ ...checklist, categories: updatedCategories });

    // API Call
    fetch(`http://localhost:5000/api/checklists/items/${itemId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ isCompleted: !currentState })
    });
  };

  const handleAddItem = async (categoryId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/checklists/categories/${categoryId}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ content: 'New Item' })
      });
      const data = await res.json();
      
      const updatedCategories = checklist.categories.map(c => {
        if (c.id === categoryId) {
          return { ...c, items: [...c.items, data.item] };
        }
        return c;
      });
      setChecklist({ ...checklist, categories: updatedCategories });
    } catch (err) {
      console.error(err);
    }
  };

  const calculateProgress = () => {
    if (!checklist) return 0;
    let total = 0;
    let completed = 0;
    checklist.categories.forEach(c => {
      total += c.items.length;
      completed += c.items.filter(i => i.isCompleted).length;
    });
    return total === 0 ? 0 : Math.round((completed / total) * 100);
  };

  return (
    <div className="checklist-container glass-card">
      <div className="checklist-sidebar">
        <div className="sidebar-header">
          <h3>Your Trips</h3>
          <input 
            type="text" 
            placeholder="Search trips..." 
            className="trip-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="trip-list">
          {filteredTrips.map(trip => (
            <div 
              key={trip.id} 
              className={`trip-item ${activeTrip?.id === trip.id ? 'active' : ''}`}
              onClick={() => handleSelectTrip(trip)}
            >
              <MapPin size={16} />
              <span>{trip.destination}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="checklist-main">
        {activeTrip && checklist ? (
          <>
            <div className="checklist-header">
              <div>
                <h1 className="checklist-title">{activeTrip.destination} Packing List</h1>
                <div className="checklist-meta">
                  <span><Calendar size={16}/> {activeTrip.duration}</span>
                  <span><MapPin size={16}/> {activeTrip.destination}</span>
                  <span><Users size={16}/> Collaborators: Just You</span>
                </div>
              </div>
              <div className="checklist-actions">
                <button className="btn-secondary btn-small"><Copy size={16}/> Duplicate</button>
                <button className="btn-secondary btn-small"><Share2 size={16}/> Share</button>
              </div>
            </div>

            <div className="progress-section">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Completion Progress</span>
                <span>{calculateProgress()}%</span>
              </div>
              <div className="progress-bar-container">
                <div className="progress-bar-fill" style={{ width: `${calculateProgress()}%` }}></div>
              </div>
            </div>

            <div className="categories-container">
              {checklist.categories.map(category => (
                <div key={category.id} className="category-card glass-card">
                  <div className="category-header">
                    <div className="category-title">{category.name} <span style={{fontSize:'0.8rem', color:'var(--text-secondary)'}}>({category.items.filter(i=>i.isCompleted).length}/{category.items.length})</span></div>
                  </div>
                  <div className="checklist-items">
                    {category.items.map(item => (
                      <div key={item.id} className="checklist-item-row">
                        <input 
                          type="checkbox" 
                          checked={item.isCompleted} 
                          onChange={() => handleToggleItem(category.id, item.id, item.isCompleted)}
                          style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                        />
                        <input 
                          type="text" 
                          defaultValue={item.content} 
                          className={`item-content ${item.isCompleted ? 'item-completed' : ''}`}
                        />
                      </div>
                    ))}
                    <button className="add-item-btn" onClick={() => handleAddItem(category.id)}>
                      <Plus size={16}/> Add item
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Smart Suggestions Modal inside Checklist */}
            <div className="smart-suggestions">
              <h4 style={{display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'1rem'}}>
                <Lightbulb size={18} color="var(--accent-color)"/> Smart AI Suggestions
              </h4>
              <div className="suggestion-item">
                <span>Raincoat (Rain expected)</span>
                <button className="icon-btn-small"><Plus size={14}/></button>
              </div>
              <div className="suggestion-item">
                <span>Power Adapter (Intl Travel)</span>
                <button className="icon-btn-small"><Plus size={14}/></button>
              </div>
              <div className="suggestion-item">
                <span>Hiking Shoes (Adventure)</span>
                <button className="icon-btn-small"><Plus size={14}/></button>
              </div>
            </div>
          </>
        ) : (
          <div style={{display:'flex', alignItems:'center', justifyContent:'center', height:'100%', color:'var(--text-secondary)'}}>
            Select a trip from the sidebar to view or create its checklist.
          </div>
        )}
      </div>
    </div>
  );
};

export default ChecklistWorkspace;
