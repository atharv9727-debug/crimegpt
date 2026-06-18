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
  {
    id: '2',
    badgeId: 'GUJ-SRT-5829',
    name: 'PSI Rajesh Patel',
    rank: 'Police Sub-Inspector',
    station: 'Cybercrime PS, Surat City',
    district: 'Surat City',
    avatar: 'RP',
    role: 'officer',
    passwordHash: '$2a$10$xQb8V1lJRJj2tV/S4sYL5.F.QqEHzHrp0xJl6D9nLv7OV7rEaGNBS',
  },
  {
    id: '3',
    badgeId: 'GUJ-GND-1102',
    name: 'DySP Neha Sharma',
    rank: 'Deputy Superintendent of Police',
    station: 'CID Crime, Gandhinagar',
    district: 'Gandhinagar',
    avatar: 'NS',
    role: 'officer',
    passwordHash: '$2a$10$xQb8V1lJRJj2tV/S4sYL5.F.QqEHzHrp0xJl6D9nLv7OV7rEaGNBS',
  },
  {
    id: '4',
    badgeId: 'GUJ-VAD-4491',
    name: 'HC Suresh Chavda',
    rank: 'Head Constable',
    station: 'Sayajigunj PS, Vadodara',
    district: 'Vadodara City',
    avatar: 'SC',
    role: 'officer',
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

// POST /api/auth/register
router.post('/register',
  [
    body('badgeId').notEmpty().withMessage('Badge ID is required'),
    body('password').notEmpty().withMessage('Password is required'),
    body('name').notEmpty().withMessage('Name is required'),
    body('rank').notEmpty().withMessage('Rank is required'),
    body('station').notEmpty().withMessage('Station is required'),
    body('district').notEmpty().withMessage('District is required'),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

      const { badgeId, password, name, rank, station, district } = req.body;
      const existing = users.find(u => u.badgeId === badgeId);
      if (existing) return res.status(400).json({ error: 'Officer with this Badge ID already exists' });

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      // Get initials for avatar
      const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

      const newUser = {
        id: String(users.length + 1),
        badgeId,
        name,
        rank,
        station,
        district,
        avatar: initials || 'OF',
        role: 'officer',
        passwordHash
      };

      users.push(newUser);

      const token = jwt.sign({ id: newUser.id, badgeId: newUser.badgeId, role: newUser.role }, JWT_SECRET, { expiresIn: '8h' });
      const { passwordHash: _, ...userSafe } = newUser;

      res.status(201).json({ token, officer: userSafe, message: 'Officer registered successfully' });
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
