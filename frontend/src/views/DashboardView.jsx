import React, { useEffect, useState } from "react";
import { 
  Database, 
  Share2, 
  AlertTriangle, 
  Brain, 
  ArrowRight, 
  Clock, 
  Sparkles,
  RefreshCw,
  AlertCircle
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
      setError(err.message || "Failed to load dashboard telemetry");
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
      color: "#6D28D9",
      bg: "#F5F0FF",
      border: "#DDD6FE",
      sub: "People, Systems, Incidents, Decisions"
    },
    {
      title: "Total Relationships",
      value: data?.total_relationships ?? 0,
      icon: Share2,
      color: "#2563EB",
      bg: "#EFF6FF",
      border: "#BFDBFE",
      sub: "AFFECTS, OWNS, USES, RESOLVED_BY"
    },
    {
      title: "Active & Past Incidents",
      value: data?.total_incidents ?? 0,
      icon: AlertTriangle,
      color: "#DC2626",
      bg: "#FEF2F2",
      border: "#FECACA",
      sub: "Seeded company incident records"
    },
    {
      title: "Persistent Memories",
      value: data?.total_investigations ?? 0,
      icon: Brain,
      color: "#059669",
      bg: "#ECFDF5",
      border: "#A7F3D0",
      sub: "Cross-session FalkorDB memories"
    }
  ];

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "1rem 0" }}>
      {/* Title & Refresh */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: "1.9rem", fontWeight: 800, color: "var(--text-main)", letterSpacing: "-0.02em" }}>
            Company Brain Dashboard
          </h1>
          <p style={{ fontSize: "0.92rem", color: "var(--text-muted)", marginTop: 4 }}>
            Real-time graph intelligence telemetry directly from FalkorDB.
          </p>
        </div>
        <button
          type="button"
          onClick={loadData}
          className="btn-secondary"
          style={{ padding: "8px 16px", fontSize: "0.88rem", gap: 6 }}
        >
          <RefreshCw size={14} className={loading ? "pulse-glow" : ""} /> Refresh Telemetry
        </button>
      </div>

      {/* Error alert if any */}
      {error && (
        <div style={{
          background: "#FEF2F2",
          border: "1px solid #FECACA",
          borderRadius: 12,
          padding: "1rem 1.4rem",
          marginBottom: "1.5rem",
          display: "flex",
          alignItems: "center",
          gap: 12
        }}>
          <AlertCircle size={20} color="#DC2626" />
          <span style={{ fontSize: "0.88rem", color: "#991B1B" }}>{error}</span>
        </div>
      )}

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
              className="white-card"
              style={{
                padding: "1.5rem",
                display: "flex",
                flexDirection: "column",
                gap: 12
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-muted)" }}>
                  {s.title}
                </span>
                <div style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: s.bg,
                  border: `1px solid ${s.border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <Icon size={18} color={s.color} />
                </div>
              </div>

              <div style={{ fontSize: "2.4rem", fontWeight: 800, color: "var(--text-main)", lineHeight: 1 }}>
                {loading ? "..." : s.value}
              </div>

              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                {s.sub}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Launch & Recent Investigations Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "2rem", marginBottom: "2.5rem" }}>
        {/* Quick Launch Action Card */}
        <div style={{
          background: "linear-gradient(135deg, #F5F0FF 0%, #FFFFFF 100%)",
          border: "1px solid #DDD6FE",
          borderRadius: 16,
          padding: "1.8rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          boxShadow: "var(--shadow-sm)"
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <Sparkles size={18} color="var(--accent-purple)" />
              <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--accent-purple)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Quick Investigation
              </span>
            </div>
            <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--text-main)", marginBottom: 8 }}>
              Investigate Payment Outage (INC-1140)
            </h3>
            <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.6, marginBottom: "1.5rem" }}>
              Explore how Connected Intelligence traverses relationships from Payment Service to PostgreSQL, identifies INC-1042 historical resolution, and pages Alex Chen.
            </p>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => onNavigate("investigate", "Our payment system is down with database timeouts. What should we do?", "INC-1140")}
              className="btn-primary"
              style={{ padding: "10px 18px", fontSize: "0.9rem" }}
            >
              Start Investigation <ArrowRight size={15} />
            </button>
            <button
              type="button"
              onClick={() => onNavigate("graph")}
              className="btn-secondary"
              style={{ padding: "10px 18px", fontSize: "0.9rem" }}
            >
              Open Graph Explorer
            </button>
          </div>
        </div>

        {/* Recent Investigations List */}
        <div className="white-card" style={{ padding: "1.8rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.2rem" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-main)" }}>
              Recent Graph Memories
            </h3>
            <button 
              type="button"
              onClick={() => onNavigate("memory")}
              style={{ background: "none", border: "none", color: "var(--accent-purple)", fontSize: "0.82rem", cursor: "pointer", fontWeight: 600 }}
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
                    padding: "10px 14px",
                    background: "#FAF8FF",
                    borderRadius: 10,
                    border: "1px solid var(--border-subtle)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 10
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--text-main)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {inv.title}
                    </div>
                    <div style={{ fontSize: "0.76rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                      <Clock size={11} /> {inv.timestamp?.slice(0, 10)} · {inv.linked_incident || "General"}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigate("investigate", inv.question, inv.linked_incident)}
                    style={{
                      background: "#F5F0FF",
                      border: "1px solid #DDD6FE",
                      color: "var(--accent-purple)",
                      padding: "4px 10px",
                      borderRadius: 6,
                      fontSize: "0.76rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      flexShrink: 0
                    }}
                  >
                    Investigate
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ fontSize: "0.88rem", color: "var(--text-muted)", padding: "2rem 0", textAlign: "center" }}>
              {dbStatus?.connected ? "No investigations saved yet. Run your first investigation in the AI Agent tab." : "FalkorDB is offline. Connect FalkorDB to load persistent memories."}
            </div>
          )}
        </div>
      </div>

      {/* Seeded Incidents Table */}
      <div className="white-card" style={{ padding: "1.8rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.2rem", flexWrap: "wrap", gap: 8 }}>
          <div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-main)" }}>
              Active & Past Incidents
            </h3>
            <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
              Incidents stored in FalkorDB with full relationship history
            </span>
          </div>
          <button 
            type="button"
            onClick={() => onNavigate("incidents")}
            style={{ background: "none", border: "none", color: "var(--accent-purple)", fontSize: "0.82rem", cursor: "pointer", fontWeight: 600 }}
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
                  padding: "12px 16px",
                  borderRadius: 10,
                  background: "#FAF8FF",
                  border: "1px solid var(--border-subtle)",
                  flexWrap: "wrap",
                  gap: 10
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{
                    padding: "3px 8px",
                    borderRadius: 6,
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    background: inc.severity === "P0" ? "#FEF2F2" : "#FFFBEB",
                    color: inc.severity === "P0" ? "#DC2626" : "#D97706",
                    border: `1px solid ${inc.severity === "P0" ? "#FECACA" : "#FDE68A"}`
                  }}>
                    {inc.severity}
                  </span>
                  <div>
                    <div style={{ fontSize: "0.92rem", fontWeight: 700, color: "var(--text-main)" }}>
                      <span style={{ color: "var(--accent-purple)", marginRight: 6 }}>{inc.id}:</span>
                      {inc.title}
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: 2 }}>
                      System: <strong style={{ color: "var(--text-main)" }}>{inc.affected_system}</strong> · Status: {inc.status}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onNavigate("investigate", `Our ${inc.affected_system} is experiencing an incident matching ${inc.id}. What should we do?`, inc.id)}
                  style={{
                    background: "#F5F0FF",
                    border: "1px solid #DDD6FE",
                    color: "var(--accent-purple)",
                    padding: "6px 14px",
                    borderRadius: 8,
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 4
                  }}
                >
                  Investigate <ArrowRight size={13} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ fontSize: "0.88rem", color: "var(--text-muted)", textAlign: "center", padding: "2rem 0" }}>
            {dbStatus?.connected ? "No incidents loaded. Click 'Re-Seed Graph' above to populate synthetic data." : "Connect FalkorDB to explore company incident records."}
          </div>
        )}
      </div>
    </div>
  );
}
