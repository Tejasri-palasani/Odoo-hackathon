import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Plane, Map, Globe, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import './AuthPage.css';

const AuthPage = () => {
  const [view, setView] = useState('login'); // 'login', 'signup', 'forgot'
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    newPassword: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateEmail = (email) => {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!validateEmail(formData.email)) {
      toast.error('Invalid email format');
      return;
    }

    if (view === 'signup' && formData.name.trim() === '') {
      toast.error('Name is required');
      return;
    }

    const passToCheck = view === 'forgot' ? formData.newPassword : formData.password;
    if (passToCheck.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      let endpoint = '';
      let payload = {};

      if (view === 'login') {
        endpoint = '/api/auth/login';
        payload = { email: formData.email, password: formData.password };
      } else if (view === 'signup') {
        endpoint = '/api/auth/signup';
        payload = { email: formData.email, password: formData.password, name: formData.name, username: formData.username };
      } else if (view === 'forgot') {
        endpoint = '/api/auth/reset-password';
        payload = { email: formData.email, newPassword: formData.newPassword };
      }

      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      if (view === 'login') {
        toast.success('Logged in successfully!');
        navigate('/');
      } else if (view === 'signup') {
        toast.success('Account created! Welcome to the community.');
        navigate('/');
      } else if (view === 'forgot') {
        toast.success('Password reset successful! Please log in.');
        setView('login');
      }

    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.3 } }
  };

  return (
    <div className="auth-page-container">
      {/* Abstract Background Elements */}
      <div className="auth-bg-blob-1" />
      <div className="auth-bg-blob-2" />

      {/* Left Column - Hero Section */}
      <div className="auth-left-column">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="auth-logo-container">
            <div className="auth-logo-icon">
              <Plane size={24} color="white" />
            </div>
            <h1 className="auth-logo-text">TravelSync</h1>
          </div>
          
          <h2 className="auth-heading">
            The dynamic trip planning app.
          </h2>
          
          <p className="auth-subheading">
            Modern collaborative travel planning experience. Smart itineraries, group trip coordination, and community-driven travel memories.
          </p>

          <div className="auth-features">
            {[
              { icon: Map, text: "Interactive smart maps" },
              { icon: User, text: "Real-time group collaboration" },
              { icon: Globe, text: "Discover global communities" }
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + idx * 0.1 }}
                className="auth-feature-item"
              >
                <div className="auth-feature-icon">
                  <feature.icon size={20} />
                </div>
                <span>{feature.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* Floating Abstract Element */}
        <motion.div 
          animate={{ y: [0, -15, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          className="auth-floating-globe"
        >
          <Globe size={128} color="rgba(34, 211, 238, 0.5)" />
        </motion.div>
      </div>

      {/* Right Column - Auth Form */}
      <div className="auth-right-column">
        <div className="auth-form-card">
          <AnimatePresence mode="wait">
            {view === 'login' && (
              <motion.div key="login" variants={containerVariants} initial="hidden" animate="visible" exit="exit">
                <h3 className="auth-form-title">Welcome back</h3>
                <p className="auth-form-subtitle">Enter your credentials to access your account</p>
                
                <form onSubmit={handleSubmit} className="auth-form">
                  <div className="auth-input-group">
                    <Mail className="auth-input-icon" size={20} />
                    <input 
                      type="email" name="email" value={formData.email} onChange={handleChange}
                      placeholder="Email Address" 
                      className="auth-input"
                    />
                  </div>
                  <div className="auth-input-group">
                    <Lock className="auth-input-icon" size={20} />
                    <input 
                      type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange}
                      placeholder="Password" 
                      className="auth-input"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="auth-password-toggle">
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <div className="auth-forgot-link">
                    <button type="button" onClick={() => setView('forgot')} className="auth-link">
                      Forgot password?
                    </button>
                  </div>
                  <button disabled={loading} type="submit" className="auth-submit-btn">
                    {loading ? 'Signing in...' : 'Sign In'} <ArrowRight size={20} />
                  </button>
                </form>
                <p className="auth-footer">
                  Don't have an account? <button onClick={() => setView('signup')} className="auth-link">Sign up</button>
                </p>
              </motion.div>
            )}

            {view === 'signup' && (
              <motion.div key="signup" variants={containerVariants} initial="hidden" animate="visible" exit="exit">
                <h3 className="auth-form-title">Create an account</h3>
                <p className="auth-form-subtitle">Join the community of travelers</p>
                
                <form onSubmit={handleSubmit} className="auth-form">
                  <div className="auth-input-group">
                    <User className="auth-input-icon" size={20} />
                    <input 
                      type="text" name="name" value={formData.name} onChange={handleChange}
                      placeholder="Full Name" 
                      className="auth-input"
                    />
                  </div>
                  <div className="auth-input-group">
                    <User className="auth-input-icon" size={20} />
                    <input 
                      type="text" name="username" value={formData.username} onChange={handleChange}
                      placeholder="Username (e.g. @wanderer)" 
                      className="auth-input"
                    />
                  </div>
                  <div className="auth-input-group">
                    <Mail className="auth-input-icon" size={20} />
                    <input 
                      type="email" name="email" value={formData.email} onChange={handleChange}
                      placeholder="Email Address" 
                      className="auth-input"
                    />
                  </div>
                  <div className="auth-input-group">
                    <Lock className="auth-input-icon" size={20} />
                    <input 
                      type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange}
                      placeholder="Password (min 6 chars)" 
                      className="auth-input"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="auth-password-toggle">
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <button disabled={loading} type="submit" className="auth-submit-btn cyan-indigo">
                    {loading ? 'Creating...' : 'Create Account'} <ArrowRight size={20} />
                  </button>
                </form>
                <p className="auth-footer">
                  Already have an account? <button onClick={() => setView('login')} className="auth-link cyan">Log in</button>
                </p>
              </motion.div>
            )}

            {view === 'forgot' && (
              <motion.div key="forgot" variants={containerVariants} initial="hidden" animate="visible" exit="exit">
                <h3 className="auth-form-title">Reset Password</h3>
                <p className="auth-form-subtitle">Set a new password for your account</p>
                
                <form onSubmit={handleSubmit} className="auth-form">
                  <div className="auth-input-group">
                    <Mail className="auth-input-icon" size={20} />
                    <input 
                      type="email" name="email" value={formData.email} onChange={handleChange}
                      placeholder="Email Address" 
                      className="auth-input"
                    />
                  </div>
                  <div className="auth-input-group">
                    <Lock className="auth-input-icon" size={20} />
                    <input 
                      type={showPassword ? "text" : "password"} name="newPassword" value={formData.newPassword} onChange={handleChange}
                      placeholder="New Password (min 6 chars)" 
                      className="auth-input"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="auth-password-toggle">
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <button disabled={loading} type="submit" className="auth-submit-btn">
                    {loading ? 'Resetting...' : 'Reset Password'} <ArrowRight size={20} />
                  </button>
                </form>
                <p className="auth-footer">
                  Remember your password? <button onClick={() => setView('login')} className="auth-link">Log in</button>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
