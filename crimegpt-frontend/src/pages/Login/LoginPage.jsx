import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Shield, Zap, Eye, EyeOff, Lock, User, AlertCircle, Globe } from 'lucide-react';
import toast from 'react-hot-toast';
import useStore from '../../store/useStore';
import logoImg from '../../assets/logo.png';
import './LoginPage.css';

const PREDEFINED_OFFICERS = [
  {
    badgeId: 'GUJ-AHD-2847',
    password: 'demo1234',
    name: 'PI Amit Solanki',
    rank: 'Police Inspector',
    station: 'Cybercrime PS, Ahmedabad',
    district: 'Ahmedabad City',
    avatar: 'AS'
  },
  {
    badgeId: 'GUJ-SRT-5829',
    password: 'demo1234',
    name: 'PSI Rajesh Patel',
    rank: 'Police Sub-Inspector',
    station: 'Cybercrime PS, Surat City',
    district: 'Surat City',
    avatar: 'RP'
  },
  {
    badgeId: 'GUJ-GND-1102',
    password: 'demo1234',
    name: 'DySP Neha Sharma',
    rank: 'Deputy Superintendent of Police',
    station: 'CID Crime, Gandhinagar',
    district: 'Gandhinagar',
    avatar: 'NS'
  },
  {
    badgeId: 'GUJ-VAD-4491',
    password: 'demo1234',
    name: 'HC Suresh Chavda',
    rank: 'Head Constable',
    station: 'Sayajigunj PS, Vadodara',
    district: 'Vadodara City',
    avatar: 'SC'
  }
];

export default function LoginPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const login = useStore(s => s.login);
  const register = useStore(s => s.register);
  const { language, setLanguage } = useStore();
  
  const [form, setForm] = useState({ badgeId: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    badgeId: '',
    password: '',
    name: '',
    rank: '',
    station: '',
    district: ''
  });
  
  const [isRegister, setIsRegister] = useState(false);
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

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const { badgeId, password, name, rank, station, district } = registerForm;
    if (!badgeId || !password || !name || !rank || !station || !district) {
      setError(t('errorCredentials'));
      return;
    }
    setLoading(true);
    try {
      await register(registerForm);
      toast.success(t('registerSuccess'));
      navigate('/');
    } catch (err) {
      setError(err.message || t('registerFailed'));
      toast.error(t('authFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (officer) => {
    setLoading(true);
    setError('');
    try {
      await login({ badgeId: officer.badgeId, password: officer.password });
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
          {error && (
            <div className="login-error">
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          {!isRegister ? (
            <>
              <div className="login-card-header">
                <h2>{t('officerSignIn')}</h2>
                <p>{t('accessPortal')}</p>
              </div>

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

              <div className="login-toggle-mode">
                <span>{t('newOfficerQuestion')}</span>
                <button type="button" className="toggle-mode-btn" onClick={() => setIsRegister(true)}>
                  {t('registerHere')}
                </button>
              </div>

              <div className="login-divider"><span>{t('quickDemoLogin')}</span></div>

              <div className="demo-profiles-grid">
                {PREDEFINED_OFFICERS.map(officer => (
                  <button
                    key={officer.badgeId}
                    className="demo-profile-tile"
                    onClick={() => handleQuickLogin(officer)}
                    disabled={loading}
                    type="button"
                  >
                    <div className="demo-avatar">{officer.avatar}</div>
                    <div className="demo-tile-details">
                      <p className="demo-tile-name">{officer.name}</p>
                      <p className="demo-tile-meta">{officer.rank} · {officer.district}</p>
                    </div>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="login-card-header">
                <h2>{t('registerTab')}</h2>
                <p>{t('badgeIdHelp')}</p>
              </div>

              <form onSubmit={handleRegisterSubmit} className="login-form">
                <div className="register-form-grid">
                  <div className="form-group">
                    <label>{t('badgeIdLabel')} *</label>
                    <input
                      type="text"
                      placeholder="e.g. GUJ-SRT-1234"
                      value={registerForm.badgeId}
                      onChange={e => setRegisterForm(rf => ({ ...rf, badgeId: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>{t('passwordLabel')} *</label>
                    <input
                      type="password"
                      placeholder="e.g. password"
                      value={registerForm.password}
                      onChange={e => setRegisterForm(rf => ({ ...rf, password: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>{t('fullNameLabel')} *</label>
                    <input
                      type="text"
                      placeholder="e.g. PSI Kiran Desai"
                      value={registerForm.name}
                      onChange={e => setRegisterForm(rf => ({ ...rf, name: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>{t('rankLabel')} *</label>
                    <input
                      type="text"
                      placeholder="e.g. Police Sub-Inspector"
                      value={registerForm.rank}
                      onChange={e => setRegisterForm(rf => ({ ...rf, rank: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>{t('policeStationLabel')} *</label>
                    <input
                      type="text"
                      placeholder="e.g. Maninagar PS"
                      value={registerForm.station}
                      onChange={e => setRegisterForm(rf => ({ ...rf, station: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>{t('districtLabel')} *</label>
                    <input
                      type="text"
                      placeholder="e.g. Ahmedabad City"
                      value={registerForm.district}
                      onChange={e => setRegisterForm(rf => ({ ...rf, district: e.target.value }))}
                      required
                    />
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
                    t('registerBtn')
                  )}
                </button>
              </form>

              <div className="login-toggle-mode">
                <span>{t('alreadyHaveAccount')}</span>
                <button type="button" className="toggle-mode-btn" onClick={() => setIsRegister(false)}>
                  {t('signInHere')}
                </button>
              </div>
            </>
          )}

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
