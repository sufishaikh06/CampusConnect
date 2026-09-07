# CampusConnect AI

**Intelligent Visitor Assistance & 360° Indoor Campus Navigation System**

TY B.Tech Computer Engineering Mini Project — Sanjivani College of Engineering, Kopargaon

---

## Quick Start

### 1. Start the backend

```bash
cd backend
npm install
npm run dev
```

Backend runs on: http://localhost:5000  
Health check: http://localhost:5000/api/health

### 2. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: http://localhost:5173

---

## Project Structure

```
CampusConnect/
├── frontend/        React + Vite + Tailwind CSS
├── backend/         Node.js + Express.js
├── data/            JSON campus data (mock/demo)
├── docs/            Documentation
└── README.md
```

---

## Features (Phase-by-phase)

- [x] Phase 0 — Workspace inspection
- [x] Phase 1 — Application foundation (React + Express)
- [x] Phase 2 — Professional visitor UI (5 screens)
- [x] Phase 3 — Campus data layer (JSON + REST APIs)
- [x] Phase 4 — Destination search & basic chat (intent engine)
- [x] Phase 5 — Campus navigation engine (BFS pathfinding)
- [x] Phase 6 — Route result UI
- [x] Phase 7 — 360° virtual tour (placeholder panoramas)
- [x] Phase 8 — Connected routing + 360° navigation
- [ ] Phase 9 — QR code entry
- [ ] Phase 10 — AI/LLM integration
- [ ] Phase 11 — Voice support
- [ ] Phase 12 — Admin management panel (basic done)

---

## Demo Routes

```
Main Gate → Reception → Admin Building → Corridor → Admission Office
Main Gate → Reception → Main Building → Staircase → First Floor → Computer Dept → HOD Cabin
```

---

## Admin Panel

URL: http://localhost:5173/admin  
Default credentials: `admin` / `campusconnect2026`

---

## Tech Stack

| Layer    | Technology          |
|----------|---------------------|
| Frontend | React + Vite + Tailwind CSS |
| Backend  | Node.js + Express.js |
| Data     | JSON (prototype) |
| Routing  | React Router |
| Icons    | Lucide React |
| 360°     | Panorama viewer (Phase 7) |

---

**Note:** All campus data is clearly marked as [DEMO DATA]. Do not present sample values as verified college information.
