import React from 'react';
import { Globe, User, Shield, Bell, Moon, Database, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import useStore from '../../store/useStore';
import './Settings.css';

const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'Hindi', native: 'हिंदी', flag: '🇮🇳' },
  { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી', flag: '🇮🇳' },
];

export default function Settings() {
  const { t, i18n } = useTranslation();
  const { officer, language, setLanguage } = useStore();

  const handleLang = (code) => {
    setLanguage(code);
    i18n.changeLanguage(code);
  };

  return (
    <div className="settings-page fade-in">
      <div className="settings-grid">
        {/* Profile */}
        <div className="settings-card">
          <div className="settings-card-header"><User size={18} /> Officer Profile</div>
          <div className="profile-block">
            <div className="profile-avatar-lg">{officer?.avatar}</div>
            <div>
              <h3 className="profile-name">{officer?.name}</h3>
              <p className="profile-rank">{officer?.rank}</p>
              <p className="profile-station">{officer?.station}</p>
              <p className="profile-badge">
                <Shield size={11} /> Badge: {officer?.badge}
              </p>
            </div>
          </div>
          <div className="profile-fields">
            <div className="pf-row"><span>District</span><span>{officer?.district}</span></div>
            <div className="pf-row"><span>Role</span><span className="pf-role">{officer?.role}</span></div>
          </div>
        </div>

        {/* Language */}
        <div className="settings-card">
          <div className="settings-card-header"><Globe size={18} /> Language &amp; Localization</div>
          <p className="settings-desc">Choose the interface and document output language.</p>
          <div className="lang-options">
            {LANGUAGES.map(lang => (
              <button
                key={lang.code}
                className={`lang-option ${language === lang.code ? 'active' : ''}`}
                onClick={() => handleLang(lang.code)}
              >
                <span className="lang-flag">{lang.flag}</span>
                <div>
                  <p className="lang-name">{lang.label}</p>
                  <p className="lang-native">{lang.native}</p>
                </div>
                {language === lang.code && <span className="lang-check">✓</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="settings-card">
          <div className="settings-card-header"><Bell size={18} /> Notifications</div>
          <div className="settings-toggles">
            {[
              { label: 'New Case Alerts', desc: 'Get notified when a new case is registered' },
              { label: 'Document Generated', desc: 'Notify when a document is ready' },
              { label: 'AI Suggestions', desc: 'Notify when AI finds applicable sections' },
              { label: 'Arrest Updates', desc: 'Updates on accused arrest status' },
            ].map((item, i) => (
              <div key={i} className="toggle-row">
                <div>
                  <p className="toggle-label">{item.label}</p>
                  <p className="toggle-desc">{item.desc}</p>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" defaultChecked={i < 2} />
                  <span className="toggle-slider" />
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* System info */}
        <div className="settings-card">
          <div className="settings-card-header"><Info size={18} /> System Information</div>
          <div className="sys-info-list">
            {[
              { label: 'Platform', value: 'CrimeGPT v1.0.0' },
              { label: 'Legal Dataset', value: 'BNS 2023 / BNSS 2023 / BSA 2023' },
              { label: 'AI Engine', value: 'Rule-based + NLP Classifier' },
              { label: 'Document Formats', value: 'TXT / PDF / DOCX' },
              { label: 'Languages', value: 'English · Hindi · Gujarati' },
              { label: 'Department', value: 'Gujarat Police' },
            ].map(item => (
              <div key={item.label} className="sys-row">
                <span className="sys-label">{item.label}</span>
                <span className="sys-value">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
