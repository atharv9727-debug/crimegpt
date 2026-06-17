# 🚔 CrimeGPT — AI-Driven Police Documentation Platform

> Automates and accelerates creation of crime-related documentation using AI-powered legal section intelligence, eliminating data duplication from first FIR to arrest.

![Platform](https://img.shields.io/badge/Platform-Web%20App-blue)
![Stack](https://img.shields.io/badge/Stack-React%20%2B%20Node.js-green)
![AI](https://img.shields.io/badge/AI-Legal%20NLP%20Engine-purple)
![Languages](https://img.shields.io/badge/Languages-EN%20%7C%20HI%20%7C%20GU-orange)

---

## ✨ Features

| Feature | Description |
|---|---|
| 🗂️ **Unified Case Data Pool** | Enter once — fills all 7 documents automatically |
| 📄 **7 Document Types** | Chargesheet, Medical Letter, Remand, Seizure, Court Custody, Panchanama, Face ID |
| 🤖 **AI Legal Intelligence** | NLP-based BNS/BNSS/BSA/NDPS section suggestion from narrative |
| 📖 **Case Diary** | Automated timeline from FIR to arrest |
| 🌐 **Trilingual** | English / Hindi / Gujarati interface + documents |
| 🔍 **Search & Audit** | Full-text search with version history and audit trail |
| 🔐 **Role-based Auth** | Officer / Supervisor / Admin roles with JWT |

---

## 🏗️ Architecture

```
crimegpt-frontend/    → React.js SPA (Vite) — deploy to Vercel
crimegpt-backend/     → Node.js Express API — deploy to Railway
```

---

## 🚀 Quick Start (Local)

### Frontend
```bash
cd crimegpt-frontend
npm install
npm run dev
# Open http://localhost:3000
```

### Backend
```bash
cd crimegpt-backend
npm install
npm run dev
# API at http://localhost:5000
```

### Demo Login
- **Badge ID:** `GUJ-AHD-2847`
- **Password:** `demo1234`

---

## ☁️ Cloud Deployment

### Frontend → Vercel
```bash
cd crimegpt-frontend
npx vercel --prod
```
Set environment variable: `VITE_API_URL=https://your-backend.railway.app`

### Backend → Railway
1. Connect the `crimegpt-backend` directory to Railway
2. Set environment variables:
   - `JWT_SECRET` — strong random string
   - `FRONTEND_URL` — your Vercel URL
   - `NODE_ENV=production`
3. Railway auto-detects Node.js and runs `npm start`

---

## 📄 Generated Documents

1. **Purvani Chargesheet** — Initial FIR/complaint draft
2. **Medical Treatment Letter** — To Civil Hospital for examination
3. **Remand Request Letter** — Police custody application for Magistrate
4. **Seizure Receipt** — Panchanama of seized evidence
5. **Court Custody Letter** — Production of accused before Magistrate
6. **Accused Panchanama** — Arrest panchanama with physical details
7. **Accused Face Identification Form** — Identification parade form

---

## ⚖️ Legal Intelligence

AI analyzes incident narratives and suggests sections from:
- **BNS 2023** (Bharatiya Nyaya Sanhita) — replaces IPC
- **BNSS 2023** (Bharatiya Nagarik Suraksha Sanhita) — replaces CrPC
- **BSA 2023** (Bharatiya Sakshya Adhiniyam) — replaces Evidence Act
- **NDPS Act**, **IT Act**, **DV Act**, and more

---

## 🔒 Security

- JWT authentication (8h expiry)
- Helmet.js security headers
- Rate limiting (200 req / 15 min)
- CORS restricted to frontend URL
- Audit trail for all document operations

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Zustand, i18next |
| Styling | Vanilla CSS (glassmorphism dark theme) |
| Backend | Node.js, Express.js |
| Auth | JWT + bcryptjs |
| AI/NLP | Rule-based + keyword classifier (OpenAI-ready) |
| Localization | i18next (EN/HI/GU) |
| Deployment | Vercel (frontend) + Railway (backend) |

---

## 📦 Project Structure

```
crimegpt-frontend/src/
├── components/Layout/    # Sidebar, Topbar, Layout shell
├── pages/
│   ├── Login/           # Officer authentication
│   ├── Dashboard/       # Stats, recent cases, quick actions
│   ├── NewCase/         # 6-step case registration wizard
│   ├── CaseDetail/      # Full case view
│   ├── Documents/       # 7 document types with preview
│   ├── LegalIntelligence/ # AI section suggester
│   ├── CaseDiary/       # Investigation timeline
│   ├── SearchAudit/     # Search + audit trail
│   └── Settings/        # Language, profile, notifications
├── store/useStore.js    # Zustand global state
├── data/mockData.js     # BNS/BNSS/BSA dataset
└── i18n/config.js       # EN/HI/GU translations
```

---

*Built for Gujarat Police Department — CrimeGPT v1.0.0*
