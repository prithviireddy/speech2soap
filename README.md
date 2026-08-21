# 🩺 Cura
### Ambient Clinical Intelligence & Grounded Patient Documentation

**Cura** is an end-to-end clinical intelligence platform that transforms raw doctor–patient consultation audio into structured medical documentation (SOAP notes, diagnoses, medications, and follow-ups) and provides a **database-backed, grounded RAG Assistant** for longitudinal patient history retrieval.

Built with a high-craft modern UI inspired by Aceternity & Linear, complete with dual-theme (Obsidian Black Dark Mode & Soft Slate Light Mode) support and Role-Based Access Control (RBAC).

---

## 🚀 Key Capabilities & System Features

### 1. 🎙️ Intelligent Audio Ingestion & Diarization Pipeline
* **High-Accuracy Speech-to-Text**: Converts noisy, overlapping clinical conversation audio into speaker-attributed transcripts using **WhisperX**.
* **Dialogue Reconstruction & Cleanup**: Filters filler speech, noise, and cross-talk while retaining critical clinical context.
* **Live Pipeline Tracking**: Real-time progress monitoring through stages: `UPLOADED` ➔ `TRANSCRIBING` ➔ `PROCESSING` ➔ `REVIEW_PENDING` ➔ `APPROVED`.

### 2. 🧠 LLM Clinical Structuring & SOAP Extraction
* **Structured Medical Synthesis**: Powered by Google **Gemini 2.5 Flash**, extracting comprehensive clinical notes:
  * **Subjective**: Patient history, chief complaints, symptoms, timeline.
  * **Objective**: Physical examinations, vital measurements, lab observations.
  * **Assessment**: Primary & differential diagnoses with clinical reasoning.
  * **Plan**: Prescribed medications (dosage/frequency), diagnostics, lifestyle guidance, and follow-ups.
* **Physician Sign-Off & Verification Workflow**: Interactive review interface where doctors can edit, adjust, and approve AI-generated reports before they become official medical records.

### 3. 💬 Database-Backed Clinical RAG Chat Assistant
* **Persistent PostgreSQL Multi-Turn History**: Chat sessions and message turns stored in PostgreSQL (`rag_chat_sessions` & `rag_chat_messages`) with automatic cascade deletion.
* **Grounded Semantic Retrieval**: Embeds approved consultation transcripts, SOAP summaries, and doctor notes into **ChromaDB** with **Gemini Embedding 2** (3072 dimensions).
* **Multi-Turn Contextual QA**: Conversational memory aware of the patient's entire longitudinal history with source citations linked directly to verified consultation dates.
* **ChatGPT-Style Sidebar UI**: Session management, quick prompt suggestions, and zero-dependency markdown rendering with bullet points and bolding.

### 4. 👥 Role-Based Access Control (RBAC) Workspaces
* **Doctor Workstation**:
  * Asymmetric Bento Grid dashboard with schedule timeline, KPI metrics, and pipeline monitor.
  * Patient history browser with timeline tabs, consultation transcripts, and interactive RAG assistant.
  * Quick-approval drawer for pending clinical reports.
* **Patient Portal**:
  * Secure view of approved medical summaries, active prescriptions, and follow-up schedules.
  * Patient-friendly AI health explainer grounded only in approved doctor reports.
* **Admin Console**:
  * Hospital staff management, doctor onboarding, and system audit monitoring.

### 5. 🎨 Modern Aceternity UI & Dual Theme System
* **Obsidian & Deep Black Gradient Dark Theme**: Pure `#030712` canvas with dark slate surfaces (`#0B0F19`), subtle graphite radial glows, and frosted glass panels.
* **Anti-Glare Soft Light Theme**: Gentle slate-neutral canvas (`#EEF2F6`) designed to prevent eye strain during long clinical shifts.
* **Bento Grid & Glassmorphism**: High-craft components, status badges, and micro-animations.

---

## 🏗️ Architecture & Pipeline Flow

```text
       ┌─────────────────────────────────────────────────────────┐
       │             Doctor–Patient Consultation Audio           │
       └────────────────────────────┬────────────────────────────┘
                                    │
                                    ▼
       ┌─────────────────────────────────────────────────────────┐
       │             WhisperX Audio Transcription                │
       │           (Speaker Diarization + Alignment)             │
       └────────────────────────────┬────────────────────────────┘
                                    │
                                    ▼
       ┌─────────────────────────────────────────────────────────┐
       │            Gemini 2.5 Flash Medical Extraction          │
       │       (SOAP Notes, Key Findings, Prescriptions)         │
       └────────────────────────────┬────────────────────────────┘
                                    │
                                    ▼
       ┌─────────────────────────────────────────────────────────┐
       │         Doctor Review & Verification Workspace          │
       │           (Physician Edits & Formal Approval)           │
       └────────────────────────────┬────────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    ▼                               ▼
       ┌────────────────────────┐      ┌─────────────────────────┐
       │   PostgreSQL Storage   │      │   ChromaDB Embeddings   │
       │ (EHR Record & Sessions)│      │  (Gemini Embedding 2)   │
       └────────────┬───────────┘      └────────────┬────────────┘
                    │                               │
                    └───────────────┬───────────────┘
                                    │
                                    ▼
       ┌─────────────────────────────────────────────────────────┐
       │        Multi-Turn Grounded Patient RAG Assistant        │
       │  (Session Memory + Exact Consultation Source Citations) │
       └─────────────────────────────────────────────────────────┘
```

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS v4, Lucide Icons, React Router 6 |
| **Backend Framework** | FastAPI (Python 3.11+), Uvicorn, Pydantic v2 |
| **Database & ORM** | PostgreSQL, SQLAlchemy 2.0 (Async/Sync), Alembic Migrations |
| **LLM & Embeddings** | Google Gemini 2.5 Flash, Gemini Embedding 2 (`text-embedding-004`) |
| **Vector Database** | ChromaDB (Persistent client & collection indexing) |
| **Audio & ASR** | WhisperX, PyAnnote Audio Diarization, PyTorch |
| **Package Management** | `uv` (Python), `npm` (Node.js) |

---

## 📁 Project Directory Structure

```bash
clinicReport/
│
├── frontend/                          # React + Vite Modern Single Page App
│   ├── src/
│   │   ├── api/                       # Axios API client (auth, doctor, patient, admin)
│   │   ├── components/
│   │   │   ├── layouts/               # DashboardLayout, Navbar, Sidebar, AuthLayout
│   │   │   ├── pages/
│   │   │   │   ├── doctor/            # DoctorDashboard, PatientRAGAssistant, DoctorPatientHistory, ReportReview
│   │   │   │   ├── patient/           # PatientDashboard, PatientAIAssistant, Followups
│   │   │   │   └── admin/             # AdminDashboard, DoctorManagement
│   │   │   └── shared/                # Bento Card, Button, Badge, Tabs, Modal, PipelineTracker
│   │   ├── context/                   # AuthContext, ThemeContext (Dark/Light mode)
│   │   └── index.css                  # Aceternity design tokens, glass panels, dark gradients
│   └── package.json
│
├── src/                               # FastAPI Backend Application
│   ├── api/                           # API Routes (/auth, /doctor, /doctor/rag, /patient, /admin)
│   ├── core/                          # Config, Security, JWT Authentication
│   ├── db/                            # Database sessions & Alembic migrations
│   │   └── migrations/versions/       # Version-controlled schema migrations
│   ├── models/                        # SQLAlchemy Models (User, Consultation, Report, RagChat)
│   ├── schemas/                       # Pydantic validation & serialization models
│   ├── services/
│   │   ├── consultation_service.py    # Pipeline coordinator & background worker
│   │   ├── transcription/             # WhisperX runner & audio processing
│   │   └── rag/                       # RAG Pipeline (Embedder, VectorStore, AnswerGenerator)
│   └── main.py                        # FastAPI application entry point
│
├── .env.example                       # Template for environment configuration
├── pyproject.toml                     # Backend dependencies & tools
├── uv.lock                            # Deterministic dependency lockfile
└── README.md
```

---

## ⚡ Getting Started

### Prerequisites
* **Python 3.11+** (managed via [`uv`](https://docs.astral.sh/uv/))
* **Node.js 18+** & **npm**
* **PostgreSQL** instance running locally or hosted (e.g. Supabase, Neon)
* **Google Gemini API Key** ([Google AI Studio](https://aistudio.google.com/))

---

### 1. Backend Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/clinicReport.git
   cd clinicReport
   ```

2. **Configure environment variables**:
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=postgresql+psycopg2://postgres:password@localhost:5432/clinic_report
   SECRET_KEY=your-super-secret-jwt-key
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=1440

   GEMINI_API_KEY=your_gemini_api_key
   HF_TOKEN=your_huggingface_token
   UPLOAD_DIR=./data/uploads
   CHROMADB_DIR=./data/chroma_db
   ```

3. **Install Python dependencies**:
   ```bash
   uv sync
   ```

4. **Run database migrations**:
   ```bash
   uv run alembic upgrade head
   ```

5. **Start the FastAPI backend server**:
   ```bash
   uv run uvicorn src.main:app --reload --port 8000
   ```
   * Interactive API Documentation (Swagger UI): `http://127.0.0.1:8000/docs`

---

### 2. Frontend Setup

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install Node dependencies**:
   ```bash
   npm install
   ```

3. **Start the Vite development server**:
   ```bash
   npm run dev
   ```
   * Open the web app at: `http://localhost:5173`

---

## 🧪 Key API Endpoints

### 🩺 Doctor & Consultation Management
* `POST /doctor/consultations/upload` — Upload doctor-patient audio file for transcription & AI extraction.
* `GET /doctor/consultations` — List consultations with real-time status and stage tracking.
* `GET /doctor/reports/{report_id}` — View synthesized draft SOAP report.
* `PATCH /doctor/reports/{report_id}` — Update/edit draft report fields.
* `POST /doctor/reports/{report_id}/approve` — Physician sign-off & trigger ChromaDB RAG vectorization.

### 💬 Grounded Clinical RAG Assistant
* `GET /doctor/patients/{patient_id}/ai/sessions` — List all persistent chat sessions for a patient.
* `POST /doctor/patients/{patient_id}/ai/sessions` — Create a new multi-turn conversation session.
* `GET /doctor/patients/{patient_id}/ai/sessions/{session_id}` — Fetch conversation turn history.
* `DELETE /doctor/patients/{patient_id}/ai/sessions/{session_id}` — Delete a chat session.
* `POST /doctor/patients/{patient_id}/ai/sessions/{session_id}/ask` — Submit multi-turn query, retrieve grounded consultation chunks, and generate an answer with evidence citations.

---

## 🔒 Security & Privacy Notes
* **Strict Role-Based Access Control**: API endpoints enforce role checks (`DOCTOR`, `PATIENT`, `ADMIN`).
* **Physician in the Loop**: AI draft notes require clinical sign-off before official EHR persistence and RAG indexing.
* **Grounded Retrieval**: RAG prompts enforce adherence strictly to verified medical transcripts and approved doctor documentation to eliminate hallucinations.

---

## 📄 License
This project is licensed under the **MIT License**.
