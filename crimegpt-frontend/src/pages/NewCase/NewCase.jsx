import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import {
  User, MapPin, Calendar, FileText, Package,
  Plus, Trash2, Save, ChevronRight, Brain,
  AlertCircle, Shield, Hash
} from 'lucide-react';
import useStore from '../../store/useStore';
import { legalSections } from '../../data/mockData';
import './NewCase.css';

const STEPS = [
  { id: 'case-info', labelKey: 'caseInfoStep', icon: Hash },
  { id: 'complainant', labelKey: 'complainantStep', icon: User },
  { id: 'accused', labelKey: 'accusedStep', icon: Shield },
  { id: 'narrative', labelKey: 'narrativeStep', icon: FileText },
  { id: 'evidence', labelKey: 'evidenceStep', icon: Package },
  { id: 'sections', labelKey: 'sectionsStep', icon: Brain },
];

export default function NewCase() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { addCase, addAuditEntry, analyzeNarrative } = useStore();

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);

  const [form, setForm] = useState({
    // Case Info
    firNumber: '',
    station: '',
    district: '',
    officer: '',
    offenseDate: '',
    offenseTime: '',
    offensePlace: '',
    // Complainant
    complainantName: '',
    complainantAge: '',
    complainantAddress: '',
    complainantPhone: '',
    complainantOccupation: '',
    // Accused
    accusedPersons: [{ name: '', age: '', address: '', identification: '', status: 'wanted' }],
    // Narrative
    narrative: '',
    crimeType: '',
    // Evidence
    evidenceItems: [{ item: '', type: 'Physical', description: '' }],
    // Sections
    suggestedSections: [],
    selectedSections: [],
    status: 'active',
  });

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const addAccused = () => setForm(f => ({
    ...f,
    accusedPersons: [...f.accusedPersons, { name: '', age: '', address: '', identification: '', status: 'wanted' }]
  }));
  const removeAccused = (i) => setForm(f => ({
    ...f,
    accusedPersons: f.accusedPersons.filter((_, idx) => idx !== i)
  }));
  const updateAccused = (i, key, val) => setForm(f => ({
    ...f,
    accusedPersons: f.accusedPersons.map((a, idx) => idx === i ? { ...a, [key]: val } : a)
  }));

  const addEvidence = () => setForm(f => ({
    ...f,
    evidenceItems: [...f.evidenceItems, { item: '', type: 'Physical', description: '' }]
  }));
  const removeEvidence = (i) => setForm(f => ({
    ...f,
    evidenceItems: f.evidenceItems.filter((_, idx) => idx !== i)
  }));
  const updateEvidence = (i, key, val) => setForm(f => ({
    ...f,
    evidenceItems: f.evidenceItems.map((e, idx) => idx === i ? { ...e, [key]: val } : e)
  }));

  const handleAnalyzeNarrative = async () => {
    if (!form.narrative.trim()) {
      toast.error(t('enterNarrativeError'));
      return;
    }
    setAiAnalyzing(true);
    try {
      const data = await analyzeNarrative(form.narrative);
      const unique = data.sections || [];
      setForm(f => ({ ...f, suggestedSections: unique, selectedSections: unique.map(s => s.code) }));
      toast.success(t('aiSuggestedSuccess', { count: unique.length }));
      setStep(5);
    } catch (err) {
      toast.error(err.message || 'Failed to analyze narrative.');
    } finally {
      setAiAnalyzing(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.firNumber || !form.complainantName || !form.narrative) {
      toast.error(t('fillRequiredFieldsError'));
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));

    const newId = addCase({
      title: `${form.crimeType || 'FIR'} — ${form.offensePlace || form.station}`,
      complainant: form.complainantName,
      accused: form.accusedPersons.map(a => a.name).filter(Boolean).join(', ') || 'Unknown',
      station: form.station,
      officer: form.officer,
      status: 'active',
      narrative: form.narrative,
      sections: form.selectedSections,
      evidence: form.evidenceItems.filter(e => e.item).map((e, i) => ({
        id: `E${String(i + 1).padStart(3, '0')}`, ...e, seized: new Date().toISOString().split('T')[0]
      })),
      diaryEntries: [
        {
          date: new Date().toISOString().split('T')[0],
          time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
          action: `FIR No. ${form.firNumber} registered. Complainant ${form.complainantName} appeared and statement recorded.`,
          officer: form.officer,
        }
      ],
    });

    addAuditEntry({ action: `Case ${newId} created (FIR ${form.firNumber})`, officer: form.officer, type: 'create' });
    toast.success(t('caseRegisteredSuccess'));
    navigate(`/cases/${newId}`);
  };

  const renderStep = () => {
    switch (step) {
      case 0: return <CaseInfoStep form={form} set={set} t={t} />;
      case 1: return <ComplainantStep form={form} set={set} t={t} />;
      case 2: return <AccusedStep form={form} addAccused={addAccused} removeAccused={removeAccused} updateAccused={updateAccused} t={t} />;
      case 3: return <NarrativeStep form={form} set={set} analyzeNarrative={handleAnalyzeNarrative} aiAnalyzing={aiAnalyzing} t={t} />;
      case 4: return <EvidenceStep form={form} addEvidence={addEvidence} removeEvidence={removeEvidence} updateEvidence={updateEvidence} t={t} />;
      case 5: return <SectionsStep form={form} setForm={setForm} t={t} />;
      default: return null;
    }
  };

  return (
    <div className="new-case fade-in">
      <div className="stepper">
        {STEPS.map((s, i) => (
          <React.Fragment key={s.id}>
            <button
              className={`step-item ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`}
              onClick={() => setStep(i)}
            >
              <div className="step-icon">
                {i < step ? '✓' : <s.icon size={12} />}
              </div>
              <span className="step-label">{t(s.labelKey)}</span>
            </button>
            {i < STEPS.length - 1 && (
              <div className={`step-connector ${i < step ? 'done' : ''}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Content */}
      <div className="case-form-card">
        {renderStep()}
      </div>

      {/* Navigation */}
      <div className="case-nav">
        <button
          className="btn-secondary"
          onClick={() => setStep(s => Math.max(0, s - 1))}
          disabled={step === 0}
        >
          {t('backButton')}
        </button>
        <div className="case-nav-right">
          {step < STEPS.length - 1 ? (
            <button className="btn-primary" onClick={() => setStep(s => s + 1)}>
              {t('nextButton')} <ChevronRight size={16} />
            </button>
          ) : (
            <button className={`btn-primary ${loading ? 'loading' : ''}`} onClick={handleSubmit} disabled={loading}>
              {loading ? <><span className="spinner-sm" />{t('savingLabel')}</> : <><Save size={16} />{t('registerCaseLabel')}</>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Sub-steps

function CaseInfoStep({ form, set, t }) {
  return (
    <div className="form-step">
      <h3 className="step-title">{t('caseInformation')}</h3>
      <p className="step-desc">{t('stepDescCaseInfo')}</p>
      <div className="form-grid">
        <div className="form-group">
          <label>{t('firNumberLabel')}</label>
          <input value={form.firNumber} onChange={e => set('firNumber', e.target.value)} placeholder={t('firNumberPlaceholder')} />
        </div>
        <div className="form-group">
          <label>{t('crimeTypeLabel')}</label>
          <input value={form.crimeType} onChange={e => set('crimeType', e.target.value)} placeholder={t('crimeTypePlaceholder')} />
        </div>
        <div className="form-group">
          <label>{t('policeStationLabel')}</label>
          <input value={form.station} onChange={e => set('station', e.target.value)} placeholder={t('policeStationPlaceholder')} />
        </div>
        <div className="form-group">
          <label>{t('districtLabel')}</label>
          <input value={form.district} onChange={e => set('district', e.target.value)} placeholder={t('districtPlaceholder')} />
        </div>
        <div className="form-group">
          <label>{t('investigatingOfficerLabel')}</label>
          <input value={form.officer} onChange={e => set('officer', e.target.value)} placeholder={t('officerPlaceholder')} />
        </div>
        <div className="form-group">
          <label>{t('dateOfOffenseLabel')}</label>
          <input type="date" value={form.offenseDate} onChange={e => set('offenseDate', e.target.value)} />
        </div>
        <div className="form-group">
          <label>{t('timeOfOffenseLabel')}</label>
          <input type="time" value={form.offenseTime} onChange={e => set('offenseTime', e.target.value)} />
        </div>
        <div className="form-group">
          <label>{t('placeOfOffenseLabel')}</label>
          <input value={form.offensePlace} onChange={e => set('offensePlace', e.target.value)} placeholder={t('placePlaceholder')} />
        </div>
      </div>
    </div>
  );
}

function ComplainantStep({ form, set, t }) {
  return (
    <div className="form-step">
      <h3 className="step-title">{t('complainantDetails')}</h3>
      <p className="step-desc">{t('stepDescComplainant')}</p>
      <div className="form-grid">
        <div className="form-group full">
          <label>{t('fullNameLabel')}</label>
          <input value={form.complainantName} onChange={e => set('complainantName', e.target.value)} placeholder={t('fullNamePlaceholder')} />
        </div>
        <div className="form-group">
          <label>{t('ageLabel')}</label>
          <input type="number" value={form.complainantAge} onChange={e => set('complainantAge', e.target.value)} placeholder={t('agePlaceholder')} />
        </div>
        <div className="form-group">
          <label>{t('phoneNumberLabel')}</label>
          <input value={form.complainantPhone} onChange={e => set('complainantPhone', e.target.value)} placeholder={t('phonePlaceholder')} />
        </div>
        <div className="form-group">
          <label>{t('occupationLabel')}</label>
          <input value={form.complainantOccupation} onChange={e => set('complainantOccupation', e.target.value)} placeholder={t('occupationPlaceholder')} />
        </div>
        <div className="form-group full">
          <label>{t('residentialAddressLabel')}</label>
          <textarea value={form.complainantAddress} onChange={e => set('complainantAddress', e.target.value)} placeholder={t('addressPlaceholder')} rows={3} />
        </div>
      </div>
    </div>
  );
}

function AccusedStep({ form, addAccused, removeAccused, updateAccused, t }) {
  return (
    <div className="form-step">
      <h3 className="step-title">{t('accusedDetails')}</h3>
      <p className="step-desc">{t('stepDescAccused')}</p>
      {form.accusedPersons.map((a, i) => (
        <div key={i} className="accused-block">
          <div className="accused-block-header">
            <span>{t('accusedHashLabel', { number: i + 1 })}</span>
            {form.accusedPersons.length > 1 && (
              <button className="icon-remove" onClick={() => removeAccused(i)}><Trash2 size={14} /></button>
            )}
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label>{t('fullNameLabel')}</label>
              <input value={a.name} onChange={e => updateAccused(i, 'name', e.target.value)} placeholder={t('accusedNamePlaceholder')} />
            </div>
            <div className="form-group">
              <label>{t('ageLabel')}</label>
              <input value={a.age} onChange={e => updateAccused(i, 'age', e.target.value)} placeholder={t('accusedAgePlaceholder')} />
            </div>
            <div className="form-group">
              <label>{t('statusLabel')}</label>
              <select value={a.status} onChange={e => updateAccused(i, 'status', e.target.value)}>
                <option value="wanted">{t('wanted')}</option>
                <option value="arrested">{t('arrested')}</option>
                <option value="bailed">{t('bailed')}</option>
                <option value="absconding">{t('absconding')}</option>
              </select>
            </div>
            <div className="form-group">
              <label>{t('identificationMarksLabel')}</label>
              <input value={a.identification} onChange={e => updateAccused(i, 'identification', e.target.value)} placeholder={t('accusedIdentificationPlaceholder')} />
            </div>
            <div className="form-group full">
              <label>{t('addressLabel')}</label>
              <input value={a.address} onChange={e => updateAccused(i, 'address', e.target.value)} placeholder={t('accusedAddressPlaceholder')} />
            </div>
          </div>
        </div>
      ))}
      <button className="btn-add" onClick={addAccused}><Plus size={14} /> {t('addAnotherAccusedLabel')}</button>
    </div>
  );
}

function NarrativeStep({ form, set, analyzeNarrative, aiAnalyzing, t }) {
  return (
    <div className="form-step">
      <h3 className="step-title">{t('incidentNarrative')}</h3>
      <p className="step-desc">{t('stepDescNarrative')}</p>
      <div className="form-group">
        <label>{t('fullIncidentNarrativeLabel')}</label>
        <textarea
          value={form.narrative}
          onChange={e => set('narrative', e.target.value)}
          placeholder={t('describeIncidentPlaceholder')}
          rows={12}
          className="narrative-textarea"
        />
      </div>
      <div className="narrative-actions">
        <span className="word-count">
          {form.narrative.split(/\s+/).filter(Boolean).length}{' '}
          {form.narrative.split(/\s+/).filter(Boolean).length === 1 ? t('word') : t('words')}
        </span>
        <button
          className={`btn-ai ${aiAnalyzing ? 'analyzing' : ''}`}
          onClick={analyzeNarrative}
          disabled={aiAnalyzing}
        >
          {aiAnalyzing ? (
            <><span className="spinner-sm" /> {t('analyzingNarrativeProgress')}</>
          ) : (
            <><Brain size={16} /> {t('analyzeWithAILabel')}</>
          )}
        </button>
      </div>
      {form.suggestedSections.length > 0 && (
        <div className="ai-result-preview">
          <AlertCircle size={14} />
          {t('aiSuggestedBannerText', { count: form.suggestedSections.length })}
        </div>
      )}
    </div>
  );
}

function EvidenceStep({ form, addEvidence, removeEvidence, updateEvidence, t }) {
  const TYPES = ['Physical', 'Digital', 'Document', 'Medical', 'Financial', 'Telecom', 'Forensic'];
  return (
    <div className="form-step">
      <h3 className="step-title">{t('evidenceSeized')}</h3>
      <p className="step-desc">{t('stepDescEvidence')}</p>
      {form.evidenceItems.map((e, i) => (
        <div key={i} className="accused-block">
          <div className="accused-block-header">
            <span>{t('evidenceItemHashLabel', { number: i + 1 })}</span>
            {form.evidenceItems.length > 1 && (
              <button className="icon-remove" onClick={() => removeEvidence(i)}><Trash2 size={14} /></button>
            )}
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label>{t('itemDescriptionLabel')}</label>
              <input value={e.item} onChange={ev => updateEvidence(i, 'item', ev.target.value)} placeholder={t('evidenceItemPlaceholder')} />
            </div>
            <div className="form-group">
              <label>{t('evidenceTypeLabel')}</label>
              <select value={e.type} onChange={ev => updateEvidence(i, 'type', ev.target.value)}>
                {TYPES.map(type => <option key={type} value={type}>{t(type.toLowerCase())}</option>)}
              </select>
            </div>
            <div className="form-group full">
              <label>{t('detailsNotesLabel')}</label>
              <input value={e.description} onChange={ev => updateEvidence(i, 'description', ev.target.value)} placeholder={t('evidenceDetailsPlaceholder')} />
            </div>
          </div>
        </div>
      ))}
      <button className="btn-add" onClick={addEvidence}><Plus size={14} /> {t('addEvidenceItemLabel')}</button>
    </div>
  );
}

function SectionsStep({ form, setForm, t }) {
  const toggleSection = (code) => {
    setForm(f => ({
      ...f,
      selectedSections: f.selectedSections.includes(code)
        ? f.selectedSections.filter(s => s !== code)
        : [...f.selectedSections, code]
    }));
  };

  const severityColor = { critical: '#ef4444', high: '#f59e0b', medium: '#3b82f6', procedural: '#8b5cf6' };

  return (
    <div className="form-step">
      <h3 className="step-title">{t('legalSections')}</h3>
      <p className="step-desc">
        {form.suggestedSections.length > 0
          ? t('stepDescSections')
          : t('noAiSuggestionsYet')}
      </p>
      {form.suggestedSections.length === 0 && (
        <div className="empty-sections">
          <Brain size={32} />
          <p>{t('noAiSuggestionsYet')}</p>
        </div>
      )}
      <div className="sections-list">
        {form.suggestedSections.map(sec => (
          <div
            key={sec.code}
            className={`section-card ${form.selectedSections.includes(sec.code) ? 'selected' : ''}`}
            onClick={() => toggleSection(sec.code)}
          >
            <div className="section-top">
              <span className="section-code" style={{ color: severityColor[sec.severity] || '#60a5fa' }}>
                {sec.code}
              </span>
              <span className="section-act">{sec.act}</span>
              <span className="section-sev" style={{ color: severityColor[sec.severity] }}>
                ● {sec.severity}
              </span>
              <div className={`section-check ${form.selectedSections.includes(sec.code) ? 'checked' : ''}`}>
                {form.selectedSections.includes(sec.code) && '✓'}
              </div>
            </div>
            <p className="section-title">{sec.title}</p>
            <p className="section-desc">{sec.description}</p>
          </div>
        ))}
      </div>
      {form.selectedSections.length > 0 && (
        <div className="sections-summary">
          <strong>{t('sectionsSelectedCount', { count: form.selectedSections.length })}</strong>{' '}
          {form.selectedSections.join(', ')}
        </div>
      )}
    </div>
  );
}
