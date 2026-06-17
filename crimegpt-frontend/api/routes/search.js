const express = require('express');
const router = express.Router();
const { requireAuth } = require('./auth');

// GET /api/search
router.get('/', requireAuth, (req, res) => {
  // Delegates to cases route in practice — centralized search stub
  res.json({ message: 'Use /api/cases?search=query for full-text search', results: [] });
});

module.exports = router;
