import React from 'react';
import { Plus, Bell, Settings as SettingsIcon, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../GlobalContext';
import './Header.css'; // We'll create scoped CSS or use the global utilities

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="header glass">
      <div className="header-left">
        <button className="btn-primary" onClick={() => navigate('/create-trip')}>
          <Plus size={20} />
          <span>New Trip</span>
        </button>
      </div>
      
      <div className="header-center">
        <Link to="/" style={{ textDecoration: 'none' }}>
          <h1 className="logo">VISTA</h1>
        </Link>
      </div>
      
      <div className="header-right">
        <button className="icon-btn">
          <Bell size={24} />
        </button>
        <Link to="/settings" className="icon-btn">
          <SettingsIcon size={24} />
        </Link>
        <Link to="/profile" className="avatar-container" style={{ textDecoration: 'none' }}>
          <div className="avatar">
            <User size={24} />
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Header;
