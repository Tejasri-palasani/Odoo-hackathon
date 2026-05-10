import React from 'react';
import { useParams } from 'react-router-dom';
import { useGlobalContext } from '../GlobalContext';
import { motion } from 'framer-motion';
import { Map, DollarSign, CalendarDays, Camera, Star, UploadCloud } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import './CompletedTripPage.css';

const CompletedTripPage = () => {
  const { id } = useParams();
  const { completedTrips } = useGlobalContext();
  const trip = completedTrips.find(t => t.id === parseInt(id));

  if (!trip) return <div className="p-8 text-center text-xl text-white">Trip not found</div>;

  const plannedVsActualData = {
    labels: ['Accommodation', 'Food', 'Transport', 'Activities'],
    datasets: [
      {
        label: 'Planned Budget ($)',
        data: [400, 250, 200, 150],
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
      {
        label: 'Actual Spent ($)',
        data: [420, 290, 180, 190],
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 1,
      }
    ]
  };

  const galleryImages = [
    trip.image,
    'https://images.unsplash.com/photo-1522083111828-52b86fa2e7d7?q=80&w=600',
    'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=600',
    'https://images.unsplash.com/photo-1543349689-9a4d426bee8e?q=80&w=600',
    'https://images.unsplash.com/photo-1502602898657-3e9076113334?q=80&w=600'
  ];

  return (
    <div className="completed-page">
      <motion.div 
        className="cover-section"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
      >
        <img src={trip.image || 'https://images.unsplash.com/photo-1488085061387-422e29b40080'} alt={trip.destination} className="cover-img" />
        <div className="cover-overlay glass">
          <h1 className="trip-hero-title">{trip.destination} (Completed)</h1>
        </div>
      </motion.div>

      {/* Completion Summary Cards */}
      <div className="summary-grid">
        <motion.div className="summary-card glass-card" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <Map size={32} className="summary-icon text-blue"/>
          <div className="summary-info">
            <h3>Distance</h3>
            <p>1,240 Miles</p>
          </div>
        </motion.div>
        <motion.div className="summary-card glass-card" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
          <DollarSign size={32} className="summary-icon text-green"/>
          <div className="summary-info">
            <h3>Total Spent</h3>
            <p>$1,080</p>
          </div>
        </motion.div>
        <motion.div className="summary-card glass-card" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
          <CalendarDays size={32} className="summary-icon text-purple"/>
          <div className="summary-info">
            <h3>Days Traveled</h3>
            <p>{trip.duration}</p>
          </div>
        </motion.div>
        <motion.div className="summary-card glass-card" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
          <Camera size={32} className="summary-icon text-yellow"/>
          <div className="summary-info">
            <h3>Memories</h3>
            <p>124 Photos</p>
          </div>
        </motion.div>
      </div>

      <div className="trip-content-grid mt-8">
        {/* Left Column: Analytics & Reviews */}
        <div className="main-col">
          <motion.div className="section-block glass-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2>Planned vs Actual Analytics</h2>
            <div className="chart-container mt-4" style={{ height: '300px' }}>
              <Bar data={plannedVsActualData} options={{ maintainAspectRatio: false, scales: { y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.1)' } }, x: { grid: { display: false } } }, plugins: { legend: { labels: { color: '#fff' } } } }} />
            </div>
          </motion.div>

          <motion.div className="section-block glass-card mt-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2>My Review</h2>
            <div className="review-box glass mt-4">
              <div className="stars">
                {[1, 2, 3, 4, 5].map(star => <Star key={star} size={24} fill="#fbbf24" color="#fbbf24" />)}
              </div>
              <p className="review-text mt-4 text-secondary">
                "An absolutely unforgettable experience! The food was amazing, and we managed to visit all the planned attractions. Slightly went over budget on food, but it was completely worth it."
              </p>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Media Gallery */}
        <div className="side-col">
          <motion.div className="section-block glass-card h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex-between">
              <h2>Media Gallery</h2>
              <button className="btn-primary btn-small"><UploadCloud size={16}/> Upload</button>
            </div>
            
            <div className="masonry-grid mt-4">
              {galleryImages.map((img, idx) => (
                <div key={idx} className={`masonry-item item-${idx}`}>
                  <img src={img} alt="Memory" loading="lazy" />
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CompletedTripPage;
