import React, { useState } from 'react';
import { X, MapPin, UploadCloud, Users, Check, Edit2 } from 'lucide-react';
import { useGlobalContext } from '../GlobalContext';
import './CollaborationModal.css';

const CollaborationModal = () => {
  const { isModalOpen, setIsModalOpen } = useGlobalContext();
  const [tripName, setTripName] = useState('');
  const [startPlace, setStartPlace] = useState('');
  const [destination, setDestination] = useState('');
  const [description, setDescription] = useState('');

  if (!isModalOpen) return null;

  return (
    <div className="modal-overlay glass" onClick={() => setIsModalOpen(false)}>
      <div className="modal-content glass-card" onClick={e => e.stopPropagation()}>
        
        <button className="close-btn icon-btn" onClick={() => setIsModalOpen(false)}>
          <X size={24} />
        </button>

        <div className="modal-header">
          <h2>New Trip</h2>
          <div className="tagline-row">
            <p>Create a personalized travel trip ✈️🌍</p>
            <button className="icon-btn-small" title="Edit trip type"><Edit2 size={16} /></button>
          </div>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label>Trip Name</label>
            <input 
              type="text" 
              className="glass-input" 
              placeholder="Trip Name: __________" 
              value={tripName} 
              onChange={e => setTripName(e.target.value)} 
            />
          </div>

          <div className="locations-group">
            <div className="form-group flex-1">
              <label>Start Place</label>
              <div className="input-with-icon">
                <MapPin size={18} className="input-icon" />
                <input 
                  type="text" 
                  className="glass-input" 
                  placeholder="e.g. New York" 
                  value={startPlace} 
                  onChange={e => setStartPlace(e.target.value)} 
                />
              </div>
            </div>
            <div className="form-group flex-1">
              <label>Destination Place</label>
              <div className="input-with-icon">
                <MapPin size={18} className="input-icon" />
                <input 
                  type="text" 
                  className="glass-input" 
                  placeholder="e.g. Paris" 
                  value={destination} 
                  onChange={e => setDestination(e.target.value)} 
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea 
              className="glass-textarea" 
              placeholder="Describe your travel plan, places to visit, and activities..." 
              rows={4}
              value={description}
              onChange={e => setDescription(e.target.value)}
            ></textarea>
          </div>

          <div className="form-group">
            <label>Upload a Cover Photo (Optional)</label>
            <div className="upload-box glass">
              <UploadCloud size={32} className="upload-icon" />
              <span>Click or drag image to upload</span>
            </div>
          </div>

          <div className="collaboration-section">
            <div className="collab-header">
              <label><Users size={18}/> Collaboration Members</label>
              <span className="last-edited">Last edited by Mahi • Just now</span>
            </div>
            
            <div className="members-list">
              <div className="member-item">
                <img src="https://randomuser.me/api/portraits/men/1.jpg" alt="Mahi" className="member-avatar" />
                <div className="member-info">
                  <span className="member-name">Mahi (You)</span>
                  <span className="member-role admin">Admin</span>
                </div>
              </div>
              
              <div className="member-item">
                <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Sarah" className="member-avatar" />
                <div className="member-info">
                  <span className="member-name">Sarah Jenkins</span>
                  <select className="role-select glass-input">
                    <option value="editor">Editor</option>
                    <option value="admin">Admin</option>
                    <option value="viewer">Viewer</option>
                  </select>
                </div>
              </div>

              <button className="invite-btn glass">+ Invite Members</button>
            </div>
          </div>

        </div>

        <div className="modal-footer">
          <button className="btn-primary w-full justify-center">
            <Check size={20} />
            <span>Save Trip</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default CollaborationModal;
