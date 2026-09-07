# CampusConnect AI — Agent Handoff & Work Log

## Purpose of This File

This file serves two purposes:

1. **Agent Handoff Instructions** — Any new agent picking up this project MUST read this file first. It contains a complete, always-current picture of what exists, what works, and what still needs to be done. You do NOT need to re-read the full concept/plan files to get started — this file summarizes everything actionable.

2. **Work Log** — Every agent that completes work appends a dated entry at the bottom of this file under the `## Change Log` section. This creates a reliable audit trail.

---

## MANDATORY FIRST STEPS FOR ANY NEW AGENT

Before touching any file, do the following in order:

1. Read this file completely.
2. Run `Get-ChildItem -Recurse -Depth 2` on the project root to confirm current file state.
3. Start the backend: `cd backend && node server.js`
4. Verify it is alive: `GET http://localhost:5000/api/health`
5. Start the frontend: `cd frontend && npm run dev`
6. Verify: open `http://localhost:5173` in a browser or send a GET request.
7. Read the two planning documents only if you need deeper architectural context:
   - `CAMPUSCONNECT_AI_PROJECT_CONCEPT.md`
   - `CAMPUSCONNECT_AI_IMPLEMENTATION_PLAN.md`

---

## Project Identity

| Field            | Value                                            |
|------------------|--------------------------------------------------|
| Project name     | CampusConnect AI                                 |
| Type             | TY B.Tech Computer Engineering Mini Project      |
| Target campus    | Sanjivani College of Engineering, Kopargaon      |
| Academic year    | 2026–2027                                        |
| Team size        | 4 students                                       |

---

## Directory Structure (as of 2026-08-31)

```
CampusConnect/
├── CAMPUSCONNECT_AI_IMPLEMENTATION_PLAN.md   (phase checklist)
├── CAMPUSCONNECT_AI_PROJECT_CONCEPT.md       (full concept doc)
├── AGENT_HANDOFF.md                          (THIS FILE — update after every session)
├── README.md                                 (project readme)
├── .gitignore
│
├── backend/                                  (Node.js + Express — port 5000)
│   ├── server.js                             (main app, all routes registered)
│   ├── package.json                          (name: campusconnect-backend)
│   ├── .env                                  (PORT, FRONTEND_URL, ADMIN_*, GEMINI_API_KEY)
│   ├── .gitignore
│   ├── routes/
│   │   ├── locations.js      GET /api/locations, /api/locations/search?q=, /api/locations/:id
│   │   ├── buildings.js      GET /api/buildings, /api/buildings/:id
│   │   ├── departments.js    GET /api/departments
│   │   ├── faculty.js        GET /api/faculty, /api/faculty/search?q=
│   │   ├── navigation.js     GET /api/navigation/nodes|edges, POST /api/navigation/route
│   │   ├── panoramas.js      GET /api/navigation/panoramas, /api/navigation/panoramas/:id
│   │   ├── chat.js           POST /api/chat
│   │   ├── auth.js           POST /api/auth/login, /api/auth/verify
│   │   └── admin.js          GET|POST|PUT|DELETE /api/admin/* (requires Bearer token)
│   ├── services/
│   │   ├── dataStore.js      reads/writes all JSON files from /data/
│   │   ├── navigationEngine.js  BFS pathfinding, calculateRoute(), getNodeForLocation()
│   │   └── intentService.js  rule-based NLP, processQuery(), detectIntent()
│   └── middleware/
│       └── requireAdmin.js   Bearer token auth check for admin routes
│
├── frontend/                                 (React + Vite + Tailwind — port 5173)
│   ├── vite.config.js        (proxy: /api → http://localhost:5000)
│   ├── package.json
│   ├── src/
│   │   ├── main.jsx          (BrowserRouter + Toaster)
│   │   ├── App.jsx           (all routes defined here)
│   │   ├── index.css         (Tailwind import)
│   │   ├── services/
│   │   │   └── api.js        (campusAPI object — all fetch calls)
│   │   └── pages/
│   │       ├── WelcomePage.jsx        / — landing screen
│   │       ├── AssistantPage.jsx      /assistant — chat UI + voice
│   │       ├── DestinationPage.jsx    /destination — location + route
│   │       ├── NavigationPage.jsx     /navigate — panorama viewer
│   │       ├── ReachedPage.jsx        /reached — destination completion
│   │       ├── QRPage.jsx             /qr — QR code generator
│   │       ├── AdminLoginPage.jsx     /admin — login
│   │       └── AdminDashboard.jsx     /admin/dashboard — manage data
│   └── public/
│       └── panoramas/
│           ├── sample-outdoor.svg
│           ├── sample-indoor.svg
│           ├── sample-corridor.svg
│           ├── sample-office.svg
│           └── sample-staircase.svg
│
└── data/                                     (JSON — source of truth)
    ├── buildings.json          3 buildings
    ├── floors.json             6 floors
    ├── locations.json          12 locations with aliases (DEMO DATA)
    ├── departments.json        3 departments
    ├── faculty.json            2 faculty (DEMO DATA)
    ├── navigation-nodes.json   16 nav graph nodes
    ├── navigation-edges.json   30 directed edges with instructions
    └── panoramas.json          11 panoramas with hotspot definitions
```

---

## Credentials & Configuration

| Item               | Value                        |
|--------------------|------------------------------|
| Admin username     | `admin`                      |
| Admin password     | `campusconnect2026`          |
| Backend port       | 5000                         |
| Frontend port      | 5173                         |
| Backend `.env` key | `GEMINI_API_KEY` (empty — Phase 10) |
| Admin token type   | Base64 encoded `username:timestamp` (simple, not JWT) |

All credentials except `GEMINI_API_KEY` are in `backend/.env`. Never commit `.env` to git.

---

## Demo Navigation Routes (working)

**Route 1 — Admission Enquiry:**
```
Main Gate → Reception → Admin Building Entrance → Ground Floor Corridor → Admission Office
(5 steps, 145m estimated)
```

**Route 2 — Computer Engineering HOD:**
```
Main Gate → Reception → Main Building Entrance → Main Staircase → First Floor Corridor → Computer Dept → HOD Cabin
(7 steps)
```

---

## Phase Completion Status

| Phase | Description                            | Status     |
|-------|----------------------------------------|------------|
| 0     | Workspace inspection & planning        | ✅ Done     |
| 1     | Application foundation                 | ✅ Done     |
| 2     | Professional visitor UI (5 screens)    | ✅ Done     |
| 3     | Campus data layer (JSON + REST APIs)   | ✅ Done     |
| 4     | Destination search & basic chat        | ✅ Done     |
| 5     | Campus navigation engine (BFS)         | ✅ Done     |
| 6     | Route result UI                        | ✅ Done     |
| 7     | 360° virtual tour (placeholder panos)  | ✅ Done     |
| 8     | Routing connected to 360° navigation   | ✅ Done     |
| 9     | QR code entry page                     | ✅ Done     |
| 10    | AI/LLM integration (Gemini/OpenAI)     | ⏳ Pending  |
| 11    | Voice support (speech-to-text TTS)     | ⏳ Pending (basic mic UI done in Phase 2) |
| 12    | Admin management panel                 | ✅ Done (basic — locations + faculty CRUD) |
| 13    | Real campus data preparation           | ⏳ Pending (needs physical verification)  |
| 14    | Real 360° campus photos                | ⏳ Pending (needs physical capture)       |
| 15    | Error handling & fallbacks             | ⏳ Partial (basic fallbacks exist)        |
| 16    | Full testing                           | ⏳ Pending  |
| 17    | Security review                        | ⏳ Pending  |
| 18    | Deployment preparation                 | ⏳ Pending  |
| 19    | Final demo preparation                 | ⏳ Pending  |
| 20    | Documentation                          | ⏳ Pending  |
| 21    | Final quality gate                     | ⏳ Pending  |

---

## Known Limitations & Issues

1. **Panoramas are SVG placeholders** — not real 360° images. The navigation UI shows them as flat images. Pannellum was installed but the current viewer is a simplified step-through navigator. Phase 14 requires actual 360° JPEG/JPEG equirectangular images.
2. **Admin token is simple Base64** — not a proper JWT. Sufficient for a student prototype. Phase 17 should harden this before any real deployment.
3. **Voice input** — browser Web Speech API is wired up in `AssistantPage.jsx` but only works in Chrome/Edge on HTTPS or localhost.
4. **All campus data is DEMO** — clearly marked `[DEMO DATA]`. Must not be presented as verified Sanjivani College information.
5. **No database** — data is stored in JSON files in `/data/`. Concurrent writes from multiple admin sessions could cause race conditions. Acceptable for prototype/demo.
6. **AI/LLM (Phase 10)** — `GEMINI_API_KEY` in `.env` is empty. The chat uses rule-based intent matching only. To enable AI: add the key and create `backend/services/aiService.js` that calls the Gemini API, then update `routes/chat.js` to use it with fallback to the rule-based system.

---

## How to Add Real 360° Panoramas (Phase 14)

1. Capture equirectangular 360° JPEGs at each navigation node location.
2. Name them consistently, e.g., `main-gate.jpg`, `reception.jpg`.
3. Place them in `frontend/public/panoramas/`.
4. Update `data/panoramas.json` — change each `imageUrl` to the new filename.
5. Optionally integrate Pannellum properly in `NavigationPage.jsx` (the npm package is already installed).

---

## How to Enable AI (Phase 10)

1. Get a Gemini API key from Google AI Studio.
2. Add it to `backend/.env`: `GEMINI_API_KEY=your-key-here`
3. Create `backend/services/aiService.js`:
   - Accept a user query
   - Call Gemini with a system prompt that includes the campus data context
   - Return structured JSON: `{ intent, entity, needsNavigation }`
4. Update `backend/routes/chat.js` to call `aiService` first, fall back to `intentService` on failure.
5. Never let the LLM invent campus facts — always retrieve location from data after intent extraction.

---

## How to Run for Development

```powershell
# Backend (from project root)
cd backend
npm run dev        # uses node --watch server.js

# Frontend (from project root, separate terminal)
cd frontend
npm run dev
```

**URLs:**
- Visitor app: `http://localhost:5173/`
- AI Assistant: `http://localhost:5173/assistant`
- QR Code page: `http://localhost:5173/qr`
- Admin login:  `http://localhost:5173/admin`
- API health:   `http://localhost:5000/api/health`

---

## Quick API Reference

```
GET  /api/health
GET  /api/locations
GET  /api/locations/search?q=<query>
GET  /api/locations/:id
GET  /api/buildings
GET  /api/departments
GET  /api/faculty
GET  /api/navigation/nodes
GET  /api/navigation/edges
POST /api/navigation/route          { startNodeId, locationId }
GET  /api/navigation/panoramas
GET  /api/navigation/panoramas/:id
POST /api/chat                      { message, startNodeId? }
POST /api/auth/login                { username, password }
POST /api/auth/verify               { token }
GET  /api/admin/stats               (Bearer token required)
GET  /api/admin/locations           (Bearer token required)
POST /api/admin/locations           (Bearer token required)
PUT  /api/admin/locations/:id       (Bearer token required)
DEL  /api/admin/locations/:id       (Bearer token required)
GET  /api/admin/faculty             (Bearer token required)
POST /api/admin/faculty             (Bearer token required)
DEL  /api/admin/faculty/:id         (Bearer token required)
```

---

## Development Rules (from original spec — still apply)

- Never invent real room numbers, faculty names, or campus facts.
- Always use `[DEMO DATA]` label on mock campus information.
- Keep API keys in `backend/.env` only — never in frontend source.
- Keep the application runnable after every change.
- Test each feature before marking it complete.
- Update this file (`AGENT_HANDOFF.md`) before ending any session.

---

## Change Log

---

### 2026-08-31 14:55 IST — Phases 0–9 + 12 Initial Implementation

**Agent:** Antigravity (Claude Sonnet 4.6)

**Completed:**
- Phase 0: Workspace inspected. Only two planning `.md` files existed. Full project created from scratch.
- Phase 1: Backend (Express.js) + Frontend (React + Vite + Tailwind CSS) scaffolded and running.
- Phase 2: All 5 visitor screens built — Welcome, Assistant (chat), Destination, Navigation (360°), Reached.
- Phase 3: All campus data JSON files created (`buildings`, `floors`, `locations`, `departments`, `faculty`, `navigation-nodes`, `navigation-edges`, `panoramas`). Full REST API layer built.
- Phase 4: Rule-based intent engine (`intentService.js`) — detects `FIND_LOCATION`, `FIND_FACULTY`, `FIND_DEPARTMENT`, `FIND_SERVICE`, `GENERAL_INFORMATION`, `UNKNOWN`. Chat route wired up and tested.
- Phase 5: BFS pathfinding in `navigationEngine.js`. Both demo routes verified with correct node sequences and human-readable step instructions.
- Phase 6: Route result UI in `DestinationPage.jsx` — shows destination details, step count, distance, numbered instructions, and "Start 360° Navigation" button.
- Phase 7: Panorama viewer in `NavigationPage.jsx` — step-through navigation with directional arrows, progress bar, current location label, instruction display. Five SVG placeholder panoramas created.
- Phase 8: Full routing → 360° navigation chain connected. Route from chat → destination card → step-through panorama viewer → "Arrived" → ReachedPage.
- Phase 9: QR code page at `/qr` using `qrcode.react`. Auto-generates scannable QR for the visitor entry URL.
- Phase 12: Admin panel — login, dashboard with stats, location list with add/delete, faculty list. Protected by Bearer token.

**Verification results (all passed):**
- Health endpoint: OK
- Library search: returns "Central Library"
- Chat "Where is the admission office?": intent=FIND_LOCATION, destination found
- Chat "I want to pay fees": intent=FIND_SERVICE, destination=Accounts Office
- Chat "Find the Computer department": destination found
- Unknown query: handled gracefully, no crash
- Admission route: 5 steps, 145m
- HOD route: 7 steps
- Admin login: success
- Frontend HTTP 200: OK
- Production build: clean, 302KB bundle, no errors

**Known limitations after this session:**
- Panoramas are SVG placeholders, not real 360° images.
- Phase 10 (AI/LLM) not started — Gemini API key needed from team.
- Phase 13–14 depend on physical campus data collection.
- Admin token is simple Base64, not JWT.

**Next recommended phase:** Phase 10 (AI/LLM integration) or Phase 13 (real campus data).

---

<!-- APPEND NEW ENTRIES BELOW THIS LINE — DO NOT DELETE EXISTING ENTRIES -->
