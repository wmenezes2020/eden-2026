# FAMA.LAB - Marketing Musical Platform

## 🌐 GitHub Repository
git@github.com:edenivabot/fama.lab.git

## 📁 Project Structure

This repository contains the complete FAMA.LAB platform:

### 1. `fama_lab/` - Backend API (NestJS)
- RESTful API with JWT authentication
- MySQL database with TypeORM
- Role-based access control (admin, artist, fan)
- File uploads for media content

### 2. `fama_lab_frontend/` - Portal Web (Next.js)
- Modern responsive design
- Dark theme with gold accents
- Dashboard for artists and managers
- Public artist profiles

### 3. `fama_lab_app/` - Mobile App (Cordova)
- "BATEU, CURTIU" branded app
- Music/video streaming
- Fan rewards system
- Background playback support

### 4. `fama_lab_brand/` - Brand Identity
- Logo files (SVG)
- App icons
- Brand guidelines
- Color palette

## 🚀 Quick Start

### Backend
```bash
cd fama_lab
npm install
npm run start:dev
```

### Frontend
```bash
cd fama_lab_frontend
npm install
npm run dev
```

### App
```bash
cd fama_lab_app
npm install
cordova run android
```

## 📝 License
MIT
