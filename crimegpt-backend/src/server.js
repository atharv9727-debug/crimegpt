require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth');
const caseRoutes = require('./routes/cases');
const documentRoutes = require('./routes/documents');
const diaryRoutes = require('./routes/diary');
const searchRoutes = require('./routes/search');
const auditRoutes = require('./routes/audit');
const nlpRoutes = require('./routes/nlp');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middlewares
app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use(cors()); // Allow all origins for the prototype
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: { error: 'Too many requests. Please try again later.' },
});
app.use('/api', limiter);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'CrimeGPT API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/diary', diaryRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/nlp', nlpRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found', path: req.path });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

app.listen(PORT, () => {
  console.log(`\n🚔 CrimeGPT Backend running on port ${PORT}`);
  console.log(`📋 Health: http://localhost:${PORT}/health`);
  console.log(`🌐 Env: ${process.env.NODE_ENV || 'development'}\n`);
});

module.exports = app;
