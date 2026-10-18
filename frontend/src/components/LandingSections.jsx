import React from "react";
import { GitBranch, BrainCircuit, ShieldAlert } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Connect & Ingest Knowledge",
      desc: "Systems, incidents, postmortems, teams, and architectural decisions are ingested into FalkorDB's native graph structure using MERGE-based idempotent Cypher.",
      icon: GitBranch,
      color: "#6D28D9",
      bg: "#F5F0FF"
    },
    {
      num: "02",
      title: "Multi-Hop Cypher Reasoning",
      desc: "When a service degrades, the agent performs real multi-hop traversals connecting the incident to upstream dependencies, past resolutions, and the exact engineers who solved it.",
      icon: BrainCircuit,
      color: "#2563EB",
      bg: "#EFF6FF"
    },
    {
      num: "03",
      title: "Persistent Graph Memory",
      desc: "Every investigation stores an explainable evidence path into FalkorDB Memory nodes. Cross-session recall ensures your organization never solves the same bug twice.",
      icon: ShieldAlert,
      color: "#059669",
      bg: "#ECFDF5"
    }
  ];

  return (
    <section style={{ margin: "5rem 0 4rem" }}>
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <span style={{
          fontSize: "0.8rem",
          fontWeight: 700,
          color: "var(--accent-purple)",
          textTransform: "uppercase",
          letterSpacing: "0.08em"
        }}>
          HOW IT WORKS
        </span>
        <h2 style={{ fontSize: "2.2rem", fontWeight: 800, color: "var(--text-main)", marginTop: 8 }}>
          From Disconnected Silos to Graph Intelligence
        </h2>
        <p style={{ fontSize: "0.98rem", color: "var(--text-muted)", maxWidth: 600, margin: "10px auto 0" }}>
          A 3-step continuous intelligence loop powered natively by FalkorDB.
        </p>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "1.5rem"
      }}>
        {steps.map((st, i) => {
          const Icon = st.icon;
          return (
            <div
              key={i}
              className="glow-card"
              style={{
                padding: "2rem 1.6rem",
                display: "flex",
                flexDirection: "column",
                gap: 14,
                position: "relative"
              }}
            >
              <div style={{
                fontSize: "2.2rem",
                fontWeight: 900,
                color: "#E9E3F5",
                fontFamily: "var(--font-mono)",
                lineHeight: 1
              }}>
                {st.num}
              </div>

              <div style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: st.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <Icon size={22} color={st.color} strokeWidth={2.2} />
              </div>

              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text-main)" }}>
                {st.title}
              </h3>

              <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
                {st.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function ArchitectureSection() {
  return (
    <section style={{
      margin: "4rem 0 5rem",
      background: "#FAF8FF",
      border: "1px solid var(--border-subtle)",
      borderRadius: 20,
      padding: "2.5rem 2rem",
      boxShadow: "var(--shadow-sm)"
    }}>
      <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
        <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--accent-purple)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          SYSTEM ARCHITECTURE
        </span>
        <h2 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-main)", marginTop: 6 }}>
          Native FalkorDB Graph Engine
        </h2>
        <p style={{ fontSize: "0.95rem", color: "var(--text-muted)", maxWidth: 650, margin: "8px auto 0" }}>
          Engineered for microsecond graph traversals across millions of entities and relationships.
        </p>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "1.5rem"
      }}>
        {/* Layer 1 */}
        <div style={{
          background: "#FFFFFF",
          borderRadius: 14,
          padding: "1.6rem",
          border: "1px solid var(--border-subtle)",
          boxShadow: "0 2px 8px rgba(109, 40, 217, 0.04)"
        }}>
          <div style={{ color: "var(--accent-purple)", fontWeight: 700, fontSize: "0.85rem", marginBottom: 6 }}>
            1. Graph Core
          </div>
          <h4 style={{ color: "var(--text-main)", fontSize: "1.1rem", fontWeight: 700, marginBottom: 8 }}>
            FalkorDB Engine
          </h4>
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
            Executes multi-hop Cypher queries in microseconds using Redis protocol. Persists Person, System, Incident, Decision, and Memory nodes.
          </p>
        </div>

        {/* Layer 2 */}
        <div style={{
          background: "#FFFFFF",
          borderRadius: 14,
          padding: "1.6rem",
          border: "1px solid var(--border-subtle)",
          boxShadow: "0 2px 8px rgba(109, 40, 217, 0.04)"
        }}>
          <div style={{ color: "#2563EB", fontWeight: 700, fontSize: "0.85rem", marginBottom: 6 }}>
            2. Agent Intelligence
          </div>
          <h4 style={{ color: "var(--text-main)", fontSize: "1.1rem", fontWeight: 700, marginBottom: 8 }}>
            FastAPI Graph Agent
          </h4>
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
            Automated entity detection, parameterized Cypher generation, evidence path construction, and persistent cross-session memory management.
          </p>
        </div>

        {/* Layer 3 */}
        <div style={{
          background: "#FFFFFF",
          borderRadius: 14,
          padding: "1.6rem",
          border: "1px solid var(--border-subtle)",
          boxShadow: "0 2px 8px rgba(109, 40, 217, 0.04)"
        }}>
          <div style={{ color: "#059669", fontWeight: 700, fontSize: "0.85rem", marginBottom: 6 }}>
            3. User Experience
          </div>
          <h4 style={{ color: "var(--text-main)", fontSize: "1.1rem", fontWeight: 700, marginBottom: 8 }}>
            Enterprise Workspace
          </h4>
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
            Interactive SVG knowledge graph with pan/zoom, incident investigation chat with evidence steps, and persistent memory explorer.
          </p>
        </div>
      </div>
    </section>
  );
}

export function Footer({ onOpenWorkspace }) {
  return (
    <footer style={{
      borderTop: "1px solid var(--border-subtle)",
      padding: "3rem 2rem 2rem",
      marginTop: "4rem",
      background: "#FFFFFF"
    }}>
      <div style={{
        maxWidth: 1200,
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "1.5rem"
      }}>
        <div>
          <div style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--text-main)" }}>
            Connected <span style={{ color: "var(--accent-purple)" }}>Intelligence</span>
          </div>
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: 4 }}>
            Connected Knowledge. Smarter Decisions. Built for Graph Hacks 2026.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
            Primary Track: <strong style={{ color: "var(--text-main)" }}>Company Brain</strong>
          </span>
          <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
            Powered by <strong style={{ color: "var(--accent-purple)" }}>FalkorDB</strong>
          </span>
          <button 
            onClick={onOpenWorkspace}
            className="btn-primary" 
            style={{ padding: "8px 18px", fontSize: "0.85rem" }}
          >
            Launch Workspace →
          </button>
        </div>
      </div>

      <div style={{
        maxWidth: 1200,
        margin: "2rem auto 0",
        textAlign: "center",
        fontSize: "0.78rem",
        color: "var(--text-dim)",
        borderTop: "1px solid var(--border-subtle)",
        paddingTop: "1.2rem"
      }}>
        © 2026 Connected Intelligence. Graph Hacks 2026 Submission. All graph operations powered by FalkorDB.
      </div>
    </footer>
  );
}
