import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import useStore from './store/useStore';
import i18n from './i18n/config';

import Layout from './components/Layout/Layout';
import LoginPage from './pages/Login/LoginPage';
import Dashboard from './pages/Dashboard/Dashboard';
import NewCase from './pages/NewCase/NewCase';
import CaseDiary from './pages/CaseDiary/CaseDiary';
import Documents from './pages/Documents/Documents';
import LegalIntelligence from './pages/LegalIntelligence/LegalIntelligence';
import SearchAudit from './pages/SearchAudit/SearchAudit';
import CaseDetail from './pages/CaseDetail/CaseDetail';
import Settings from './pages/Settings/Settings';

function ProtectedRoute({ children }) {
  const isAuthenticated = useStore(s => s.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const language = useStore(s => s.language);
  const { isAuthenticated, initializeData } = useStore();

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  useEffect(() => {
    if (isAuthenticated) {
      initializeData();
    }
  }, [isAuthenticated, initializeData]);

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1a2236',
            color: '#f1f5f9',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '10px',
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#22c55e', secondary: '#0a0f1e' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#0a0f1e' } },
        }}
      />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/new-case" element={<NewCase />} />
                  <Route path="/cases/:id" element={<CaseDetail />} />
                  <Route path="/case-diary" element={<CaseDiary />} />
                  <Route path="/documents" element={<Documents />} />
                  <Route path="/legal-intel" element={<LegalIntelligence />} />
                  <Route path="/search-audit" element={<SearchAudit />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
