# CAMPUSCONNECT: AI-POWERED AUTO APPLY & SMART INTERVIEW MANAGEMENT PLATFORM
## Comprehensive Project Engineering & Technical Architecture Report

---

**Project Title:** CampusConnect — Enterprise Campus Recruitment & Automated Career Platform  
**Version:** Release 2.5 (Production Release)  
**Academic Year:** 2025–2026  
**Primary Author & Developer:** Satyam Bhardwaj  
**Technology Stack:** React 19, Tailwind CSS, Node.js, Express.js, MongoDB Atlas, JWT, RESTful Architecture  
**Target Environment:** University Placement Cells, Corporate Hiring Teams, Undergraduate & Graduate Students  

---

## TABLE OF CONTENTS
1. [Executive Summary & Abstract](#1-executive-summary--abstract)
2. [Introduction & Problem Statement](#2-introduction--problem-statement)
3. [Comparative Market Analysis (CampusConnect vs Superset, Handshake, LinkedIn)](#3-comparative-market-analysis)
4. [System Requirements Specification (SRS)](#4-system-requirements-specification-srs)
5. [High-Level System Architecture](#5-high-level-system-architecture)
6. [AI-Powered Job Matching Engine (Computational Logic)](#6-ai-powered-job-matching-engine)
7. [Autonomous Job Application Pipeline (Auto Apply)](#7-autonomous-job-application-pipeline)
8. [Smart Interview Request & Scheduling Workflow](#8-smart-interview-request--scheduling-workflow)
9. [Application Tracking System (9-State Lifecycle)](#9-application-tracking-system)
10. [Database Architecture & DBMS Concepts (Viva Defense Notes)](#10-database-architecture--dbms-concepts)
11. [RESTful API Endpoints Specification](#11-restful-api-endpoints-specification)
12. [Frontend Engineering & UI/UX Design System](#12-frontend-engineering--uiux-design-system)
13. [Security Architecture & Role-Based Access Control (RBAC)](#13-security-architecture--rbac)
14. [Testing, Quality Assurance & Build Verification](#14-testing-quality-assurance--build-verification)
15. [Viva & Project Evaluation Questions & Answers](#15-viva--project-evaluation-qa)
16. [Conclusion & Future Roadmap](#16-conclusion--future-roadmap)
17. [Appendix: Local Installation & Verification Guide](#17-appendix-local-installation--verification-guide)

---

## 1. Executive Summary & Abstract

Traditional university recruitment processes are plagued by administrative friction, mismatched student qualifications, repetitive manual job applications, and fragmented interview scheduling. **CampusConnect** is an enterprise-grade recruitment automation platform designed to streamline early-career placements for students, recruiters, and placement officers.

The platform introduces four foundational architectural innovations:
1. **Weighted Multi-Factor AI Matching Engine:** Deterministically computes a 0–100% compatibility score across technical skills (45%), academic CGPA (20%), target job role (15%), experience level (10%), and geographical preferences (10%).
2. **Autonomous Job Application (Auto Apply) Pipeline:** An event-driven background engine that proactively matches newly published job requisitions against student criteria and autonomously submits applications while enforcing daily quota limits and strict duplicate prevention.
3. **Smart Interview Lifecycle Management:** A bidirectional interview coordination system allowing recruiters to dispatch invitations with defined rounds (Technical, HR, Managerial, Coding) and meeting links (Google Meet, Zoom), while empowering candidates to accept, reschedule with proposed slots and reasons, or decline.
4. **Transparent 9-State Application Tracker:** Complete visibility across `Applied Automatically`, `Applied Manually`, `Under Review`, `Shortlisted`, `Interview Requested`, `Interview Scheduled`, `Rejected`, `Selected`, and `Withdrawn`.

Built using a decoupled MERN stack architecture with JWT security and modern SaaS UI/UX (Obsidian Slate `#0F172A` and Deep Forest Green `#145A42`), CampusConnect bridges the gap between academic education and professional employment.

---

## 2. Introduction & Problem Statement

### 2.1 Background
University campus recruitment is a critical milestone for graduating students and corporate talent acquisition teams. Annually, millions of students compete for campus placement opportunities. However, existing institutional placement portals and commercial job boards are disconnected from university curricula and fail to address the specific needs of early-career hiring.

### 2.2 The Core Problem
1. **Application Fatigue:** Students manually re-enter biographical and educational data for dozens of company postings, leading to human error and missed deadlines.
2. **Qualification Mismatch:** Recruiters receive hundreds of irrelevant resumes from students who do not meet prerequisite skills or CGPA criteria, inflating shortlisting cycles.
3. **Scheduling Chaos:** Interview coordination between recruiters and students typically relies on uncoordinated email chains and phone calls, resulting in schedule conflicts and no-shows.
4. **Lack of Lifecycle Transparency:** Candidates remain uninformed regarding whether their applications have been reviewed, shortlisted, or scheduled for evaluations.

### 2.3 Objectives of CampusConnect
- To design a deterministic, multi-dimensional algorithm that evaluates candidate compatibility in real-time.
- To implement an automated event-driven application mechanism (Auto Apply) governed by student-controlled rules and safety limits.
- To create a unified recruiter candidate shortlisting pipeline with instant resume review and status management.
- To establish a bidirectional interview scheduling interface with integrated video conference links and rescheduling protocols.
- To maintain strict database integrity and deliver a modern, human-crafted SaaS user experience free of generic AI visual tropes.

---

## 3. Comparative Market Analysis

| Evaluation Metric | Legacy Institutional Portals | Superset / Handshake | LinkedIn / Indeed | CampusConnect (This Project) |
|---|---|---|---|---|
| **AI Compatibility Scoring** | ❌ None | ⚠️ Basic Boolean filters | ⚠️ General semantic keywords | ✅ **Multi-factor weighted formula (0–100%)** |
| **Autonomous Job Application** | ❌ None | ❌ Manual one-by-one | ⚠️ "Easy Apply" (still manual) | ✅ **Autonomous Event-Driven Auto Apply** |
| **Daily Quota & Preference Rules** | ❌ None | ❌ None | ❌ None | ✅ **Configurable daily rate limit & filters** |
| **Bidirectional Interview Scheduling** | ❌ External Email/WhatsApp | ⚠️ University schedule slot | ❌ External links only | ✅ **Accept / Reschedule / Decline workflow** |
| **Application Lifecycle Tracking** | ⚠️ Incomplete / Static | ⚠️ 3 to 4 basic states | ⚠️ Generic "Applied / Viewed" | ✅ **9 explicit lifecycle states with history** |
| **Recruiter Shortlist Filtering** | ❌ Spreadsheet downloads | ⚠️ Basic department filters | ⚠️ Subscription-walled filters | ✅ **CGPA, Skill & Compatibility sliders** |
| **Modern SaaS UX (Stripe/Linear)** | ❌ Cluttered, legacy table UI | ⚠️ Dated corporate tables | ⚠️ Dense ad-driven feeds | ✅ **Obsidian & Forest Green minimal design** |

---

## 4. System Requirements Specification (SRS)

### 4.1 Functional Requirements
- **FR-01 (Authentication & Authorization):** The system shall authenticate students and recruiters via stateless JWT tokens with 7-day expiration and bcrypt password hashing (10 salt rounds).
- **FR-02 (Dynamic Student Profile):** Students shall maintain verified profiles with CGPA, degree, branch, graduation year, verified skills array, resume file, and job preferences.
- **FR-03 (Job Requisition Management):** Recruiters shall publish job listings containing job title, description, required skills, minimum CGPA, salary, location, job type, and open positions.
- **FR-04 (Compatibility Scoring):** The system shall compute compatibility percentages (0–100%) and return matched skills, missing skills, and detailed scoring reasons.
- **FR-05 (Autonomous Auto Apply):** When a job is posted or when a student triggers a batch scan, the system shall evaluate rules and create application records without manual student intervention.
- **FR-06 (Candidate Shortlisting):** Recruiters shall filter applicants by minimum CGPA, minimum match score, skills, and update statuses to `Shortlisted` or `Rejected`.
- **FR-07 (Interview Dispatch & Response):** Recruiters shall dispatch formal interview invitations specifying round, mode, date, time, and meeting link. Students shall respond with `Accept`, `Reschedule` (with proposed time/reason), or `Decline`.
- **FR-08 (In-App Notification Dispatch):** The system shall dispatch timestamped notifications for auto-apply submissions, shortlisting decisions, interview invites, and candidate responses.

### 4.2 Non-Functional Requirements
- **NFR-01 (Performance):** The AI matching algorithm shall compute compatibility scores in less than 5 milliseconds per job-student pair.
- **NFR-02 (Security):** All protected endpoints shall enforce JWT validation and role-based access checks (`student` vs `recruiter`).
- **NFR-03 (Scalability):** The backend architecture shall remain stateless to allow horizontal scaling behind reverse proxies.
- **NFR-04 (UI Responsiveness):** The frontend layout shall adapt fluidly across mobile (<768px), tablet (768–1024px), and desktop (>1024px) viewports.

---

## 5. High-Level System Architecture

CampusConnect is structured following the classical Three-Tier Architecture model:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       PRESENTATION LAYER (Client)                           │
│  React 19 • Vite • Tailwind CSS • Lucide Icons • Recharts Analytics         │
│  Pages: StudentDashboard, RecruiterDashboard, MyApplications, Interviews    │
│  State: Context API, LocalStorage Session, Axios Interceptors               │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ HTTP / JSON (REST APIs with JWT)
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       APPLICATION / BUSINESS LAYER                          │
│  Node.js (v20+) • Express.js Framework • Modular MVC Controllers            │
│  • utils/jobMatcher.js        : 5-Factor Weighted Compatibility Algorithm   │
│  • services/autoApplyService  : Proactive Job-Trigger & Reactive Scan Engine│
│  • controllers/interviewCtrl  : Bidirectional Interview State Transitions   │
│  • middleware/auth.js         : JWT Verification & RBAC Enforcement         │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ Mongoose ODM / TCP Connection
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DATA PERSISTENCE LAYER                              │
│  MongoDB Atlas (Cloud Cluster)                                               │
│  Collections: users, jobs, companies, applications, autoapplysettings,      │
│               interviews, notifications                                      │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. AI-Powered Job Matching Engine

### 6.1 Algorithmic Formulation
The compatibility engine computes a normalized score $S \in [0, 100]$ using a multi-factor weighted sum:

$$S = W_{\text{skills}} \cdot S_{\text{skills}} + W_{\text{cgpa}} \cdot S_{\text{cgpa}} + W_{\text{role}} \cdot S_{\text{role}} + W_{\text{exp}} \cdot S_{\text{exp}} + W_{\text{loc}} \cdot S_{\text{loc}}$$

Where the weight distribution is defined as:
- $W_{\text{skills}} = 0.45$ (45% Technical Skill Match)
- $W_{\text{cgpa}} = 0.20$ (20% Academic CGPA Requirement)
- $W_{\text{role}} = 0.15$ (15% Preferred Role Alignment)
- $W_{\text{exp}} = 0.10$ (10% Experience Level Compatibility)
- $W_{\text{loc}} = 0.10$ (10% Work Location Preference)

### 6.2 Component Sub-Score Calculations
1. **Technical Skills ($S_{\text{skills}}$):**
   - Extracts required skills from `job.requiredSkills` and regex tokenization of `job.requirements` and `job.description`.
   - Normalizes student skills (lowercase, whitespace trimmed, version suffix stripping e.g., "React.js" $\rightarrow$ "react").
   - Computes:
     $$S_{\text{skills}} = \frac{|\text{Matched Skills}|}{|\text{Required Skills}|} \times 100$$
2. **Academic CGPA ($S_{\text{cgpa}}$):**
   - If Student CGPA $\ge$ Job CGPA Cutoff: $S_{\text{cgpa}} = 100\%$.
   - If Student CGPA $<$ Cutoff:
     $$S_{\text{cgpa}} = \max\left(0, \frac{\text{Student CGPA}}{\text{Job CGPA Cutoff}} \times 100 - 20\right)$$
3. **Role Alignment ($S_{\text{role}}$):**
   - Computes semantic token overlap between `student.profile.preferredRole` and `job.title`.
   - Exact substring match yields $100\%$; shared keywords yield $60\% - 85\%$; default baseline is $30\%$.
4. **Experience Level ($S_{\text{exp}}$):**
   - Compares student experience/graduation year against position seniority level. Graduate/Fresher roles yield $100\%$.
5. **Location Compatibility ($S_{\text{loc}}$):**
   - If job is "Remote" or candidate prefers "Remote": $S_{\text{loc}} = 100\%$.
   - If candidate preferred location matches job city: $S_{\text{loc}} = 100\%$; otherwise $40\%$.

---

## 7. Autonomous Job Application Pipeline (Auto Apply)

```
                         AUTO APPLY EXECUTION PIPELINE
                                       
    Recruiter Posts Job                              Student Clicks "Scan Now"
     (POST /api/jobs)                               (POST /api/auto-apply/run)
            │                                                    │
            ▼                                                    ▼
   runAutoApplyForJob(jobId)                       runAutoApplyForStudent(studentId)
            │                                                    │
            ├──────────────────────────┬─────────────────────────┤
                                       ▼
                       Query Active Auto Apply Settings
                       (enabled: true, quota remaining)
                                       │
                                       ▼
                       Evaluate Matching Engine Rules:
                       • Compatibility Score >= minMatchScore
                       • Student CGPA >= minCgpa
                       • Preferred Role & Location filter
                                       │
                        ┌──────────────┴──────────────┐
                        ▼                             ▼
                  [ Criteria Met ]            [ Criteria Not Met ]
                        │                             │
                        ▼                             ▼
             Prevent Duplicate Check               Skip Job
             (Unique application index)
                        │
                        ▼
             Create Application Record:
             • status: 'Applied Automatically'
             • applicationMethod: 'Automatic'
             • matchScore & matchBreakdown
                        │
                        ▼
             Update Daily Quota Counter &
             Dispatch In-App Student Notification
```

---

## 8. Smart Interview Request & Scheduling Workflow

### 8.1 Recruiter Dispatch Lifecycle
Recruiters initiate interviews directly from the candidate pipeline in [RecruiterDashboard.jsx](file:///Users/satyam/Documents/campusconnect/campusconnect/client/src/pages/RecruiterDashboard.jsx):
1. **Interview Round:** Technical Round, HR Round, Managerial Round, Coding Assessment, System Design, Final Round.
2. **Interview Mode:**
   - **Online:** Input Google Meet, Zoom, or Teams video room link.
   - **Offline:** Input on-campus venue or company office address.
3. **Date & Time:** Timestamp with time-slot selection.
4. **Instructions:** Custom notes, assessment syllabus, and preparation guides.

### 8.2 Student Response Lifecycle
Students receive real-time notifications and manage interviews via [Interviews.jsx](file:///Users/satyam/Documents/campusconnect/campusconnect/client/src/pages/Interviews.jsx):
- **Option A (Accept):** Status transitions to `Interview Scheduled`. Unlocks direct "Join Online Video" button and notifies the recruiter.
- **Option B (Reschedule):** Opens modal allowing candidate to propose an alternative date, alternative time, and specific reason. Status becomes `Reschedule Requested`.
- **Option C (Decline):** Candidate enters decline rationale. Status updates to `Declined`.

---

## 9. Application Tracking System

Every job application transitions through 9 formal lifecycle states:

| Status Code | Lifecycle Stage | Triggered By | Notification Sent? |
|---|---|---|---|
| `Applied Automatically` | Initial autonomous submission | Auto Apply Engine | Yes (to Student) |
| `Applied Manually` | Initial manual submission | Student Apply Button | Yes (to Recruiter) |
| `Under Review` | Recruiter opened applicant record | Recruiter Action | No |
| `Shortlisted` | Qualified for formal hiring rounds | Recruiter Shortlist Button | Yes (to Student) |
| `Interview Requested` | Interview invitation dispatched | Recruiter Interview Modal | Yes (to Student) |
| `Interview Scheduled` | Candidate confirmed interview | Student Accept Button | Yes (to Recruiter) |
| `Rejected` | Application closed | Recruiter Reject Button | Yes (to Student) |
| `Selected` | Final offer extended | Recruiter Selection Button | Yes (to Student) |
| `Withdrawn` | Application retracted | Student Withdrawal Action | Yes (to Recruiter) |

---

## 10. Database Architecture & DBMS Concepts

### 10.1 MongoDB Entity Schemas

#### 1. User Schema (`users`)
```javascript
{
  _id: ObjectId,
  fullname: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true }, // Bcrypt hash
  role: { type: String, enum: ['student', 'recruiter'], required: true },
  profile: {
    bio: String,
    skills: [String],
    cgpa: { type: Number, default: 7.5 },
    degree: { type: String, default: "B.Tech" },
    branch: { type: String, default: "Computer Science" },
    graduationYear: { type: Number, default: 2026 },
    experienceYears: { type: Number, default: 0 },
    preferredRole: { type: String, default: "Software Engineer" },
    preferredLocation: { type: String, default: "Remote" },
    expectedSalary: Number,
    resume: String,
    profilePhoto: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

#### 2. Job Schema (`jobs`)
```javascript
{
  _id: ObjectId,
  title: { type: String, required: true },
  description: { type: String, required: true },
  requirements: [String],
  requiredSkills: [String],
  requiredCgpa: { type: Number, default: 6.0 },
  preferredBranch: [String],
  salary: { type: Number, required: true },
  experienceLevel: { type: Number, default: 0 },
  location: { type: String, required: true },
  jobType: { type: String, enum: ['Full-Time', 'Part-Time', 'Internship', 'Contract'], default: 'Full-Time' },
  position: { type: Number, default: 1 },
  company: { type: ObjectId, ref: 'Company', required: true },
  created_by: { type: ObjectId, ref: 'User', required: true },
  applications: [{ type: ObjectId, ref: 'Application' }],
  createdAt: Date
}
```

#### 3. Application Schema (`applications`)
```javascript
{
  _id: ObjectId,
  job: { type: ObjectId, ref: 'Job', required: true, index: true },
  applicant: { type: ObjectId, ref: 'User', required: true, index: true },
  status: { 
    type: String, 
    enum: [
      'Applied Automatically', 'Applied Manually', 'Under Review',
      'Shortlisted', 'Interview Requested', 'Interview Scheduled',
      'Rejected', 'Selected', 'Withdrawn'
    ],
    default: 'Applied Manually'
  },
  applicationMethod: { type: String, enum: ['Automatic', 'Manual'], default: 'Manual' },
  matchScore: { type: Number, default: 0 },
  matchBreakdown: {
    matchingSkills: [String],
    missingSkills: [String],
    reasons: [String]
  },
  statusHistory: [{
    status: String,
    changedAt: { type: Date, default: Date.now },
    note: String
  }],
  createdAt: Date
}
```

#### 4. AutoApplySettings Schema (`autoapplysettings`)
```javascript
{
  _id: ObjectId,
  student: { type: ObjectId, ref: 'User', required: true, unique: true },
  enabled: { type: Boolean, default: false },
  minMatchScore: { type: Number, min: 50, max: 100, default: 75 },
  minCgpa: { type: Number, min: 0, max: 10, default: 7.0 },
  preferredRoles: [String],
  preferredLocations: [String],
  jobTypes: [{ type: String, enum: ['Full-Time', 'Part-Time', 'Internship', 'Contract'] }],
  minSalary: { type: Number, default: 0 },
  maxApplicationsPerDay: { type: Number, default: 5 },
  applicationsCountToday: { type: Number, default: 0 },
  lastAppliedDate: Date
}
```

#### 5. Interview Schema (`interviews`)
```javascript
{
  _id: ObjectId,
  application: { type: ObjectId, ref: 'Application', required: true },
  job: { type: ObjectId, ref: 'Job', required: true },
  company: { type: ObjectId, ref: 'Company', required: true },
  student: { type: ObjectId, ref: 'User', required: true, index: true },
  recruiter: { type: ObjectId, ref: 'User', required: true },
  interviewDate: { type: String, required: true },
  interviewTime: { type: String, required: true },
  interviewMode: { type: String, enum: ['Online', 'Offline'], default: 'Online' },
  meetingLinkOrLocation: { type: String, required: true },
  round: { type: String, default: 'Technical Round' },
  message: String,
  status: {
    type: String,
    enum: ['Invited', 'Accepted', 'Rescheduled', 'Declined', 'Completed', 'Cancelled'],
    default: 'Invited'
  },
  rescheduleReason: String,
  proposedDate: String,
  proposedTime: String,
  declineReason: String,
  createdAt: Date
}
```

#### 6. Notification Schema (`notifications`)
```javascript
{
  _id: ObjectId,
  recipient: { type: ObjectId, ref: 'User', required: true, index: true },
  sender: { type: ObjectId, ref: 'User' },
  type: { type: String, enum: ['auto_apply', 'shortlisted', 'interview_invite', 'interview_response', 'status_update', 'general'] },
  title: { type: String, required: true },
  message: { type: String, required: true },
  link: String,
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
}
```

---

### 10.2 DBMS Concepts Demonstrated (Viva Reference Guide)

| DBMS Concept | Implementation in CampusConnect | Viva Explanation |
|---|---|---|
| **CRUD Operations** | Creating jobs/applications (`create()`), retrieving candidate pipelines (`find()`), status transitions (`findByIdAndUpdate()`), job removals (`deleteOne()`). | Demonstrates fundamental data persistence and lifecycle management across relational document collections. |
| **Primary Keys** | MongoDB default immutable `_id` (12-byte BSON ObjectId). | Uniquely identifies documents across distributed database nodes. |
| **Foreign Keys / Referential Integrity** | Mongoose `ref` pointing across collections (e.g. `job.company -> Company`, `application.applicant -> User`). | Enforces relational integrity and enables joined multi-document queries via `.populate()`. |
| **One-to-Many Relationships** | One recruiter user owns multiple jobs; one job posting accumulates many student applications. | Represented via referencing arrays (`applications: [ObjectId]`) and parent reference attributes. |
| **Many-to-Many Relationships** | Students apply to multiple jobs; jobs receive applications from multiple students. | Modeled cleanly using the `Application` junction/associative collection linking `User` and `Job`. |
| **Unique Constraints & Indexing** | Unique index on `User.email`; unique index on `AutoApplySettings.student`; compound unique index on `(applicant, job)` in `Application`. | Prevents duplicate accounts, duplicate settings, and duplicate applications while accelerating query times from $O(N)$ to $O(\log N)$. |
| **Aggregation Pipelines** | Recruiter metrics computation (`$match`, `$group`, `$count`) for total candidates, shortlists, and placement rates. | Performs server-side data summarization without memory overhead. |
| **ACID Guarantees** | Single-document atomicity in MongoDB Atlas and atomic transactional updates when bumping daily application quotas. | Ensures consistent application counts during concurrent auto-apply runs. |

---

## 11. RESTful API Endpoints Specification

| Method | Endpoint Path | Access Level | Description |
|---|---|---|---|
| `POST` | `/api/users/register` | Public | Registers a new student or recruiter account |
| `POST` | `/api/users/login` | Public | Validates credentials and returns signed JWT token |
| `GET` | `/api/users/profile` | Auth (JWT) | Retrieves authenticated user profile details |
| `PUT` | `/api/users/profile` | Auth (JWT) | Updates verified skills, CGPA, branch, resume, and role targets |
| `POST` | `/api/jobs/create` | Recruiter | Publishes job requisition and triggers asynchronous Auto Apply |
| `GET` | `/api/jobs` | Public | Returns all published opportunities with company metadata |
| `GET` | `/api/jobs/:id` | Public | Retrieves specific job description and requirements |
| `POST` | `/api/applications/apply` | Student | Submits manual application and computes instant compatibility |
| `GET` | `/api/applications/my-applications` | Student | Lists student applications with 9 statuses and match percentages |
| `GET` | `/api/applications/applicants/:jobId` | Recruiter | Retrieves candidate pipeline with skills, CGPA, and match scores |
| `PUT` | `/api/applications/status/:id` | Recruiter | Updates applicant status (Shortlist/Reject) and dispatches alert |
| `GET` | `/api/auto-apply/settings` | Student | Retrieves student Auto Apply status, thresholds, and limits |
| `PUT` | `/api/auto-apply/settings` | Student | Updates Auto Apply toggle, minimum match score, and daily quotas |
| `POST` | `/api/auto-apply/run` | Student | Triggers on-demand batch scan of active listings |
| `POST` | `/api/interviews/create` | Recruiter | Dispatches formal interview invitation with video meeting link |
| `GET` | `/api/interviews/my-interviews` | Student | Retrieves upcoming and past interviews for student |
| `GET` | `/api/interviews/recruiter` | Recruiter | Retrieves all dispatched interviews and candidate responses |
| `PUT` | `/api/interviews/:id/respond` | Student | Submits response (`Accept`, `Reschedule`, `Decline`) |
| `GET` | `/api/notifications` | Auth (JWT) | Fetches in-app notifications with unread count |
| `PUT` | `/api/notifications/read-all` | Auth (JWT) | Marks all notifications as read |

---

## 12. Frontend Engineering & UI/UX Design System

### 12.1 Design Philosophy: Anti-AI, Human-Crafted SaaS
Modern enterprise software must communicate clarity, authority, and trust. CampusConnect departs strictly from generic AI templates (overused purple/violet gradients, blurry glassmorphism, floating neon blobs) in favor of a restrained, high-density editorial design inspired by Linear and Stripe.

### 12.2 Color Architecture
- **Primary Foundation:** Obsidian Slate (`#0F172A`) — Clean, authoritative background for navigation, active badges, and high-emphasis controls.
- **Brand Accent:** Deep Forest Green (`#145A42`) & Emerald (`#059669`) — Represents growth, placement success, and primary call-to-actions.
- **Canvas Background:** Warm Off-White (`#F8FAFC`) — Soft on the eyes during prolonged recruitment sessions.
- **Surface Elevation:** Pure Crisp White (`#FFFFFF`) cards with hairline borders (`#E2E8F0`) and micro drop-shadows (`rgba(0, 0, 0, 0.04)`).
- **Status Tints:**
  - Success / Selected: Emerald tint (`#ECFDF5`, text `#047857`)
  - Warning / Reschedule: Amber tint (`#FFFBEB`, text `#B45309`)
  - Closed / Rejected: Rose tint (`#FFF1F2`, text `#BE123C`)

### 12.3 Modular Component Directory
- `TopNavigation.jsx`: Real-time notification drawer with polling, live badge counter, and profile quick access.
- `Sidebar.jsx`: Fixed vertical navigation with route indicators, placement verified badge, and user credentials.
- `WelcomeSection.jsx`: Personalized greeting banner with time-filter segmented controls and one-click PDF project report download.
- `AutoApplyCard.jsx`: Interactive control center showing active rules, daily applications remaining, toggle switch, and scan trigger.
- `UpcomingInterviewsWidget.jsx`: Dashboard widget showing upcoming interview rounds, status badges, and direct "Join Online Video" buttons.
- `DashboardModals.jsx`: Houses `AutoApplySettingsModal` (sliders for match score and CGPA, tag inputs) and `ProfileModal` (resume file upload and skills management).
- `ChartsSection.jsx`: Interactive charts displaying application trends, status breakdown, and recruitment conversion funnels.
- `RecentApplicationsTable.jsx`: Tabular view of applications with search, status pills, and match badges.
- `RecruiterDashboard.jsx`: Enterprise candidate pipeline with multi-filter controls (CGPA, Match Score, Job, Name) and interview dispatch modal.

---

## 13. Security Architecture & Role-Based Access Control (RBAC)

1. **Stateless Authentication:** User credentials are exchanged for JSON Web Tokens signed with a secure server-side secret (`process.env.JWT_SECRET`) and a 7-day expiration window.
2. **Password Protection:** Passwords are encrypted before database insertion using `bcryptjs` with 10 salt rounds. Plaintext passwords are never stored or logged.
3. **Role-Based Route Guards:**
   - Client-side: `<ProtectedRoute role="student">` and `<ProtectedRoute role="recruiter">` prevent unauthorized UI rendering and handle redirects.
   - Server-side: `protect` middleware verifies JWT claims; `requireRole("student"|"recruiter")` ensures that students cannot create jobs or shortlist applicants, and recruiters cannot auto-apply.
4. **Input Sanitization & CORS:** API endpoints enforce allowed origins and payload type validation to prevent cross-site scripting (XSS) and injection attacks.

---

## 14. Testing, Quality Assurance & Build Verification

### 14.1 Test Matrix
- **Unit Testing (Job Matcher Engine):** Tested with exact skill matches, partial substring matches, higher/lower CGPA cutoffs, and edge cases (empty skill arrays, undefined locations). Results confirmed 100% deterministic output.
- **Integration Testing (Auto Apply Pipeline):** Verified job creation webhook trigger; verified rate-limiting cutoff when `applicationsCountToday >= maxApplicationsPerDay`; confirmed duplicate prevention when student is already in `job.applications`.
- **Interview Response Testing:** Tested student accept, reschedule, and decline requests; confirmed status transitions and reciprocal recruiter notifications.
- **Frontend Build Verification:** Rolldown / Vite production compilation verified:
  ```
  vite v8.1.4 building client environment for production...
  ✓ 2616 modules transformed.
  dist/index.html                   0.80 kB
  dist/assets/index-C1kBtKIV.css   57.65 kB
  dist/assets/index-COy4P-WN.js   969.47 kB
  ✓ built in 232ms with 0 errors
  ```

---

## 15. Viva & Project Evaluation Q&A

**Q1: What is the primary novelty of CampusConnect compared to traditional job portals?**  
*Answer:* Traditional job portals require students to manually search, evaluate, and submit individual applications. CampusConnect introduces a closed-loop automated recruitment pipeline: students configure criteria once, an AI matching engine computes multi-factor compatibility (skills, CGPA, role, experience, location), an autonomous Auto Apply engine applies to matching openings within daily safety quotas, and recruiters dispatch online/offline interviews with integrated response tracking.

**Q2: How does the AI Matching Engine prevent false positives in skill matching?**  
*Answer:* The engine uses standardized keyword normalization (stripping punctuation, case differences, and framework version suffixes such as "React.js" to "react"). It separates deterministic required skills from general description tokens, prevents single-letter false matches, and balances skill weightage (45%) with academic CGPA requirements (20%) so candidates lacking academic eligibility cannot achieve top match scores.

**Q3: How does the system handle high concurrency during campus recruitment drives?**  
*Answer:* The backend is completely stateless; session state is carried inside cryptographically signed JWTs. Heavy aggregation operations utilize MongoDB indexed lookups ($O(\log N)$) rather than full table scans. The Auto Apply engine operates asynchronously without blocking the recruiter's HTTP response when posting a job.

**Q4: Where is DBMS referential integrity enforced in a NoSQL database like MongoDB?**  
*Answer:* Referential integrity is enforced at both the application and database tiers:
1. Mongoose schema definitions enforce `ref` constraints pointing to valid collection IDs.
2. Compound unique indexes prevent duplicate junction records in the `Application` collection.
3. Pre-save hooks and atomic operators (`$addToSet`, `$inc`) maintain referential consistency between parent jobs and child applications.

**Q5: What safety mechanisms protect students from unintended auto-applications?**  
*Answer:* The student maintains complete sovereignty: Auto Apply is disabled by default, students set their own minimum compatibility score threshold (e.g. 85%), minimum CGPA filter, preferred roles, and a daily application ceiling (e.g., maximum 5 per day). Students can pause or disable the feature at any time.

---

## 16. Conclusion & Future Roadmap

CampusConnect v2.5 successfully demonstrates a modern, end-to-end campus recruitment ecosystem that eliminates repetitive administrative tasks while preserving candidate qualification rigor. By pairing transparent AI matching algorithms with structured interview workflows and high-contrast SaaS ergonomics, the platform redefines university career placement.

### Future Roadmap (Version 3.0):
- **Automated Coding Sandbox:** Direct browser-based coding assessments for Technical Round evaluations.
- **Resume NLP Parser:** Automatic extraction of student skills, GitHub repositories, and certifications directly from PDF resumes.
- **Calendar Synchronization:** Bi-directional sync with Google Calendar and Microsoft Outlook for recruiter interview slots.
- **Placement Officer Analytics Portal:** University administrative dashboard monitoring department-wise placement percentages, median compensation packages, and top corporate recruiters.

---

## 17. Appendix: Local Installation & Verification Guide

### Step 1: Clone Repository & Setup Environment
Ensure Node.js (v20+) and MongoDB Atlas / local MongoDB are accessible.

### Step 2: Start Backend Server
```bash
cd campusconnect/server
npm install
npm run dev
# Server initiates on http://localhost:5001
# Connected to MongoDB Atlas cluster
```

### Step 3: Start Frontend Client
```bash
cd campusconnect/client
npm install
npm run dev
# Vite client initiates on http://localhost:5173
```

### Step 4: Verify End-to-End Workflow
1. Navigate to `http://localhost:5173/register` to create a Student account.
2. Open `http://localhost:5173/student-dashboard` to review the AI Matcher, Auto Apply Card, and Application Tracker.
3. Login as a Recruiter at `http://localhost:5173/recruiter-dashboard` to view applicant pipelines and dispatch interview invitations.
4. Click **"Download Project PDF"** in the student dashboard banner to download the full generated project report.

---
*Report Compiled on November 25, 2026.*  
*CampusConnect Engineering Team — All Rights Reserved.*
