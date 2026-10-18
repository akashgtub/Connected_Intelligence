# Connected Intelligence

> **Connected Knowledge. Smarter Decisions.**  
> *Built for Graph Hacks 2026, powered by FalkorDB.*  
> **Primary Track:** Company Brain | **Additional Track:** Agents That Act on Connected Data

---

## 1. Executive Summary & Problem Statement

Modern technology organizations scatter operational and architectural knowledge across disconnected systems:
- Production incident logs in PagerDuty / Datadog
- Architecture decisions in ADR documents and Confluence wikis
- System dependencies across Git repositories and Kubernetes specs
- Domain expertise trapped in individual engineers' heads

When a critical outage occurs (e.g. `Payment Service down with database timeouts`), responders scramble:
- Who authored or maintains this service?
- What downstream databases or gateways does it depend on?
- Has this exact error occurred before, and how was it solved?
- What architectural decisions (e.g., connection pool size limits) govern this system?

**Connected Intelligence** solves this problem by using **FalkorDB** as an active **Company Brain**. It constructs an interconnected property graph of People, Teams, Systems, Incidents, Decisions, Documents, and Cross-Session Memories. When an incident occurs, an AI agent traverses multi-hop graph relationships in FalkorDB, surfaces historical resolutions, identifies subject-matter experts, and provides explainable 4-step mitigation protocols.

---

## 2. Visual Architecture

```mermaid
graph TD
    subgraph Frontend ["React 19 + Vite Enterprise UI"]
        UI["Landing Page / Workspace (Port 5173)"]
        Hero["SVG Radial Graph & Evidence Card"]
        Dash["Company Brain Dashboard"]
        Chat["AI Investigation Agent"]
        GraphExplorer["Knowledge Graph Explorer"]
        MemoryView["Persistent Memory Manager"]
    end

    subgraph Backend ["FastAPI Graph Agent (Port 8000)"]
        API["FastAPI Orchestrator"]
        Agent["GraphAgentEngine"]
        Tools["Graph Tools (Cypher Traversals)"]
        HealthMgr["FalkorDB Connection Manager"]
    end

    subgraph GraphDB ["FalkorDB Graph Engine (Port 6379)"]
        Falkor["FalkorDB Server (falkordb/falkordb:latest)"]
        Graph["'company_brain' Property Graph"]
        Nodes["Nodes: Person, Team, System, Incident, Decision, Memory, Document"]
        Rels["Edges: AFFECTS, USES, OWNS, RESOLVED_BY, WORKED_ON, REFERENCES"]
    end

    UI -->|REST API / JSON| API
    API --> Agent
    Agent --> Tools
    Tools -->|Parameterized Cypher| Falkor
    HealthMgr -->|Ping / Telemetry| Falkor
    Falkor --> Graph
```

---

## 3. FalkorDB Graph Data Model & Ontology

### Node Labels
| Label | Description | Example Properties |
|---|---|---|
| `:Person` | Engineers, architects, and team leads | `id: 'person-alex'`, `name: 'Alex Chen'`, `role: 'Staff Backend Engineer'`, `skills: 'Python, Connection Pooling'` |
| `:Team` | Engineering squads & owners | `id: 'team-payments'`, `name: 'Payments & Billing Team'`, `lead: 'Alex Chen'` |
| `:System` | Microservices, databases, and gateways | `id: 'sys-payment'`, `name: 'Payment Service'`, `tier: 'Tier-1'`, `status: 'Degraded'` |
| `:Incident` | Active and historical outages | `id: 'INC-1042'`, `title: 'Database Timeout'`, `severity: 'P0'`, `resolution: 'HikariCP pool bump'` |
| `:Decision` | Architectural Decision Records (ADRs) | `id: 'DEC-201'`, `title: 'Connection Pool Hard Limits'`, `status: 'Approved'` |
| `:Document` | Postmortems, runbooks, and playbooks | `id: 'DOC-301'`, `title: 'Payment Runbook'`, `category: 'Runbook'` |
| `:Project` | Strategic modernization initiatives | `id: 'proj-titan'`, `name: 'Project Titan'`, `status: 'In Progress'` |
| `:Memory` | Cross-session investigation learnings | `id: 'mem-001'`, `title: 'Payment Outage Protocol'`, `timestamp: '2026-10-18'` |

### Relationship Types
| Relationship | From Node | To Node | Semantics |
|---|---|---|---|
| `:MEMBER_OF` | `Person` | `Team` | Engineer belongs to a squad |
| `:OWNS` | `Team` | `System` | Team has operational ownership of service |
| `:WORKED_ON` | `Person` | `System` / `Project` | Hands-on code contribution history |
| `:USES` | `System` | `System` | Downstream service or database dependency |
| `:AFFECTS` | `Incident` | `System` | Outage blast radius |
| `:RESOLVED_BY` | `Incident` | `Person` | Engineer who mitigated the incident |
| `:RELATED_TO` | `Incident` | `Incident` | Historical incident with identical root cause |
| `:ABOUT` | `Decision` / `Document` / `Memory` | `System` | Policy or guide governing a system |
| `:REFERENCES` | `Decision` / `Memory` | `Incident` | Postmortem learning citation |

---

## 4. Key Cypher Queries Executed Against FalkorDB

### A. Multi-Hop Graph Traversal (3+ Entity Types)
Traverses from an active system to downstream dependencies, finds similar historical incidents, identifies the resolving engineer, and retrieves the governing architectural decision:

```cypher
MATCH (sys:System)
WHERE toLower(sys.name) CONTAINS toLower($keyword)
OPTIONAL MATCH (sys)-[:USES]->(dep:System)
OPTIONAL MATCH (past_inc:Incident)-[:AFFECTS]->(sys)
OPTIONAL MATCH (past_inc)-[:RESOLVED_BY]->(eng:Person)
OPTIONAL MATCH (dec:Decision)-[:ABOUT]->(sys)
RETURN sys.name AS affected_system,
       dep.name AS dependency,
       past_inc.id AS historical_incident,
       past_inc.resolution AS historical_resolution,
       eng.name AS expert_engineer,
       dec.title AS governing_decision
LIMIT 5;
```

### B. Finding Domain Experts & Owners
```cypher
MATCH (p:Person)-[:WORKED_ON]->(s:System)
WHERE s.id = $system_id OR toLower(s.name) CONTAINS toLower($system_id)
RETURN p.name, p.role, p.email, 'WORKED_ON' AS context
UNION
MATCH (p:Person)<-[:RESOLVED_BY]-(i:Incident)
WHERE i.id = $system_id OR toLower(i.affected_system) CONTAINS toLower($system_id)
RETURN p.name, p.role, p.email, 'RESOLVED_INCIDENT' AS context;
```

### C. Persistent Memory Retrieval Across Sessions
```cypher
MATCH (m:Memory)
WHERE toLower(m.title) CONTAINS toLower($keyword)
   OR toLower(m.summary) CONTAINS toLower($keyword)
   OR toLower(m.question) CONTAINS toLower($keyword)
RETURN m.id, m.title, m.summary, m.question, m.recommendations, m.timestamp, m.linked_incident
ORDER BY m.timestamp DESC
LIMIT 10;
```

### D. Saving Investigation into Graph Memory
```cypher
CREATE (m:Memory {
    id: $id,
    title: $title,
    summary: $summary,
    question: $question,
    recommendations: $recs,
    timestamp: $ts,
    linked_incident: $inc,
    linked_system: $sys
});
MATCH (m:Memory {id: $id}), (i:Incident {id: $inc})
MERGE (m)-[:REFERENCES]->(i);
MATCH (m:Memory {id: $id}), (s:System {name: $sys})
MERGE (m)-[:ABOUT]->(s);
```

---

## 5. Technology Stack

- **Graph Database:** FalkorDB (`falkordb/falkordb:latest` on Redis port 6379)
- **Database Driver:** Official Python Client `falkordb>=1.8.0`
- **Backend:** Python 3.11, FastAPI, Uvicorn, Pydantic v2
- **Frontend:** React 19, Vite 8, Lucide React icons, Vanilla CSS Design System
- **Styling:** Midnight Navy aesthetic (`#050B16`), Electric Blue (`#3478FF`), Cyan (`#22D3EE`), Inter typography

---

## 6. How to Run the Application

### Step 1: Start FalkorDB

#### Option A: Local Docker (Recommended)
```bash
# Run official FalkorDB prebuilt Docker image:
docker run -p 6379:6379 -it --rm falkordb/falkordb

# OR using Docker Compose:
docker-compose up -d falkordb
```

#### Option B: FalkorDB Cloud
If running without local Docker, create a free database at [FalkorDB Cloud](https://falkordb.com/) and configure `backend/.env`:
```env
FALKORDB_URL=falkor://username:password@your-cloud-instance.falkordb.cloud:port
FALKORDB_GRAPH=company_brain
```

### Step 2: Start the Backend (FastAPI)
```bash
# Navigate to backend directory:
cd backend

# Install dependencies:
pip install -r requirements.txt

# Start the API server:
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
API runs at: `http://127.0.0.1:8000` (Interactive docs at `/docs`)

### Step 3: Start the Frontend (React + Vite)
```bash
# Navigate to frontend directory:
cd frontend

# Install npm dependencies:
npm install

# Start Vite dev server:
npm run dev
```
Open your browser at: `http://127.0.0.1:5173`

---

## 7. Synthetic Data Seeding

The synthetic dataset represents **Apex Cloud Platform**, populated with:
- **6 People:** Alex Chen (Payment Platform Lead), Sarah Jenkins (Principal SRE), Marcus Vance (Security Lead), Elena Rostova (Staff DBA), Priyanshu Mehta (Full Stack), David Kim (DevOps).
- **3 Teams:** Payments & Billing, Core Infrastructure, Identity & Security.
- **5 Systems:** Payment Service, PostgreSQL Cluster, Auth Gateway, Billing Engine, Notification Service.
- **4 Projects:** Project Titan (v2 Modernization), Project Resilience (HA Database), Project Aegis (Zero-Trust), Project Horizon.
- **6 Incidents:** INC-1042 (Payment API DB Pool Exhaustion), INC-1055 (Auth Latency), INC-1078 (Webhook Storm), INC-1089 (Replica Lag), INC-1102 (Billing Renewal Timeout), INC-1140 (Active Payment Outage).
- **5 Decisions:** DEC-201 (HikariCP limits), DEC-202 (Read replica routing), DEC-203 (Token caching), DEC-204 (Retry jitter), DEC-205 (Automated failover).
- **Documents & Historical Postmortems.**

Seeding runs automatically on startup if the graph is empty, or can be triggered anytime via `POST /api/seed` or the **"Re-Seed Graph"** button in the dashboard.

---

## 8. Verified End-to-End Test Results

1. **Backend Initialization:** FastAPI starts cleanly on port 8000 with lifespan check.
2. **Health Endpoint (`GET /api/health`):** Accurately detects FalkorDB socket state and provides actionable Docker instructions when disconnected.
3. **Dashboard Telemetry (`GET /api/dashboard`):** Returns real node and relationship counts without fake static mocks.
4. **Graph Agent Traversal (`POST /api/investigations`):** Executes multi-hop Cypher queries across System -> Incident -> Person -> Decision, returns explainable 5-step Evidence Paths, and persists memories into FalkorDB.
5. **Persistent Memory (`GET /api/memory` & `POST /api/memory`):** Saves cross-session investigation learnings and retrieves them dynamically.
6. **Production Build:** Vite production build compiles with 0 errors (`npm run build` succeeds).

---

## 9. Current Environment & Docker Blocker Disclosure

- **Docker Status:** Docker Desktop is not installed on this Windows environment (`shutil.which('docker')` returned `None`, and Windows registry inspection confirms Docker Desktop is absent).
- **System Behavior:** The application handles this gracefully. When FalkorDB is offline, the backend and frontend display a prominent connection banner with the exact command to run:  
  `docker run -p 6379:6379 -it --rm falkordb/falkordb`
- As soon as FalkorDB is started (via local Docker or FalkorDB Cloud URL in `.env`), the backend immediately establishes connectivity, auto-seeds the graph, and responds to real-time queries.

---

## 10. AI Coding Assistant Disclosure

This project was built pair-programming with Google DeepMind's Antigravity AI agent. Architecture, Cypher schemas, API endpoints, and React components were designed and validated to meet the Graph Hacks 2026 specifications.
