import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard, FilePlus, BookOpen, FileText,
  Brain, Search, Settings, LogOut, Shield, ChevronLeft, ChevronRight,
  Zap
} from 'lucide-react';
import useStore from '../../store/useStore';
import './Sidebar.css';

const navItems = [
  { path: '/', icon: LayoutDashboard, labelKey: 'dashboard' },
  { path: '/new-case', icon: FilePlus, labelKey: 'newCase' },
  { path: '/case-diary', icon: BookOpen, labelKey: 'caseDiary' },
  { path: '/documents', icon: FileText, labelKey: 'documents' },
  { path: '/legal-intel', icon: Brain, labelKey: 'legalIntel' },
  { path: '/search-audit', icon: Search, labelKey: 'searchAudit' },
];

export default function Sidebar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { officer, sidebarOpen, toggleSidebar, logout } = useStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className={`sidebar ${sidebarOpen ? 'open' : 'collapsed'}`}>
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">
          <Shield size={20} />
          <Zap size={10} className="logo-zap" />
        </div>
        {sidebarOpen && (
          <div className="logo-text">
            <span className="logo-name">CrimeGPT</span>
            <span className="logo-sub">AI Documentation</span>
          </div>
        )}
        <button className="sidebar-toggle" onClick={toggleSidebar} aria-label="Toggle sidebar">
          {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {navItems.map(({ path, icon: Icon, labelKey }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            title={!sidebarOpen ? t(labelKey) : undefined}
          >
            <Icon size={18} />
            {sidebarOpen && <span>{t(labelKey)}</span>}
            {!sidebarOpen && <div className="tooltip">{t(labelKey)}</div>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <NavLink
          to="/settings"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          title={!sidebarOpen ? t('settings') : undefined}
        >
          <Settings size={18} />
          {sidebarOpen && <span>{t('settings')}</span>}
          {!sidebarOpen && <div className="tooltip">{t('settings')}</div>}
        </NavLink>

        {/* Officer card */}
        {sidebarOpen && (
          <div className="officer-card">
            <div className="officer-avatar">{officer?.avatar || 'OA'}</div>
            <div className="officer-info">
              <p className="officer-name">{officer?.name}</p>
              <p className="officer-rank">{officer?.rank}</p>
            </div>
          </div>
        )}

        <button className="nav-item logout-btn" onClick={handleLogout} title={!sidebarOpen ? t('logout') : undefined}>
          <LogOut size={18} />
          {sidebarOpen && <span>{t('logout')}</span>}
          {!sidebarOpen && <div className="tooltip">{t('logout')}</div>}
        </button>
      </div>
    </aside>
  );
}
