import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Shield, Zap, Eye, EyeOff, Lock, User, AlertCircle, Globe } from 'lucide-react';
import toast from 'react-hot-toast';
import useStore from '../../store/useStore';
import logoImg from '../../assets/logo.png';
import './LoginPage.css';

export default function LoginPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const login = useStore(s => s.login);
  const { language, setLanguage } = useStore();
  const [form, setForm] = useState({ badgeId: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLang = (code) => {
    setLanguage(code);
    i18n.changeLanguage(code);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.badgeId || !form.password) {
      setError(t('errorCredentials'));
      return;
    }
    setLoading(true);
    try {
      await login(form);
      toast.success(t('welcomeBack'));
      navigate('/');
    } catch (err) {
      setError(err.message || t('loginFailedDesc'));
      toast.error(t('authFailed'));
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
        {/* Language switcher */}
        <div className="login-lang-switch" role="group" aria-label="Language selector">
          <Globe size={14} className="lang-icon" />
          {[
            { code: 'en', label: 'EN', full: 'English' },
            { code: 'hi', label: 'HI', full: 'हिंदी' },
            { code: 'gu', label: 'GU', full: 'ગુજરાતી' },
          ].map(l => (
            <button
              key={l.code}
              type="button"
              className={`login-lang-btn ${language === l.code ? 'active' : ''}`}
              onClick={() => handleLang(l.code)}
              title={l.full}
              aria-pressed={language === l.code}
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* Brand */}
        <div className="login-brand">
          <div className="brand-logo">
            <img src={logoImg} className="brand-logo-img" alt="CrimeGPT Logo" />
          </div>
          <div>
            <h1 className="brand-name">CrimeGPT</h1>
            <p className="brand-tagline">{t('brandTagline')}</p>
          </div>
        </div>

        <div className="login-card">
          <div className="login-card-header">
            <h2>{t('officerSignIn')}</h2>
            <p>{t('accessPortal')}</p>
          </div>

          {error && (
            <div className="login-error">
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="badgeId">{t('badgeIdLabel')}</label>
              <div className="input-wrap">
                <User size={16} className="input-icon" />
                <input
                  id="badgeId"
                  type="text"
                  placeholder={t('badgeIdPlaceholder')}
                  value={form.badgeId}
                  onChange={e => setForm(f => ({ ...f, badgeId: e.target.value }))}
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">{t('passwordLabel')}</label>
              <div className="input-wrap">
                <Lock size={16} className="input-icon" />
                <input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  placeholder={t('passwordPlaceholder')}
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="pass-toggle"
                  onClick={() => setShowPass(s => !s)}
                  aria-label={showPass ? t('hidePassword') : t('showPassword')}
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
                  {t('authenticating')}
                </>
              ) : (
                t('signInBtn')
              )}
            </button>
          </form>

          <div className="login-divider"><span>{t('or')}</span></div>

          <button className="demo-btn" onClick={handleDemo} type="button">
            {t('demoCredentialsBtn')}
          </button>

          <p className="login-footer">
            {t('gujaratPoliceSecurePortal')}<br />
            <span>{t('unauthorizedProhibited')}</span>
          </p>
        </div>

        {/* Feature pills */}
        <div className="login-features">
          {[
            t('legalIntel'),
            t('generateDocument'),
            t('languagesLabel'),
            t('caseDiary')
          ].map(f => (
            <span key={f} className="feature-pill">{f}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
