const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { requireAuth } = require('./auth');

// In-memory store (replace with MongoDB/PostgreSQL)
let cases = [
  {
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
  },
];

// GET /api/cases — list all cases
router.get('/', requireAuth, (req, res) => {
  const { status, search, limit = 50, offset = 0 } = req.query;
  let result = [...cases];
  if (status) result = result.filter(c => c.status === status);
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(c =>
      c.id.toLowerCase().includes(q) ||
      c.title.toLowerCase().includes(q) ||
      c.complainant.toLowerCase().includes(q) ||
      c.accused.toLowerCase().includes(q) ||
      (c.sections || []).some(s => s.toLowerCase().includes(q))
    );
  }
  const total = result.length;
  result = result.slice(Number(offset), Number(offset) + Number(limit));
  res.json({ cases: result, total, limit: Number(limit), offset: Number(offset) });
});

// GET /api/cases/:id
router.get('/:id', requireAuth, (req, res) => {
  const c = cases.find(c => c.id === req.params.id);
  if (!c) return res.status(404).json({ error: 'Case not found' });
  res.json(c);
});

// POST /api/cases — create new case
router.post('/', requireAuth, (req, res) => {
  const { firNumber, title, complainant, accused, station, district, officer, narrative, sections, evidence, status } = req.body;
  if (!firNumber || !complainant || !narrative) {
    return res.status(400).json({ error: 'firNumber, complainant, and narrative are required' });
  }
  const now = new Date().toISOString();
  const id = `CR-${new Date().getFullYear()}-${String(cases.length + 900).padStart(4, '0')}`;
  const newCase = {
    id,
    firNumber,
    title: title || `Case ${id}`,
    complainant,
    accused: accused || 'Unknown',
    date: now.split('T')[0],
    station: station || '',
    district: district || '',
    officer: officer || req.user.badgeId,
    status: status || 'active',
    sections: sections || [],
    narrative,
    evidence: evidence || [],
    diaryEntries: [{
      date: now.split('T')[0],
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      action: `FIR No. ${firNumber} registered. Complainant ${complainant} appeared and statement recorded.`,
      officer: officer || req.user.badgeId,
    }],
    createdAt: now,
    updatedAt: now,
  };
  cases.unshift(newCase);
  res.status(201).json(newCase);
});

// PATCH /api/cases/:id
router.patch('/:id', requireAuth, (req, res) => {
  const idx = cases.findIndex(c => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Case not found' });
  cases[idx] = { ...cases[idx], ...req.body, updatedAt: new Date().toISOString() };
  res.json(cases[idx]);
});

// DELETE /api/cases/:id (supervisor only)
router.delete('/:id', requireAuth, (req, res) => {
  const idx = cases.findIndex(c => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Case not found' });
  cases.splice(idx, 1);
  res.json({ message: 'Case deleted', id: req.params.id });
});

// POST /api/cases/:id/diary — add diary entry
router.post('/:id/diary', requireAuth, (req, res) => {
  const c = cases.find(c => c.id === req.params.id);
  if (!c) return res.status(404).json({ error: 'Case not found' });
  const { action, type, officer } = req.body;
  if (!action) return res.status(400).json({ error: 'action is required' });
  const now = new Date();
  const entry = {
    date: now.toISOString().split('T')[0],
    time: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    action,
    type: type || 'investigation',
    officer: officer || req.user.badgeId,
  };
  c.diaryEntries = [...(c.diaryEntries || []), entry];
  c.updatedAt = now.toISOString();
  res.status(201).json(entry);
});

module.exports = router;
