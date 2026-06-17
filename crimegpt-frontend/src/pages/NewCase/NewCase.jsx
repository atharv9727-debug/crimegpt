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
  { id: 'case-info', label: 'Case Info', icon: Hash },
  { id: 'complainant', label: 'Complainant', icon: User },
  { id: 'accused', label: 'Accused', icon: Shield },
  { id: 'narrative', label: 'Narrative', icon: FileText },
  { id: 'evidence', label: 'Evidence', icon: Package },
  { id: 'sections', label: 'Sections', icon: Brain },
];

export default function NewCase() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { addCase, addAuditEntry } = useStore();

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

  const analyzeNarrative = async () => {
    if (!form.narrative.trim()) {
      toast.error('Please enter an incident narrative first.');
      return;
    }
    setAiAnalyzing(true);
    await new Promise(r => setTimeout(r, 1800));

    // Keyword-based section suggestion
    const text = form.narrative.toLowerCase();
    let suggested = [];
    if (text.includes('assault') || text.includes('beat') || text.includes('hurt')) suggested.push(...(legalSections.assault || []));
    if (text.includes('snatch') || text.includes('rob') || text.includes('theft') || text.includes('chain')) suggested.push(...(legalSections.robbery || []));
    if (text.includes('murder') || text.includes('kill') || text.includes('death')) suggested.push(...(legalSections.murder || []));
    if (text.includes('fraud') || text.includes('cheat') || text.includes('otp') || text.includes('bank')) suggested.push(...(legalSections.fraud || []));
    if (text.includes('drug') || text.includes('heroin') || text.includes('narcotic') || text.includes('ganja')) suggested.push(...(legalSections.drugs || []));
    if (text.includes('kidnap') || text.includes('abduct')) suggested.push(...(legalSections.kidnapping || []));
    if (text.includes('domestic') || text.includes('husband') || text.includes('wife') || text.includes('cruelty')) suggested.push(...(legalSections.domestic_violence || []));

    // Dedup
    const unique = suggested.filter((v, i, a) => a.findIndex(x => x.code === v.code) === i);
    setForm(f => ({ ...f, suggestedSections: unique, selectedSections: unique.map(s => s.code) }));
    setAiAnalyzing(false);
    toast.success(`AI suggested ${unique.length} applicable sections!`);
    setStep(5);
  };

  const handleSubmit = async () => {
    if (!form.firNumber || !form.complainantName || !form.narrative) {
      toast.error('Please fill FIR number, complainant name, and incident narrative.');
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
    toast.success('Case registered successfully!');
    navigate(`/cases/${newId}`);
  };

  const renderStep = () => {
    switch (step) {
      case 0: return <CaseInfoStep form={form} set={set} />;
      case 1: return <ComplainantStep form={form} set={set} />;
      case 2: return <AccusedStep form={form} addAccused={addAccused} removeAccused={removeAccused} updateAccused={updateAccused} />;
      case 3: return <NarrativeStep form={form} set={set} analyzeNarrative={analyzeNarrative} aiAnalyzing={aiAnalyzing} />;
      case 4: return <EvidenceStep form={form} addEvidence={addEvidence} removeEvidence={removeEvidence} updateEvidence={updateEvidence} />;
      case 5: return <SectionsStep form={form} setForm={setForm} />;
      default: return null;
    }
  };

  return (
    <div className="new-case fade-in">
      {/* Stepper */}
      <div className="stepper">
        {STEPS.map((s, i) => (
          <button
            key={s.id}
            className={`step-item ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`}
            onClick={() => setStep(i)}
          >
            <div className="step-icon">
              {i < step ? '✓' : <s.icon size={14} />}
            </div>
            <span className="step-label">{s.label}</span>
            {i < STEPS.length - 1 && <div className="step-connector" />}
          </button>
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
          Back
        </button>
        <div className="case-nav-right">
          {step < STEPS.length - 1 ? (
            <button className="btn-primary" onClick={() => setStep(s => s + 1)}>
              Next <ChevronRight size={16} />
            </button>
          ) : (
            <button className={`btn-primary ${loading ? 'loading' : ''}`} onClick={handleSubmit} disabled={loading}>
              {loading ? <><span className="spinner-sm" />Saving...</> : <><Save size={16} />Register Case</>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Sub-steps

function CaseInfoStep({ form, set }) {
  return (
    <div className="form-step">
      <h3 className="step-title">Case Information</h3>
      <p className="step-desc">Basic FIR and case registration details</p>
      <div className="form-grid">
        <div className="form-group">
          <label>FIR Number *</label>
          <input value={form.firNumber} onChange={e => set('firNumber', e.target.value)} placeholder="e.g. 45/2024" />
        </div>
        <div className="form-group">
          <label>Crime Type</label>
          <input value={form.crimeType} onChange={e => set('crimeType', e.target.value)} placeholder="e.g. Robbery, Assault" />
        </div>
        <div className="form-group">
          <label>Police Station *</label>
          <input value={form.station} onChange={e => set('station', e.target.value)} placeholder="e.g. Maninagar PS" />
        </div>
        <div className="form-group">
          <label>District</label>
          <input value={form.district} onChange={e => set('district', e.target.value)} placeholder="e.g. Ahmedabad City" />
        </div>
        <div className="form-group">
          <label>Investigating Officer</label>
          <input value={form.officer} onChange={e => set('officer', e.target.value)} placeholder="e.g. PI Amit Solanki" />
        </div>
        <div className="form-group">
          <label>Date of Offense</label>
          <input type="date" value={form.offenseDate} onChange={e => set('offenseDate', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Time of Offense</label>
          <input type="time" value={form.offenseTime} onChange={e => set('offenseTime', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Place of Offense</label>
          <input value={form.offensePlace} onChange={e => set('offensePlace', e.target.value)} placeholder="e.g. Near Maninagar Market" />
        </div>
      </div>
    </div>
  );
}

function ComplainantStep({ form, set }) {
  return (
    <div className="form-step">
      <h3 className="step-title">Complainant Details</h3>
      <p className="step-desc">Information about the victim / complainant</p>
      <div className="form-grid">
        <div className="form-group full">
          <label>Full Name *</label>
          <input value={form.complainantName} onChange={e => set('complainantName', e.target.value)} placeholder="Full name" />
        </div>
        <div className="form-group">
          <label>Age</label>
          <input type="number" value={form.complainantAge} onChange={e => set('complainantAge', e.target.value)} placeholder="Age" />
        </div>
        <div className="form-group">
          <label>Phone Number</label>
          <input value={form.complainantPhone} onChange={e => set('complainantPhone', e.target.value)} placeholder="+91 XXXXX XXXXX" />
        </div>
        <div className="form-group">
          <label>Occupation</label>
          <input value={form.complainantOccupation} onChange={e => set('complainantOccupation', e.target.value)} placeholder="e.g. Shopkeeper" />
        </div>
        <div className="form-group full">
          <label>Residential Address</label>
          <textarea value={form.complainantAddress} onChange={e => set('complainantAddress', e.target.value)} placeholder="Full residential address" rows={3} />
        </div>
      </div>
    </div>
  );
}

function AccusedStep({ form, addAccused, removeAccused, updateAccused }) {
  return (
    <div className="form-step">
      <h3 className="step-title">Accused Details</h3>
      <p className="step-desc">Add one or more accused persons</p>
      {form.accusedPersons.map((a, i) => (
        <div key={i} className="accused-block">
          <div className="accused-block-header">
            <span>Accused #{i + 1}</span>
            {form.accusedPersons.length > 1 && (
              <button className="icon-remove" onClick={() => removeAccused(i)}><Trash2 size={14} /></button>
            )}
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name</label>
              <input value={a.name} onChange={e => updateAccused(i, 'name', e.target.value)} placeholder="Name or Unknown" />
            </div>
            <div className="form-group">
              <label>Age (approx.)</label>
              <input value={a.age} onChange={e => updateAccused(i, 'age', e.target.value)} placeholder="e.g. 25" />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select value={a.status} onChange={e => updateAccused(i, 'status', e.target.value)}>
                <option value="wanted">Wanted</option>
                <option value="arrested">Arrested</option>
                <option value="bailed">On Bail</option>
                <option value="absconding">Absconding</option>
              </select>
            </div>
            <div className="form-group">
              <label>Identification Marks</label>
              <input value={a.identification} onChange={e => updateAccused(i, 'identification', e.target.value)} placeholder="Physical description" />
            </div>
            <div className="form-group full">
              <label>Address</label>
              <input value={a.address} onChange={e => updateAccused(i, 'address', e.target.value)} placeholder="Address if known" />
            </div>
          </div>
        </div>
      ))}
      <button className="btn-add" onClick={addAccused}><Plus size={14} /> Add Another Accused</button>
    </div>
  );
}

function NarrativeStep({ form, set, analyzeNarrative, aiAnalyzing }) {
  return (
    <div className="form-step">
      <h3 className="step-title">Incident Narrative</h3>
      <p className="step-desc">Describe the incident in detail. AI will extract entities and suggest legal sections automatically.</p>
      <div className="form-group">
        <label>Full Incident Narrative *</label>
        <textarea
          value={form.narrative}
          onChange={e => set('narrative', e.target.value)}
          placeholder="Describe the incident in detail: what happened, when, where, who was involved, what was the mode of operation, what injuries/loss occurred..."
          rows={12}
          className="narrative-textarea"
        />
      </div>
      <div className="narrative-actions">
        <span className="word-count">{form.narrative.split(/\s+/).filter(Boolean).length} words</span>
        <button
          className={`btn-ai ${aiAnalyzing ? 'analyzing' : ''}`}
          onClick={analyzeNarrative}
          disabled={aiAnalyzing}
        >
          {aiAnalyzing ? (
            <><span className="spinner-sm" /> Analyzing Narrative...</>
          ) : (
            <><Brain size={16} /> {('Analyze with AI')}</>
          )}
        </button>
      </div>
      {form.suggestedSections.length > 0 && (
        <div className="ai-result-preview">
          <AlertCircle size={14} />
          AI suggested <strong>{form.suggestedSections.length} sections</strong>. Proceed to the Sections step to review.
        </div>
      )}
    </div>
  );
}

function EvidenceStep({ form, addEvidence, removeEvidence, updateEvidence }) {
  const TYPES = ['Physical', 'Digital', 'Document', 'Medical', 'Financial', 'Telecom', 'Forensic'];
  return (
    <div className="form-step">
      <h3 className="step-title">Evidence Seized</h3>
      <p className="step-desc">All items recovered or seized during investigation</p>
      {form.evidenceItems.map((e, i) => (
        <div key={i} className="accused-block">
          <div className="accused-block-header">
            <span>Evidence Item #{i + 1}</span>
            {form.evidenceItems.length > 1 && (
              <button className="icon-remove" onClick={() => removeEvidence(i)}><Trash2 size={14} /></button>
            )}
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label>Item Description</label>
              <input value={e.item} onChange={ev => updateEvidence(i, 'item', ev.target.value)} placeholder="e.g. Mobile phone (Samsung)" />
            </div>
            <div className="form-group">
              <label>Evidence Type</label>
              <select value={e.type} onChange={ev => updateEvidence(i, 'type', ev.target.value)}>
                {TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group full">
              <label>Details / Notes</label>
              <input value={e.description} onChange={ev => updateEvidence(i, 'description', ev.target.value)} placeholder="Serial numbers, condition, where found, etc." />
            </div>
          </div>
        </div>
      ))}
      <button className="btn-add" onClick={addEvidence}><Plus size={14} /> Add Evidence Item</button>
    </div>
  );
}

function SectionsStep({ form, setForm }) {
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
      <h3 className="step-title">Legal Sections</h3>
      <p className="step-desc">
        {form.suggestedSections.length > 0
          ? `AI suggested ${form.suggestedSections.length} sections. Select the applicable ones.`
          : 'Run AI analysis on the Narrative step, or manually add sections below.'}
      </p>
      {form.suggestedSections.length === 0 && (
        <div className="empty-sections">
          <Brain size={32} />
          <p>No AI suggestions yet. Go back to Narrative and click "Analyze with AI".</p>
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
          <strong>{form.selectedSections.length} sections selected:</strong>{' '}
          {form.selectedSections.join(', ')}
        </div>
      )}
    </div>
  );
}
