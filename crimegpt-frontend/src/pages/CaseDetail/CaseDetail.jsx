import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, BookOpen, Package, User, Scale, Clock, Plus } from 'lucide-react';
import useStore from '../../store/useStore';
import './CaseDetail.css';

export default function CaseDetail() {
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
        <p>Case not found: {id}</p>
        <button className="btn-secondary" onClick={() => navigate('/')}>← Back to Dashboard</button>
      </div>
    );
  }

  const statusMap = { active: 'badge-active', pending: 'badge-pending', closed: 'badge-closed' };
  const severityColor = { critical: '#ef4444', high: '#f59e0b', medium: '#3b82f6', procedural: '#8b5cf6' };

  return (
    <div className="case-detail fade-in">
      {/* Header */}
      <div className="cd-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} /> Back
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
            <span className={`badge ${statusMap[c.status] || 'badge-pending'}`}>{c.status}</span>
          </div>
        </div>
        <div className="cd-actions">
          <button className="btn-secondary" onClick={() => navigate('/documents')}>
            <FileText size={15} /> Generate Documents
          </button>
          <button className="btn-primary" onClick={() => navigate('/case-diary')}>
            <BookOpen size={15} /> Case Diary
          </button>
        </div>
      </div>

      <div className="cd-body">
        {/* Sections */}
        <div className="cd-card">
          <h3><Scale size={15} /> Applied Legal Sections</h3>
          <div className="cd-sections">
            {(c.sections || []).map(s => (
              <span key={s} className="cd-section-tag">{s}</span>
            ))}
            {(!c.sections || c.sections.length === 0) && (
              <span className="cd-empty">No sections applied yet. Use Legal Intelligence to suggest sections.</span>
            )}
          </div>
        </div>

        <div className="cd-grid">
          {/* Narrative */}
          <div className="cd-card cd-card-wide">
            <h3><FileText size={15} /> Incident Narrative</h3>
            <p className="cd-narrative">{c.narrative || 'No narrative recorded.'}</p>
          </div>

          {/* Persons */}
          <div className="cd-card">
            <h3><User size={15} /> Persons Involved</h3>
            <div className="cd-persons">
              <div className="cd-person cd-complainant">
                <span className="person-role">Complainant</span>
                <span className="person-name">{c.complainant}</span>
              </div>
              <div className="cd-person cd-accused">
                <span className="person-role">Accused</span>
                <span className="person-name">{c.accused}</span>
              </div>
            </div>
          </div>

          {/* Evidence */}
          <div className="cd-card">
            <h3><Package size={15} /> Evidence Seized ({(c.evidence || []).length} items)</h3>
            <div className="cd-evidence-list">
              {(c.evidence || []).map(e => (
                <div key={e.id} className="cd-evidence-item">
                  <span className="ev-id">{e.id}</span>
                  <div className="ev-info">
                    <p className="ev-item">{e.item}</p>
                    <span className="ev-type">{e.type}</span>
                  </div>
                  <span className="ev-date">{e.seized}</span>
                </div>
              ))}
              {(!c.evidence || c.evidence.length === 0) && (
                <p className="cd-empty">No evidence recorded.</p>
              )}
            </div>
          </div>
        </div>

        {/* Diary */}
        <div className="cd-card">
          <div className="cd-card-header">
            <h3><Clock size={15} /> Case Diary ({(c.diaryEntries || []).length} entries)</h3>
            <button className="link-btn" onClick={() => navigate('/case-diary')}>
              Full Diary <ArrowLeft size={12} style={{ transform: 'rotate(180deg)' }} />
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
              <p className="cd-empty">No diary entries yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
