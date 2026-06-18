import { create } from 'zustand';

const API_URL = (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1')
  ? ''
  : (import.meta.env.VITE_API_URL || '');

// Centralized API requester helper
const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    ...options.headers,
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('officer');
    // Force redirect/reload or let Zustand handle state change
    window.dispatchEvent(new Event('unauthorized'));
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || 'API request failed');
  }

  return response.json();
};

const calculateStats = (cases, docs) => {
  const activeCases = cases.filter(c => c.status === 'active').length;
  const totalDocuments = docs.length;
  const pendingArrests = cases.filter(c => c.status === 'active' && !c.accused.toLowerCase().includes('arrested')).length;
  const sectionsSuggested = cases.reduce((acc, c) => acc + (c.sections ? c.sections.length : 0), 0) + 12; // Base offset
  return { activeCases, totalDocuments, pendingArrests, sectionsSuggested };
};

const savedToken = localStorage.getItem('token');
const savedOfficer = localStorage.getItem('officer') ? JSON.parse(localStorage.getItem('officer')) : null;

const useStore = create((set, get) => ({
  // Auth State
  officer: savedOfficer,
  isAuthenticated: !!savedToken,
  isLoading: false,

  login: async (credentials) => {
    set({ isLoading: true });
    try {
      const data = await apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('officer', JSON.stringify(data.officer));
      
      set({ 
        isAuthenticated: true, 
        officer: data.officer, 
        isLoading: false 
      });
      
      // Auto-load all case data on login
      await get().initializeData();
      return true;
    } catch (err) {
      set({ isLoading: false });
      console.error('Login failed:', err);
      throw err;
    }
  },

  register: async (officerData) => {
    set({ isLoading: true });
    try {
      const data = await apiRequest('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(officerData),
      });
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('officer', JSON.stringify(data.officer));
      
      set({ 
        isAuthenticated: true, 
        officer: data.officer, 
        isLoading: false 
      });
      
      await get().initializeData();
      return true;
    } catch (err) {
      set({ isLoading: false });
      console.error('Registration failed:', err);
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('officer');
    set({ 
      isAuthenticated: false, 
      officer: null, 
      cases: [], 
      selectedCase: null,
      generatedDocs: [],
      auditLog: [],
      stats: { activeCases: 0, totalDocuments: 0, pendingArrests: 0, sectionsSuggested: 0 }
    });
  },

  // Cases State
  cases: [],
  selectedCase: null,
  stats: { activeCases: 0, totalDocuments: 0, pendingArrests: 0, sectionsSuggested: 0 },

  initializeData: async () => {
    if (!get().isAuthenticated) return;
    try {
      const casesData = await apiRequest('/api/cases');
      const docsData = await apiRequest('/api/documents');
      const auditData = await apiRequest('/api/audit');

      const loadedCases = casesData.cases || [];
      const loadedDocs = docsData.documents || [];
      const loadedAudit = auditData.audit || [];

      set({
        cases: loadedCases,
        generatedDocs: loadedDocs,
        auditLog: loadedAudit,
        stats: calculateStats(loadedCases, loadedDocs)
      });
    } catch (err) {
      console.error('Failed to initialize store data:', err);
    }
  },

  selectCase: (id) => {
    const c = get().cases.find(c => c.id === id);
    set({ selectedCase: c || null });
  },

  addCase: async (newCase) => {
    try {
      // Map frontend case representation to API payload
      const payload = {
        firNumber: newCase.firNumber,
        title: newCase.title,
        complainant: newCase.complainant,
        accused: newCase.accused,
        station: newCase.station,
        district: newCase.district,
        narrative: newCase.narrative,
        sections: newCase.sections,
        evidence: newCase.evidence || [],
        status: newCase.status || 'active'
      };

      const createdCase = await apiRequest('/api/cases', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      set(s => {
        const updatedCases = [createdCase, ...s.cases];
        return {
          cases: updatedCases,
          stats: calculateStats(updatedCases, s.generatedDocs)
        };
      });

      return createdCase.id;
    } catch (err) {
      console.error('Failed to create case:', err);
      throw err;
    }
  },

  updateCase: async (id, updates) => {
    try {
      const updatedCase = await apiRequest(`/api/cases/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates)
      });

      set(s => {
        const updatedCases = s.cases.map(c => c.id === id ? updatedCase : c);
        return {
          cases: updatedCases,
          selectedCase: s.selectedCase?.id === id ? updatedCase : s.selectedCase,
          stats: calculateStats(updatedCases, s.generatedDocs)
        };
      });
    } catch (err) {
      console.error('Failed to update case:', err);
      throw err;
    }
  },

  addDiaryEntry: async (caseId, entry) => {
    try {
      const newEntry = await apiRequest(`/api/cases/${caseId}/diary`, {
        method: 'POST',
        body: JSON.stringify(entry)
      });

      set(s => {
        const updatedCases = s.cases.map(c => {
          if (c.id === caseId) {
            return {
              ...c,
              diaryEntries: [...(c.diaryEntries || []), newEntry]
            };
          }
          return c;
        });

        const selectedCase = s.selectedCase?.id === caseId 
          ? { ...s.selectedCase, diaryEntries: [...(s.selectedCase.diaryEntries || []), newEntry] }
          : s.selectedCase;

        return {
          cases: updatedCases,
          selectedCase
        };
      });
    } catch (err) {
      console.error('Failed to add diary entry:', err);
      throw err;
    }
  },

  // Documents State
  generatedDocs: [],
  
  addDocument: async (doc) => {
    try {
      const payload = {
        caseId: doc.caseId,
        docType: doc.docType,
        caseData: doc.caseData
      };

      const generatedDoc = await apiRequest('/api/documents/generate', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      // Maintain title and content locally for immediate preview
      const fullDoc = {
        ...generatedDoc,
        title: doc.title || generatedDoc.title,
        content: doc.content
      };

      set(s => {
        const updatedDocs = [fullDoc, ...s.generatedDocs];
        return {
          generatedDocs: updatedDocs,
          stats: calculateStats(s.cases, updatedDocs)
        };
      });
    } catch (err) {
      console.error('Failed to generate document:', err);
      throw err;
    }
  },

  // UI State
  language: localStorage.getItem('language') || 'en',
  sidebarOpen: true,
  
  setLanguage: (lang) => {
    localStorage.setItem('language', lang);
    set({ language: lang });
  },
  
  toggleSidebar: () => set(s => ({ sidebarOpen: !s.sidebarOpen })),

  // Audit Trails State
  auditLog: [],

  addAuditEntry: async (entry) => {
    try {
      const createdEntry = await apiRequest('/api/audit', {
        method: 'POST',
        body: JSON.stringify(entry)
      });

      set(s => ({
        auditLog: [createdEntry, ...s.auditLog]
      }));
    } catch (err) {
      console.error('Failed to log audit entry:', err);
    }
  },

  // NLP Legal Intelligence Call
  analyzeNarrative: async (narrative) => {
    try {
      return await apiRequest('/api/nlp/analyze', {
        method: 'POST',
        body: JSON.stringify({ narrative })
      });
    } catch (err) {
      console.error('NLP narrative analysis failed:', err);
      throw err;
    }
  }
}));

// Setup listener for 401s to force state reset
if (typeof window !== 'undefined') {
  window.addEventListener('unauthorized', () => {
    useStore.getState().logout();
  });
}

export default useStore;
