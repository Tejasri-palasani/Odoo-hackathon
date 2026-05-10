import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X, ArrowRight, ArrowLeft, Search, Check, Users, MapPin, DollarSign, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { useGlobalContext } from '../GlobalContext';
import './CreateTripPage.css';

const STEPS = ['Basic Info', 'Stops', 'Collaborators', 'Budget', 'Review'];

export default function CreateTripPage() {
  const navigate = useNavigate();
  const { createTrip, getAuthToken } = useGlobalContext();
  
  const [currentStep, setCurrentStep] = useState(1);
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Adventure',
    startDate: '',
    endDate: '',
    description: '',
    destinations: [],
    stops: [],
    collaborators: [],
    budget: '',
    currency: 'USD'
  });

  // Collaboration Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [addedCollabs, setAddedCollabs] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (currentStep === 1 && !formData.title) {
      toast.error('Please enter a trip title');
      return;
    }
    setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
  };

  const handlePrev = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  // Handle Stops
  const addStop = () => {
    setFormData(prev => ({
      ...prev,
      stops: [...prev.stops, { city: '', arrivalDate: '', departureDate: '', transport: 'Flight' }]
    }));
  };

  const updateStop = (index, field, value) => {
    const newStops = [...formData.stops];
    newStops[index][field] = value;
    setFormData(prev => ({ ...prev, stops: newStops }));
  };

  const removeStop = (index) => {
    const newStops = formData.stops.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, stops: newStops }));
  };

  // Handle Collaboration Search
  useEffect(() => {
    if (searchQuery.length > 1) {
      const delayDebounceFn = setTimeout(async () => {
        try {
          const res = await fetch(`http://localhost:5000/api/users/search?q=${searchQuery}`, {
            credentials: 'include'
          });
          if (res.ok) {
            const data = await res.json();
            setSearchResults(data);
          }
        } catch (error) {
          console.error("Search error", error);
        }
      }, 500);

      return () => clearTimeout(delayDebounceFn);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const addCollaborator = (user) => {
    if (!addedCollabs.find(u => u.id === user.id)) {
      setAddedCollabs([...addedCollabs, user]);
      setFormData(prev => ({
        ...prev,
        collaborators: [...prev.collaborators, user.id]
      }));
    }
    setSearchQuery('');
    setSearchResults([]);
  };

  const removeCollaborator = (userId) => {
    setAddedCollabs(addedCollabs.filter(u => u.id !== userId));
    setFormData(prev => ({
      ...prev,
      collaborators: prev.collaborators.filter(id => id !== userId)
    }));
  };

  const handleSubmit = async () => {
    try {
      // In a real app we'd call the API directly here or via context
      // Let's call our newly created endpoint
      const response = await fetch('http://localhost:5000/api/trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          destinations: formData.stops.length > 0 ? [formData.stops[0].city] : []
        }),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to create trip');
      }

      toast.success('Trip created successfully!');
      navigate('/');
    } catch (error) {
      toast.error('Error creating trip');
      console.error(error);
    }
  };

  return (
    <div className="create-trip-container">
      <div className="create-trip-header">
        <h1>Create New Trip</h1>
        <p>Plan your next adventure in a few simple steps</p>
      </div>

      <div className="step-indicator">
        {STEPS.map((step, index) => {
          const stepNum = index + 1;
          let className = 'step-item';
          if (stepNum === currentStep) className += ' active';
          if (stepNum < currentStep) className += ' completed';

          return (
            <div key={stepNum} className={className}>
              {stepNum < currentStep ? <Check size={20} /> : stepNum}
            </div>
          );
        })}
      </div>

      <div className="create-trip-card">
        {/* Step 1: Basic Info */}
        {currentStep === 1 && (
          <div className="step-content">
            <h2>Basic Details</h2>
            <div className="form-group">
              <label>Trip Title</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} className="form-input" placeholder="e.g. Summer in Europe" />
            </div>
            <div className="row">
              <div className="form-group">
                <label>Category</label>
                <select name="category" value={formData.category} onChange={handleChange} className="form-input">
                  <option value="Adventure">Adventure</option>
                  <option value="Relaxation">Relaxation</option>
                  <option value="Business">Business</option>
                  <option value="Family">Family</option>
                  <option value="Road Trip">Road Trip</option>
                </select>
              </div>
            </div>
            <div className="row">
              <div className="form-group">
                <label>Start Date</label>
                <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="form-input" />
              </div>
              <div className="form-group">
                <label>End Date</label>
                <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className="form-input" />
              </div>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} className="form-input" rows="3" placeholder="What is this trip about?"></textarea>
            </div>
          </div>
        )}

        {/* Step 2: Stops & Destinations */}
        {currentStep === 2 && (
          <div className="step-content">
            <h2>Destinations & Stops</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '20px' }}>Add the places you'll be visiting on this trip.</p>
            
            {formData.stops.map((stop, index) => (
              <div key={index} className="stop-item">
                <button className="remove-stop" onClick={() => removeStop(index)}><X size={16} /></button>
                <div className="form-group">
                  <label>City / Location</label>
                  <input type="text" value={stop.city} onChange={(e) => updateStop(index, 'city', e.target.value)} className="form-input" placeholder="e.g. Paris" />
                </div>
                <div className="row">
                  <div className="form-group">
                    <label>Arrival Date</label>
                    <input type="date" value={stop.arrivalDate} onChange={(e) => updateStop(index, 'arrivalDate', e.target.value)} className="form-input" />
                  </div>
                  <div className="form-group">
                    <label>Departure Date</label>
                    <input type="date" value={stop.departureDate} onChange={(e) => updateStop(index, 'departureDate', e.target.value)} className="form-input" />
                  </div>
                  <div className="form-group">
                    <label>Transport In</label>
                    <select value={stop.transport} onChange={(e) => updateStop(index, 'transport', e.target.value)} className="form-input">
                      <option value="Flight">Flight</option>
                      <option value="Train">Train</option>
                      <option value="Bus">Bus</option>
                      <option value="Car">Car</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
            
            <button className="add-stop-btn" onClick={addStop}>
              <Plus size={20} /> Add Stop
            </button>
          </div>
        )}

        {/* Step 3: Collaborators */}
        {currentStep === 3 && (
          <div className="step-content">
            <h2>Invite Friends</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '20px' }}>Search for other users to collaborate on planning.</p>
            
            <div className="form-group" style={{ position: 'relative' }}>
              <div style={{ position: 'relative' }}>
                <Search size={20} style={{ position: 'absolute', left: '16px', top: '16px', color: 'rgba(255,255,255,0.5)' }} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-input" 
                  style={{ paddingLeft: '48px' }}
                  placeholder="Search by username or name..." 
                />
              </div>
              
              {searchResults.length > 0 && (
                <div className="user-search-list">
                  {searchResults.map(user => (
                    <div key={user.id} className="user-search-item">
                      <div className="user-info">
                        <div className="user-avatar">{user.name.charAt(0)}</div>
                        <div>
                          <div style={{ fontWeight: 500 }}>{user.name}</div>
                          <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>@{user.username}</div>
                        </div>
                      </div>
                      <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.85rem' }} onClick={() => addCollaborator(user)}>
                        Add
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {addedCollabs.length > 0 && (
              <div className="collab-list">
                <h3>Added Collaborators</h3>
                {addedCollabs.map(user => (
                  <div key={user.id} className="collab-item">
                    <div className="user-info">
                      <div className="user-avatar" style={{ width: '32px', height: '32px' }}>{user.name.charAt(0)}</div>
                      <span>{user.name}</span>
                    </div>
                    <button style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }} onClick={() => removeCollaborator(user.id)}>
                      <X size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 4: Budget */}
        {currentStep === 4 && (
          <div className="step-content">
            <h2>Budget Setup</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '20px' }}>Set an initial budget for your trip.</p>
            
            <div className="row">
              <div className="form-group" style={{ flex: '0 0 150px' }}>
                <label>Currency</label>
                <select name="currency" value={formData.currency} onChange={handleChange} className="form-input">
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="INR">INR (₹)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Total Budget</label>
                <div style={{ position: 'relative' }}>
                  <DollarSign size={20} style={{ position: 'absolute', left: '16px', top: '16px', color: 'rgba(255,255,255,0.5)' }} />
                  <input type="number" name="budget" value={formData.budget} onChange={handleChange} className="form-input" style={{ paddingLeft: '48px' }} placeholder="0.00" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Review */}
        {currentStep === 5 && (
          <div className="step-content">
            <h2>Review Trip Details</h2>
            
            <div className="review-section">
              <h3><MapPin size={18} style={{ display: 'inline', marginRight: '8px' }} /> Basic Info</h3>
              <div className="review-content">
                <div className="review-row">
                  <span className="review-label">Title:</span>
                  <span>{formData.title}</span>
                </div>
                <div className="review-row">
                  <span className="review-label">Category:</span>
                  <span>{formData.category}</span>
                </div>
                <div className="review-row">
                  <span className="review-label">Dates:</span>
                  <span>{formData.startDate} - {formData.endDate}</span>
                </div>
              </div>
            </div>

            <div className="review-section">
              <h3><Users size={18} style={{ display: 'inline', marginRight: '8px' }} /> Collaborators ({addedCollabs.length})</h3>
              <div className="review-content">
                {addedCollabs.length === 0 ? 'No collaborators added.' : addedCollabs.map(u => u.name).join(', ')}
              </div>
            </div>

            <div className="review-section">
              <h3><DollarSign size={18} style={{ display: 'inline', marginRight: '8px' }} /> Budget</h3>
              <div className="review-content">
                {formData.currency} {formData.budget || '0'}
              </div>
            </div>
            
            <div className="review-section">
              <h3>Stops ({formData.stops.length})</h3>
              <div className="review-content">
                {formData.stops.length === 0 ? 'No stops added.' : formData.stops.map(s => s.city).join(' → ')}
              </div>
            </div>
          </div>
        )}

        <div className="step-actions">
          {currentStep > 1 ? (
            <button className="btn btn-secondary" onClick={handlePrev}>
              <ArrowLeft size={18} /> Back
            </button>
          ) : (
            <div></div> // Spacer
          )}

          {currentStep < STEPS.length ? (
            <button className="btn btn-primary" onClick={handleNext}>
              Next Step <ArrowRight size={18} />
            </button>
          ) : (
            <button className="btn btn-primary" onClick={handleSubmit} style={{ background: '#10b981' }}>
              Create Trip <Check size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
