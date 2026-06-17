const express = require('express');
const router = express.Router();
const { requireAuth } = require('./auth');

// BNS/BNSS/BSA section dataset
const LEGAL_SECTIONS = {
  assault: [
    { code: 'BNS 109', title: 'Abetment of offences', act: 'BNS', severity: 'high' },
    { code: 'BNS 115', title: 'Voluntarily causing hurt', act: 'BNS', severity: 'medium' },
    { code: 'BNS 117', title: 'Voluntarily causing grievous hurt', act: 'BNS', severity: 'high' },
    { code: 'BNS 121', title: 'Assault', act: 'BNS', severity: 'medium' },
  ],
  robbery: [
    { code: 'BNS 304', title: 'Robbery', act: 'BNS', severity: 'high' },
    { code: 'BNS 305', title: 'Aggravated robbery', act: 'BNS', severity: 'critical' },
    { code: 'BNS 310', title: 'Dacoity', act: 'BNS', severity: 'critical' },
  ],
  murder: [
    { code: 'BNS 101', title: 'Murder', act: 'BNS', severity: 'critical' },
    { code: 'BNS 103', title: 'Culpable homicide not amounting to murder', act: 'BNS', severity: 'critical' },
  ],
  fraud: [
    { code: 'BNS 318', title: 'Cheating', act: 'BNS', severity: 'medium' },
    { code: 'BNS 319', title: 'Cheating by personation', act: 'BNS', severity: 'high' },
    { code: 'IT Act 66C', title: 'Identity theft', act: 'IT Act', severity: 'high' },
    { code: 'IT Act 66D', title: 'Cheating by personation using computer', act: 'IT Act', severity: 'high' },
  ],
  drugs: [
    { code: 'NDPS 8(c)', title: 'Prohibition on production/sale of narcotics', act: 'NDPS', severity: 'critical' },
    { code: 'NDPS 21', title: 'Punishment for contravention involving manufactured drugs', act: 'NDPS', severity: 'critical' },
    { code: 'NDPS 29', title: 'Abetment and criminal conspiracy', act: 'NDPS', severity: 'high' },
  ],
  kidnapping: [
    { code: 'BNS 137', title: 'Kidnapping', act: 'BNS', severity: 'critical' },
    { code: 'BNS 140', title: 'Abduction', act: 'BNS', severity: 'high' },
    { code: 'BNS 144', title: 'Kidnapping for ransom', act: 'BNS', severity: 'critical' },
  ],
  domestic_violence: [
    { code: 'BNS 85', title: 'Cruelty by husband or his relatives', act: 'BNS', severity: 'high' },
    { code: 'DV Act 3', title: 'Definition of domestic violence', act: 'DV Act', severity: 'high' },
  ],
};

const JUDGMENTS = [
  { case: 'D.K. Basu v. State of West Bengal', citation: 'AIR 1997 SC 610', relevance: 'arrest', summary: 'Fundamental guidelines for arrest, detention, and interrogation procedures.' },
  { case: 'Arnesh Kumar v. State of Bihar', citation: '(2014) 8 SCC 273', relevance: 'arrest', summary: 'Guidelines on arrest in Section 498A IPC / BNS 85 cases.' },
  { case: 'Joginder Kumar v. State of UP', citation: 'AIR 1994 SC 1349', relevance: 'arrest', summary: 'Arrest should not be made as a matter of course.' },
  { case: 'State of Maharashtra v. Dyaneshwar', citation: '(2009) 15 SCC 200', relevance: 'evidence', summary: 'Admissibility of electronic evidence under BSA.' },
  { case: 'Hussainara Khatoon v. State of Bihar', citation: 'AIR 1979 SC 1360', relevance: 'remand', summary: 'Right to speedy trial is fundamental; bail vs. jail principles.' },
];

// POST /api/nlp/analyze — analyze narrative and suggest sections
router.post('/analyze', requireAuth, (req, res) => {
  const { narrative } = req.body;
  if (!narrative || narrative.trim().split(/\s+/).length < 3) {
    return res.status(400).json({ error: 'Narrative is too short for analysis' });
  }

  const text = narrative.toLowerCase();
  let suggested = [];

  if (/assault|beat|hurt|punch|kick|attack/i.test(text)) suggested.push(...LEGAL_SECTIONS.assault);
  if (/snatch|rob|theft|chain|steal|loot/i.test(text)) suggested.push(...LEGAL_SECTIONS.robbery);
  if (/murder|kill|death|shot|stab|dead/i.test(text)) suggested.push(...LEGAL_SECTIONS.murder);
  if (/fraud|cheat|otp|bank|online|deception/i.test(text)) suggested.push(...LEGAL_SECTIONS.fraud);
  if (/drug|heroin|narcotic|ganja|mdma|cocaine/i.test(text)) suggested.push(...LEGAL_SECTIONS.drugs);
  if (/kidnap|abduct|ransom/i.test(text)) suggested.push(...LEGAL_SECTIONS.kidnapping);
  if (/domestic|husband|wife|cruelty|harassment/i.test(text)) suggested.push(...LEGAL_SECTIONS.domestic_violence);

  // Dedup by code
  const unique = suggested.filter((v, i, a) => a.findIndex(x => x.code === v.code) === i);

  // Relevant judgments
  const relevantJudgments = JUDGMENTS.filter(j =>
    text.includes(j.relevance) ||
    (/arrest/i.test(text) && j.relevance === 'arrest') ||
    (/bail/i.test(text) && j.relevance === 'remand')
  );

  res.json({
    sections: unique,
    judgments: relevantJudgments.length > 0 ? relevantJudgments : JUDGMENTS.slice(0, 2),
    actsReferenced: [...new Set(unique.map(s => s.act))],
    confidence: unique.length > 0 ? 'high' : 'low',
    analysisTimestamp: new Date().toISOString(),
  });
});

// GET /api/nlp/sections — get all available sections
router.get('/sections', requireAuth, (req, res) => {
  const all = Object.values(LEGAL_SECTIONS).flat();
  const unique = all.filter((v, i, a) => a.findIndex(x => x.code === v.code) === i);
  res.json({ sections: unique, total: unique.length });
});

module.exports = router;
