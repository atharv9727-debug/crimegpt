import { create } from 'zustand';
import { mockCases, mockOfficer, mockStats } from '../data/mockData';

const useStore = create((set, get) => ({
  // Auth
  officer: mockOfficer,
  isAuthenticated: false,
  login: (credentials) => {
    // Demo: accept any login
    set({ isAuthenticated: true, officer: mockOfficer });
    return true;
  },
  logout: () => set({ isAuthenticated: false }),

  // Cases
  cases: mockCases,
  selectedCase: null,
  stats: mockStats,
  selectCase: (id) => {
    const c = get().cases.find(c => c.id === id);
    set({ selectedCase: c || null });
  },
  addCase: (newCase) => {
    const id = `CR-2024-${String(mockCases.length + 900).padStart(4, '0')}`;
    const caseWithId = { ...newCase, id, date: new Date().toISOString().split('T')[0] };
    set(s => ({
      cases: [caseWithId, ...s.cases],
      stats: { ...s.stats, activeCases: s.stats.activeCases + 1 }
    }));
    return id;
  },
  updateCase: (id, updates) => {
    set(s => ({
      cases: s.cases.map(c => c.id === id ? { ...c, ...updates } : c),
      selectedCase: s.selectedCase?.id === id ? { ...s.selectedCase, ...updates } : s.selectedCase,
    }));
  },
  addDiaryEntry: (caseId, entry) => {
    set(s => ({
      cases: s.cases.map(c =>
        c.id === caseId
          ? { ...c, diaryEntries: [...(c.diaryEntries || []), entry] }
          : c
      ),
    }));
  },

  // Documents
  generatedDocs: [],
  addDocument: (doc) => {
    set(s => ({
      generatedDocs: [{ ...doc, id: Date.now(), createdAt: new Date().toISOString() }, ...s.generatedDocs],
      stats: { ...s.stats, totalDocuments: s.stats.totalDocuments + 1 },
    }));
  },

  // UI
  language: 'en',
  sidebarOpen: true,
  setLanguage: (lang) => set({ language: lang }),
  toggleSidebar: () => set(s => ({ sidebarOpen: !s.sidebarOpen })),

  // Audit log
  auditLog: [
    { id: 1, action: 'Case CR-2024-0891 created', officer: 'PSI Kiran Desai', time: '2024-06-10 22:15', type: 'create' },
    { id: 2, action: 'Medical letter generated for CR-2024-0885', officer: 'WPSI Asha Rana', time: '2024-06-08 11:00', type: 'generate' },
    { id: 3, action: 'Remand request modified for CR-2024-0892', officer: 'PI Amit Solanki', time: '2024-06-15 09:30', type: 'edit' },
    { id: 4, action: 'Chargesheet generated for CR-2024-0878', officer: 'PI Ravi Bhai Joshi', time: '2024-06-07 14:00', type: 'generate' },
  ],
  addAuditEntry: (entry) => {
    set(s => ({ auditLog: [{ id: Date.now(), ...entry, time: new Date().toLocaleString() }, ...s.auditLog] }));
  },
}));

export default useStore;
