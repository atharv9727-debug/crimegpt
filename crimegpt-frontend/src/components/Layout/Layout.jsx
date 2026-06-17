import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import useStore from '../../store/useStore';
import { useLocation } from 'react-router-dom';
import './Layout.css';

const PAGE_TITLES = {
  '/': { title: 'Dashboard', subtitle: 'Overview of all cases and activities' },
  '/new-case': { title: 'New Case Entry', subtitle: 'Unified data pool — enter once, generate all documents' },
  '/case-diary': { title: 'Case Diary', subtitle: 'Timeline of investigative actions' },
  '/documents': { title: 'Document Generator', subtitle: 'Generate, preview and download legal documents' },
  '/legal-intel': { title: 'Legal Intelligence', subtitle: 'AI-powered section suggestion (BNS / BNSS / BSA)' },
  '/search-audit': { title: 'Search & Audit', subtitle: 'Search cases, documents, and view version history' },
  '/settings': { title: 'Settings', subtitle: 'Preferences, profile, and system configuration' },
};

export default function Layout({ children }) {
  const sidebarOpen = useStore(s => s.sidebarOpen);
  const location = useLocation();
  const path = location.pathname;

  // Match dynamic routes
  const pageKey = Object.keys(PAGE_TITLES).find(k => k !== '/' && path.startsWith(k)) || path;
  const meta = PAGE_TITLES[pageKey] || PAGE_TITLES['/'];

  return (
    <div className={`app-shell ${sidebarOpen ? 'sidebar-open' : 'sidebar-collapsed'}`}>
      <Sidebar />
      <div className="main-area">
        <Topbar title={meta.title} subtitle={meta.subtitle} />
        <main className="page-content fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
