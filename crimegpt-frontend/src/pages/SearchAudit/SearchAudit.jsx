import React, { useState, useMemo } from 'react';
import { Search, Filter, Clock, FileText, Edit3, Plus, ChevronRight, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useStore from '../../store/useStore';
import './SearchAudit.css';

export default function SearchAudit() {
  const navigate = useNavigate();
  const { cases, auditLog, generatedDocs } = useStore();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('cases');

  const filteredCases = useMemo(() => {
    let result = cases;
    if (statusFilter !== 'all') result = result.filter(c => c.status === statusFilter);
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(c =>
        c.id.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.complainant.toLowerCase().includes(q) ||
        c.accused.toLowerCase().includes(q) ||
        c.station.toLowerCase().includes(q) ||
        (c.sections || []).some(s => s.toLowerCase().includes(q))
      );
    }
    return result;
  }, [cases, query, statusFilter]);

  const auditTypeColor = { create: '#22c55e', generate: '#3b82f6', edit: '#f59e0b', delete: '#ef4444' };
  const auditTypeIcon = { create: Plus, generate: FileText, edit: Edit3, delete: FileText };

  return (
    <div className="search-audit fade-in">
      {/* Search bar */}
      <div className="search-bar-wrap">
        <div className="search-main">
          <Search size={18} className="search-icon" />
          <input
            id="global-search"
            className="search-input"
            placeholder="Search by case number, name, sections, station..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
          />
          {query && (
            <button className="search-clear" onClick={() => setQuery('')}>✕</button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="audit-tabs">
        <button className={`tab ${activeTab === 'cases' ? 'active' : ''}`} onClick={() => setActiveTab('cases')}>
          <FileText size={14} /> Cases ({filteredCases.length})
        </button>
        <button className={`tab ${activeTab === 'audit' ? 'active' : ''}`} onClick={() => setActiveTab('audit')}>
          <Clock size={14} /> Audit Trail ({auditLog.length})
        </button>
        <button className={`tab ${activeTab === 'docs' ? 'active' : ''}`} onClick={() => setActiveTab('docs')}>
          <FileText size={14} /> Generated Docs ({generatedDocs.length})
        </button>
      </div>

      {activeTab === 'cases' && (
        <>
          {/* Filters */}
          <div className="filters-row">
            <Filter size={14} />
            {['all', 'active', 'pending', 'closed'].map(s => (
              <button
                key={s}
                className={`filter-chip ${statusFilter === s ? 'active' : ''}`}
                onClick={() => setStatusFilter(s)}
              >
                {s === 'all' ? 'All Cases' : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
            <span className="results-count">{filteredCases.length} result{filteredCases.length !== 1 ? 's' : ''}</span>
          </div>

          {/* Results */}
          <div className="search-results">
            {filteredCases.length === 0 ? (
              <div className="no-results-state">
                <Search size={32} />
                <p>No cases found matching "{query}"</p>
                <span>Try searching by case number, name, or section</span>
              </div>
            ) : (
              filteredCases.map(c => (
                <div key={c.id} className="search-case-card" onClick={() => navigate(`/cases/${c.id}`)}>                  
                  <div className="scc-left">
                    <span className="scc-id">{c.id}</span>
                    <h3 className="scc-title">{c.title}</h3>
                    <div className="scc-meta">
                      <span>{c.complainant}</span>
                      <span>·</span>
                      <span>{c.station}</span>
                      <span>·</span>
                      <span>{c.officer}</span>
                    </div>
                    <div className="scc-sections">
                      {(c.sections || []).map(s => <span key={s} className="mini-section">{s}</span>)}
                    </div>
                  </div>
                  <div className="scc-right">
                    <span className={`badge badge-${c.status === 'active' ? 'active' : c.status === 'pending' ? 'pending' : 'closed'}`}>{c.status}</span>
                    <span className="scc-date">{c.date}</span>
                    <ChevronRight size={16} className="scc-arrow" />
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {activeTab === 'audit' && (
        <div className="audit-list">
          {auditLog.map((entry) => {
            const Icon = auditTypeIcon[entry.type] || FileText;
            const color = auditTypeColor[entry.type] || '#60a5fa';
            return (
              <div key={entry.id} className="audit-entry">
                <div className="ae-icon" style={{ background: color + '15', color }}>
                  <Icon size={14} />
                </div>
                <div className="ae-content">
                  <p className="ae-action">{entry.action}</p>
                  <div className="ae-meta">
                    <span>{entry.officer}</span>
                    <span>·</span>
                    <span className="ae-time">{entry.time}</span>
                  </div>
                </div>
                <span className="ae-type" style={{ color, background: color + '15' }}>{entry.type}</span>
              </div>
            );
          })}
          {auditLog.length === 0 && (
            <div className="no-results-state"><Clock size={32} /><p>No audit entries yet.</p></div>
          )}
        </div>
      )}

      {activeTab === 'docs' && (
        <div className="docs-audit-list">
          {generatedDocs.length === 0 ? (
            <div className="no-results-state"><FileText size={32} /><p>No documents generated yet. Go to Documents to generate them.</p></div>
          ) : (
            generatedDocs.map(doc => (
              <div key={doc.id} className="doc-audit-entry">
                <FileText size={16} />
                <div>
                  <p className="dae-title">{doc.title}</p>
                  <p className="dae-meta">Case {doc.caseId} · {new Date(doc.createdAt).toLocaleString()}</p>
                </div>
                <button className="dae-download" title="Download"><Download size={14} /></button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
