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
    subgraph Frontend ["React 19 + Vite Enterprise UI (Render Static Site)"]
        UI["Landing Page / Workspace (Port 5173 / Production URL)"]
        Hero["SVG Radial Graph & Evidence Card"]
        Dash["Company Brain Dashboard"]
        Chat["AI Investigation Agent"]
        GraphExplorer["Knowledge Graph Explorer"]
        MemoryView["Persistent Memory Manager"]
    end

    subgraph Backend ["FastAPI Graph Agent (Render Web Service)"]
        API["FastAPI Orchestrator"]
        Agent["GraphAgentEngine"]
        Tools["Graph Tools (Cypher Traversals)"]
        HealthMgr["FalkorDB Connection Manager"]
    end

    subgraph GraphDB ["FalkorDB Engine (Remote Cloud / Docker)"]
        Falkor["FalkorDB (falkordb/falkordb:latest)"]
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

- **Graph Database:** FalkorDB (`falkordb/falkordb:latest` locally or [FalkorDB Cloud](https://falkordb.com/))
- **Database Driver:** Official Python Client `falkordb>=1.8.0` with Redis wire protocol
- **Backend:** Python 3.11, FastAPI, Uvicorn, Pydantic v2
- **Frontend:** React 19, Vite, Lucide React icons, Vanilla CSS Design System
- **Design System:** Light lavender & purple enterprise aesthetic (`#FAF8FF`, `#6D28D9`, `#8B5CF6`), Inter & JetBrains Mono typography

---

## 6. Production Deployment on Render

Both the **Frontend** and **Backend** are configured for deployment on **Render**.

### Step 1: Remote FalkorDB Database Instance

1. Create a free database at [FalkorDB Cloud](https://falkordb.com/) (or run a persistent remote FalkorDB instance).
2. Copy your connection URL:
   `falkor://username:password@your-instance.falkordb.cloud:port`
   *(Or for TLS/SSL: `falkors://username:password@your-instance.falkordb.cloud:port`)*
3. The graph name will be `company_brain`.

---

### Step 2: Deploy Backend Web Service (Render)

1. Log in to the [Render Dashboard](https://dashboard.render.com/) and click **New + > Web Service**.
2. Connect your Git repository.
3. Configure the service settings:
   - **Name:** `connected-intelligence-api`
   - **Root Directory:** `backend`
   - **Environment:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Plan:** Free
4. Add the following **Environment Variables**:
   | Variable | Value / Description |
   |---|---|
   | `PYTHON_VERSION` | `3.11.9` |
   | `FALKORDB_URL` | `falkor://username:password@your-instance.falkordb.cloud:port` |
   | `FALKORDB_GRAPH` | `company_brain` |
   | `FRONTEND_ORIGINS` | `https://connected-intelligence-ui.onrender.com` *(Set after creating frontend)* |
   | `OPENAI_API_KEY` | *(Optional; deterministic graph engine is used if omitted)* |
   | `GEMINI_API_KEY` | *(Optional)* |
5. Click **Create Web Service**. Note the deployed URL (e.g., `https://connected-intelligence-api.onrender.com`).

---

### Step 3: Deploy Frontend Static Site (Render)

1. In the Render Dashboard, click **New + > Static Site**.
2. Connect the same Git repository.
3. Configure the static site settings:
   - **Name:** `connected-intelligence-ui`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
4. Add the following **Environment Variable**:
   | Variable | Value / Description |
   |---|---|
   | `VITE_API_BASE_URL` | `https://connected-intelligence-api.onrender.com` *(Backend URL from Step 2)* |
5. Under **Redirects / Rewrites**, add the SPA rewrite rule:
   - **Type:** `Rewrite`
   - **Source:** `/*`
   - **Destination:** `/index.html`
6. Click **Create Static Site**.
7. Once deployed, copy your frontend URL (e.g. `https://connected-intelligence-ui.onrender.com`) and update the backend's `FRONTEND_ORIGINS` variable.

---

### Alternative: Automated 1-Click Blueprint (`render.yaml`)

This repository contains a validated [render.yaml](file:///c:/Connected_Intelligence/render.yaml) file. You can deploy both services in one step:
1. In Render Dashboard, click **New + > Blueprint**.
2. Select this repository. Render automatically reads `render.yaml` and provisions both `connected-intelligence-api` and `connected-intelligence-ui`.
3. Fill in `FALKORDB_URL`, `FRONTEND_ORIGINS`, and `VITE_API_BASE_URL` when prompted.

---

## 7. Production Troubleshooting

- **CORS Errors:** Ensure `FRONTEND_ORIGINS` on the backend matches the exact protocol and domain of the Render frontend (e.g. `https://connected-intelligence-ui.onrender.com`). The backend automatically permits `localhost` origins for local development alongside production.
- **Cold Starts on Render Free Tier:** Render free-tier web services spin down after 15 minutes of inactivity. The first API request after inactivity may take 30–50 seconds while the container initializes. The UI handles this gracefully with connection status indicators.
- **FalkorDB Connection Timeouts:** Verify that your FalkorDB Cloud instance allows connections from `0.0.0.0/0` (standard for serverless/cloud platforms). Check `/api/health` to confirm socket reachability without exposing credentials.
- **SPA 404 on Refresh:** Verify the Render Static Site has the rewrite rule `/* -> /index.html` configured.

---

## 8. Local Development Setup

### Option 1: 1-Click Windows Launcher (Easiest)
Double-click `run.bat` in the project root to start FalkorDB, FastAPI backend, and React frontend in separate windows. Run `stop.bat` to stop the FalkorDB container.

### Option 2: Manual 3-Terminal Execution

#### Terminal 1 — Start FalkorDB
```bash
docker compose up -d
# or: docker run -p 6379:6379 -it --rm falkordb/falkordb
```

#### Terminal 2 — Start Backend (Port 8000)
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
Interactive Swagger docs: `http://127.0.0.1:8000/docs`

#### Terminal 3 — Start Frontend (Port 5173)
```bash
cd frontend
npm install
npm run dev
```
Web Application: `http://127.0.0.1:5173`

---

## 9. Synthetic Data Seeding

The synthetic dataset represents **Apex Cloud Platform**, populated with:
- **6 People:** Alex Chen (Payment Platform Lead), Sarah Jenkins (Principal SRE), Marcus Vance (Security Lead), Elena Rostova (Staff DBA), Priyanshu Mehta (Full Stack), David Kim (DevOps).
- **3 Teams:** Payments & Billing, Core Infrastructure, Identity & Security.
- **5 Systems:** Payment Service, PostgreSQL Cluster, Auth Gateway, Billing Engine, Notification Service.
- **4 Projects:** Project Titan (v2 Modernization), Project Resilience (HA Database), Project Aegis (Zero-Trust), Project Horizon.
- **6 Incidents:** INC-1042 (Payment API DB Pool Exhaustion), INC-1055 (Auth Latency), INC-1078 (Webhook Storm), INC-1089 (Replica Lag), INC-1102 (Billing Renewal Timeout), INC-1140 (Active Payment Outage).
- **5 Decisions:** DEC-201 (HikariCP limits), DEC-202 (Read replica routing), DEC-203 (Token caching), DEC-204 (Retry jitter), DEC-205 (Automated failover).
- **Documents & Historical Postmortems.**

Seeding runs automatically on startup if the graph is empty, or can be triggered anytime via `POST /api/seed` or the **"Re-Seed Graph"** button in the dashboard. Seeding is fully idempotent using Cypher `MERGE`.

---

## 10. AI Coding Assistant Disclosure

This project was built pair-programming with Google DeepMind's Antigravity AI agent. Architecture, Cypher schemas, API endpoints, and React components were designed and validated to meet the Graph Hacks 2026 specifications.
