const express = require('express');
const router = express.Router();
const { requireAuth } = require('./auth');

// Stub routes (implement with docxtpl/pdfmake in production)
let documents = [];

// GET /api/documents
router.get('/', requireAuth, (req, res) => {
  const { caseId } = req.query;
  let result = caseId ? documents.filter(d => d.caseId === caseId) : documents;
  res.json({ documents: result, total: result.length });
});

// POST /api/documents/generate
router.post('/generate', requireAuth, (req, res) => {
  const { caseId, docType, caseData } = req.body;
  if (!caseId || !docType) return res.status(400).json({ error: 'caseId and docType are required' });

  const doc = {
    id: `DOC-${Date.now()}`,
    caseId,
    docType,
    title: docType.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase()),
    status: 'generated',
    createdAt: new Date().toISOString(),
    createdBy: req.user.badgeId,
    downloadUrl: `/api/documents/${Date.now()}/download`,
  };
  documents.unshift(doc);
  res.status(201).json(doc);
});

// DELETE /api/documents/:id
router.delete('/:id', requireAuth, (req, res) => {
  documents = documents.filter(d => d.id !== req.params.id);
  res.json({ message: 'Document deleted' });
});

module.exports = router;
