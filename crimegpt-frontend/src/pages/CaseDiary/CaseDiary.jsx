import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BookOpen, Plus, Clock, User, FileText, Package, Scale, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import useStore from '../../store/useStore';
import './CaseDiary.css';

const ENTRY_TYPES = [
  { value: 'statement', labelKey: 'statementRecorded', icon: FileText, color: '#3b82f6' },
  { value: 'arrest', labelKey: 'arrestMade', icon: User, color: '#ef4444' },
  { value: 'evidence', labelKey: 'evidenceSeized', icon: Package, color: '#f59e0b' },
  { value: 'court', labelKey: 'courtAppearance', icon: Scale, color: '#8b5cf6' },
  { value: 'investigation', labelKey: 'investigationStep', icon: BookOpen, color: '#22c55e' },
];

export default function CaseDiary() {
  const { t } = useTranslation();
  const { cases, addDiaryEntry, officer } = useStore();
  const [selectedCase, setSelectedCase] = useState(cases[0]?.id || '');
  const [showAddEntry, setShowAddEntry] = useState(false);
  const [entryForm, setEntryForm] = useState({ action: '', type: 'investigation', officer: officer?.name || '' });

  const activeCase = cases.find(c => c.id === selectedCase);
  const entries = activeCase?.diaryEntries || [];

  const handleAddEntry = () => {
    if (!entryForm.action.trim()) { toast.error('Please describe the action taken.'); return; }
    const now = new Date();
    addDiaryEntry(selectedCase, {
      date: now.toISOString().split('T')[0],
      time: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      action: entryForm.action,
      officer: entryForm.officer || officer?.name,
      type: entryForm.type,
    });
    setEntryForm({ action: '', type: 'investigation', officer: officer?.name || '' });
    setShowAddEntry(false);
    toast.success('Diary entry added!');
  };

  const getTypeInfo = (type) => ENTRY_TYPES.find(t => t.value === type) || ENTRY_TYPES[4];

  return (
    <div className="case-diary fade-in">
      {/* Case selector */}
      <div className="diary-header">
        <div className="case-select-wrap">
          <label>{t('caseSelectLabel')}</label>
          <select value={selectedCase} onChange={e => setSelectedCase(e.target.value)}>
            {cases.map(c => (
              <option key={c.id} value={c.id}>{c.id} — {c.title}</option>
            ))}
          </select>
        </div>
        <button className="btn-primary" onClick={() => setShowAddEntry(s => !s)}>
          <Plus size={16} /> {t('addDiaryEntryBtn')}
        </button>
      </div>

      {/* Add Entry form */}
      {showAddEntry && (
        <div className="add-entry-panel">
          <h3>{t('newDiaryEntry')}</h3>
          <div className="entry-form-grid">
            <div className="form-group">
              <label>{t('entryType')}</label>
              <select value={entryForm.type} onChange={e => setEntryForm(f => ({ ...f, type: e.target.value }))}>
                {ENTRY_TYPES.map(item => <option key={item.value} value={item.value}>{t(item.labelKey)}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>{t('officerName')}</label>
              <input
                value={entryForm.officer}
                onChange={e => setEntryForm(f => ({ ...f, officer: e.target.value }))}
                placeholder={t('officer')}
              />
            </div>
            <div className="form-group full">
              <label>{t('actionDescription')}</label>
              <textarea
                value={entryForm.action}
                onChange={e => setEntryForm(f => ({ ...f, action: e.target.value }))}
                placeholder={t('actionPlaceholder')}
                rows={3}
              />
            </div>
          </div>
          <div className="entry-form-actions">
            <button className="btn-secondary" onClick={() => setShowAddEntry(false)}>{t('cancel')}</button>
            <button className="btn-primary" onClick={handleAddEntry}><Plus size={14} /> {t('addEntry')}</button>
          </div>
        </div>
      )}

      {/* Case info */}
      {activeCase && (
        <div className="diary-case-info">
          <div className="dci-main">
            <span className="dci-id">{activeCase.id}</span>
            <h3 className="dci-title">{activeCase.title}</h3>
            <div className="dci-meta">
              <span>{activeCase.station}</span>
              <span>·</span>
              <span>{activeCase.officer}</span>
              <span>·</span>
              <span className={`badge badge-${activeCase.status === 'active' ? 'active' : activeCase.status === 'pending' ? 'pending' : 'closed'}`}>{t(activeCase.status)}</span>
            </div>
          </div>
          <div className="dci-sections">
            {(activeCase.sections || []).map(s => (
              <span key={s} className="section-tag">{s}</span>
            ))}
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="diary-timeline">
        <h3 className="timeline-title"><Clock size={16} /> {t('investigationTimeline', { count: entries.length })}</h3>
        {entries.length === 0 ? (
          <div className="timeline-empty">
            <BookOpen size={32} />
            <p>{t('noDiaryEntriesYet')}</p>
          </div>
        ) : (
          <div className="timeline-list">
            {[...entries].reverse().map((entry, i) => {
              const typeInfo = getTypeInfo(entry.type);
              const Icon = typeInfo.icon;
              return (
                <div key={i} className="timeline-item">
                  <div className="timeline-dot" style={{ background: typeInfo.color + '20', borderColor: typeInfo.color }}>
                    <Icon size={12} style={{ color: typeInfo.color }} />
                  </div>
                  <div className="timeline-connector" />
                  <div className="timeline-content">
                    <div className="timeline-meta">
                      <span className="timeline-date">{entry.date}</span>
                      <span className="timeline-time">{entry.time}</span>
                      <span className="timeline-type" style={{ color: typeInfo.color }}>{t(typeInfo.labelKey)}</span>
                    </div>
                    <p className="timeline-action">{entry.action}</p>
                    <p className="timeline-officer">{t('officer')}: {entry.officer}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
