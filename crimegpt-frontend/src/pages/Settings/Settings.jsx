import React from 'react';
import { Globe, User, Shield, Bell, Moon, Sun, Database, Info } from 'lucide-react';
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
  const { officer, language, setLanguage, theme, setTheme } = useStore();

  const handleLang = (code) => {
    setLanguage(code);
    i18n.changeLanguage(code);
  };

  return (
    <div className="settings-page fade-in">
      <div className="settings-grid">
        {/* Profile */}
        <div className="settings-card">
          <div className="settings-card-header"><User size={18} /> {t('officerProfile')}</div>
          <div className="profile-block">
            <div className="profile-avatar-lg">{officer?.avatar}</div>
            <div>
              <h3 className="profile-name">{officer?.name}</h3>
              <p className="profile-rank">{officer?.rank}</p>
              <p className="profile-station">{officer?.station}</p>
              <p className="profile-badge">
                <Shield size={11} /> {t('badgeIdLabel')}: {officer?.badgeId}
              </p>
            </div>
          </div>
          <div className="profile-fields">
            <div className="pf-row"><span>{t('districtLabel')}</span><span>{officer?.district}</span></div>
            <div className="pf-row"><span>{t('role')}</span><span className="pf-role">{officer?.role}</span></div>
          </div>
        </div>

        {/* Language */}
        <div className="settings-card">
          <div className="settings-card-header"><Globe size={18} /> {t('languageLocalization')}</div>
          <p className="settings-desc">{t('chooseLanguageDesc')}</p>
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

        {/* Theme Preference */}
        <div className="settings-card">
          <div className="settings-card-header"><Moon size={18} /> {t('themePreference')}</div>
          <p className="settings-desc">{t('themeDesc')}</p>
          <div className="theme-options">
            <button
              className={`theme-option ${theme === 'dark' ? 'active' : ''}`}
              onClick={() => setTheme('dark')}
            >
              <div className="theme-option-icon dark"><Moon size={18} /></div>
              <div>
                <p className="theme-option-name">{t('darkMode')}</p>
              </div>
              {theme === 'dark' && <span className="theme-check">✓</span>}
            </button>
            <button
              className={`theme-option ${theme === 'light' ? 'active' : ''}`}
              onClick={() => setTheme('light')}
            >
              <div className="theme-option-icon light"><Sun size={18} /></div>
              <div>
                <p className="theme-option-name">{t('lightMode')}</p>
              </div>
              {theme === 'light' && <span className="theme-check">✓</span>}
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="settings-card">
          <div className="settings-card-header"><Bell size={18} /> {t('notifications')}</div>
          <div className="settings-toggles">
            {[
              { labelKey: 'newCaseAlertsLabel', descKey: 'newCaseAlertsDesc' },
              { labelKey: 'docGeneratedLabel', descKey: 'docGeneratedDesc' },
              { labelKey: 'aiSuggestionsLabel', descKey: 'aiSuggestionsDesc' },
              { labelKey: 'arrestUpdatesLabel', descKey: 'arrestUpdatesDesc' },
            ].map((item, i) => (
              <div key={i} className="toggle-row">
                <div>
                  <p className="toggle-label">{t(item.labelKey)}</p>
                  <p className="toggle-desc">{t(item.descKey)}</p>
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
          <div className="settings-card-header"><Info size={18} /> {t('systemInformation')}</div>
          <div className="sys-info-list">
            {[
              { labelKey: 'platformLabel', value: 'CrimeGPT v1.0.0' },
              { labelKey: 'legalDatasetLabel', value: 'BNS 2023 / BNSS 2023 / BSA 2023' },
              { labelKey: 'aiEngineLabel', value: 'Rule-based + NLP Classifier' },
              { labelKey: 'docFormatsLabel', value: 'TXT / PDF / DOCX' },
              { labelKey: 'languagesLabel', value: 'English · Hindi · Gujarati' },
              { labelKey: 'departmentLabel', value: 'Gujarat Police' },
            ].map(item => (
              <div key={item.labelKey} className="sys-row">
                <span className="sys-label">{t(item.labelKey)}</span>
                <span className="sys-value">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
