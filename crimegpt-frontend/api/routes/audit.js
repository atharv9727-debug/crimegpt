const express = require('express');
const router = express.Router();
const { requireAuth } = require('./auth');

let auditLog = [
  { id: '1', action: 'Platform initialized', officer: 'System', time: new Date().toISOString(), type: 'system' },
];

// GET /api/audit
router.get('/', requireAuth, (req, res) => {
  const { type, limit = 50 } = req.query;
  let result = type ? auditLog.filter(a => a.type === type) : auditLog;
  res.json({ audit: result.slice(0, Number(limit)), total: result.length });
});

// POST /api/audit (internal use)
router.post('/', requireAuth, (req, res) => {
  const { action, type } = req.body;
  const entry = {
    id: String(Date.now()),
    action,
    officer: req.user.badgeId,
    time: new Date().toISOString(),
    type: type || 'action',
  };
  auditLog.unshift(entry);
  res.status(201).json(entry);
});

module.exports = router;
