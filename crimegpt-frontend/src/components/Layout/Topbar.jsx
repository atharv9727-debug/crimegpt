import React from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, Globe, Search } from 'lucide-react';
import useStore from '../../store/useStore';
import './Topbar.css';

const LANGUAGES = [
  { code: 'en', label: 'EN', full: 'English' },
  { code: 'hi', label: 'HI', full: 'हिंदी' },
  { code: 'gu', label: 'GU', full: 'ગુજરાતી' },
];

export default function Topbar({ title, subtitle }) {
  const { t, i18n } = useTranslation();
  const { language, setLanguage, stats } = useStore();

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
        <button className="icon-btn" aria-label="Notifications">
          <Bell size={18} />
          <span className="notif-dot" aria-hidden="true" />
        </button>

        {/* Quick stat */}
        <div className="topbar-stat">
          <span className="stat-label">Active</span>
          <span className="stat-value">{stats?.activeCases}</span>
        </div>
      </div>
    </header>
  );
}
