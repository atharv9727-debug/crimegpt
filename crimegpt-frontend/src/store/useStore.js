import { create } from 'zustand';
import bcrypt from 'bcryptjs';

// ─── LocalStorage helpers ───────────────────────────────────────────────────
const ls = {
  get: (key, fallback = null) => {
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : fallback;
    } catch { return fallback; }
  },
  set: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
  remove: (key) => localStorage.removeItem(key),
};

// ─── Demo officers (always available) ───────────────────────────────────────
const DEMO_OFFICERS = [
  {
    id: '1', badgeId: 'GUJ-AHD-2847', name: 'PI Amit Solanki',
    rank: 'Police Inspector', station: 'Cybercrime PS, Ahmedabad',
    district: 'Ahmedabad City', avatar: 'AS', role: 'officer',
    passwordHash: '$2a$10$xQb8V1lJRJj2tV/S4sYL5.F.QqEHzHrp0xJl6D9nLv7OV7rEaGNBS',
    isDemo: true,
  },
  {
    id: '2', badgeId: 'GUJ-SRT-5829', name: 'PSI Rajesh Patel',
    rank: 'Police Sub-Inspector', station: 'Cybercrime PS, Surat City',
    district: 'Surat City', avatar: 'RP', role: 'officer',
    passwordHash: '$2a$10$xQb8V1lJRJj2tV/S4sYL5.F.QqEHzHrp0xJl6D9nLv7OV7rEaGNBS',
    isDemo: true,
  },
  {
    id: '3', badgeId: 'GUJ-GND-1102', name: 'DySP Neha Sharma',
    rank: 'Deputy Superintendent of Police', station: 'CID Crime, Gandhinagar',
    district: 'Gandhinagar', avatar: 'NS', role: 'officer',
    passwordHash: '$2a$10$xQb8V1lJRJj2tV/S4sYL5.F.QqEHzHrp0xJl6D9nLv7OV7rEaGNBS',
    isDemo: true,
  },
  {
    id: '4', badgeId: 'GUJ-VAD-4491', name: 'HC Suresh Chavda',
    rank: 'Head Constable', station: 'Sayajigunj PS, Vadodara',
    district: 'Vadodara City', avatar: 'SC', role: 'officer',
    passwordHash: '$2a$10$xQb8V1lJRJj2tV/S4sYL5.F.QqEHzHrp0xJl6D9nLv7OV7rEaGNBS',
    isDemo: true,
  },
];

// ─── Seed case (shown to new users) ─────────────────────────────────────────
const SEED_CASE = {
  id: 'CR-2024-0891',
  firNumber: '45/2024',
  title: 'Assault & Robbery — Maninagar Market',
  complainant: 'Ramesh Bhai Patel',
  accused: 'Unknown (3 persons)',
  date: '2024-06-10',
  station: 'Maninagar PS',
  district: 'Ahmedabad City',
  officer: 'PSI Kiran Desai',
  status: 'active',
  sections: ['BNS 109', 'BNS 304', 'BNS 310'],
  narrative: 'On 10/06/2024 at approximately 21:30 hrs, the complainant Ramesh Bhai Patel was returning from his shop when three unknown persons assaulted him near Maninagar market and snatched his gold chain worth ₹45,000 and mobile phone.',
  evidence: [
    { id: 'E001', item: 'CCTV Footage (Market area)', type: 'Digital', seized: '2024-06-11' },
  ],
  diaryEntries: [
    { date: '2024-06-10', time: '22:15', action: 'FIR registered at Maninagar PS', officer: 'HC Mohan Sinh' },
  ],
  createdAt: '2024-06-10T22:15:00Z',
  updatedAt: '2024-06-10T22:15:00Z',
};

// ─── NLP Legal Intelligence (client-side) ───────────────────────────────────
const LEGAL_SECTIONS = {
  assault: [
    { code: 'BNS 109', title: 'Abetment of offences', act: 'BNS', severity: 'high' },
    { code: 'BNS 115', title: 'Voluntarily causing hurt', act: 'BNS', severity: 'medium' },
    { code: 'BNS 117', title: 'Voluntarily causing grievous hurt', act: 'BNS', severity: 'high' },
    { code: 'BNS 121', title: 'Assault', act: 'BNS', severity: 'medium' },
  ],
  robbery: [
    { code: 'BNS 304', title: 'Robbery', act: 'BNS', severity: 'high' },
    { code: 'BNS 305', title: 'Aggravated robbery', act: 'BNS', severity: 'critical' },
    { code: 'BNS 310', title: 'Dacoity', act: 'BNS', severity: 'critical' },
  ],
  murder: [
    { code: 'BNS 101', title: 'Murder', act: 'BNS', severity: 'critical' },
    { code: 'BNS 103', title: 'Culpable homicide not amounting to murder', act: 'BNS', severity: 'critical' },
  ],
  fraud: [
    { code: 'BNS 318', title: 'Cheating', act: 'BNS', severity: 'medium' },
    { code: 'BNS 319', title: 'Cheating by personation', act: 'BNS', severity: 'high' },
    { code: 'IT Act 66C', title: 'Identity theft', act: 'IT Act', severity: 'high' },
    { code: 'IT Act 66D', title: 'Cheating by personation using computer', act: 'IT Act', severity: 'high' },
  ],
  drugs: [
    { code: 'NDPS 8(c)', title: 'Prohibition on production/sale of narcotics', act: 'NDPS', severity: 'critical' },
    { code: 'NDPS 21', title: 'Punishment for contravention involving manufactured drugs', act: 'NDPS', severity: 'critical' },
    { code: 'NDPS 29', title: 'Abetment and criminal conspiracy', act: 'NDPS', severity: 'high' },
  ],
  kidnapping: [
    { code: 'BNS 137', title: 'Kidnapping', act: 'BNS', severity: 'critical' },
    { code: 'BNS 140', title: 'Abduction', act: 'BNS', severity: 'high' },
    { code: 'BNS 144', title: 'Kidnapping for ransom', act: 'BNS', severity: 'critical' },
  ],
  domestic_violence: [
    { code: 'BNS 85', title: 'Cruelty by husband or his relatives', act: 'BNS', severity: 'high' },
    { code: 'DV Act 3', title: 'Definition of domestic violence', act: 'DV Act', severity: 'high' },
  ],
};

const JUDGMENTS = [
  { case: 'D.K. Basu v. State of West Bengal', citation: 'AIR 1997 SC 610', relevance: 'arrest', summary: 'Fundamental guidelines for arrest, detention, and interrogation procedures.' },
  { case: 'Arnesh Kumar v. State of Bihar', citation: '(2014) 8 SCC 273', relevance: 'arrest', summary: 'Guidelines on arrest in Section 498A IPC / BNS 85 cases.' },
  { case: 'Joginder Kumar v. State of UP', citation: 'AIR 1994 SC 1349', relevance: 'arrest', summary: 'Arrest should not be made as a matter of course.' },
  { case: 'State of Maharashtra v. Dyaneshwar', citation: '(2009) 15 SCC 200', relevance: 'evidence', summary: 'Admissibility of electronic evidence under BSA.' },
  { case: 'Hussainara Khatoon v. State of Bihar', citation: 'AIR 1979 SC 1360', relevance: 'remand', summary: 'Right to speedy trial is fundamental; bail vs. jail principles.' },
];

function analyzeNarrativeLocal(narrative) {
  const text = narrative.toLowerCase();
  let suggested = [];

  if (/assault|beat|hurt|punch|kick|attack/i.test(text)) suggested.push(...LEGAL_SECTIONS.assault);
  if (/snatch|rob|theft|chain|steal|loot/i.test(text)) suggested.push(...LEGAL_SECTIONS.robbery);
  if (/murder|kill|death|shot|stab|dead/i.test(text)) suggested.push(...LEGAL_SECTIONS.murder);
  if (/fraud|cheat|otp|bank|online|deception/i.test(text)) suggested.push(...LEGAL_SECTIONS.fraud);
  if (/drug|heroin|narcotic|ganja|mdma|cocaine/i.test(text)) suggested.push(...LEGAL_SECTIONS.drugs);
  if (/kidnap|abduct|ransom/i.test(text)) suggested.push(...LEGAL_SECTIONS.kidnapping);
  if (/domestic|husband|wife|cruelty|harassment/i.test(text)) suggested.push(...LEGAL_SECTIONS.domestic_violence);

  const unique = suggested.filter((v, i, a) => a.findIndex(x => x.code === v.code) === i);

  const relevantJudgments = JUDGMENTS.filter(j =>
    text.includes(j.relevance) ||
    (/arrest/i.test(text) && j.relevance === 'arrest') ||
    (/bail/i.test(text) && j.relevance === 'remand')
  );

  return {
    sections: unique,
    judgments: relevantJudgments.length > 0 ? relevantJudgments : JUDGMENTS.slice(0, 2),
    actsReferenced: [...new Set(unique.map(s => s.act))],
    confidence: unique.length > 0 ? 'high' : 'low',
    analysisTimestamp: new Date().toISOString(),
  };
}

// ─── Helper: get all users (demo + registered) ─────────────────────────────
function getAllUsers() {
  const registered = ls.get('crimegpt_users', []);
  const all = [...DEMO_OFFICERS];
  for (const ru of registered) {
    if (!all.find(u => u.badgeId === ru.badgeId)) {
      all.push(ru);
    }
  }
  return all;
}

// ─── Stats calculator ───────────────────────────────────────────────────────
const calculateStats = (cases, docs) => {
  const activeCases = cases.filter(c => c.status === 'active').length;
  const totalDocuments = docs.length;
  const pendingArrests = cases.filter(c => c.status === 'active' && !c.accused.toLowerCase().includes('arrested')).length;
  const sectionsSuggested = cases.reduce((acc, c) => acc + (c.sections ? c.sections.length : 0), 0) + 12;
  return { activeCases, totalDocuments, pendingArrests, sectionsSuggested };
};

// ─── Persist data helpers (scoped per officer) ──────────────────────────────
function loadCases() {
  const cases = ls.get('crimegpt_cases', null);
  if (cases === null) return [SEED_CASE];
  return cases;
}
function saveCases(cases) { ls.set('crimegpt_cases', cases); }
function loadDocs() { return ls.get('crimegpt_docs', []); }
function saveDocs(docs) { ls.set('crimegpt_docs', docs); }
function loadAudit() {
  return ls.get('crimegpt_audit', [
    { id: '1', action: 'Platform initialized', officer: 'System', time: new Date().toISOString(), type: 'system' },
  ]);
}
function saveAudit(audit) { ls.set('crimegpt_audit', audit); }

// ─── Restored auth state ────────────────────────────────────────────────────
const savedOfficer = ls.get('officer', null);
const savedAuth = !!savedOfficer;

// ═══════════════════════════════════════════════════════════════════════════
// STORE — 100 % client-side, no backend required
// ═══════════════════════════════════════════════════════════════════════════
const useStore = create((set, get) => ({
  // ── Auth ────────────────────────────────────────────────────────────────
  officer: savedOfficer,
  isAuthenticated: savedAuth,
  isLoading: false,

  login: async (credentials) => {
    set({
      isAuthenticated: false, officer: null, isLoading: true,
      cases: [], selectedCase: null, generatedDocs: [], auditLog: [],
      stats: { activeCases: 0, totalDocuments: 0, pendingArrests: 0, sectionsSuggested: 0 },
    });
    ls.remove('officer');

    try {
      const { badgeId, password } = credentials;
      const users = getAllUsers();
      const user = users.find(u => u.badgeId === badgeId);

      if (!user) throw new Error('No officer found with this Badge ID. Please register first.');

      let valid = false;
      if (user.isDemo && password === 'demo1234') {
        valid = true;
      } else {
        valid = bcrypt.compareSync(password, user.passwordHash);
      }
      if (!valid) throw new Error('Incorrect password. Please try again.');

      const { passwordHash, isDemo, ...officerSafe } = user;
      ls.set('officer', officerSafe);

      set({ isAuthenticated: true, officer: officerSafe, isLoading: false });
      get().initializeData();
      return true;
    } catch (err) {
      set({ isLoading: false, isAuthenticated: false, officer: null });
      throw err;
    }
  },

  register: async (officerData) => {
    set({
      isAuthenticated: false, officer: null, isLoading: true,
      cases: [], selectedCase: null, generatedDocs: [], auditLog: [],
      stats: { activeCases: 0, totalDocuments: 0, pendingArrests: 0, sectionsSuggested: 0 },
    });
    ls.remove('officer');

    try {
      const { badgeId, password, name, rank, station, district } = officerData;
      const users = getAllUsers();
      if (users.find(u => u.badgeId === badgeId)) {
        throw new Error('Officer with this Badge ID already exists. Please login instead.');
      }

      const salt = bcrypt.genSaltSync(10);
      const passwordHash = bcrypt.hashSync(password, salt);
      const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

      const newUser = {
        id: String(Date.now()),
        badgeId, name, rank, station, district,
        avatar: initials || 'OF',
        role: 'officer',
        isDemo: false,
        passwordHash,
      };

      // Save to registered users list
      const registered = ls.get('crimegpt_users', []);
      registered.push(newUser);
      ls.set('crimegpt_users', registered);

      const { passwordHash: _, isDemo: __, ...officerSafe } = newUser;
      ls.set('officer', officerSafe);

      set({ isAuthenticated: true, officer: officerSafe, isLoading: false });
      get().initializeData();
      return true;
    } catch (err) {
      set({ isLoading: false, isAuthenticated: false, officer: null });
      throw err;
    }
  },

  logout: () => {
    ls.remove('officer');
    set({
      isAuthenticated: false, officer: null,
      cases: [], selectedCase: null, generatedDocs: [], auditLog: [],
      stats: { activeCases: 0, totalDocuments: 0, pendingArrests: 0, sectionsSuggested: 0 },
    });
  },

  // ── Cases ───────────────────────────────────────────────────────────────
  cases: [],
  selectedCase: null,
  stats: { activeCases: 0, totalDocuments: 0, pendingArrests: 0, sectionsSuggested: 0 },

  initializeData: () => {
    if (!get().isAuthenticated) return;
    const cases = loadCases();
    const docs = loadDocs();
    const audit = loadAudit();
    set({
      cases,
      generatedDocs: docs,
      auditLog: audit,
      stats: calculateStats(cases, docs),
    });
  },

  selectCase: (id) => {
    const c = get().cases.find(c => c.id === id);
    set({ selectedCase: c || null });
  },

  addCase: async (newCase) => {
    const now = new Date().toISOString();
    const cases = get().cases;
    const id = `CR-${new Date().getFullYear()}-${String(cases.length + 900).padStart(4, '0')}`;
    const officer = get().officer;

    const created = {
      id,
      firNumber: newCase.firNumber,
      title: newCase.title || `Case ${id}`,
      complainant: newCase.complainant,
      accused: newCase.accused || 'Unknown',
      date: now.split('T')[0],
      station: newCase.station || '',
      district: newCase.district || '',
      officer: officer?.badgeId || '',
      status: newCase.status || 'active',
      sections: newCase.sections || [],
      narrative: newCase.narrative,
      evidence: newCase.evidence || [],
      diaryEntries: [{
        date: now.split('T')[0],
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        action: `FIR No. ${newCase.firNumber} registered. Complainant ${newCase.complainant} appeared and statement recorded.`,
        officer: officer?.badgeId || '',
      }],
      createdAt: now,
      updatedAt: now,
    };

    set(s => {
      const updatedCases = [created, ...s.cases];
      saveCases(updatedCases);
      return { cases: updatedCases, stats: calculateStats(updatedCases, s.generatedDocs) };
    });

    return created.id;
  },

  updateCase: async (id, updates) => {
    set(s => {
      const updatedCases = s.cases.map(c =>
        c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
      );
      saveCases(updatedCases);
      const updatedCase = updatedCases.find(c => c.id === id);
      return {
        cases: updatedCases,
        selectedCase: s.selectedCase?.id === id ? updatedCase : s.selectedCase,
        stats: calculateStats(updatedCases, s.generatedDocs),
      };
    });
  },

  addDiaryEntry: async (caseId, entry) => {
    const now = new Date();
    const newEntry = {
      date: now.toISOString().split('T')[0],
      time: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      action: entry.action,
      type: entry.type || 'investigation',
      officer: entry.officer || get().officer?.badgeId || '',
    };

    set(s => {
      const updatedCases = s.cases.map(c => {
        if (c.id === caseId) {
          return { ...c, diaryEntries: [...(c.diaryEntries || []), newEntry] };
        }
        return c;
      });
      saveCases(updatedCases);

      const selectedCase = s.selectedCase?.id === caseId
        ? { ...s.selectedCase, diaryEntries: [...(s.selectedCase.diaryEntries || []), newEntry] }
        : s.selectedCase;

      return { cases: updatedCases, selectedCase };
    });
  },

  // ── Documents ───────────────────────────────────────────────────────────
  generatedDocs: [],

  addDocument: async (doc) => {
    const officer = get().officer;
    const generated = {
      id: `DOC-${Date.now()}`,
      caseId: doc.caseId,
      docType: doc.docType,
      title: doc.title || doc.docType.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase()),
      content: doc.content,
      status: 'generated',
      createdAt: new Date().toISOString(),
      createdBy: officer?.badgeId || '',
    };

    set(s => {
      const updatedDocs = [generated, ...s.generatedDocs];
      saveDocs(updatedDocs);
      return { generatedDocs: updatedDocs, stats: calculateStats(s.cases, updatedDocs) };
    });
  },

  // ── UI State ────────────────────────────────────────────────────────────
  language: localStorage.getItem('language') || 'en',
  sidebarOpen: true,
  theme: localStorage.getItem('theme') || 'dark',

  setLanguage: (lang) => {
    localStorage.setItem('language', lang);
    set({ language: lang });
  },

  toggleSidebar: () => set(s => ({ sidebarOpen: !s.sidebarOpen })),

  setTheme: (theme) => {
    localStorage.setItem('theme', theme);
    set({ theme });
  },

  // ── Audit ───────────────────────────────────────────────────────────────
  auditLog: [],

  addAuditEntry: async (entry) => {
    const officer = get().officer;
    const created = {
      id: String(Date.now()),
      action: entry.action,
      officer: officer?.badgeId || 'System',
      time: new Date().toISOString(),
      type: entry.type || 'action',
    };
    set(s => {
      const updated = [created, ...s.auditLog];
      saveAudit(updated);
      return { auditLog: updated };
    });
  },

  // ── NLP Legal Intelligence (client-side) ────────────────────────────────
  analyzeNarrative: async (narrative) => {
    // Simulate slight async delay for UX
    await new Promise(r => setTimeout(r, 300));
    return analyzeNarrativeLocal(narrative);
  },
}));

export default useStore;
