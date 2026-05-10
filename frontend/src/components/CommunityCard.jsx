import React from 'react';
import { Heart, MessageCircle, Bookmark, Share2, User } from 'lucide-react';
import { useGlobalContext } from '../GlobalContext';
import { getDefaultImage } from '../utils';
import './Cards.css';

const CommunityCard = ({ post }) => {
  const { savedPosts, setSavedPosts, addToast } = useGlobalContext();
  const { author, avatar, title, likes, comments, image, category } = post;
  const imageUrl = image || getDefaultImage(category);

  const isSaved = savedPosts.some(p => p.id === post.id);

  const toggleSave = () => {
    if (isSaved) {
      setSavedPosts(savedPosts.filter(p => p.id !== post.id));
      addToast('Post removed from saved.', 'success');
    } else {
      setSavedPosts([...savedPosts, post]);
      addToast('Post saved successfully!', 'success');
    }
  };

  return (
    <div className="community-card glass-card">
      <div className="card-img-container">
        <img src={imageUrl} alt={title} className="card-img" loading="lazy" />
        <div className="author-badge glass">
          {avatar ? <img src={avatar} alt={author} className="author-avatar" /> : <User size={16} />}
          <span className="author-name">{author}</span>
        </div>
      </div>
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        <div className="community-actions">
          <button className="action-btn"><Heart size={18}/> {likes}</button>
          <button className="action-btn"><MessageCircle size={18}/> {comments}</button>
          <div className="action-right">
            <button className={`action-btn ${isSaved ? 'text-accent' : ''}`} onClick={toggleSave}>
              <Bookmark size={18} fill={isSaved ? 'currentColor' : 'none'}/>
            </button>
            <button className="action-btn"><Share2 size={18}/></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityCard;
