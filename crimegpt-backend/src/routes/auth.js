const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

// In-memory user store (replace with MongoDB in production)
const users = [
  {
    id: '1',
    badgeId: 'GUJ-AHD-2847',
    name: 'PI Amit Solanki',
    rank: 'Police Inspector',
    station: 'Cybercrime PS, Ahmedabad',
    district: 'Ahmedabad City',
    avatar: 'AS',
    role: 'officer',
    // password: demo1234 (hashed)
    passwordHash: '$2a$10$xQb8V1lJRJj2tV/S4sYL5.F.QqEHzHrp0xJl6D9nLv7OV7rEaGNBS',
  },
];

const JWT_SECRET = process.env.JWT_SECRET || 'crimegpt-dev-secret-change-in-production';

// POST /api/auth/login
router.post('/login',
  [
    body('badgeId').notEmpty().withMessage('Badge ID is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

      const { badgeId, password } = req.body;
      const user = users.find(u => u.badgeId === badgeId);

      if (!user) return res.status(401).json({ error: 'Invalid credentials' });

      // For demo: accept any password or check hash
      const valid = password === 'demo1234' || await bcrypt.compare(password, user.passwordHash);
      if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

      const { passwordHash, ...userSafe } = user;
      const token = jwt.sign({ id: user.id, badgeId: user.badgeId, role: user.role }, JWT_SECRET, { expiresIn: '8h' });

      res.json({ token, officer: userSafe, message: 'Login successful' });
    } catch (err) { next(err); }
  }
);

// GET /api/auth/me (protected)
router.get('/me', requireAuth, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const { passwordHash, ...safe } = user;
  res.json(safe);
});

// Middleware
function requireAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
  try {
    req.user = jwt.verify(auth.split(' ')[1], JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = router;
module.exports.requireAuth = requireAuth;
