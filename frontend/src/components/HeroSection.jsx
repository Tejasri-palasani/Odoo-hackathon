import React, { useState, useEffect } from 'react';
import { Search, Filter, Moon, Sun, Palette } from 'lucide-react';
import { useGlobalContext } from '../GlobalContext';
import './HeroSection.css';

const HeroSection = () => {
  const { userProfile, isUserLoading } = useGlobalContext();
  const getGreetingName = () => {
    if (isUserLoading || !userProfile) return 'Traveler';
    return userProfile.username || userProfile.name;
  };
  const [placeholder, setPlaceholder] = useState(`Welcome ${getGreetingName()}...`);
  const [searchFocused, setSearchFocused] = useState(false);
  const [fadeClass, setFadeClass] = useState('fade-in');

  useEffect(() => {
    if (isUserLoading) return;
    setPlaceholder(`Welcome ${getGreetingName()}...`);
    
    const timer = setTimeout(() => {
      setFadeClass('fade-out');
      setTimeout(() => {
        setPlaceholder('Search for new cities...');
        setFadeClass('fade-in');
      }, 400); // Wait for fade out animation before changing text
    }, 5000);
    return () => clearTimeout(timer);
  }, [userProfile, isUserLoading]);

  const changeTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
  };

  return (
    <section className="hero-section">
      <div className="search-container-wrapper">
        <div className="filters-left">
          <div className="dropdown glass">
            <button className="dropdown-btn">
              <Filter size={18} /> Filters
            </button>
            <div className="dropdown-content glass-card">
              <a href="#">Budget</a>
              <a href="#">Cities</a>
              <a href="#">Type of places</a>
              <a href="#">Duration</a>
              <a href="#">Ratings</a>
              <a href="#">Adventure/Relaxation</a>
            </div>
          </div>
        </div>

        <div className={`search-bar-wrapper glass-card ${searchFocused ? 'focused' : ''}`}>
          <Search className="search-icon" size={24} />
          <input 
            type="text" 
            className={`search-input ${fadeClass}`}
            placeholder={placeholder}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          <button className="btn-primary search-btn">Search</button>
        </div>

        <div className="theme-selector-right">
          <div className="theme-buttons glass">
            <button onClick={() => changeTheme('dark')} title="Dark Theme" className="theme-btn">
              <Moon size={18} />
            </button>
            <button onClick={() => changeTheme('light')} title="Light Theme" className="theme-btn">
              <Sun size={18} />
            </button>
            <button onClick={() => changeTheme('custom')} title="Custom Theme" className="theme-btn">
              <Palette size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
