# CampusConnect AI --- Complete Project Concept & Technical Specification

## 1. Project Identity

**Project Name:** CampusConnect AI\
**Full Title:** CampusConnect AI -- Intelligent Visitor Assistance and
360° Indoor Campus Navigation System\
**Project Type:** TY B.Tech Computer Engineering Mini Project\
**Target Campus:** Sanjivani College of Engineering, Kopargaon\
**Academic Year:** 2026--2027\
**Team Size:** 4 students

------------------------------------------------------------------------

## 2. Executive Summary

CampusConnect AI is a web-based intelligent visitor assistance system
designed for first-time visitors of a college campus. Parents, students,
admission seekers, guests, recruiters, vendors, and other visitors may
not know the location of departments, offices, classrooms, laboratories,
faculty cabins, fee counters, libraries, or other facilities.

The system provides a simple entry point through a QR code placed at the
campus entrance. After scanning the QR code, the visitor opens the
CampusConnect AI web application in a mobile browser without installing
an application.

The visitor can communicate with the system using natural-language
queries such as:

-   "Where is the admission office?"
-   "I want to pay my fees."
-   "Where is the Computer Engineering department?"
-   "I want to meet the HOD."
-   "Where is the library?"
-   "Where is the examination cell?"

The AI layer interprets the visitor's request and identifies the
intended destination. A structured campus information database provides
the authoritative location information. A campus navigation engine then
determines a route from the visitor's current/starting point to the
selected destination.

The distinguishing feature of CampusConnect AI is the 360° virtual
navigation experience. Instead of showing only a conventional map, the
system can display connected panoramic views of the campus. These views
are connected through directional hotspots/arrows. The visitor can click
the appropriate arrow to move to the next panorama, creating a
Google-Street-View-like indoor campus tour.

The project is intended to be implemented initially as a controlled
prototype for Sanjivani College of Engineering. The first version should
prioritize a reliable demonstration of the complete concept over
advanced real-time indoor positioning.

------------------------------------------------------------------------

## 3. Problem Being Solved

A visitor entering an unfamiliar college campus generally does not know:

-   Which building contains a required service.
-   Which floor a destination is on.
-   Which room/cabin to visit.
-   Which corridor, staircase, lift, or entrance to use.
-   How to reach the destination without repeatedly asking other people.

Current manual guidance depends heavily on security personnel, students,
faculty, or staff. This can be inconvenient, especially during admission
periods, examinations, events, parent visits, or busy administrative
hours.

CampusConnect AI addresses this gap by providing a digital self-service
campus guide.

------------------------------------------------------------------------

## 4. Core Idea

The system combines four major capabilities:

1.  **QR-based access** --- gives visitors immediate access to the web
    application.
2.  **AI conversational assistance** --- converts natural-language
    questions into meaningful campus destinations or information
    requests.
3.  **Campus pathfinding** --- determines the route through a structured
    campus graph.
4.  **360° virtual navigation** --- presents connected panoramic views
    so visitors can visually follow the route.

The AI should not be responsible for inventing room numbers or routes.
The campus database and navigation engine should remain the source of
truth. The AI is primarily responsible for understanding the visitor's
language and presenting useful responses.

------------------------------------------------------------------------

## 5. Example User Journey

### Example: Admission Enquiry

**Step 1:** Visitor enters the college.

**Step 2:** Visitor scans the QR code at the entrance.

**Step 3:** CampusConnect AI opens in the mobile browser.

**Step 4:** The system asks:

> "Welcome to Sanjivani College of Engineering. How can I help you?"

**Step 5:** Visitor asks:

> "I want to enquire about admission for Computer Engineering."

**Step 6:** The AI identifies the likely intent as an admission-related
request.

**Step 7:** The system retrieves the official admission office location
from the campus database.

**Step 8:** The navigation engine determines the route.

**Step 9:** The system displays:

-   Destination name
-   Building
-   Floor
-   Room
-   Estimated route
-   Navigation steps
-   "Start 360° Navigation" button

**Step 10:** The visitor follows connected 360° panoramas using
directional hotspots.

**Step 11:** The system indicates that the destination has been reached.

------------------------------------------------------------------------

## 6. Main Functional Modules

### Module 1 --- QR Code Visitor Access

A QR code is placed at one or more strategic campus entry points.
Scanning it opens the CampusConnect AI web application in a browser.

Responsibilities:

-   Provide fast visitor access.
-   Avoid mandatory app installation.
-   Identify the standard starting point, such as Main Gate/Reception.
-   Create a visitor navigation session.
-   Optionally allow different QR codes to represent different starting
    locations.

------------------------------------------------------------------------

### Module 2 --- AI Chatbot using NLP

This is the conversational interface.

Responsibilities:

-   Accept natural-language text.
-   Optionally accept voice input.
-   Detect user intent.
-   Extract destination/entity names.
-   Ask clarification questions when the request is ambiguous.
-   Retrieve information from the campus knowledge base.
-   Present concise and useful responses.

Examples:

-   "Where is the library?"
-   "I need to pay fees."
-   "Find Prof. ABC."
-   "Where is the Computer department?"
-   "How do I reach the principal office?"

The AI must use retrieved campus data instead of hallucinating
information.

------------------------------------------------------------------------

### Module 3 --- Campus Navigation Engine

This module converts the campus into a navigable graph.

A node can represent:

-   Main Gate
-   Reception
-   Corridor junction
-   Staircase
-   Lift
-   Building entrance
-   Floor junction
-   Room
-   Office

An edge represents a possible movement between two nodes.

Example:

``` text
Main Gate
   |
Reception
   |
Admin Building Entrance
   |
Ground Floor Corridor
   |
Room 102 — Admission Office
```

The engine calculates a route using a graph pathfinding algorithm such
as BFS for a simple unweighted prototype or Dijkstra/A\* when
distances/weights are available.

------------------------------------------------------------------------

### Module 4 --- 360° Virtual Tour

This is the visual navigation layer.

Each navigation point can have a panoramic image. Panoramas are
connected using directional hotspots.

Example:

``` text
360 Node A — Reception
       |
       | Forward
       v
360 Node B — Corridor
       |
       | Left
       v
360 Node C — Admin Building
       |
       | Forward
       v
360 Node D — Admission Office
```

The user can:

-   Rotate the panorama.
-   Zoom.
-   Click directional hotspots.
-   Move to the next panorama.
-   Follow the generated route.

For the prototype, actual 360° images can be introduced progressively.
The system should first work with sample/placeholder panorama assets so
that software development is not blocked by image collection.

------------------------------------------------------------------------

### Module 5 --- Campus Information Database

This is the authoritative campus information layer.

It should store:

-   Buildings
-   Floors
-   Rooms
-   Departments
-   Faculty
-   Offices
-   Facilities
-   Navigation nodes
-   Navigation connections
-   360° image references
-   Destination aliases

Example aliases:

``` text
"fees"
"fee counter"
"fees payment"
"accounts"
```

can map to the same official destination if the campus data
administrator defines them that way.

------------------------------------------------------------------------

### Module 6 --- Admin Management Panel

Authorized administrators can manage campus information.

Possible functions:

-   Admin login.
-   Add/edit/delete locations.
-   Add buildings and floors.
-   Manage rooms.
-   Manage faculty details.
-   Manage destination aliases.
-   Create navigation nodes.
-   Connect navigation nodes.
-   Upload/replace 360° panorama references.
-   View basic visitor/search analytics.
-   Manage system configuration.

The admin panel is important because campus information can change over
time.

------------------------------------------------------------------------

## 7. System Architecture

The proposed architecture has five logical layers.

### Layer 1 --- Visitor / Client Layer

The visitor uses a smartphone browser after scanning a QR code.

### Layer 2 --- Web Application Layer

Responsible for:

-   Chat UI
-   Interactive map
-   Route display
-   360° viewer
-   Visitor information
-   Feedback/help

### Layer 3 --- AI & Processing Layer

Responsible for:

-   NLP
-   Intent detection
-   Entity extraction
-   Dialogue management
-   Knowledge retrieval
-   Route request generation

### Layer 4 --- Data & Navigation Layer

Responsible for:

-   Campus database
-   Campus graph
-   Location metadata
-   360° node repository
-   Route relationships

### Layer 5 --- External Services Layer

Optional integrations:

-   LLM API
-   Speech-to-text
-   Text-to-speech
-   Outdoor map service
-   Email/SMS

External APIs should be optional where possible so that the basic
prototype remains usable even without them.

------------------------------------------------------------------------

## 8. End-to-End Data Flow

``` text
Visitor
   |
   v
Scan QR Code
   |
   v
Web Application
   |
   v
User Query
   |
   v
AI/NLP Processing
   |
   v
Destination Identification
   |
   v
Campus Database
   |
   v
Navigation Engine
   |
   v
Route / Navigation Nodes
   |
   v
360° Virtual Tour
   |
   v
Destination Reached
```

------------------------------------------------------------------------

## 9. AI Architecture Principle

The project should follow a controlled AI architecture.

### Incorrect approach

``` text
User Question
      |
      v
LLM
      |
      v
Randomly generated room number/route
```

This can produce hallucinated campus information.

### Recommended approach

``` text
User Question
      |
      v
Intent + Entity Detection
      |
      v
Campus Knowledge Retrieval
      |
      v
Verified Destination
      |
      v
Pathfinding Engine
      |
      v
AI-generated natural-language response
```

The LLM should be treated as a language interface, not as the
authoritative source of campus facts.

------------------------------------------------------------------------

## 10. Suggested Technology Stack

### Frontend

-   React
-   Vite
-   Tailwind CSS
-   React Router
-   JavaScript/TypeScript

### Backend

-   Node.js
-   Express.js
-   REST API

### Database

Prototype:

-   JSON/local structured data

Expanded implementation:

-   MongoDB / MongoDB Atlas

### AI

One of:

-   OpenAI API
-   Gemini API
-   Another suitable LLM API

The implementation should keep the AI provider behind a service
abstraction so it can be changed later.

### 360° Viewer

Possible options:

-   Pannellum
-   Marzipano
-   Photo Sphere Viewer

Use one viewer consistently in the prototype.

### Development Tools

-   Antigravity IDE
-   VS Code-compatible workflow if required
-   Git
-   GitHub
-   Postman
-   Chrome/Edge

------------------------------------------------------------------------

## 11. Campus Data Model

The minimum conceptual entities are:

### Building

``` text
id
name
description
coordinates/position
floors
```

### Floor

``` text
id
buildingId
name
floorNumber
```

### Location

``` text
id
name
type
buildingId
floorId
roomNumber
description
aliases
navigationNodeId
```

### Faculty

``` text
id
name
department
designation
room/cabin
locationId
```

### Navigation Node

``` text
id
name
type
floorId
panoramaId
```

### Navigation Edge

``` text
fromNode
toNode
direction
distance
instruction
```

### Panorama

``` text
id
imageUrl/path
nodeId
hotspots
```

------------------------------------------------------------------------

## 12. Routing Model

Represent the campus as a graph:

``` text
G = (V, E)

V = navigation nodes
E = movement connections
```

For a simple prototype, each node may represent a location and each edge
a valid movement.

For example:

``` text
Gate
 |
Reception
 /      \
Admin   Library
 |
Staircase
 |
First Floor
 |
Computer Department
```

The route algorithm should return a sequence such as:

``` text
Gate
→ Reception
→ Admin Entrance
→ Staircase
→ First Floor Corridor
→ Computer Department
→ HOD Cabin
```

The 360° module then maps each node in this sequence to its
corresponding panorama.

------------------------------------------------------------------------

## 13. 360° Navigation Model

Each panorama is a navigation node with one or more hotspots.

A hotspot contains information such as:

``` text
targetNodeId
direction
pitch/yaw
label
```

Example:

``` text
Reception Panorama
    |
    +-- Forward --> Corridor Panorama
    |
    +-- Left -----> Admin Entrance Panorama
```

When the visitor selects a hotspot, the viewer loads the target
panorama.

The prototype does not need real-time physical positioning. The user
manually advances through the connected panoramas.

------------------------------------------------------------------------

## 14. Important Distinction: Virtual Tour vs Real-Time Indoor Positioning

The initial project should implement **virtual guided navigation**, not
claim real-time indoor positioning.

### Prototype

User:

``` text
Scan QR
→ Select destination
→ Follow virtual 360° path
```

### Future Advanced Version

Possible technologies:

-   Bluetooth Low Energy beacons
-   Wi-Fi fingerprinting
-   UWB
-   Computer vision
-   AR navigation

These should be treated as future enhancements unless hardware and time
permit.

------------------------------------------------------------------------

## 15. Visitor Interface

The UI should be mobile-first because visitors will primarily use
smartphones.

Suggested screens:

### Screen 1 --- Welcome

-   CampusConnect AI logo/name
-   College name
-   Welcome message
-   Start button

### Screen 2 --- AI Assistant

-   Chat history
-   Text input
-   Microphone button (optional)
-   Suggested destinations

### Screen 3 --- Destination Details

Show:

-   Destination
-   Building
-   Floor
-   Room
-   Description
-   Route summary
-   Start Navigation button

### Screen 4 --- Navigation

Show:

-   360° panorama
-   Directional hotspots
-   Current location
-   Destination
-   Progress/path information
-   Exit navigation button

### Screen 5 --- Completion

Show:

> "You have reached your destination."

Optional:

-   Back to assistant
-   Give feedback

------------------------------------------------------------------------

## 16. Admin Interface

Suggested dashboard:

``` text
CampusConnect Admin

Buildings       Locations       Faculty
   6               87             120

360° Nodes       Searches        Sessions
   45              320             540
```

Management sections:

-   Dashboard
-   Buildings
-   Floors
-   Rooms/Locations
-   Departments
-   Faculty
-   Navigation Graph
-   360° Panoramas
-   Visitor Queries
-   Feedback
-   Settings

------------------------------------------------------------------------

## 17. QR Code Strategy

The simplest implementation uses a single QR code at the main entrance.

Future improvement:

``` text
Main Gate QR
Reception QR
Admin Building QR
Library QR
Hostel QR
```

Each QR code can encode a URL containing a starting-node identifier.

Example concept:

``` text
/app?start=main-gate
```

The actual URL should be configured from the deployed application rather
than hard-coded during development.

------------------------------------------------------------------------

## 18. Security and Reliability

The system should include basic security practices:

-   Validate API input.
-   Protect admin routes.
-   Do not expose database credentials in frontend code.
-   Store API keys in environment variables.
-   Restrict admin operations to authenticated users.
-   Sanitize user input where appropriate.
-   Avoid storing unnecessary personal visitor information.
-   Display only verified campus information.

The AI should clearly indicate when it cannot find a destination rather
than inventing an answer.

------------------------------------------------------------------------

## 19. Error and Edge Cases

The prototype should handle:

### Unknown Destination

> "I couldn't find that location. Did you mean Computer Department,
> Accounts Office, or Admission Office?"

### Ambiguous Query

> "There are multiple offices matching your request. Please select one."

### Missing Route

> "A navigation route is not currently available for this destination."

### Missing Panorama

> "360° navigation is not available for this section yet. Here are the
> text directions."

### AI/API Failure

The system should fall back to campus database search wherever possible.

------------------------------------------------------------------------

## 20. Prototype Scope

The first working prototype should demonstrate:

-   QR entry
-   Professional web interface
-   AI/chat-style interaction
-   Campus destination search
-   Structured campus data
-   Route calculation
-   360° panorama viewer
-   Clickable navigation hotspots
-   Destination completion
-   Basic admin panel

It is not necessary for the first prototype to contain every room in the
college.

A smaller but complete route is better than a large but incomplete
system.

Recommended demonstration route:

``` text
Main Gate
→ Reception
→ Administration Building
→ Corridor
→ Admission Office
```

Then add another route such as:

``` text
Main Gate
→ Reception
→ Main Building
→ Staircase
→ First Floor
→ Computer Engineering Department
→ HOD Cabin
```

------------------------------------------------------------------------

## 21. Future Scope

Potential future improvements:

1.  Real-time indoor positioning.
2.  AR navigation arrows using smartphone camera.
3.  Voice-first navigation.
4.  Marathi/Hindi/English multilingual support.
5.  Accessibility support.
6.  Appointment booking.
7.  Faculty availability information.
8.  Event navigation.
9.  Parking guidance.
10. Emergency route guidance.
11. Analytics and heatmaps.
12. Multi-campus support.
13. Offline campus map.
14. Automated campus-map updates.
15. Integration with college ERP where appropriate.

------------------------------------------------------------------------

## 22. Success Criteria for the Prototype

The prototype should be considered successful when a user can:

1.  Scan a QR code.
2.  Open the web application.
3.  Ask for a campus destination.
4.  Get the correct destination from the campus data.
5.  Receive a generated route.
6.  Start a 360° navigation session.
7.  Move between panorama nodes using hotspots.
8.  Reach the destination in the virtual tour.
9.  Return to the AI assistant.
10. Have an administrator modify at least one campus location.

------------------------------------------------------------------------

## 23. Development Philosophy

Build the project incrementally.

Do not attempt all advanced features simultaneously.

Priority order:

``` text
Working UI
    ↓
Campus Data
    ↓
Destination Search
    ↓
Routing
    ↓
360° Viewer
    ↓
AI Integration
    ↓
Admin Panel
    ↓
Polish + Testing
```

The application must remain runnable after every phase.

------------------------------------------------------------------------

## 24. Important Instruction for the Development Agent

The development agent must read this entire file before modifying the
project.

The agent must also read the separate implementation plan:

**`CAMPUSCONNECT_AI_IMPLEMENTATION_PLAN.md`**

The implementation plan contains the phase-by-phase development
checklist.

Rules:

-   Do not skip phases.
-   Do not implement future-scope features before the MVP is stable.
-   Do not invent campus information.
-   Use clearly marked mock/sample data until verified college data is
    supplied.
-   Keep the architecture modular.
-   Keep the application runnable after each phase.
-   Update the implementation checklist when a task is actually
    completed.
-   Never mark a task complete merely because code was generated; verify
    it first.
-   Preserve existing working functionality when adding new features.
-   Prefer simple, maintainable solutions over unnecessarily complex
    technology.

------------------------------------------------------------------------

## 25. Final Product Vision

CampusConnect AI should feel like a digital receptionist + campus guide.

The visitor should be able to arrive at the campus, scan one QR code,
ask a question naturally, receive the correct destination, and visually
navigate toward it through an interactive 360° campus environment.

The strongest demonstration is:

``` text
Visitor
  ↓
QR Code
  ↓
CampusConnect AI
  ↓
"What do you need?"
  ↓
"I want to meet the Computer Engineering HOD."
  ↓
AI identifies destination
  ↓
Route calculated
  ↓
"Start 360° Navigation"
  ↓
Panorama → Arrow → Panorama → Arrow
  ↓
Computer Engineering Department
  ↓
HOD Cabin
  ↓
"Destination Reached"
```

This is the core identity of CampusConnect AI.
