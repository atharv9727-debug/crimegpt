import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Brain, Zap, BookOpen, Scale, AlertCircle, Copy, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import useStore from '../../store/useStore';
import { legalSections, landmarkJudgments } from '../../data/mockData';
import './LegalIntelligence.css';

export default function LegalIntelligence() {
  const { t } = useTranslation();
  const { analyzeNarrative } = useStore();
  const [narrative, setNarrative] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [activeTab, setActiveTab] = useState('sections');

  const analyze = async () => {
    if (!narrative.trim() || narrative.split(' ').length < 5) {
      toast.error(t('enterDetailedNarrativeError'));
      return;
    }
    setAnalyzing(true);
    setResults(null);
    try {
      const data = await analyzeNarrative(narrative);
      const unique = data.sections || [];
      setResults({
        sections: unique,
        judgments: data.judgments || [],
      });
      toast.success(t('aiSuggestedSuccess', { count: unique.length }));
    } catch (err) {
      toast.error(err.message || 'Failed to analyze narrative.');
    } finally {
      setAnalyzing(false);
    }
  };

  const copy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success(t('copiedToClipboardSuccess'));
  };

  const severityColor = { critical: '#ef4444', high: '#f59e0b', medium: '#3b82f6', procedural: '#8b5cf6' };

  return (
    <div className="legal-page fade-in">
      {/* Input panel */}
      <div className="legal-input-panel">
        <div className="legal-input-header">
          <div className="ai-badge"><Brain size={14} /> {t('aiLegalAnalysisEngine')}</div>
          <p className="legal-input-desc">{t('legalInputDesc')}</p>
        </div>
        <textarea
          className="legal-textarea"
          value={narrative}
          onChange={e => setNarrative(e.target.value)}
          placeholder={t('pasteNarrativePlaceholder')}
          rows={8}
        />
        <div className="legal-input-footer">
          <div className="input-stats">
            <span>{narrative.split(/\s+/).filter(Boolean).length} {narrative.split(/\s+/).filter(Boolean).length === 1 ? t('word') : t('words')}</span>
            <span>·</span>
            <span>{narrative.length} {narrative.length === 1 ? t('character') : t('characters')}</span>
          </div>
          <button
            className={`btn-analyze ${analyzing ? 'analyzing' : ''}`}
            onClick={analyze}
            disabled={analyzing}
          >
            {analyzing ? (
              <><span className="ai-spinner" /> {t('analyzingNarrativeProgress')}</>
            ) : (
              <><Zap size={16} /> {t('analyzeSuggestBtn')}</>
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
          <p>{t('processingKnowledgeBase')}</p>
          <p className="analyzing-sub">{t('matchingEntitiesSub')}</p>
        </div>
      )}

      {/* Results */}
      {results && (
        <div className="legal-results">
          <div className="results-summary">
            <div className="result-stat">
              <span className="rs-num">{results.sections.length}</span>
              <span className="rs-label">{t('sectionsFoundLabel')}</span>
            </div>
            <div className="result-stat">
              <span className="rs-num">{results.judgments.length}</span>
              <span className="rs-label">{t('landmarkCasesLabel')}</span>
            </div>
            <div className="result-stat">
              <span className="rs-num">{[...new Set(results.sections.map(s => s.act))].length}</span>
              <span className="rs-label">{t('actsReferencedLabel')}</span>
            </div>
            <button className="copy-all-btn" onClick={() => copy(results.sections.map(s => `${s.code} — ${s.title}`).join('\n'))}>
              <Copy size={14} /> {t('copyAllSectionsLabel')}
            </button>
          </div>

          <div className="results-tabs">
            <button className={`tab ${activeTab === 'sections' ? 'active' : ''}`} onClick={() => setActiveTab('sections')}>
              <Scale size={14} /> {t('legalSectionsTab', { count: results.sections.length })}
            </button>
            <button className={`tab ${activeTab === 'judgments' ? 'active' : ''}`} onClick={() => setActiveTab('judgments')}>
              <BookOpen size={14} /> {t('landmarkJudgmentsTab', { count: results.judgments.length })}
            </button>
          </div>

          {activeTab === 'sections' && (
            <div className="sections-results">
              {results.sections.length === 0 ? (
                <div className="no-results"><AlertCircle size={24} /><p>{t('noMatchingSectionsFound')}</p></div>
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
            { icon: '⚖️', titleKey: 'bnsTitle', descKey: 'bnsDesc' },
            { icon: '📋', titleKey: 'bnssTitle', descKey: 'bnssDesc' },
            { icon: '📄', titleKey: 'bsaTitle', descKey: 'bsaDesc' },
            { icon: '💊', titleKey: 'ndpsTitle', descKey: 'ndpsDesc' },
          ].map(card => (
            <div key={card.titleKey} className="info-card">
              <span className="info-card-icon">{card.icon}</span>
              <div>
                <h4 className="info-card-title">{t(card.titleKey)}</h4>
                <p className="info-card-desc">{t(card.descKey)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
