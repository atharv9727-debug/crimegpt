import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Search } from 'lucide-react';
import useStore from '../../store/useStore';
import logoImg from '../../assets/logo.png';
import './Topbar.css';

const LANGUAGES = [
  { code: 'en', label: 'EN', full: 'English' },
  { code: 'hi', label: 'HI', full: 'हिंदी' },
  { code: 'gu', label: 'GU', full: 'ગુજરાતી' },
];

export default function Topbar({ title, subtitle }) {
  const { t, i18n } = useTranslation();
  const { language, setLanguage, stats } = useStore();
  const [showNotif, setShowNotif] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowNotif(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLang = (code) => {
    setLanguage(code);
    i18n.changeLanguage(code);
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <h1 className="topbar-title">{title}</h1>
        {subtitle && <p className="topbar-subtitle">{subtitle}</p>}
      </div>

      <div className="topbar-right">
        {/* Language switcher */}
        <div className="lang-switcher" role="group" aria-label="Language selector">
          <Globe size={14} className="lang-icon" />
          {LANGUAGES.map(l => (
            <button
              key={l.code}
              className={`lang-btn ${language === l.code ? 'active' : ''}`}
              onClick={() => handleLang(l.code)}
              title={l.full}
              aria-pressed={language === l.code}
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* Notifications */}
        <div className="notif-container" ref={dropdownRef}>
          <button
            className={`icon-btn ${showNotif ? 'active' : ''}`}
            aria-label="Notifications"
            onClick={() => {
              setShowNotif(!showNotif);
              setHasUnread(false);
            }}
          >
            <img src={logoImg} className="main-logo-icon-img" alt="Notifications" />
            {hasUnread && <span className="notif-dot" aria-hidden="true" />}
          </button>

          {showNotif && (
            <div className="notif-dropdown">
              <div className="notif-header">
                <h3>{t('notifications')}</h3>
                <button className="clear-btn" onClick={() => setShowNotif(false)}>{t('close')}</button>
              </div>
              <div className="notif-list">
                {[
                  { text: t('activityChargesheetGenerated', { caseId: 'CR-2024-0878' }), time: t('twoHoursAgo') },
                  { text: t('activityAccusedArrested', { name: 'Raju Prasad', caseId: 'CR-2024-0892' }), time: t('fiveHoursAgo') },
                  { text: t('activityMedicalLetterPending', { caseId: 'CR-2024-0885' }), time: t('oneDayAgo') },
                  { text: t('activityAiSectionsSuggested', { count: 3, caseId: 'CR-2024-0891' }), time: t('twoDaysAgo') },
                ].map((item, i) => (
                  <div key={i} className="notif-item">
                    <p className="notif-text">{item.text}</p>
                    <span className="notif-time">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick stat */}
        <div className="topbar-stat">
          <span className="stat-label">{t('active')}</span>
          <span className="stat-value">{stats?.activeCases}</span>
        </div>
      </div>
    </header>
  );
}
