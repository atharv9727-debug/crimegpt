import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, FileText, BookOpen, Package, User, Scale, Clock, Plus } from 'lucide-react';
import useStore from '../../store/useStore';
import './CaseDetail.css';

export default function CaseDetail() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { cases, selectCase, selectedCase } = useStore();

  useEffect(() => {
    selectCase(id);
  }, [id]);

  const c = selectedCase || cases.find(c => c.id === id);

  if (!c) {
    return (
      <div className="case-detail-error fade-in">
        <p>{t('caseNotFound', { id })}</p>
        <button className="btn-secondary" onClick={() => navigate('/')}>← {t('backToDashboard')}</button>
      </div>
    );
  }

  const statusMap = { active: 'badge-active', pending: 'badge-pending', closed: 'badge-closed' };

  return (
    <div className="case-detail fade-in">
      {/* Header */}
      <div className="cd-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} /> {t('back')}
        </button>
        <div className="cd-title-wrap">
          <span className="cd-id">{c.id}</span>
          <h2 className="cd-title">{c.title}</h2>
          <div className="cd-meta">
            <span>{c.station}</span>
            <span>·</span>
            <span>{c.officer}</span>
            <span>·</span>
            <span>{c.date}</span>
            <span className={`badge ${statusMap[c.status] || 'badge-pending'}`}>{t(c.status)}</span>
          </div>
        </div>
        <div className="cd-actions">
          <button className="btn-secondary" onClick={() => navigate('/documents')}>
            <FileText size={15} /> {t('generateDocumentsBtn')}
          </button>
          <button className="btn-primary" onClick={() => navigate('/case-diary')}>
            <BookOpen size={15} /> {t('caseDiary')}
          </button>
        </div>
      </div>

      <div className="cd-body">
        {/* Sections */}
        <div className="cd-card">
          <h3><Scale size={15} /> {t('appliedLegalSections')}</h3>
          <div className="cd-sections">
            {(c.sections || []).map(s => (
              <span key={s} className="cd-section-tag">{s}</span>
            ))}
            {(!c.sections || c.sections.length === 0) && (
              <span className="cd-empty">{t('noSectionsApplied')}</span>
            )}
          </div>
        </div>

        <div className="cd-grid">
          {/* Narrative */}
          <div className="cd-card cd-card-wide">
            <h3><FileText size={15} /> {t('incidentNarrativeLabel')}</h3>
            <p className="cd-narrative">{c.narrative || t('noNarrativeRecorded')}</p>
          </div>

          {/* Persons */}
          <div className="cd-card">
            <h3><User size={15} /> {t('personsInvolved')}</h3>
            <div className="cd-persons">
              <div className="cd-person cd-complainant">
                <span className="person-role">{t('complainant')}</span>
                <span className="person-name">{c.complainant}</span>
              </div>
              <div className="cd-person cd-accused">
                <span className="person-role">{t('accused')}</span>
                <span className="person-name">{c.accused}</span>
              </div>
            </div>
          </div>

          {/* Evidence */}
          <div className="cd-card">
            <h3><Package size={15} /> {t('evidenceSeizedTitle', { count: (c.evidence || []).length })}</h3>
            <div className="cd-evidence-list">
              {(c.evidence || []).map(e => (
                <div key={e.id} className="cd-evidence-item">
                  <span className="ev-id">{e.id}</span>
                  <div className="ev-info">
                    <p className="ev-item">{e.item}</p>
                    <span className="ev-type">{t(e.type.toLowerCase())}</span>
                  </div>
                  <span className="ev-date">{e.seized}</span>
                </div>
              ))}
              {(!c.evidence || c.evidence.length === 0) && (
                <p className="cd-empty">{t('noEvidenceRecorded')}</p>
              )}
            </div>
          </div>
        </div>

        {/* Diary */}
        <div className="cd-card">
          <div className="cd-card-header">
            <h3><Clock size={15} /> {t('caseDiaryTitleCount', { count: (c.diaryEntries || []).length })}</h3>
            <button className="link-btn" onClick={() => navigate('/case-diary')}>
              {t('fullDiaryBtn')} <ArrowLeft size={12} style={{ transform: 'rotate(180deg)' }} />
            </button>
          </div>
          <div className="cd-diary-list">
            {[...(c.diaryEntries || [])].reverse().map((entry, i) => (
              <div key={i} className="cd-diary-entry">
                <div className="cde-dot" />
                <div className="cde-content">
                  <div className="cde-meta">
                    <span className="cde-date">{entry.date} {entry.time}</span>
                    <span className="cde-officer">— {entry.officer}</span>
                  </div>
                  <p className="cde-action">{entry.action}</p>
                </div>
              </div>
            ))}
            {(!c.diaryEntries || c.diaryEntries.length === 0) && (
              <p className="cd-empty">{t('noDiaryEntriesYetDetail')}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
