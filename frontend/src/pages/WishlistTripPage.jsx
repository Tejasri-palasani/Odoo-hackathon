import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGlobalContext } from '../GlobalContext';
import { motion } from 'framer-motion';
import { Calendar, Users, DollarSign, ExternalLink } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import BudgetPlanner from '../components/BudgetPlanner';
import SmartStopSearch from '../components/SmartStopSearch';
import 'leaflet/dist/leaflet.css';
import './WishlistTripPage.css';

import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow, iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

const WishlistTripPage = () => {
  const { id } = useParams();
  const { wishlistTrips } = useGlobalContext();
  const trip = wishlistTrips.find(t => t.id === parseInt(id));

  const [stops, setStops] = useState([
    { id: 'stop-1', city: 'Paris', arrival: '10 AM', duration: '3 Days', type: 'Flight', coordinates: [48.8566, 2.3522] },
    { id: 'stop-2', city: 'Lyon', arrival: '2 PM', duration: '2 Days', type: 'Train', coordinates: [45.7640, 4.8357] },
    { id: 'stop-3', city: 'Nice', arrival: '11 AM', duration: '3 Days', type: 'Car', coordinates: [43.7102, 7.2620] },
  ]);

  // Track the selected stop for SmartStopSearch
  const [selectedStopCity, setSelectedStopCity] = useState('Paris');

  if (!trip) return <div className="p-8 text-center text-xl text-white">Trip not found</div>;

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(stops);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setStops(items);
  };

  return (
    <div className="wishlist-page">
      <motion.div 
        className="cover-section"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
      >
        <img src={trip.image || 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e'} alt={trip.destination} className="cover-img" />
        <div className="cover-overlay glass">
          <h1 className="trip-hero-title">{trip.destination}</h1>
          <div className="trip-meta">
            <span><Calendar size={18}/> {trip.duration}</span>
            <span><DollarSign size={18}/> {trip.budget} Budget</span>
            <span><Users size={18}/> Friends Trip</span>
          </div>
        </div>
      </motion.div>

      <div className="trip-content-grid">
        <div className="main-col">
          <motion.div className="section-block glass-card" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
            <h2>Journey Timeline</h2>
            <p className="text-secondary">Drag and drop to reorder. Click a stop to explore attractions.</p>
            
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="timeline">
                {(provided) => (
                  <div className="timeline-container" {...provided.droppableProps} ref={provided.innerRef}>
                    {stops.map((stop, index) => (
                      <Draggable key={stop.id} draggableId={stop.id} index={index}>
                        {(provided) => (
                          <div 
                            className={`timeline-stop glass ${selectedStopCity === stop.city ? 'active-stop' : ''}`}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            onClick={() => setSelectedStopCity(stop.city)}
                            style={{...provided.draggableProps.style, cursor: 'pointer', border: selectedStopCity === stop.city ? '1px solid var(--accent-color)' : ''}}
                          >
                            <div className="stop-marker"></div>
                            <div className="stop-content">
                              <h3>{stop.city}</h3>
                              <p>{stop.duration} • Arrive at {stop.arrival} via {stop.type}</p>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </motion.div>

          <motion.div className="section-block glass-card mt-8" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
            <h2>Smart Attractions: {selectedStopCity}</h2>
            <SmartStopSearch currentCity={selectedStopCity} />
          </motion.div>
        </div>

        <div className="side-col">
          <motion.div className="section-block glass-card map-container" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
            <div className="flex-between">
              <h2>Interactive Map</h2>
              <button className="icon-btn-small" title="Open Full Map"><ExternalLink size={18}/></button>
            </div>
            <div className="leaflet-wrapper mt-4 rounded-xl overflow-hidden">
              <MapContainer center={[46.603354, 1.888334]} zoom={5} style={{ height: '300px', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {stops.map(stop => (
                  <Marker key={stop.id} position={stop.coordinates}>
                    <Popup>{stop.city}</Popup>
                  </Marker>
                ))}
                <Polyline positions={stops.map(s => s.coordinates)} color="#3b82f6" />
              </MapContainer>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
        <BudgetPlanner trip={trip} />
      </motion.div>
    </div>
  );
};

export default WishlistTripPage;
