// Mock case data store — replaces backend API calls in demo mode
export const mockCases = [
  {
    id: 'CR-2024-0891',
    title: 'Assault & Robbery — Maninagar Market',
    complainant: 'Ramesh Bhai Patel',
    accused: 'Unknown (3 persons)',
    date: '2024-06-10',
    station: 'Maninagar PS',
    officer: 'PSI Kiran Desai',
    status: 'active',
    sections: ['BNS 109', 'BNS 304', 'BNS 310'],
    narrative: 'On 10/06/2024 at approximately 21:30 hrs, the complainant Ramesh Bhai Patel was returning from his shop when three unknown persons assaulted him near Maninagar market and snatched his gold chain worth ₹45,000 and mobile phone. The accused fled towards Ellis Bridge.',
    evidence: [
      { id: 'E001', item: 'CCTV Footage (Market area)', type: 'Digital', seized: '2024-06-11' },
      { id: 'E002', item: 'Witness Statements (3)', type: 'Document', seized: '2024-06-11' },
    ],
    diaryEntries: [
      { date: '2024-06-10', time: '22:15', action: 'FIR registered at Maninagar PS', officer: 'HC Mohan Sinh' },
      { date: '2024-06-11', time: '09:00', action: 'Scene of crime visited, CCTV footage collected', officer: 'PSI Kiran Desai' },
      { date: '2024-06-12', time: '14:30', action: 'Three witnesses recorded their statements u/s 180 BNSS', officer: 'PSI Kiran Desai' },
    ]
  },
  {
    id: 'CR-2024-0892',
    title: 'Cybercrime — Online Banking Fraud',
    complainant: 'Meena ben Shah',
    accused: 'Raju Prasad (Arrested)',
    date: '2024-06-12',
    station: 'Cybercrime PS',
    officer: 'PI Amit Solanki',
    status: 'active',
    sections: ['BNS 318', 'IT Act 66C', 'IT Act 66D'],
    narrative: 'Complainant received a call from someone posing as SBI bank official and was induced to share OTP. Amount of ₹1,20,000 was fraudulently transferred from her account. IP trace leads to accused Raju Prasad in Ahmedabad.',
    evidence: [
      { id: 'E001', item: 'Bank transaction records', type: 'Financial', seized: '2024-06-13' },
      { id: 'E002', item: 'Call Detail Records (CDR)', type: 'Telecom', seized: '2024-06-14' },
      { id: 'E003', item: 'Mobile phone of accused', type: 'Physical', seized: '2024-06-15' },
    ],
    diaryEntries: [
      { date: '2024-06-12', time: '11:00', action: 'FIR registered, cyber cell informed', officer: 'HC Nilesh' },
      { date: '2024-06-13', time: '15:00', action: 'Bank statement and transaction logs obtained', officer: 'PI Amit Solanki' },
      { date: '2024-06-14', time: '10:00', action: 'CDR obtained from telecom company', officer: 'PI Amit Solanki' },
      { date: '2024-06-15', time: '17:30', action: 'Accused Raju Prasad arrested from Naroda', officer: 'PI Amit Solanki' },
    ]
  },
  {
    id: 'CR-2024-0885',
    title: 'Domestic Violence — Bodakdev',
    complainant: 'Priya Sharma',
    accused: 'Suresh Sharma (Husband)',
    date: '2024-06-08',
    station: 'Bodakdev PS',
    officer: 'WPSI Asha Rana',
    status: 'pending',
    sections: ['BNS 115', 'DV Act 3'],
    narrative: 'Complainant Priya Sharma reported repeated physical and mental harassment by her husband Suresh Sharma. Medical examination confirms injuries. Complainant seeking protection order.',
    evidence: [
      { id: 'E001', item: 'Medical examination report', type: 'Medical', seized: '2024-06-08' },
      { id: 'E002', item: 'Photographs of injuries', type: 'Digital', seized: '2024-06-08' },
    ],
    diaryEntries: [
      { date: '2024-06-08', time: '08:30', action: 'Complainant arrived at PS, statement recorded', officer: 'WPSI Asha Rana' },
      { date: '2024-06-08', time: '10:00', action: 'Medical examination conducted at Civil Hospital', officer: 'WPSI Asha Rana' },
      { date: '2024-06-09', time: '12:00', action: 'Accused called for inquiry, statement recorded', officer: 'WPSI Asha Rana' },
    ]
  },
  {
    id: 'CR-2024-0878',
    title: 'Drug Peddling — Vastrapur',
    complainant: 'State (Trap case)',
    accused: 'Amir Khan',
    date: '2024-06-05',
    station: 'SOG / NCB',
    officer: 'PI Ravi Bhai Joshi',
    status: 'closed',
    sections: ['NDPS 8(c)', 'NDPS 21', 'NDPS 29'],
    narrative: 'Acting on specific intelligence, a trap was laid near Vastrapur Lake. Accused Amir Khan was apprehended while in possession of 250 grams of heroin worth approximately ₹12 lakhs.',
    evidence: [
      { id: 'E001', item: 'Heroin (250g) — FSL sent', type: 'Physical', seized: '2024-06-05' },
      { id: 'E002', item: 'Mobile phones (2)', type: 'Physical', seized: '2024-06-05' },
      { id: 'E003', item: 'Cash ₹45,000', type: 'Financial', seized: '2024-06-05' },
    ],
    diaryEntries: [
      { date: '2024-06-05', time: '20:00', action: 'Trap laid as per intelligence', officer: 'PI Ravi Bhai Joshi' },
      { date: '2024-06-05', time: '21:30', action: 'Accused arrested, contraband seized, panchanama drawn', officer: 'PI Ravi Bhai Joshi' },
      { date: '2024-06-06', time: '10:00', action: 'Accused produced before Magistrate, remand obtained', officer: 'PI Ravi Bhai Joshi' },
      { date: '2024-06-07', time: '14:00', action: 'FSL samples sent, chargesheet prepared', officer: 'PI Ravi Bhai Joshi' },
    ]
  },
];

export const mockOfficer = {
  id: 'OFF-001',
  name: 'PI Amit Solanki',
  badge: 'GUJ-AHD-2847',
  rank: 'Police Inspector',
  station: 'Cybercrime PS, Ahmedabad',
  district: 'Ahmedabad City',
  avatar: 'AS',
  role: 'officer',
};

export const mockStats = {
  activeCases: 12,
  totalDocuments: 87,
  pendingArrests: 3,
  sectionsSuggested: 241,
};

// BNS/BNSS/BSA section dataset for AI suggestions
export const legalSections = {
  assault: [
    { code: 'BNS 109', title: 'Abetment of offences', act: 'BNS', description: 'Whoever abets any offence shall...', severity: 'high' },
    { code: 'BNS 115', title: 'Voluntarily causing hurt', act: 'BNS', description: 'Whoever voluntarily causes hurt...', severity: 'medium' },
    { code: 'BNS 117', title: 'Voluntarily causing grievous hurt', act: 'BNS', description: 'Whoever voluntarily causes grievous hurt...', severity: 'high' },
    { code: 'BNS 121', title: 'Assault', act: 'BNS', description: 'Whoever makes any gesture or preparation...', severity: 'medium' },
    { code: 'BNSS 170', title: 'Power of arrest without warrant', act: 'BNSS', description: 'Police officer may arrest without warrant...', severity: 'procedural' },
  ],
  robbery: [
    { code: 'BNS 304', title: 'Robbery', act: 'BNS', description: 'In all robbery there is either theft or extortion...', severity: 'high' },
    { code: 'BNS 305', title: 'Aggravated robbery', act: 'BNS', description: 'Whoever commits robbery being armed...', severity: 'critical' },
    { code: 'BNS 310', title: 'Dacoity', act: 'BNS', description: 'When five or more persons conjointly commit...', severity: 'critical' },
  ],
  murder: [
    { code: 'BNS 101', title: 'Murder', act: 'BNS', description: 'Except in the cases hereinafter excepted, culpable homicide...', severity: 'critical' },
    { code: 'BNS 103', title: 'Culpable homicide not amounting to murder', act: 'BNS', description: 'Whoever causes death by doing an act...', severity: 'critical' },
    { code: 'BNS 109', title: 'Abetment', act: 'BNS', description: 'Whoever abets the commission of...', severity: 'high' },
  ],
  fraud: [
    { code: 'BNS 318', title: 'Cheating', act: 'BNS', description: 'Whoever, by deceiving any person...', severity: 'medium' },
    { code: 'BNS 319', title: 'Cheating by personation', act: 'BNS', description: 'A person is said to cheat by personation...', severity: 'high' },
    { code: 'IT Act 66C', title: 'Identity theft', act: 'IT Act', description: 'Whoever fraudulently or dishonestly makes use of...', severity: 'high' },
    { code: 'IT Act 66D', title: 'Cheating by personation using computer', act: 'IT Act', description: 'Whoever by means of any communication device...', severity: 'high' },
  ],
  kidnapping: [
    { code: 'BNS 137', title: 'Kidnapping', act: 'BNS', description: 'Kidnapping is of two kinds: kidnapping from India...', severity: 'critical' },
    { code: 'BNS 140', title: 'Abduction', act: 'BNS', description: 'Whoever by force compels, or by any deceitful means...', severity: 'high' },
    { code: 'BNS 144', title: 'Kidnapping for ransom', act: 'BNS', description: 'Whoever kidnaps or abducts any person...', severity: 'critical' },
  ],
  drugs: [
    { code: 'NDPS 8(c)', title: 'Prohibition on production/sale of narcotics', act: 'NDPS', description: 'No person shall produce, manufacture, possess...', severity: 'critical' },
    { code: 'NDPS 21', title: 'Punishment for contravention involving manufactured drugs', act: 'NDPS', description: 'Whoever contravenes any provision...', severity: 'critical' },
    { code: 'NDPS 29', title: 'Abetment and criminal conspiracy', act: 'NDPS', description: 'Whoever abets or is a party to a criminal conspiracy...', severity: 'high' },
  ],
  domestic_violence: [
    { code: 'BNS 85', title: 'Cruelty by husband or his relatives', act: 'BNS', description: 'Whoever, being the husband or the relative...', severity: 'high' },
    { code: 'DV Act 3', title: 'Definition of domestic violence', act: 'DV Act', description: 'Any act, omission or commission or conduct of the respondent...', severity: 'high' },
    { code: 'DV Act 18', title: 'Protection Orders', act: 'DV Act', description: 'The Magistrate may, after giving the aggrieved person and respondent...', severity: 'procedural' },
  ],
};

export const landmarkJudgments = [
  { case: 'D.K. Basu v. State of West Bengal', citation: 'AIR 1997 SC 610', relevance: 'arrest', summary: 'Laid down fundamental guidelines for arrest, detention, and interrogation procedures.' },
  { case: 'Arnesh Kumar v. State of Bihar', citation: '(2014) 8 SCC 273', relevance: 'arrest', summary: 'Supreme Court guidelines on arrest in cases under Section 498A IPC / BNS 85.' },
  { case: 'Joginder Kumar v. State of UP', citation: 'AIR 1994 SC 1349', relevance: 'arrest', summary: 'Arrest should not be made as a matter of course; grounds must exist.' },
  { case: 'State of Maharashtra v. Dyaneshwar Laxman Rao Wankhede', citation: '(2009) 15 SCC 200', relevance: 'evidence', summary: 'Admissibility of electronic evidence under BSA.' },
  { case: 'Selvi v. State of Karnataka', citation: '(2010) 7 SCC 263', relevance: 'investigation', summary: 'Constitutional validity of narco-analysis, brain mapping, and polygraph tests.' },
  { case: 'Hussainara Khatoon v. State of Bihar', citation: 'AIR 1979 SC 1360', relevance: 'remand', summary: 'Right to speedy trial is a fundamental right; bail vs. jail principles.' },
];
