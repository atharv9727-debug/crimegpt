import React, { useState } from 'react';
import { Brain, Zap, BookOpen, Scale, AlertCircle, Copy, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import { legalSections, landmarkJudgments } from '../../data/mockData';
import './LegalIntelligence.css';

export default function LegalIntelligence() {
  const [narrative, setNarrative] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [activeTab, setActiveTab] = useState('sections');

  const analyze = async () => {
    if (!narrative.trim() || narrative.split(' ').length < 5) {
      toast.error('Please enter a more detailed narrative (at least 5 words).');
      return;
    }
    setAnalyzing(true);
    setResults(null);
    await new Promise(r => setTimeout(r, 2200));

    const text = narrative.toLowerCase();
    let suggested = [];
    if (text.includes('assault') || text.includes('beat') || text.includes('hurt')) suggested.push(...(legalSections.assault || []));
    if (text.includes('snatch') || text.includes('rob') || text.includes('theft') || text.includes('chain') || text.includes('steal')) suggested.push(...(legalSections.robbery || []));
    if (text.includes('murder') || text.includes('kill') || text.includes('death') || text.includes('shot')) suggested.push(...(legalSections.murder || []));
    if (text.includes('fraud') || text.includes('cheat') || text.includes('otp') || text.includes('bank') || text.includes('online')) suggested.push(...(legalSections.fraud || []));
    if (text.includes('drug') || text.includes('heroin') || text.includes('narcotic') || text.includes('ganja') || text.includes('mdma')) suggested.push(...(legalSections.drugs || []));
    if (text.includes('kidnap') || text.includes('abduct') || text.includes('ransom')) suggested.push(...(legalSections.kidnapping || []));
    if (text.includes('domestic') || text.includes('husband') || text.includes('wife') || text.includes('cruelty') || text.includes('harassment')) suggested.push(...(legalSections.domestic_violence || []));

    const unique = suggested.filter((v, i, a) => a.findIndex(x => x.code === v.code) === i);

    const relevantJudgments = landmarkJudgments.filter(j =>
      text.includes(j.relevance) ||
      (text.includes('arrest') && j.relevance === 'arrest') ||
      (text.includes('bail') && j.relevance === 'remand') ||
      (text.includes('evidence') && j.relevance === 'evidence')
    );

    setResults({ sections: unique, judgments: relevantJudgments.length > 0 ? relevantJudgments : landmarkJudgments.slice(0, 3) });
    setAnalyzing(false);
    toast.success(`Analysis complete — ${unique.length} sections found!`);
  };

  const copy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const severityColor = { critical: '#ef4444', high: '#f59e0b', medium: '#3b82f6', procedural: '#8b5cf6' };

  return (
    <div className="legal-page fade-in">
      {/* Input panel */}
      <div className="legal-input-panel">
        <div className="legal-input-header">
          <div className="ai-badge"><Brain size={14} /> AI Legal Analysis Engine</div>
          <p className="legal-input-desc">Paste the incident narrative below. The AI will identify applicable BNS, BNSS, BSA, NDPS and other sections and suggest landmark judgments.</p>
        </div>
        <textarea
          className="legal-textarea"
          value={narrative}
          onChange={e => setNarrative(e.target.value)}
          placeholder="Paste incident narrative here...&#10;&#10;Example: On 12/06/2024 at approximately 23:00 hours, the accused armed with a knife robbed the complainant of his gold chain and mobile phone near the bus stop. Two other persons were involved and fled on a motorcycle."
          rows={8}
        />
        <div className="legal-input-footer">
          <div className="input-stats">
            <span>{narrative.split(/\s+/).filter(Boolean).length} words</span>
            <span>·</span>
            <span>{narrative.length} characters</span>
          </div>
          <button
            className={`btn-analyze ${analyzing ? 'analyzing' : ''}`}
            onClick={analyze}
            disabled={analyzing}
          >
            {analyzing ? (
              <><span className="ai-spinner" /> Analyzing Narrative...</>
            ) : (
              <><Zap size={16} /> Analyze & Suggest Sections</>
            )}
          </button>
        </div>
      </div>

      {/* Analyzing animation */}
      {analyzing && (
        <div className="analyzing-state">
          <div className="analyzing-orbs">
            <div className="orb a" />
            <div className="orb b" />
            <div className="orb c" />
          </div>
          <p>Processing narrative through legal knowledge base...</p>
          <p className="analyzing-sub">Matching entities → Identifying offence categories → Cross-referencing BNS/BNSS/BSA sections</p>
        </div>
      )}

      {/* Results */}
      {results && (
        <div className="legal-results">
          <div className="results-summary">
            <div className="result-stat">
              <span className="rs-num">{results.sections.length}</span>
              <span className="rs-label">Sections Found</span>
            </div>
            <div className="result-stat">
              <span className="rs-num">{results.judgments.length}</span>
              <span className="rs-label">Landmark Cases</span>
            </div>
            <div className="result-stat">
              <span className="rs-num">{[...new Set(results.sections.map(s => s.act))].length}</span>
              <span className="rs-label">Acts Referenced</span>
            </div>
            <button className="copy-all-btn" onClick={() => copy(results.sections.map(s => `${s.code} — ${s.title}`).join('\n'))}>
              <Copy size={14} /> Copy All Sections
            </button>
          </div>

          <div className="results-tabs">
            <button className={`tab ${activeTab === 'sections' ? 'active' : ''}`} onClick={() => setActiveTab('sections')}>
              <Scale size={14} /> Legal Sections ({results.sections.length})
            </button>
            <button className={`tab ${activeTab === 'judgments' ? 'active' : ''}`} onClick={() => setActiveTab('judgments')}>
              <BookOpen size={14} /> Landmark Judgments ({results.judgments.length})
            </button>
          </div>

          {activeTab === 'sections' && (
            <div className="sections-results">
              {results.sections.length === 0 ? (
                <div className="no-results"><AlertCircle size={24} /><p>No matching sections found. Try adding more details about the crime type.</p></div>
              ) : (
                results.sections.map(sec => (
                  <div key={sec.code} className="result-section-card">
                    <div className="rsc-header">
                      <span className="rsc-code" style={{ color: severityColor[sec.severity] }}>{sec.code}</span>
                      <span className="rsc-act">{sec.act}</span>
                      <span className="rsc-sev" style={{ background: `${severityColor[sec.severity]}18`, color: severityColor[sec.severity], border: `1px solid ${severityColor[sec.severity]}30` }}>{sec.severity}</span>
                      <button className="rsc-copy" onClick={() => copy(`${sec.code} — ${sec.title}`)} title="Copy"><Copy size={12} /></button>
                    </div>
                    <p className="rsc-title">{sec.title}</p>
                    <p className="rsc-desc">{sec.description}</p>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'judgments' && (
            <div className="judgments-results">
              {results.judgments.map((j, i) => (
                <div key={i} className="judgment-card">
                  <div className="jc-header">
                    <BookOpen size={16} />
                    <span className="jc-case">{j.case}</span>
                    <span className="jc-citation">{j.citation}</span>
                  </div>
                  <p className="jc-summary">{j.summary}</p>
                  <span className="jc-tag">{j.relevance}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Info cards */}
      {!results && !analyzing && (
        <div className="legal-info-cards">
          {[
            { icon: '⚖️', title: 'BNS 2023', desc: 'Bharatiya Nyaya Sanhita — replaces IPC. 358 sections covering all criminal offences.' },
            { icon: '📋', title: 'BNSS 2023', desc: 'Bharatiya Nagarik Suraksha Sanhita — replaces CrPC. 531 sections for criminal procedure.' },
            { icon: '📄', title: 'BSA 2023', desc: 'Bharatiya Sakshya Adhiniyam — replaces Indian Evidence Act. 170 sections for evidence.' },
            { icon: '💊', title: 'NDPS Act', desc: 'Narcotic Drugs and Psychotropic Substances Act, 1985. Key sections for drug offences.' },
          ].map(card => (
            <div key={card.title} className="info-card">
              <span className="info-card-icon">{card.icon}</span>
              <div>
                <h4 className="info-card-title">{card.title}</h4>
                <p className="info-card-desc">{card.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
