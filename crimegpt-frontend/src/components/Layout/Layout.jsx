import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import useStore from '../../store/useStore';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Layout.css';

const PAGE_TITLES = {
  '/': { titleKey: 'dashboardTitle', subtitleKey: 'dashboardSubtitle' },
  '/new-case': { titleKey: 'newCaseTitle', subtitleKey: 'newCaseSubtitle' },
  '/cases': { titleKey: 'caseDetailsTitle', subtitleKey: 'caseDetailsSubtitle' },
  '/case-diary': { titleKey: 'caseDiaryTitle', subtitleKey: 'caseDiarySubtitle' },
  '/documents': { titleKey: 'documentsTitle', subtitleKey: 'documentsSubtitle' },
  '/legal-intel': { titleKey: 'legalIntelTitle', subtitleKey: 'legalIntelSubtitle' },
  '/search-audit': { titleKey: 'searchAuditTitle', subtitleKey: 'searchAuditSubtitle' },
  '/settings': { titleKey: 'settingsTitle', subtitleKey: 'settingsSubtitle' },
};

export default function Layout({ children }) {
  const { t } = useTranslation();
  const sidebarOpen = useStore(s => s.sidebarOpen);
  const toggleSidebar = useStore(s => s.toggleSidebar);
  const location = useLocation();
  const path = location.pathname;

  // Match dynamic routes
  const pageKey = Object.keys(PAGE_TITLES).find(k => k !== '/' && path.startsWith(k)) || path;
  const meta = PAGE_TITLES[pageKey] || PAGE_TITLES['/'];

  return (
    <div className={`app-shell ${sidebarOpen ? 'sidebar-open' : 'sidebar-collapsed'}`}>
      <Sidebar />
      {sidebarOpen && <div className="sidebar-overlay-mobile" onClick={toggleSidebar} />}
      <div className="main-area">
        <Topbar title={t(meta.titleKey)} subtitle={t(meta.subtitleKey)} />
        <main className="page-content fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}

