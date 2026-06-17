import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Zap, Eye, EyeOff, Lock, User, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import useStore from '../../store/useStore';
import logoImg from '../../assets/logo.png';
import './LoginPage.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useStore(s => s.login);
  const [form, setForm] = useState({ badgeId: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.badgeId || !form.password) {
      setError('Please enter your Badge ID and Password.');
      return;
    }
    setLoading(true);
    try {
      await login(form);
      toast.success('Welcome back, Officer!');
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials or ensure backend is awake.');
      toast.error('Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = () => {
    setForm({ badgeId: 'GUJ-AHD-2847', password: 'demo1234' });
  };

  return (
    <div className="login-page">
      {/* Animated background */}
      <div className="login-bg">
        <div className="bg-orb orb-1" />
        <div className="bg-orb orb-2" />
        <div className="bg-orb orb-3" />
        <div className="bg-grid" />
      </div>

      <div className="login-container">
        {/* Brand */}
        <div className="login-brand">
          <div className="brand-logo">
            <img src={logoImg} className="brand-logo-img" alt="CrimeGPT Logo" />
          </div>
          <div>
            <h1 className="brand-name">CrimeGPT</h1>
            <p className="brand-tagline">AI-Driven Police Documentation Platform</p>
          </div>
        </div>

        <div className="login-card">
          <div className="login-card-header">
            <h2>Officer Sign In</h2>
            <p>Access your case management portal</p>
          </div>

          {error && (
            <div className="login-error">
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="badgeId">Badge / Officer ID</label>
              <div className="input-wrap">
                <User size={16} className="input-icon" />
                <input
                  id="badgeId"
                  type="text"
                  placeholder="e.g. GUJ-AHD-2847"
                  value={form.badgeId}
                  onChange={e => setForm(f => ({ ...f, badgeId: e.target.value }))}
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrap">
                <Lock size={16} className="input-icon" />
                <input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="pass-toggle"
                  onClick={() => setShowPass(s => !s)}
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className={`login-submit ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner" />
                  Authenticating...
                </>
              ) : (
                'Sign In to CrimeGPT'
              )}
            </button>
          </form>

          <div className="login-divider"><span>or</span></div>

          <button className="demo-btn" onClick={handleDemo} type="button">
            Use Demo Credentials
          </button>

          <p className="login-footer">
            Gujarat Police Department · Secure Portal<br />
            <span>Unauthorized access is prohibited and monitored.</span>
          </p>
        </div>

        {/* Feature pills */}
        <div className="login-features">
          {['BNS / BNSS / BSA Intelligence', 'Auto Document Generation', 'Trilingual Support', 'Case Diary Automation'].map(f => (
            <span key={f} className="feature-pill">{f}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
