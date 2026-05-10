import React, { useState } from 'react';
import { User, Bell, Lock, Globe, Palette, Shield, LogOut, CheckCircle } from 'lucide-react';
import { useGlobalContext } from '../GlobalContext';
import './Settings.css';

const Settings = () => {
  const { 
    userProfile, setUserProfile,
    notificationSettings, setNotificationSettings,
    privacySettings, setPrivacySettings,
    languageSettings, setLanguageSettings,
    addToast
  } = useGlobalContext();

  const [activeTab, setActiveTab] = useState('account');

  // Local temp states for forms before saving
  const [tempProfile, setTempProfile] = useState(userProfile);
  const [tempNotifs, setTempNotifs] = useState(notificationSettings);
  const [tempPrivacy, setTempPrivacy] = useState(privacySettings);
  const [tempLang, setTempLang] = useState(languageSettings);

  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

  const tabs = [
    { id: 'account', icon: <User size={20}/>, label: 'Account Settings' },
    { id: 'theme', icon: <Palette size={20}/>, label: 'Appearance & Theme' },
    { id: 'notifications', icon: <Bell size={20}/>, label: 'Notifications' },
    { id: 'privacy', icon: <Shield size={20}/>, label: 'Privacy Settings' },
    { id: 'security', icon: <Lock size={20}/>, label: 'Password & Security' },
    { id: 'language', icon: <Globe size={20}/>, label: 'Language Preferences' },
  ];

  const changeTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    addToast(`Theme successfully changed to ${theme}!`, 'success');
  };

  const handleSaveAccount = (e) => {
    e.preventDefault();
    if (!tempProfile.name || !tempProfile.email) {
      addToast('Name and Email are required fields.', 'error');
      return;
    }
    setUserProfile(tempProfile);
    addToast('Account settings saved successfully!', 'success');
  };

  const handleSaveNotifs = () => {
    setNotificationSettings(tempNotifs);
    addToast('Notification preferences updated.', 'success');
  };

  const handleSavePrivacy = () => {
    setPrivacySettings(tempPrivacy);
    addToast('Privacy settings updated securely.', 'success');
  };

  const handleSaveLang = () => {
    setLanguageSettings(tempLang);
    addToast('Language preferences applied.', 'success');
  };

  const handleSaveSecurity = (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      addToast('New passwords do not match!', 'error');
      return;
    }
    if (passwords.new.length < 6) {
      addToast('Password must be at least 6 characters.', 'error');
      return;
    }
    addToast('Password updated successfully!', 'success');
    setPasswords({ current: '', new: '', confirm: '' });
  };

  return (
    <div className="settings-container">
      <div className="settings-sidebar glass-card">
        <h2 className="settings-title">Settings</h2>
        <div className="settings-tabs">
          {tabs.map(tab => (
            <button 
              key={tab.id}
              className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
        <div className="settings-footer">
          <button className="settings-tab logout-btn">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </div>

      <div className="settings-content glass-card">
        {activeTab === 'account' && (
          <div className="settings-section">
            <h3>Account Settings</h3>
            <form onSubmit={handleSaveAccount}>
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" className="glass-input" value={tempProfile.name} onChange={e => setTempProfile({...tempProfile, name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Username</label>
                <input type="text" className="glass-input" value={tempProfile.username} onChange={e => setTempProfile({...tempProfile, username: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" className="glass-input" value={tempProfile.email} onChange={e => setTempProfile({...tempProfile, email: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="text" className="glass-input" value={tempProfile.phone} onChange={e => setTempProfile({...tempProfile, phone: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Date of Birth</label>
                <input type="date" className="glass-input" value={tempProfile.dob} onChange={e => setTempProfile({...tempProfile, dob: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input type="text" className="glass-input" value={tempProfile.location} onChange={e => setTempProfile({...tempProfile, location: e.target.value})} />
              </div>
              <button type="submit" className="btn-primary mt-4"><CheckCircle size={18}/> Save Changes</button>
            </form>
          </div>
        )}

        {activeTab === 'theme' && (
          <div className="settings-section">
            <h3>Appearance Customization</h3>
            <p className="text-secondary">Choose your preferred dashboard theme.</p>
            <div className="theme-preview-cards">
              <div className="theme-card dark-preview" onClick={() => changeTheme('dark')}>
                <div className="preview-box"></div>
                <span>Dark Theme</span>
              </div>
              <div className="theme-card light-preview" onClick={() => changeTheme('light')}>
                <div className="preview-box"></div>
                <span>Light Theme</span>
              </div>
              <div className="theme-card custom-preview" onClick={() => changeTheme('custom')}>
                <div className="preview-box"></div>
                <span>Custom Purple</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="settings-section">
            <h3>Notification Settings</h3>
            <div className="toggle-group">
              {Object.keys(tempNotifs).map((key) => (
                <div className="toggle-item" key={key}>
                  <span className="capitalize">{key} Notifications</span>
                  <label className="switch">
                    <input 
                      type="checkbox" 
                      checked={tempNotifs[key]} 
                      onChange={e => setTempNotifs({...tempNotifs, [key]: e.target.checked})} 
                    />
                    <span className="slider round"></span>
                  </label>
                </div>
              ))}
            </div>
            <button className="btn-primary mt-4" onClick={handleSaveNotifs}><CheckCircle size={18}/> Save Preferences</button>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="settings-section">
            <h3>Privacy Settings</h3>
            <div className="toggle-group">
              <div className="toggle-item">
                <span>Public Account</span>
                <label className="switch">
                  <input type="checkbox" checked={tempPrivacy.publicAccount} onChange={e => setTempPrivacy({...tempPrivacy, publicAccount: e.target.checked})} />
                  <span className="slider round"></span>
                </label>
              </div>
              <div className="toggle-item">
                <span>Show Email on Profile</span>
                <label className="switch">
                  <input type="checkbox" checked={tempPrivacy.showEmail} onChange={e => setTempPrivacy({...tempPrivacy, showEmail: e.target.checked})} />
                  <span className="slider round"></span>
                </label>
              </div>
              <div className="toggle-item">
                <span>Show Travel History</span>
                <label className="switch">
                  <input type="checkbox" checked={tempPrivacy.showHistory} onChange={e => setTempPrivacy({...tempPrivacy, showHistory: e.target.checked})} />
                  <span className="slider round"></span>
                </label>
              </div>
              <div className="toggle-item">
                <span>Search Engine Visibility</span>
                <label className="switch">
                  <input type="checkbox" checked={tempPrivacy.searchVisibility} onChange={e => setTempPrivacy({...tempPrivacy, searchVisibility: e.target.checked})} />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>
            <button className="btn-primary mt-4" onClick={handleSavePrivacy}><CheckCircle size={18}/> Save Privacy</button>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="settings-section">
            <h3>Password & Security</h3>
            <form onSubmit={handleSaveSecurity}>
              <div className="form-group">
                <label>Current Password</label>
                <input type="password" className="glass-input" value={passwords.current} onChange={e => setPasswords({...passwords, current: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input type="password" className="glass-input" value={passwords.new} onChange={e => setPasswords({...passwords, new: e.target.value})} required />
                <small className="text-secondary">Must be at least 6 characters long.</small>
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input type="password" className="glass-input" value={passwords.confirm} onChange={e => setPasswords({...passwords, confirm: e.target.value})} required />
              </div>
              <div className="toggle-item mt-4">
                <span>Enable Two-Factor Authentication (2FA)</span>
                <label className="switch">
                  <input type="checkbox" />
                  <span className="slider round"></span>
                </label>
              </div>
              <button type="submit" className="btn-primary mt-4"><CheckCircle size={18}/> Update Password</button>
            </form>
            
            <div className="mt-8 pt-4 border-top">
              <h4 className="text-danger mb-2">Active Sessions</h4>
              <button className="btn-secondary text-danger">Logout from all devices</button>
            </div>
          </div>
        )}

        {activeTab === 'language' && (
          <div className="settings-section">
            <h3>Language Preferences</h3>
            <div className="form-group">
              <label>Application Language</label>
              <select className="glass-input" value={tempLang.language} onChange={e => setTempLang({...tempLang, language: e.target.value})}>
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
              </select>
            </div>
            <div className="form-group">
              <label>Region</label>
              <select className="glass-input" value={tempLang.region} onChange={e => setTempLang({...tempLang, region: e.target.value})}>
                <option value="United States">United States</option>
                <option value="Europe">Europe</option>
                <option value="Asia">Asia</option>
              </select>
            </div>
            <div className="form-group">
              <label>Preferred Currency</label>
              <select className="glass-input" value={tempLang.currency} onChange={e => setTempLang({...tempLang, currency: e.target.value})}>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
            <button className="btn-primary mt-4" onClick={handleSaveLang}><CheckCircle size={18}/> Save Preferences</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
