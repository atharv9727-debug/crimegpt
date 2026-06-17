import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Folder, FileText, AlertTriangle, Brain,
  FilePlus, BookOpen, TrendingUp, Clock,
  ChevronRight, CheckCircle2, Circle, Zap
} from 'lucide-react';
import useStore from '../../store/useStore';
import './Dashboard.css';

function StatCard({ icon: Icon, label, value, color, trend }) {
  return (
    <div className={`stat-card stat-${color}`}>
      <div className="stat-icon-wrap">
        <Icon size={20} />
      </div>
      <div className="stat-body">
        <p className="stat-label">{label}</p>
        <p className="stat-value">{value}</p>
        {trend && <p className="stat-trend">↑ {trend}</p>}
      </div>
    </div>
  );
}

function CaseRow({ c, onClick }) {
  const { t } = useTranslation();
  const statusMap = { active: 'badge-active', pending: 'badge-pending', closed: 'badge-closed' };
  return (
    <div className="case-row" onClick={onClick} role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && onClick()}>
      <div className="case-row-main">
        <p className="case-row-id">{c.id}</p>
        <p className="case-row-title">{c.title}</p>
        <p className="case-row-meta">{c.station} · {c.officer}</p>
      </div>
      <div className="case-row-right">
        <span className={`badge ${statusMap[c.status] || 'badge-pending'}`}>{t(c.status)}</span>
        <span className="case-row-date">{c.date}</span>
        <ChevronRight size={14} className="case-row-arrow" />
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { cases, stats, officer } = useStore();

  const recentCases = cases.slice(0, 5);

  const quickActions = [
    { labelKey: 'registerNewFIR', icon: FilePlus, path: '/new-case', color: 'blue' },
    { labelKey: 'documents', icon: FileText, path: '/documents', color: 'purple' },
    { labelKey: 'legalIntel', icon: Brain, path: '/legal-intel', color: 'cyan' },
    { labelKey: 'caseDiary', icon: BookOpen, path: '/case-diary', color: 'green' },
  ];

  const activityItems = [
    { text: t('activityChargesheetGenerated', { caseId: 'CR-2024-0878' }), time: t('twoHoursAgo'), icon: FileText, done: true },
    { text: t('activityAccusedArrested', { name: 'Raju Prasad', caseId: 'CR-2024-0892' }), time: t('fiveHoursAgo'), icon: CheckCircle2, done: true },
    { text: t('activityMedicalLetterPending', { caseId: 'CR-2024-0885' }), time: t('oneDayAgo'), icon: AlertTriangle, done: false },
    { text: t('activityAiSectionsSuggested', { count: 3, caseId: 'CR-2024-0891' }), time: t('twoDaysAgo'), icon: Brain, done: true },
  ];

  return (
    <div className="dashboard fade-in">
      {/* Welcome */}
      <div className="dashboard-welcome">
        <div>
          <h2 className="welcome-title">{t('welcomeOfficer', { name: officer?.name })}</h2>
          <p className="welcome-sub">{officer?.station} · {officer?.district}</p>
        </div>
        <button className="btn-primary" onClick={() => navigate('/new-case')}>
          <FilePlus size={16} />
          {t('registerNewFIR')}
        </button>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <StatCard icon={Folder} label={t('activeCases')} value={stats.activeCases} color="blue" trend={t('trendTwoThisWeek')} />
        <StatCard icon={FileText} label={t('totalDocuments')} value={stats.totalDocuments} color="purple" trend={t('trendTwelveThisWeek')} />
        <StatCard icon={AlertTriangle} label={t('pendingArrests')} value={stats.pendingArrests} color="orange" />
        <StatCard icon={Brain} label={t('sectionsSuggested')} value={stats.sectionsSuggested} color="cyan" trend={t('trendAiPowered')} />
      </div>

      {/* Main grid */}
      <div className="dashboard-main">
        {/* Recent Cases */}
        <div className="dash-panel">
          <div className="panel-header">
            <h3>{t('recentCases')}</h3>
            <button className="link-btn" onClick={() => navigate('/search-audit')}>
              {t('viewAll')} <ChevronRight size={14} />
            </button>
          </div>
          <div className="cases-list">
            {recentCases.map(c => (
              <CaseRow key={c.id} c={c} onClick={() => navigate(`/cases/${c.id}`)} />
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="dash-side">
          {/* Quick Actions */}
          <div className="dash-panel">
            <div className="panel-header"><h3>{t('quickActions')}</h3></div>
            <div className="quick-actions-grid">
              {quickActions.map(({ labelKey, icon: Icon, path, color }) => (
                <button key={path} className={`quick-action-btn qa-${color}`} onClick={() => navigate(path)}>
                  <Icon size={20} />
                  <span>{t(labelKey)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="dash-panel">
            <div className="panel-header">
              <h3>{t('recentActivity')}</h3>
              <Clock size={14} className="panel-icon" />
            </div>
            <div className="activity-list">
              {activityItems.map((item, i) => (
                <div key={i} className={`activity-item ${item.done ? '' : 'activity-pending'}`}>
                  <div className={`activity-dot ${item.done ? 'done' : 'pending'}`}>
                    <item.icon size={10} />
                  </div>
                  <div className="activity-content">
                    <p className="activity-text">{item.text}</p>
                    <p className="activity-time">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI tip */}
          <div className="ai-tip-card">
            <div className="ai-tip-icon"><Zap size={14} /></div>
            <div>
              <p className="ai-tip-title">{t('aiReady')}</p>
              <p className="ai-tip-body">{t('aiTipBody')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
