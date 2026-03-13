# 🎓 International Student Platform

A full-stack web app where international students can post and browse **Housing**, **Ride Sharing**, **Jobs**, and **Community** listings — all powered by one unified posting system.

## 📁 Project Structure

```
student-platform/
├── backend/          # Node.js + Express REST API
│   └── src/
│       ├── config/       # DB, Firebase, Cloudinary
│       ├── controllers/  # Business logic
│       ├── middleware/   # Auth, validation, errors
│       ├── models/       # Mongoose schemas
│       ├── routes/       # Express routers
│       └── utils/        # Helpers
│
└── frontend/         # React + Tailwind CSS
    └── src/
        ├── components/   # Reusable UI pieces
        ├── context/      # Auth & state context
        ├── hooks/        # Custom React hooks
        ├── pages/        # Full page views
        ├── services/     # API calls
        └── utils/        # Constants, helpers
```

## 🛠 Tech Stack
- **Frontend**: React.js + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: MongoDB Atlas
- **Auth**: Firebase Authentication
- **Images**: Cloudinary
- **Hosting**: Vercel (frontend) + Railway (backend)

## 🚀 Quick Start

### Backend
```bash
cd backend
npm install
cp .env.example .env   # fill in your credentials
npm run dev            # runs on http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env   # fill in your credentials
npm start              # runs on http://localhost:3000
```

## 📅 Build Timeline
| Month | Weeks | Focus |
|-------|-------|-------|
| 1 | 1–4 | Setup, Auth, Core Posting, Basic UI |
| 2 | 5–8 | Custom Fields, Search/Filter, Messaging, Profiles |
| 3 | 9–12 | Testing, Polish, Security, Deploy |
