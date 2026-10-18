import React, { useEffect, useState } from "react";
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  ArrowRight, 
  Search, 
  Sparkles, 
  Server, 
  User, 
  RefreshCw 
} from "lucide-react";
import { fetchIncidents } from "../api";

export default function IncidentsView({ onInvestigateIncident, dbStatus }) {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState("ALL");

  const loadIncidents = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchIncidents();
      setIncidents(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIncidents();
  }, [dbStatus?.connected]);

  const filtered = incidents.filter((inc) => {
    const matchesSearch = !search || 
      inc.title.toLowerCase().includes(search.toLowerCase()) ||
      inc.id.toLowerCase().includes(search.toLowerCase()) ||
      inc.affected_system.toLowerCase().includes(search.toLowerCase());
    const matchesSev = selectedSeverity === "ALL" || inc.severity === selectedSeverity;
    return matchesSearch && matchesSev;
  });

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "1rem 0" }}>
      {/* Title */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#FFFFFF" }}>
            Seeded Company Incidents
          </h1>
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
            Incidents and outages stored in FalkorDB with real system dependencies and resolution playbooks.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            background: "rgba(13, 25, 48, 0.8)",
            border: "1px solid var(--border-subtle)",
            borderRadius: 8,
            padding: "6px 12px",
            display: "flex",
            alignItems: "center",
            gap: 6
          }}>
            <Search size={14} color="var(--text-dim)" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search incidents or systems..."
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                color: "#FFFFFF",
                fontSize: "0.82rem",
                width: 200
              }}
            />
          </div>

          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            style={{
              background: "rgba(13, 25, 48, 0.8)",
              border: "1px solid var(--border-subtle)",
              color: "#E2E8F0",
              borderRadius: 8,
              padding: "6px 10px",
              fontSize: "0.82rem",
              outline: "none"
            }}
          >
            <option value="ALL">All Severities</option>
            <option value="P0">P0 - Critical</option>
            <option value="P1">P1 - High</option>
            <option value="P2">P2 - Moderate</option>
          </select>

          <button onClick={loadIncidents} className="btn-secondary" style={{ padding: "6px 10px" }}>
            <RefreshCw size={14} className={loading ? "pulse-glow" : ""} />
          </button>
        </div>
      </div>

      {/* Incidents Table / Cards */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "4rem 0", color: "var(--accent-cyan)" }}>
          <RefreshCw size={24} className="pulse-glow" style={{ margin: "0 auto 10px" }} />
          <div>Querying incident nodes from FalkorDB...</div>
        </div>
      ) : error ? (
        <div style={{
          background: "rgba(239, 68, 68, 0.1)",
          border: "1px solid rgba(239, 68, 68, 0.3)",
          borderRadius: 12,
          padding: "2rem",
          textAlign: "center"
        }}>
          <AlertTriangle size={28} color="#EF4444" style={{ margin: "0 auto 8px" }} />
          <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#FCA5A5" }}>
            Could not load incidents
          </div>
          <div style={{ fontSize: "0.82rem", color: "#E2E8F0", marginTop: 4 }}>
            {error}. Start FalkorDB via Docker to access seeded incident records.
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem 0", color: "var(--text-muted)" }}>
          No incidents match your filter.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {filtered.map((inc) => (
            <div
              key={inc.id}
              className="glow-card"
              style={{
                background: "rgba(13, 25, 48, 0.75)",
                border: "1px solid var(--border-subtle)",
                borderRadius: 14,
                padding: "1.4rem",
                display: "flex",
                flexDirection: "column",
                gap: 12
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{
                    padding: "4px 10px",
                    borderRadius: 6,
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    background: inc.severity === "P0" ? "rgba(239, 68, 68, 0.2)" : inc.severity === "P1" ? "rgba(245, 158, 11, 0.2)" : "rgba(52, 120, 255, 0.2)",
                    color: inc.severity === "P0" ? "#EF4444" : inc.severity === "P1" ? "#F59E0B" : "#93C5FD",
                    border: `1px solid ${inc.severity === "P0" ? "rgba(239,68,68,0.4)" : "rgba(245,158,11,0.4)"}`
                  }}>
                    {inc.severity}
                  </span>

                  <span style={{
                    fontSize: "0.75rem",
                    color: inc.status === "Resolved" ? "#34D399" : "#FBBF24",
                    background: inc.status === "Resolved" ? "rgba(16, 185, 129, 0.12)" : "rgba(245, 158, 11, 0.12)",
                    padding: "3px 8px",
                    borderRadius: 4,
                    fontWeight: 600
                  }}>
                    {inc.status}
                  </span>

                  <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#FFFFFF" }}>
                    <span style={{ color: "var(--accent-cyan)", marginRight: 6 }}>{inc.id}:</span>
                    {inc.title}
                  </h3>
                </div>

                <button
                  onClick={() => onInvestigateIncident(`Our ${inc.affected_system} is experiencing an incident matching ${inc.id}. What should we do?`, inc.id)}
                  className="btn-primary"
                  style={{ padding: "7px 14px", fontSize: "0.82rem", gap: 6 }}
                >
                  <Sparkles size={13} /> Investigate in Agent →
                </button>
              </div>

              {/* Description */}
              <p style={{ fontSize: "0.86rem", color: "#CBD5E1", lineHeight: 1.5 }}>
                {inc.description}
              </p>

              {/* Resolution if resolved */}
              {inc.resolution && (
                <div style={{
                  background: "rgba(16, 185, 129, 0.08)",
                  border: "1px solid rgba(16, 185, 129, 0.25)",
                  borderRadius: 8,
                  padding: "8px 12px",
                  fontSize: "0.8rem",
                  color: "#A7F3D0"
                }}>
                  <strong style={{ color: "#34D399" }}>Historical Resolution:</strong> {inc.resolution}
                </div>
              )}

              {/* Meta tags */}
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                fontSize: "0.78rem",
                color: "var(--text-dim)",
                borderTop: "1px solid var(--border-subtle)",
                paddingTop: 10
              }}>
                <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <Server size={13} color="var(--accent-blue)" /> Affected System: <strong style={{ color: "#F1F5F9" }}>{inc.affected_system}</strong>
                </span>
                {inc.assigned_engineer && (
                  <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <User size={13} color="var(--accent-purple)" /> Engineer: <strong style={{ color: "#F1F5F9" }}>{inc.assigned_engineer}</strong>
                  </span>
                )}
                <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <Clock size={13} /> {inc.created_at?.slice(0, 10)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
