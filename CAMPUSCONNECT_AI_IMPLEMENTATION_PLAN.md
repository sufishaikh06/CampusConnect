# CampusConnect AI --- Phase-by-Phase Implementation Plan

## Purpose of This File

This file is the **execution checklist** for building the CampusConnect
AI prototype.

The development agent must first read:

**`CAMPUSCONNECT_AI_PROJECT_CONCEPT.md`**

That file explains the complete project concept, architecture, modules,
data model, navigation concept, 360° system, and product vision.

This file explains **what to build, in what order, and how to verify
it**.

------------------------------------------------------------------------

# Development Rules

-   [ ] Read `CAMPUSCONNECT_AI_PROJECT_CONCEPT.md` completely before
    starting.
-   [ ] Inspect the existing workspace before creating files.
-   [ ] Do not delete or overwrite existing work without understanding
    it.
-   [ ] Keep the application runnable after every phase.
-   [ ] Work only on the current phase unless a dependency requires
    otherwise.
-   [ ] Use mock/sample campus data until verified college data is
    supplied.
-   [ ] Never invent real room numbers, faculty cabins, or campus facts
    and present them as verified.
-   [ ] Keep API keys and secrets in environment variables.
-   [ ] Do not put private API keys in frontend source code.
-   [ ] Prefer modular, simple, maintainable implementation.
-   [ ] Test each feature before marking its task complete.
-   [ ] Mark a task from `[ ]` to `[1]` only after it has been
    implemented **and verified**.
-   [ ] Do not mark parent tasks complete if important child tasks
    remain incomplete.
-   [ ] At the end of every phase, provide a short implementation
    summary and list any blockers.
-   [ ] Do not implement advanced future-scope features unless
    explicitly instructed.

------------------------------------------------------------------------

# Phase 0 --- Workspace Inspection & Project Planning

## Goal

Understand the current workspace and establish a safe development
baseline.

### Tasks

-   [ ] Inspect all existing project files.
-   [ ] Determine whether a frontend/backend already exists.
-   [ ] Identify package manager and existing dependencies.
-   [ ] Check whether Git is initialized.
-   [ ] Read existing README/documentation.
-   [ ] Identify any existing build or run commands.
-   [ ] Create a backup/branch if appropriate.
-   [ ] Decide the final project structure without unnecessarily
    restructuring existing working code.
-   [ ] Create/update the project README with the project purpose.

### Verification

The agent must be able to explain:

-   What files already exist.
-   How the application currently runs.
-   Which parts can be reused.
-   What needs to be created.

### Completion condition

The workspace is understood and a safe development baseline exists.

------------------------------------------------------------------------

# Phase 1 --- Application Foundation

## Goal

Create a clean, runnable foundation for CampusConnect AI.

### Suggested stack

Frontend:

-   React
-   Vite
-   Tailwind CSS

Backend:

-   Node.js
-   Express.js

If the existing project uses an equivalent stack, do not replace it
unnecessarily.

### Tasks

-   [ ] Create/configure frontend.
-   [ ] Create/configure backend.
-   [ ] Configure development scripts.
-   [ ] Configure environment variables.
-   [ ] Create basic API health endpoint.
-   [ ] Create frontend-to-backend connection.
-   [ ] Configure routing.
-   [ ] Establish reusable UI components.
-   [ ] Create error/loading states.
-   [ ] Confirm application works locally.

### Suggested structure

``` text
campusconnect-ai/
├── frontend/
├── backend/
├── data/
├── public/
├── docs/
└── README.md
```

### Verification

-   [ ] Frontend starts successfully.
-   [ ] Backend starts successfully.
-   [ ] Health endpoint responds.
-   [ ] Frontend can communicate with backend.
-   [ ] No critical console/build errors.

------------------------------------------------------------------------

# Phase 2 --- Professional Visitor UI

## Goal

Build the user-facing interface before integrating complex AI
functionality.

### Required screens

-   [ ] Welcome/Landing screen.
-   [ ] AI Assistant screen.
-   [ ] Destination Result screen.
-   [ ] Navigation screen.
-   [ ] Destination Reached screen.

### UI requirements

-   [ ] Mobile-first responsive design.
-   [ ] Professional college/campus visual identity.
-   [ ] Clear typography.
-   [ ] Clear navigation.
-   [ ] Accessible buttons and controls.
-   [ ] Loading states.
-   [ ] Error states.
-   [ ] Empty states.
-   [ ] Smooth transitions where useful.

### Welcome screen

Include:

``` text
CampusConnect AI
Intelligent Visitor Assistance

Welcome to Sanjivani College of Engineering

[ Start Navigation ]
```

### AI screen

Include:

-   Chat messages.
-   User input.
-   Send button.
-   Optional microphone button.
-   Suggested destinations.

### Verification

Test on:

-   [ ] Desktop browser.
-   [ ] Mobile-size viewport.
-   [ ] Different screen widths.

Do not proceed until the basic interface is stable.

------------------------------------------------------------------------

# Phase 3 --- Campus Data Layer

## Goal

Create the source of truth for campus information.

Initially use local JSON or equivalent structured mock data.

### Create datasets

-   [ ] Buildings.
-   [ ] Floors.
-   [ ] Locations.
-   [ ] Departments.
-   \[Faculty.
-   [ ] Navigation nodes.
-   [ ] Navigation edges.
-   [ ] Panorama metadata.

### Sample data

Use clearly marked demo data.

Example:

``` json
{
  "id": "demo-admission-office",
  "name": "Admission Office",
  "building": "Administration Building",
  "floor": "Ground Floor",
  "room": "102",
  "aliases": [
    "admission",
    "admission office",
    "admission enquiry"
  ]
}
```

Do not claim sample values are actual college data.

### Backend APIs

Create APIs such as:

``` text
GET /api/locations
GET /api/locations/:id
GET /api/search?q=
GET /api/buildings
GET /api/departments
GET /api/faculty
```

### Verification

-   [ ] Search returns matching locations.
-   [ ] Location details are correct according to the mock dataset.
-   [ ] Unknown searches return a controlled response.
-   [ ] Data is not duplicated unnecessarily.

------------------------------------------------------------------------

# Phase 4 --- Destination Search & Basic Chat

## Goal

Make the application understand simple visitor requests without
depending on an external LLM yet.

### Tasks

-   [ ] Create chat message model.
-   [ ] Implement destination keyword/alias matching.
-   [ ] Implement intent categories.
-   [ ] Support common requests.
-   [ ] Return structured destination results.
-   [ ] Implement clarification for ambiguous requests.
-   [ ] Implement "not found" response.

### Example intents

``` text
FIND_LOCATION
FIND_FACULTY
FIND_DEPARTMENT
FIND_SERVICE
GENERAL_INFORMATION
UNKNOWN
```

### Example

Input:

``` text
Where is the library?
```

Output:

``` text
Intent: FIND_LOCATION
Destination: Library
```

### Verification

Test at least:

-   [ ] "Where is the library?"
-   [ ] "I want to pay fees."
-   [ ] "Where is the admission office?"
-   [ ] "Find the Computer department."
-   [ ] Unknown query.
-   [ ] Ambiguous query.

------------------------------------------------------------------------

# Phase 5 --- Campus Navigation Engine

## Goal

Convert destination selection into a valid route.

### Tasks

-   [ ] Define navigation graph structure.
-   [ ] Create demo navigation nodes.
-   [ ] Create graph edges.
-   [ ] Store direction information.
-   [ ] Store optional distance/weight.
-   [ ] Implement shortest-path algorithm.
-   [ ] Return ordered navigation nodes.
-   [ ] Generate human-readable instructions.

### Initial graph

Use a small complete demo route:

``` text
Main Gate
→ Reception
→ Administration Entrance
→ Ground Floor Corridor
→ Admission Office
```

Add another:

``` text
Main Gate
→ Reception
→ Main Building
→ Staircase
→ First Floor Corridor
→ Computer Department
→ HOD Cabin
```

### Routing response

The backend should return something like:

``` json
{
  "start": "main-gate",
  "destination": "admission-office",
  "route": [
    "main-gate",
    "reception",
    "admin-entrance",
    "admin-corridor",
    "admission-office"
  ],
  "instructions": [
    "Proceed straight to Reception.",
    "Enter the Administration Building.",
    "Continue along the corridor.",
    "Admission Office is ahead."
  ]
}
```

### Verification

-   [ ] Valid route generated.
-   [ ] Route order is correct.
-   [ ] No impossible edge is used.
-   [ ] Unknown destination handled.
-   [ ] No-route condition handled.
-   [ ] Route can be displayed by frontend.

------------------------------------------------------------------------

# Phase 6 --- Route Result UI

## Goal

Make the generated route understandable before adding 360° navigation.

### Tasks

-   [ ] Show current/start location.
-   [ ] Show destination.
-   [ ] Show building.
-   [ ] Show floor.
-   [ ] Show room if available.
-   [ ] Show route steps.
-   [ ] Show estimated distance if available.
-   [ ] Show "Start 360° Navigation".
-   [ ] Show fallback text directions if 360° data is unavailable.

### Verification

For at least two demo destinations:

-   [ ] Destination details appear.
-   [ ] Route appears.
-   [ ] Route steps are understandable.
-   [ ] Navigation button works.

------------------------------------------------------------------------

# Phase 7 --- 360° Virtual Tour Engine

## Goal

Implement the core Google-Street-View-like virtual navigation
experience.

### Technology

Use one supported 360° viewer such as:

-   Pannellum
-   Marzipano
-   Photo Sphere Viewer

Choose one and keep the implementation consistent.

### Tasks

-   [ ] Integrate the 360° viewer.
-   [ ] Load a sample panorama.
-   [ ] Allow rotation.
-   [ ] Allow zoom.
-   [ ] Create panorama node model.
-   [ ] Create hotspot model.
-   [ ] Add directional hotspots.
-   [ ] Connect panorama A to panorama B.
-   [ ] Load the target panorama when a hotspot is clicked.
-   [ ] Display current navigation node.
-   [ ] Provide exit/back navigation.

### Example

``` text
Reception 360°
      |
      | Forward
      v
Corridor 360°
      |
      | Left
      v
Admin Building 360°
```

### Important

Do not wait for actual college 360° photographs.

Use sample/test panoramas first.

### Verification

-   [ ] Panorama loads.
-   [ ] User can look around.
-   [ ] Hotspots are visible.
-   [ ] Clicking a hotspot loads another panorama.
-   [ ] Back/exit works.
-   [ ] No broken image causes the application to crash.

------------------------------------------------------------------------

# Phase 8 --- Connect Routing With 360° Navigation

## Goal

Combine the pathfinding engine and 360° viewer.

### Tasks

-   [ ] Route engine returns ordered panorama nodes.
-   [ ] Navigation screen receives route.
-   [ ] Viewer starts at the correct panorama.
-   [ ] Only valid next navigation options are highlighted where
    practical.
-   [ ] Current node is displayed.
-   [ ] Destination node is detected.
-   [ ] Destination completion screen appears.
-   [ ] User can restart navigation.

### Example

``` text
AI
 ↓
Admission Office
 ↓
Route
 ↓
[Reception 360°]
      ↓
[Corridor 360°]
      ↓
[Admin Entrance 360°]
      ↓
[Admission Office 360°]
      ↓
Destination Reached
```

### Verification

-   [ ] Full route can be completed.
-   [ ] Panorama sequence matches route sequence.
-   [ ] Wrong/missing panorama is handled gracefully.
-   [ ] Destination completion works.

------------------------------------------------------------------------

# Phase 9 --- QR Code Entry

## Goal

Make the prototype accessible exactly as intended by the project
concept.

### Tasks

-   [ ] Create visitor entry URL.
-   [ ] Generate a QR code for the demo URL.
-   [ ] Implement start location parameter.
-   [ ] Read the start location on application load.
-   [ ] Default to Main Gate if no parameter is provided.
-   [ ] Display a QR scanning/demo instruction page if appropriate.

### Example concept

``` text
/app?start=main-gate
```

### Verification

-   [ ] QR code scans successfully.
-   [ ] Correct application opens.
-   [ ] Start location is initialized.
-   [ ] Navigation can begin without installing an app.

------------------------------------------------------------------------

# Phase 10 --- AI/LLM Integration

## Goal

Upgrade the rule-based destination understanding into an AI-assisted
conversational interface.

### Important architecture

Use:

``` text
User Query
   ↓
LLM/NLP
   ↓
Intent + Entity
   ↓
Backend Retrieval
   ↓
Verified Campus Data
   ↓
Route Engine
   ↓
AI Response
```

Do not allow the LLM to directly invent campus facts.

### Tasks

-   [ ] Create AI service abstraction.
-   [ ] Configure API key through environment variables.
-   [ ] Implement structured AI output.
-   [ ] Detect intent.
-   [ ] Extract destination/entity.
-   [ ] Retrieve matching campus record.
-   [ ] Generate natural-language response using retrieved data.
-   [ ] Handle API errors.
-   [ ] Handle rate limits.
-   [ ] Add fallback to local search.

### Structured response concept

``` json
{
  "intent": "FIND_LOCATION",
  "entity": "Admission Office",
  "needsNavigation": true
}
```

### Verification

Test:

-   [ ] Natural-language query.
-   [ ] Different wording for same destination.
-   [ ] Ambiguous query.
-   [ ] Unknown destination.
-   [ ] AI API failure.
-   [ ] API key missing.

------------------------------------------------------------------------

# Phase 11 --- Voice Support

## Goal

Add optional speech interaction.

### Tasks

-   [ ] Add microphone UI.
-   [ ] Implement browser speech recognition or suitable API.
-   [ ] Convert speech to text.
-   [ ] Send transcript to existing chat pipeline.
-   [ ] Display transcript.
-   [ ] Handle microphone permission denial.

Optional:

-   [ ] Text-to-speech response.

### Verification

-   [ ] Spoken query reaches chatbot.
-   [ ] Transcript is visible.
-   [ ] Permission failure is handled.

Voice is optional if it threatens the core MVP schedule.

------------------------------------------------------------------------

# Phase 12 --- Admin Management Panel

## Goal

Provide a basic administrative interface for maintaining campus data.

### Tasks

-   [ ] Admin login.
-   [ ] Admin dashboard.
-   [ ] Manage buildings.
-   [ ] Manage floors.
-   [ ] Manage locations.
-   [ ] Manage faculty.
-   [ ] Manage navigation nodes.
-   [ ] Manage navigation edges.
-   [ ] Manage panorama metadata.
-   [ ] Upload or register panorama references.
-   [ ] Edit destination aliases.

### Security

-   [ ] Protect admin routes.
-   [ ] Keep credentials/API secrets out of frontend code.
-   [ ] Validate admin input.

### Verification

-   [ ] Admin can log in.
-   [ ] Admin can add a demo location.
-   [ ] Visitor search can find the newly added location.
-   [ ] Admin can modify a location.
-   [ ] Visitor sees the updated information.

------------------------------------------------------------------------

# Phase 13 --- Real Campus Data Preparation

## Goal

Replace mock data gradually with verified Sanjivani College data.

### Data to collect

-   [ ] Building names.
-   [ ] Floor names/numbers.
-   [ ] Important offices.
-   [ ] Departments.
-   [ ] Laboratories.
-   [ ] Library.
-   [ ] Accounts/fee-related locations.
-   [ ] Admission-related locations.
-   [ ] Examination-related locations.
-   [ ] Faculty cabins where permitted.
-   [ ] Other important visitor facilities.
-   [ ] Actual route connections.
-   [ ] Starting points.

### Important rule

Do not add personal or sensitive information unless it is appropriate
and authorized for the project.

### Verification

Each important destination should be verified before being shown as
official data.

------------------------------------------------------------------------

# Phase 14 --- 360° Campus Data Collection

## Goal

Create the actual panorama network for the demonstration area.

### Tasks

-   [ ] Select the initial demonstration route.
-   [ ] Identify panorama capture points.
-   [ ] Capture 360° images.
-   [ ] Ensure adequate image quality.
-   [ ] Name images consistently.
-   [ ] Add panorama metadata.
-   [ ] Connect panoramas.
-   [ ] Set hotspot positions.
-   [ ] Test transitions.
-   [ ] Replace placeholder panoramas.

### Recommended first route

``` text
Main Gate
→ Reception
→ Administration Building
→ Corridor
→ Admission Office
```

Then:

``` text
Main Gate
→ Reception
→ Main Building
→ Staircase
→ First Floor
→ Computer Department
→ HOD Cabin
```

### Verification

A person unfamiliar with the route should be able to follow the virtual
navigation without needing the developer to explain every step.

------------------------------------------------------------------------

# Phase 15 --- Error Handling & Fallbacks

## Goal

Make the prototype robust.

### Tasks

-   [ ] Handle invalid API requests.
-   [ ] Handle empty search.
-   [ ] Handle unknown destination.
-   [ ] Handle ambiguous destination.
-   [ ] Handle unavailable route.
-   [ ] Handle missing panorama.
-   [ ] Handle AI service failure.
-   [ ] Handle network failure.
-   [ ] Handle invalid admin data.
-   [ ] Add user-friendly error messages.

### Fallback strategy

If 360° navigation is unavailable:

``` text
360° unavailable
      ↓
Show text directions
      ↓
Show destination details
```

If AI is unavailable:

``` text
AI unavailable
      ↓
Use campus keyword search
      ↓
Show matching locations
```

------------------------------------------------------------------------

# Phase 16 --- Testing

## Goal

Test the complete application as a visitor and administrator.

### Functional testing

-   [ ] QR access.
-   [ ] Chat.
-   [ ] Search.
-   [ ] Destination identification.
-   [ ] Route calculation.
-   [ ] 360° navigation.
-   [ ] Destination completion.
-   [ ] Admin login.
-   [ ] Data management.

### UI testing

-   [ ] Desktop.
-   [ ] Mobile.
-   [ ] Tablet.
-   [ ] Small-screen layout.
-   [ ] Touch interaction.

### Negative testing

-   [ ] Unknown destination.
-   [ ] Empty query.
-   [ ] Invalid URL.
-   [ ] Missing route.
-   [ ] Missing panorama.
-   [ ] API failure.
-   [ ] Unauthorized admin access.

### Performance

-   [ ] Optimize large panorama images.
-   [ ] Avoid unnecessary API calls.
-   [ ] Avoid unnecessary frontend re-renders.
-   [ ] Compress static assets where appropriate.
-   [ ] Check initial loading time.

------------------------------------------------------------------------

# Phase 17 --- Security Review

## Goal

Perform a basic security review appropriate for a student prototype.

### Tasks

-   [ ] Check that secrets are not committed.
-   [ ] Check `.env` is ignored by Git.
-   [ ] Protect admin endpoints.
-   [ ] Validate request parameters.
-   [ ] Validate uploaded file types if uploads are implemented.
-   [ ] Avoid exposing unnecessary database fields.
-   [ ] Review CORS configuration.
-   [ ] Review authentication/session handling.
-   [ ] Review error messages for accidental secret disclosure.

------------------------------------------------------------------------

# Phase 18 --- Deployment Preparation

## Goal

Prepare a demo deployment that can be accessed using a QR code.

### Tasks

-   [ ] Prepare production frontend build.
-   [ ] Prepare backend deployment.
-   [ ] Configure production environment variables.
-   [ ] Configure database if using MongoDB.
-   [ ] Test deployed API.
-   [ ] Test deployed frontend.
-   [ ] Generate final QR code.
-   [ ] Test QR code using multiple phones.
-   [ ] Confirm 360° assets load in production.

Possible hosting choices may include:

-   Vercel for frontend.
-   Render/Railway or similar for backend.
-   MongoDB Atlas for database.

Use whichever service is practical and available to the team.

------------------------------------------------------------------------

# Phase 19 --- Final Demo Preparation

## Goal

Prepare a reliable demonstration for the project guide/examiner.

### Demo flow

-   [ ] Show QR code.
-   [ ] Scan QR code using phone.
-   [ ] Show welcome screen.
-   [ ] Ask a natural-language question.
-   [ ] Show destination identification.
-   [ ] Show route.
-   [ ] Start 360° navigation.
-   [ ] Move through at least 3 panorama nodes.
-   [ ] Reach destination.
-   [ ] Demonstrate a second destination.
-   [ ] Show admin panel.
-   [ ] Modify/add a demo location.
-   [ ] Search the updated location from visitor interface.

### Demo script

Example:

> "I am a first-time visitor and want to meet the Computer Engineering
> HOD."

Then demonstrate:

``` text
AI understands request
        ↓
Finds HOD Cabin
        ↓
Retrieves verified location
        ↓
Calculates route
        ↓
Starts 360° navigation
        ↓
Visitor follows arrows
        ↓
Destination reached
```

------------------------------------------------------------------------

# Phase 20 --- Documentation

## Goal

Prepare all material required for the mini project.

### Tasks

-   [ ] Finalize project title.
-   [ ] Prepare abstract.
-   [ ] Prepare introduction.
-   [ ] Prepare problem statement.
-   [ ] Prepare objectives.
-   [ ] Prepare scope.
-   [ ] Prepare literature survey.
-   [ ] Prepare methodology.
-   [ ] Prepare system architecture.
-   [ ] Prepare module descriptions.
-   [ ] Prepare database design.
-   [ ] Prepare flowcharts.
-   [ ] Prepare screenshots.
-   [ ] Prepare testing results.
-   [ ] Prepare conclusion.
-   [ ] Prepare future scope.
-   [ ] Prepare references.
-   [ ] Update README.

The proposal template supplied for the project expects sections
including introduction/background, problem statement, objectives, scope,
literature survey, proposed methodology, modules, technologies,
requirements, outcomes, timeline, feasibility, SDG mapping, and
references. Keep the implementation documentation aligned with those
sections.

------------------------------------------------------------------------

# Phase 21 --- Final Quality Gate

Do not call the project complete until the following are verified.

## Core MVP

-   [ ] QR code opens the application.
-   [ ] Visitor can ask for a destination.
-   [ ] System identifies a destination.
-   [ ] Campus database provides destination details.
-   [ ] Navigation engine generates a route.
-   [ ] Route is displayed.
-   [ ] 360° viewer loads.
-   [ ] Hotspots move between panorama nodes.
-   [ ] Destination completion is shown.
-   [ ] Admin can manage basic campus data.

## Reliability

-   [ ] Unknown queries do not crash the app.
-   [ ] Missing panorama does not crash the app.
-   [ ] AI failure has a fallback.
-   [ ] Backend errors are handled.
-   [ ] Mobile UI is usable.

## Security

-   [ ] No secret/API key is exposed in frontend.
-   [ ] Admin operations are protected.
-   [ ] Input validation exists.

## Presentation

-   [ ] UI looks professional.
-   [ ] Demo route works from beginning to end.
-   [ ] QR code works on a real phone.
-   [ ] At least one real/approved campus route is demonstrated if
    available.
-   [ ] Project architecture can be explained by all four team members.

------------------------------------------------------------------------

# Task Completion Convention

Use this exact convention throughout the file:

``` text
[ ] = Not completed
[1] = Completed and verified
```

Do not use `[1]` simply because code was written.

A task is complete only when:

1.  Implementation exists.
2.  It runs.
3.  The intended behavior was tested.
4.  No known critical error remains.

------------------------------------------------------------------------

# Change Log

Whenever a major phase is completed, append a short entry:

``` text
## YYYY-MM-DD — Phase X Completed

Completed:
- ...
- ...

Verification:
- ...

Known limitations:
- ...

Next phase:
- ...
```

------------------------------------------------------------------------

# Final Instruction to the Development Agent

Build CampusConnect AI as a **working, demonstrable prototype first**,
not as an unnecessarily complicated production system.

The most important experience is:

``` text
SCAN QR
   ↓
OPEN CAMPUSCONNECT AI
   ↓
ASK WHERE TO GO
   ↓
AI UNDERSTANDS
   ↓
DESTINATION FOUND
   ↓
ROUTE GENERATED
   ↓
START 360° NAVIGATION
   ↓
FOLLOW CLICKABLE ARROWS
   ↓
DESTINATION REACHED
```

If a technically advanced feature threatens the reliability of this core
flow, prioritize the core flow.

Do not move to the next major phase until the current phase is
functional and verified.
