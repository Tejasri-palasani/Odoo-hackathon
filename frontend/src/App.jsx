import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import WishlistTripPage from './pages/WishlistTripPage';
import CompletedTripPage from './pages/CompletedTripPage';
import PublishTripPage from './pages/PublishTripPage';
import ChecklistWorkspace from './pages/ChecklistWorkspace';
import CollaborationModal from './components/CollaborationModal';
import AuthPage from './pages/AuthPage';
import CreateTripPage from './pages/CreateTripPage';
import { Toaster } from 'react-hot-toast';
import './index.css';

function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth';

  return (
    <div className={isAuthPage ? '' : 'dashboard-container'}>
      <Toaster position="bottom-right" toastOptions={{
        style: {
          background: '#1e293b',
          color: '#fff',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }
      }} />
      {!isAuthPage && <Header />}
      {!isAuthPage && <CollaborationModal />}
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/wishlist/:id" element={<WishlistTripPage />} />
        <Route path="/completed/:id" element={<CompletedTripPage />} />
        <Route path="/publish" element={<PublishTripPage />} />
        <Route path="/checklist" element={<ChecklistWorkspace />} />
        <Route path="/create-trip" element={<CreateTripPage />} />
      </Routes>
    </div>
  );
}

export default App;
