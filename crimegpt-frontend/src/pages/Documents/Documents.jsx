import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import {
  FileText, Download, Eye, Globe, Printer,
  CheckCircle, Clock, ChevronDown, Search, Zap
} from 'lucide-react';
import useStore from '../../store/useStore';
import './Documents.css';

const DOC_TYPES = [
  {
    id: 'chargesheet',
    title: 'Purvani Chargesheet',
    titleHi: 'पूर्वानी चार्जशीट',
    titleGu: 'પૂર્વાની ચાર્જશીટ',
    description: 'Initial chargesheet / FIR complaint document',
    icon: '📋',
    color: 'blue',
    fields: ['FIR Number', 'Complainant', 'Accused', 'Sections', 'Date', 'Station'],
  },
  {
    id: 'medical',
    title: 'Medical Treatment Letter',
    titleHi: 'चिकित्सा पत्र',
    titleGu: 'તબીબી પત્ર',
    description: 'Letter to CMO / Civil Hospital for medical examination',
    icon: '🏥',
    color: 'green',
    fields: ['Accused Name', 'Date', 'Station', 'Officer Name', 'Hospital'],
  },
  {
    id: 'remand',
    title: 'Remand Request Letter',
    titleHi: 'रिमांड अनुरोध पत्र',
    titleGu: 'રિમાન્ડ વિનંતી પત્ર',
    description: 'Police custody remand request for Magistrate',
    icon: '⚖️',
    color: 'orange',
    fields: ['Accused Name', 'Arrest Date', 'Days Requested', 'Reasons', 'Court'],
  },
  {
    id: 'seizure',
    title: 'Seizure Receipt',
    titleHi: 'जब्ती रसीद',
    titleGu: 'જ પ્ત રસીદ',
    description: 'Receipt for items seized during investigation',
    icon: '📦',
    color: 'purple',
    fields: ['Items List', 'Seizure Date', 'Location', 'Panchas', 'Officer'],
  },
  {
    id: 'courtcustody',
    title: 'Court Custody Letter',
    titleHi: 'न्यायालय अभिरक्षा पत्र',
    titleGu: 'કોર્ટ કસ્ટડી પત્ર',
    description: 'Letter for production of accused before Magistrate',
    icon: '🏛️',
    color: 'cyan',
    fields: ['Accused', 'Court Name', 'Date of Production', 'Case Number'],
  },
  {
    id: 'panchanama',
    title: 'Accused Panchanama',
    titleHi: 'आरोपी पंचनामा',
    titleGu: 'આરોપી પંચનામા',
    description: 'Detailed panchanama of accused at time of arrest',
    icon: '📝',
    color: 'violet',
    fields: ['Accused Details', 'Arrest Time', 'Place', 'Panchas', 'Articles'],
  },
  {
    id: 'faceid',
    title: 'Accused Face Identification Form',
    titleHi: 'चेहरा पहचान फॉर्म',
    titleGu: 'ચહેરો ઓળખ ફોર્મ',
    description: 'Face identification parade form for accused',
    icon: '🪪',
    color: 'red',
    fields: ['Accused Photo', 'Identification Date', 'Witnesses', 'Magistrate'],
  },
];

const TEMPLATES = {
  chargesheet: (c) => `
GUJARAT POLICE DEPARTMENT
CRIMINAL COMPLAINT / PURVANI CHARGESHEET
${'─'.repeat(60)}

FIR Number: ${c?.id || 'CR-____'}
Police Station: ${c?.station || '_______________'}
Date of FIR: ${c?.date || '_______________'}
Investigating Officer: ${c?.officer || '_______________'}

COMPLAINANT DETAILS:
Name: ${c?.complainant || '_______________'}
Address: _______________

ACCUSED DETAILS:
Name: ${c?.accused || '_______________'}
Status: Under Investigation

SECTIONS APPLIED:
${(c?.sections || ['BNS ___']).join('\n')}

INCIDENT NARRATIVE:
${c?.narrative || 'As per complaint...'}

RELIEF SOUGHT:
Registration of FIR and investigation as per law.

Signature of Complainant: _______________
Date: ${c?.date || '_______________'}

Received by: ${c?.officer || '_______________'}
Designation & Station: ${c?.station || '_______________'}
`,
  medical: (c) => `
GUJARAT POLICE DEPARTMENT
MEDICAL EXAMINATION REQUEST LETTER
${'─'.repeat(60)}

To,
The Civil Surgeon / CMO,
Civil Hospital, Ahmedabad.

Sub: Medical Examination of Accused / Victim

Ref: FIR No. ${c?.id || 'CR-____'} dated ${c?.date || '___'}

Sir/Ma'am,

In connection with the above FIR registered at ${c?.station || '_______________'}, you are requested to medically examine the following person and furnish the Medical Certificate at the earliest.

Name of Person: ${c?.accused || '_______________'}
FIR Number: ${c?.id || '_______________'}
Date of Examination: _______________

Your cooperation is solicited.

Yours faithfully,

${c?.officer || '_______________'}
${c?.station || '_______________'}
Date: _______________
`,
  remand: (c) => `
GUJARAT POLICE DEPARTMENT
POLICE CUSTODY REMAND REQUEST
${'─'.repeat(60)}

To,
The Learned Metropolitan Magistrate,
Ahmedabad.

Sub: Application for Police Custody Remand u/s 187 BNSS

Ref: FIR No. ${c?.id || 'CR-____'}, ${c?.station || '_______________'}

Most Respectfully Submitted,

That the accused ${c?.accused || '_______________'} has been arrested in connection with FIR No. ${c?.id || '___'} for offences punishable u/s ${(c?.sections || []).join(', ') || '___'} of BNS.

GROUNDS FOR REMAND:
1. Recovery of incriminating material is pending.
2. Interrogation of accused in police custody is necessary.
3. Accused may destroy evidence if released.

Prayer: It is therefore prayed that the accused be remanded to Police Custody for ___ days.

Date: _______________
${c?.officer || '_______________'}
${c?.station || '_______________'}
`,
  seizure: (c) => `
GUJARAT POLICE DEPARTMENT
SEIZURE RECEIPT (PANCHANAMA)
${'─'.repeat(60)}

FIR No.: ${c?.id || 'CR-____'}
Date of Seizure: ${c?.date || '_______________'}
Place of Seizure: _______________
Seizing Officer: ${c?.officer || '_______________'}

ITEMS SEIZED:
${'─'.repeat(40)}
${(c?.evidence || []).map((e, i) => `${i+1}. ${e.item} [${e.type}]`).join('\n') || '1. _______________'}
${'─'.repeat(40)}

PANCHAS (Witnesses):
1. Name: _______________ Signature: ___
2. Name: _______________ Signature: ___

I/We confirm that the above items were seized in our presence.

Seizing Officer: ${c?.officer || '_______________'}
Station: ${c?.station || '_______________'}
Date & Time: _______________
`,
  courtcustody: (c) => `
GUJARAT POLICE DEPARTMENT
COURT CUSTODY PRODUCTION LETTER
${'─'.repeat(60)}

To,
The Learned Metropolitan Magistrate,
Ahmedabad Court Complex.

Sub: Production of Accused before Honourable Court

Ref: FIR No. ${c?.id || 'CR-____'}

Sir,

In connection with the above FIR, the accused ${c?.accused || '_______________'} who is currently in Police Custody is being produced before Your Honour as per the order dated _______________.

Remand Period: From _______________ to _______________
Next Date of Production: _______________

Prayer: The accused may be remanded to Judicial Custody.

Respectfully,
${c?.officer || '_______________'}
${c?.station || '_______________'}
Date: _______________
`,
  panchanama: (c) => `
GUJARAT POLICE DEPARTMENT
ARREST PANCHANAMA OF ACCUSED
${'─'.repeat(60)}

FIR No.: ${c?.id || 'CR-____'}
Date of Arrest: _______________
Time of Arrest: _______________
Place of Arrest: _______________

ACCUSED DETAILS:
Full Name: ${c?.accused || '_______________'}
Age: ___   Father's Name: _______________
Address: _______________

PHYSICAL DESCRIPTION:
Height: ___   Build: ___   Complexion: ___
Identification Marks: _______________

ARTICLES FOUND ON PERSON:
_______________________________

PANCHAS (Witnesses to Arrest):
1. Name: _______________ Sign: ___
2. Name: _______________ Sign: ___

Arresting Officer: ${c?.officer || '_______________'}
Station: ${c?.station || '_______________'}
`,
  faceid: (c) => `
GUJARAT POLICE DEPARTMENT
ACCUSED FACE IDENTIFICATION FORM
${'─'.repeat(60)}

FIR No.: ${c?.id || 'CR-____'}
Date of Identification Parade: _______________
Location: _______________
Presiding Magistrate: _______________

ACCUSED:
Name: ${c?.accused || '_______________'}
FIR Reference: ${c?.id || '_______________'}

IDENTIFYING WITNESSES:
1. Name: _______________ Result: Identified / Not Identified
2. Name: _______________ Result: Identified / Not Identified

OBSERVATIONS:
_______________________________

Magistrate's Signature: _______________
Date: _______________

IO Signature: ${c?.officer || '_______________'}
`,
};

export default function Documents() {
  const { t } = useTranslation();
  const { cases, addDocument, addAuditEntry, language } = useStore();
  const [selectedCase, setSelectedCase] = useState('');
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [previewContent, setPreviewContent] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [generating, setGenerating] = useState(null);
  const [searchQ, setSearchQ] = useState('');

  const activeCase = cases.find(c => c.id === selectedCase);

  const filteredDocs = DOC_TYPES.filter(d =>
    d.title.toLowerCase().includes(searchQ.toLowerCase()) ||
    d.description.toLowerCase().includes(searchQ.toLowerCase())
  );

  const handleGenerate = async (doc) => {
    if (!selectedCase) { toast.error('Please select a case first.'); return; }
    setGenerating(doc.id);
    await new Promise(r => setTimeout(r, 1200));
    const fn = TEMPLATES[doc.id];
    const content = fn ? fn(activeCase) : 'Document content...';
    setPreviewContent(content);
    setSelectedDoc(doc);
    setShowPreview(true);
    addDocument({ type: doc.id, title: doc.title, caseId: selectedCase, content });
    addAuditEntry({ action: `${doc.title} generated for case ${selectedCase}`, officer: 'Current Officer', type: 'generate' });
    toast.success(`${doc.title} generated!`);
    setGenerating(null);
  };

  const handleDownload = () => {
    const blob = new Blob([previewContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedDoc?.id}_${selectedCase}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Document downloaded!');
  };

  const getDocTitle = (doc) => {
    if (language === 'hi') return doc.titleHi;
    if (language === 'gu') return doc.titleGu;
    return doc.title;
  };

  const colorMap = { blue: '#3b82f6', green: '#22c55e', orange: '#f59e0b', purple: '#8b5cf6', cyan: '#06b6d4', violet: '#7c3aed', red: '#ef4444' };

  return (
    <div className="documents-page fade-in">
      {/* Header controls */}
      <div className="docs-controls">
        <div className="docs-search">
          <Search size={16} />
          <input
            placeholder={t('searchDocsPlaceholder')}
            value={searchQ}
            onChange={e => setSearchQ(e.target.value)}
          />
        </div>
        <div className="case-selector-wrap">
          <label>{t('selectCaseLabel')}</label>
          <select value={selectedCase} onChange={e => setSelectedCase(e.target.value)}>
            <option value="">{t('chooseCasePlaceholder')}</option>
            {cases.map(c => (
              <option key={c.id} value={c.id}>{c.id} — {c.title}</option>
            ))}
          </select>
        </div>
      </div>

      {selectedCase && activeCase && (
        <div className="selected-case-banner">
          <CheckCircle size={16} />
          <span>{t('generatingDocsFor')} <strong>{activeCase.id}</strong>: {activeCase.title}</span>
          <span className="banner-sections">{activeCase.sections?.join(' · ')}</span>
        </div>
      )}

      {/* Document grid */}
      <div className="docs-grid">
        {filteredDocs.map(doc => (
          <div key={doc.id} className="doc-card" style={{ '--doc-color': colorMap[doc.color] || '#3b82f6' }}>
            <div className="doc-card-top">
              <span className="doc-icon">{doc.icon}</span>
              <div className="doc-info">
                <h3 className="doc-title">{getDocTitle(doc)}</h3>
                <p className="doc-desc">{doc.description}</p>
              </div>
            </div>
            <div className="doc-fields">
              {doc.fields.slice(0, 4).map(f => (
                <span key={f} className="doc-field">{f}</span>
              ))}
              {doc.fields.length > 4 && <span className="doc-field doc-field-more">+{doc.fields.length - 4}</span>}
            </div>
            <div className="doc-actions">
              <button
                className={`btn-generate ${generating === doc.id ? 'loading' : ''}`}
                onClick={() => handleGenerate(doc)}
                disabled={!!generating}
              >
                {generating === doc.id ? <><span className="spinner-sm" /> {t('loading')}</> : <><Zap size={14} /> {t('generateDocument')}</>}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {showPreview && selectedDoc && (
        <div className="preview-overlay" onClick={() => setShowPreview(false)}>
          <div className="preview-modal" onClick={e => e.stopPropagation()}>
            <div className="preview-header">
              <div>
                <h3>{getDocTitle(selectedDoc)}</h3>
                <p>{t('caseSelectLabel')} {selectedCase} · Generated {new Date().toLocaleString()}</p>
              </div>
              <div className="preview-actions">
                <button className="preview-btn" onClick={handleDownload} title="Download TXT">
                  <Download size={16} /> {t('downloadPDF')}
                </button>
                <button className="preview-btn preview-close" onClick={() => setShowPreview(false)}>✕</button>
              </div>
            </div>
            <div className="preview-body">
              <pre className="preview-content">{previewContent}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
