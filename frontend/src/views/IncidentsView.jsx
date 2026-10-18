import React, { useEffect, useState } from "react";
import { 
  AlertTriangle, 
  Search, 
  Sparkles, 
  Server, 
  User, 
  RefreshCw,
  Clock
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
          <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--text-main)" }}>
            Seeded Company Incidents
          </h1>
          <p style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
            Incidents and outages stored in FalkorDB with real system dependencies and resolution playbooks.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            background: "#FFFFFF",
            border: "1px solid var(--border-subtle)",
            borderRadius: 8,
            padding: "6px 12px",
            display: "flex",
            alignItems: "center",
            gap: 6,
            boxShadow: "var(--shadow-sm)"
          }}>
            <Search size={14} color="var(--text-muted)" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search incidents or systems..."
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                color: "var(--text-main)",
                fontSize: "0.82rem",
                width: 200
              }}
            />
          </div>

          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            style={{
              background: "#FFFFFF",
              border: "1px solid var(--border-subtle)",
              color: "var(--text-main)",
              borderRadius: 8,
              padding: "6px 12px",
              fontSize: "0.82rem",
              fontWeight: 500,
              outline: "none",
              boxShadow: "var(--shadow-sm)"
            }}
          >
            <option value="ALL">All Severities</option>
            <option value="P0">P0 - Critical</option>
            <option value="P1">P1 - High</option>
            <option value="P2">P2 - Moderate</option>
          </select>

          <button onClick={loadIncidents} className="btn-secondary" style={{ padding: "6px 12px" }}>
            <RefreshCw size={14} className={loading ? "pulse-glow" : ""} />
          </button>
        </div>
      </div>

      {/* Incidents Table / Cards */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "4rem 0", color: "var(--accent-purple)" }}>
          <RefreshCw size={24} className="pulse-glow" style={{ margin: "0 auto 10px" }} />
          <div>Querying incident nodes from FalkorDB...</div>
        </div>
      ) : error ? (
        <div style={{
          background: "#FEF2F2",
          border: "1px solid #FECACA",
          borderRadius: 14,
          padding: "2rem",
          textAlign: "center"
        }}>
          <AlertTriangle size={28} color="#DC2626" style={{ margin: "0 auto 8px" }} />
          <div style={{ fontSize: "1rem", fontWeight: 700, color: "#991B1B" }}>
            Could not load incidents
          </div>
          <div style={{ fontSize: "0.85rem", color: "#7F1D1D", marginTop: 4 }}>
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
              className="white-card"
              style={{
                padding: "1.5rem",
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
                    background: inc.severity === "P0" ? "#FEF2F2" : inc.severity === "P1" ? "#FFFBEB" : "#F5F0FF",
                    color: inc.severity === "P0" ? "#DC2626" : inc.severity === "P1" ? "#D97706" : "var(--accent-purple)",
                    border: `1px solid ${inc.severity === "P0" ? "#FECACA" : inc.severity === "P1" ? "#FDE68A" : "#DDD6FE"}`
                  }}>
                    {inc.severity}
                  </span>

                  <span style={{
                    fontSize: "0.75rem",
                    color: inc.status === "Resolved" ? "#059669" : "#D97706",
                    background: inc.status === "Resolved" ? "#ECFDF5" : "#FFFBEB",
                    border: `1px solid ${inc.status === "Resolved" ? "#A7F3D0" : "#FDE68A"}`,
                    padding: "3px 8px",
                    borderRadius: 6,
                    fontWeight: 600
                  }}>
                    {inc.status}
                  </span>

                  <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--text-main)" }}>
                    <span style={{ color: "var(--accent-purple)", marginRight: 6 }}>{inc.id}:</span>
                    {inc.title}
                  </h3>
                </div>

                <button
                  onClick={() => onInvestigateIncident(`Our ${inc.affected_system} is experiencing an incident matching ${inc.id}. What should we do?`, inc.id)}
                  className="btn-primary"
                  style={{ padding: "8px 16px", fontSize: "0.85rem", gap: 6 }}
                >
                  <Sparkles size={14} /> Investigate in Agent →
                </button>
              </div>

              {/* Description */}
              <p style={{ fontSize: "0.9rem", color: "var(--text-main)", lineHeight: 1.55 }}>
                {inc.description}
              </p>

              {/* Resolution if resolved */}
              {inc.resolution && (
                <div style={{
                  background: "#ECFDF5",
                  border: "1px solid #A7F3D0",
                  borderRadius: 10,
                  padding: "10px 14px",
                  fontSize: "0.84rem",
                  color: "#065F46"
                }}>
                  <strong style={{ color: "#047857" }}>Historical Resolution:</strong> {inc.resolution}
                </div>
              )}

              {/* Meta tags */}
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 18,
                fontSize: "0.8rem",
                color: "var(--text-muted)",
                borderTop: "1px solid var(--border-subtle)",
                paddingTop: 10
              }}>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Server size={14} color="var(--accent-purple)" /> Affected System: <strong style={{ color: "var(--text-main)" }}>{inc.affected_system}</strong>
                </span>
                {inc.assigned_engineer && (
                  <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <User size={14} color="#2563EB" /> Engineer: <strong style={{ color: "var(--text-main)" }}>{inc.assigned_engineer}</strong>
                  </span>
                )}
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Clock size={13} /> Created: {inc.created_at?.slice(0, 10)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
