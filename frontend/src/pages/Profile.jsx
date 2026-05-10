import React, { useState } from 'react';
import { Camera, Trash2, Edit3, Save, Bookmark, MapPin, Phone, Calendar, User as UserIcon } from 'lucide-react';
import { useGlobalContext } from '../GlobalContext';
import CommunityCard from '../components/CommunityCard';
import TravelJournal from '../components/TravelJournal';
import './Profile.css';

const Profile = () => {
  const { userProfile, setUserProfile, isUserLoading, communityPosts, savedPosts, addToast } = useGlobalContext();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('my_posts');
  const [isSaving, setIsSaving] = useState(false);

  // Initialize edit form state
  const [formData, setFormData] = useState({
    name: userProfile?.name || '',
    bio: userProfile?.bio || '',
    phoneNumber: userProfile?.phoneNumber || '',
    country: userProfile?.country || '',
    dob: userProfile?.dob || '',
    gender: userProfile?.gender || '',
  });

  if (isUserLoading || !userProfile) {
    return (
      <div className="profile-container">
        <div className="skeleton" style={{ height: '300px', width: '100%', borderRadius: '16px' }}></div>
      </div>
    );
  }

  const userPosts = communityPosts.filter(post => post.author === userProfile.username);

  const handleEditToggle = () => {
    if (!isEditing) {
      setFormData({
        name: userProfile.name || '',
        bio: userProfile.bio || '',
        phoneNumber: userProfile.phoneNumber || '',
        country: userProfile.country || '',
        dob: userProfile.dob || '',
        gender: userProfile.gender || '',
      });
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('http://localhost:5000/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to update profile');

      const data = await response.json();
      setUserProfile(data.user);
      setIsEditing(false);
      addToast('Profile updated successfully!', 'success');
    } catch (error) {
      addToast(error.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePhoto = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ avatar: null })
      });
      if (!response.ok) throw new Error('Failed to remove photo');
      const data = await response.json();
      setUserProfile(data.user);
      addToast('Profile photo removed.', 'success');
    } catch (error) {
      addToast('Error removing photo', 'error');
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header glass-card">
        
        <div className="profile-photo-section">
          <div className="profile-avatar-wrapper">
            {userProfile.avatar ? (
              <img src={userProfile.avatar} alt={userProfile.name} className="profile-avatar" />
            ) : (
              <div className="avatar-placeholder">{userProfile.name?.charAt(0) || 'U'}</div>
            )}
            
            <div className="avatar-overlay">
              <button className="icon-btn-small" title="Upload Photo"><Camera size={18} /></button>
              {userProfile.avatar && (
                <button className="icon-btn-small delete" onClick={handleDeletePhoto} title="Delete Photo">
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="profile-info-section" style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h2 className="profile-name">{userProfile.name}</h2>
              <p className="text-secondary" style={{marginTop: '-0.5rem', marginBottom: '1rem'}}>@{userProfile.username}</p>
            </div>
            {!isEditing && (
              <button className="btn-secondary btn-small" onClick={handleEditToggle}>
                <Edit3 size={16} /> Edit Profile
              </button>
            )}
          </div>
          
          {isEditing ? (
            <div className="profile-edit-form" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" name="name" className="auth-input" style={{ padding: '0.5rem' }} value={formData.name} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>Bio</label>
                <textarea name="bio" className="glass-textarea" rows={3} value={formData.bio} onChange={handleInputChange}></textarea>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input type="text" name="phoneNumber" className="auth-input" style={{ padding: '0.5rem' }} value={formData.phoneNumber} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Country</label>
                  <input type="text" name="country" className="auth-input" style={{ padding: '0.5rem' }} value={formData.country} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Date of Birth</label>
                  <input type="date" name="dob" className="auth-input" style={{ padding: '0.5rem', colorScheme: 'dark' }} value={formData.dob} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Gender</label>
                  <select name="gender" className="auth-input" style={{ padding: '0.5rem', backgroundColor: 'var(--bg-secondary)' }} value={formData.gender} onChange={handleInputChange}>
                    <option value="">Select...</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-binary">Non-binary</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button className="btn-primary" onClick={handleSaveProfile} disabled={isSaving}>
                  {isSaving ? 'Saving...' : <><Save size={16}/> Save Changes</>}
                </button>
                <button className="btn-secondary" onClick={handleEditToggle} disabled={isSaving}>Cancel</button>
              </div>
            </div>
          ) : (
            <>
              <p className="profile-bio">{userProfile.bio || "No bio added yet."}</p>
              
              <div className="profile-details-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                  <MapPin size={16} /> <span>{userProfile.country || "Country not set"}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                  <Phone size={16} /> <span>{userProfile.phoneNumber || "Phone not set"}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                  <Calendar size={16} /> <span>{userProfile.dob || "DOB not set"}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                  <UserIcon size={16} /> <span>{userProfile.gender || "Gender not set"}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="profile-tabs-section">
        <div className="profile-tabs">
          <button className={`tab-btn ${activeTab === 'my_posts' ? 'active' : ''}`} onClick={() => setActiveTab('my_posts')}>
            My Posts ({userPosts.length})
          </button>
          <button className={`tab-btn ${activeTab === 'saved' ? 'active' : ''}`} onClick={() => setActiveTab('saved')}>
            Saved ({savedPosts.length})
          </button>
          <button className={`tab-btn ${activeTab === 'journal' ? 'active' : ''}`} onClick={() => setActiveTab('journal')}>
            Travel Journal
          </button>
          <button className="tab-btn" onClick={() => window.location.href='/checklist'} style={{color: 'var(--accent-color)'}}>
            Travel Checklists
          </button>
        </div>
      </div>

      <div className="profile-content-section">
        {activeTab === 'my_posts' && (
          userPosts.length > 0 ? (
            <div className="posts-grid">
              {userPosts.map(post => <CommunityCard key={post.id} post={post} />)}
            </div>
          ) : (
            <div className="empty-state glass-card">
              <p>You haven't posted any trips to the community yet.</p>
              <p className="text-secondary">Go to your Completed Trips on the dashboard to share your experiences!</p>
            </div>
          )
        )}

        {activeTab === 'saved' && (
          savedPosts.length > 0 ? (
            <div className="posts-grid">
              {savedPosts.map(post => <CommunityCard key={post.id} post={post} />)}
            </div>
          ) : (
            <div className="empty-state glass-card">
              <Bookmark size={48} className="text-secondary mx-auto mb-4" />
              <p>You haven't saved any community posts yet.</p>
              <p className="text-secondary">Explore the community section and bookmark your favorite travel stories!</p>
            </div>
          )
        )}

        {activeTab === 'journal' && (
          <TravelJournal />
        )}
      </div>
    </div>
  );
};

export default Profile;
