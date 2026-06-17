const express = require('express');
const router = express.Router();
const { requireAuth } = require('./auth');

// GET /api/diary/:caseId
router.get('/:caseId', requireAuth, (req, res) => {
  // In production, fetch from case document
  res.json({ entries: [], caseId: req.params.caseId });
});

module.exports = router;
