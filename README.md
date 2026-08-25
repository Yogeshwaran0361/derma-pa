# 🩺 DermaVision AI — Patient Web Application (Production Deployment)

This is the official, production-ready Patient Web Application repository for **DermaVision AI**.

---

## 🚀 Quick Start (Local Setup)

### 1. Prerequisites
- **Node.js**: `v18.0.0` or higher (`v20.x` recommended)
- **NPM**: `v9.x` or higher

### 2. Installation
```bash
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env` and fill in your production credentials:
```bash
cp .env.example .env
```

### 4. Local Development Server
```bash
npm run dev
```

### 5. Production Build
```bash
npm run build
```

---

## ☁️ Deployment Instructions for Vercel

1. **Push to GitHub**: Push this clean repository (`DermaVision_Patient_Vercel`) to GitHub.
2. **Import to Vercel**: Connect your GitHub repository to Vercel.
3. **Build Settings**:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Node.js Version**: `20`
4. **Environment Variables**: Add all environment variables listed in `.env.example` under **Vercel Project Settings $\rightarrow$ Environment Variables**.
5. **Firebase Authorized Domains**: Add your Vercel deployment domain (e.g. `your-app.vercel.app`) in **Firebase Console $\rightarrow$ Authentication $\rightarrow$ Settings $\rightarrow$ Authorized Domains**.

---

## 🛠️ Architecture & Technologies Used
- **Frontend Engine**: React 19 + Vite 6 + TypeScript 5
- **Styling**: Tailwind CSS v4 + Lucide React Icons
- **Database & Authentication**: Firebase Firestore & Firebase Auth
- **Notification Services**: EmailJS Browser API
- **AI Backend Communication**: REST API endpoints connecting to FastAPI PyTorch inference server (`/predict`, `/quality-check`, `/health`).
