import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Carousel.css';

const Carousel = ({ title, actionButton, children, isGlowing }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = direction === 'left' ? -current.offsetWidth / 2 : current.offsetWidth / 2;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="carousel-section">
      <div className="carousel-header">
        <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
          <h2 className="carousel-title">{title}</h2>
          {actionButton}
        </div>
        <div className="carousel-controls">
          <button className="carousel-arrow glass" onClick={() => scroll('left')}>
            <ChevronLeft size={24} />
          </button>
          <button className="carousel-arrow glass" onClick={() => scroll('right')}>
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
      
      <div className="carousel-container no-scrollbar" ref={scrollRef}>
        {/* We map through children to wrap them if needed, but here we just render */}
        {React.Children.map(children, child => (
          <div className="carousel-item">
            {child}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
