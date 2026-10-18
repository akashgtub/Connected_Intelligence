import React, { useEffect, useState } from "react";
import { 
  Database, 
  Share2, 
  AlertTriangle, 
  Brain, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  Sparkles,
  RefreshCw
} from "lucide-react";
import { fetchDashboard } from "../api";

export default function DashboardView({ onNavigate, dbStatus }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchDashboard();
      setData(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [dbStatus?.connected]);

  const stats = [
    {
      title: "Total Graph Nodes",
      value: data?.total_nodes ?? 0,
      icon: Database,
      color: "#22D3EE",
      bg: "rgba(34, 211, 238, 0.12)",
      sub: "People, Systems, Incidents, Decisions"
    },
    {
      title: "Total Relationships",
      value: data?.total_relationships ?? 0,
      icon: Share2,
      color: "#3478FF",
      bg: "rgba(52, 120, 255, 0.12)",
      sub: "AFFECTS, OWNS, USES, RESOLVED_BY"
    },
    {
      title: "Active & Past Incidents",
      value: data?.total_incidents ?? 0,
      icon: AlertTriangle,
      color: "#EF4444",
      bg: "rgba(239, 68, 68, 0.12)",
      sub: "Seeded company incident records"
    },
    {
      title: "Persistent Memories",
      value: data?.total_investigations ?? 0,
      icon: Brain,
      color: "#10B981",
      bg: "rgba(16, 185, 129, 0.12)",
      sub: "Cross-session FalkorDB memories"
    }
  ];

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "1rem 0" }}>
      {/* Title & Refresh */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#FFFFFF", letterSpacing: "-0.02em" }}>
            Company Brain Dashboard
          </h1>
          <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginTop: 4 }}>
            Real-time graph intelligence telemetry directly from FalkorDB.
          </p>
        </div>
        <button
          onClick={loadData}
          className="btn-secondary"
          style={{ padding: "8px 14px", fontSize: "0.85rem", gap: 6 }}
        >
          <RefreshCw size={14} className={loading ? "pulse-glow" : ""} /> Refresh Telemetry
        </button>
      </div>

      {/* 4 Stat Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: "1.25rem",
        marginBottom: "2.5rem"
      }}>
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={idx}
              style={{
                background: "rgba(13, 25, 48, 0.7)",
                backdropFilter: "blur(12px)",
                border: "1px solid var(--border-subtle)",
                borderRadius: 16,
                padding: "1.4rem",
                display: "flex",
                flexDirection: "column",
                gap: 12
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-muted)" }}>
                  {s.title}
                </span>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: s.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <Icon size={18} color={s.color} />
                </div>
              </div>

              <div style={{ fontSize: "2.2rem", fontWeight: 800, color: "#FFFFFF", lineHeight: 1 }}>
                {loading ? "..." : s.value}
              </div>

              <div style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>
                {s.sub}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Launch & Recent Investigations Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "2.5rem" }}>
        {/* Quick Launch Action Card */}
        <div style={{
          background: "linear-gradient(135deg, rgba(52, 120, 255, 0.1) 0%, rgba(13, 25, 48, 0.8) 100%)",
          border: "1px solid rgba(52, 120, 255, 0.3)",
          borderRadius: 16,
          padding: "1.6rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <Sparkles size={18} color="#22D3EE" />
              <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--accent-cyan)", textTransform: "uppercase" }}>
                Quick Investigation
              </span>
            </div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#FFFFFF", marginBottom: 8 }}>
              Investigate Payment Outage (INC-1140)
            </h3>
            <p style={{ fontSize: "0.85rem", color: "#CBD5E1", lineHeight: 1.5, marginBottom: "1.5rem" }}>
              Explore how Connected Intelligence traverses relationships from Payment Service to PostgreSQL, identifies INC-1042 historical resolution, and pages Alex Chen.
            </p>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => onNavigate("investigate")}
              className="btn-primary"
              style={{ padding: "9px 16px", fontSize: "0.88rem" }}
            >
              Start Investigation <ArrowRight size={15} />
            </button>
            <button
              onClick={() => onNavigate("graph")}
              className="btn-secondary"
              style={{ padding: "9px 16px", fontSize: "0.88rem" }}
            >
              Open Graph Explorer
            </button>
          </div>
        </div>

        {/* Recent Investigations List */}
        <div style={{
          background: "rgba(13, 25, 48, 0.7)",
          border: "1px solid var(--border-subtle)",
          borderRadius: 16,
          padding: "1.6rem"
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
            <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#FFFFFF" }}>
              Recent Graph Memories
            </h3>
            <button 
              onClick={() => onNavigate("memory")}
              style={{ background: "none", border: "none", color: "var(--accent-blue)", fontSize: "0.8rem", cursor: "pointer", fontWeight: 600 }}
            >
              View All →
            </button>
          </div>

          {data?.recent_investigations && data.recent_investigations.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {data.recent_investigations.map((inv) => (
                <div 
                  key={inv.id}
                  style={{
                    padding: "10px 12px",
                    background: "rgba(5, 11, 22, 0.6)",
                    borderRadius: 10,
                    border: "1px solid var(--border-subtle)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between"
                  }}
                >
                  <div>
                    <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#F8FAFC" }}>
                      {inv.title}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-dim)", display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                      <Clock size={11} /> {inv.timestamp?.slice(0, 10)} · {inv.linked_incident || "General"}
                    </div>
                  </div>
                  <button
                    onClick={() => onNavigate("memory")}
                    style={{
                      background: "rgba(52, 120, 255, 0.15)",
                      border: "none",
                      color: "var(--accent-cyan)",
                      padding: "4px 8px",
                      borderRadius: 6,
                      fontSize: "0.75rem",
                      cursor: "pointer"
                    }}
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", padding: "1.5rem 0", textAlign: "center" }}>
              {dbStatus?.connected ? "No investigations saved yet. Run your first investigation in the AI Agent tab." : "FalkorDB is offline. Connect FalkorDB to load persistent memories."}
            </div>
          )}
        </div>
      </div>

      {/* Seeded Incidents Table */}
      <div style={{
        background: "rgba(13, 25, 48, 0.7)",
        border: "1px solid var(--border-subtle)",
        borderRadius: 16,
        padding: "1.6rem"
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.2rem" }}>
          <div>
            <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#FFFFFF" }}>
              Active & Past Incidents
            </h3>
            <span style={{ fontSize: "0.8rem", color: "var(--text-dim)" }}>
              Incidents stored in FalkorDB with full relationship history
            </span>
          </div>
          <button 
            onClick={() => onNavigate("incidents")}
            style={{ background: "none", border: "none", color: "var(--accent-blue)", fontSize: "0.8rem", cursor: "pointer", fontWeight: 600 }}
          >
            All Incidents →
          </button>
        </div>

        {data?.recent_incidents && data.recent_incidents.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {data.recent_incidents.map((inc) => (
              <div 
                key={inc.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 14px",
                  borderRadius: 8,
                  background: "rgba(5, 11, 22, 0.5)",
                  border: "1px solid var(--border-subtle)"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{
                    padding: "3px 8px",
                    borderRadius: 6,
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    background: inc.severity === "P0" ? "rgba(239, 68, 68, 0.2)" : "rgba(245, 158, 11, 0.2)",
                    color: inc.severity === "P0" ? "#EF4444" : "#F59E0B"
                  }}>
                    {inc.severity}
                  </span>
                  <div>
                    <div style={{ fontSize: "0.88rem", fontWeight: 600, color: "#FFFFFF" }}>
                      <span style={{ color: "var(--accent-cyan)", marginRight: 6 }}>{inc.id}:</span>
                      {inc.title}
                    </div>
                    <div style={{ fontSize: "0.76rem", color: "var(--text-dim)", marginTop: 2 }}>
                      System: <strong style={{ color: "#E2E8F0" }}>{inc.affected_system}</strong> · Status: {inc.status}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate("investigate")}
                  style={{
                    background: "rgba(52, 120, 255, 0.15)",
                    border: "1px solid rgba(52, 120, 255, 0.3)",
                    color: "#93C5FD",
                    padding: "5px 12px",
                    borderRadius: 6,
                    fontSize: "0.78rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 4
                  }}
                >
                  Investigate <ArrowRight size={12} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", textAlign: "center", padding: "1.5rem 0" }}>
            {dbStatus?.connected ? "No incidents loaded. Click 'Re-Seed Graph' above to populate synthetic data." : "Connect FalkorDB to explore company incident records."}
          </div>
        )}
      </div>
    </div>
  );
}
