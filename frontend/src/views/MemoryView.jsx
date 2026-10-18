import React, { useEffect, useState } from "react";
import { 
  Brain, 
  Search, 
  ArrowRight, 
  Clock, 
  Database, 
  AlertTriangle, 
  RefreshCw 
} from "lucide-react";
import { fetchMemories } from "../api";

export default function MemoryView({ onContinueInvestigation, dbStatus }) {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  const loadMemories = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchMemories(search);
      setMemories(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMemories();
  }, [dbStatus?.connected]);

  const handleSearch = (e) => {
    e.preventDefault();
    loadMemories();
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "1rem 0" }}>
      {/* Title */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <Brain size={22} color="var(--accent-purple)" />
            <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--text-main)" }}>
              FalkorDB Persistent Memories
            </h1>
          </div>
          <p style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
            Cross-session investigations, solutions, and architectural learnings stored persistently as Memory nodes.
          </p>
        </div>

        <form onSubmit={handleSearch} style={{ display: "flex", alignItems: "center", gap: 8 }}>
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
              placeholder="Search memories..."
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                color: "var(--text-main)",
                fontSize: "0.82rem",
                width: 180
              }}
            />
          </div>
          <button type="submit" className="btn-secondary" style={{ padding: "6px 14px", fontSize: "0.82rem" }}>
            Search
          </button>
          <button type="button" onClick={loadMemories} className="btn-secondary" style={{ padding: "6px 12px" }}>
            <RefreshCw size={14} className={loading ? "pulse-glow" : ""} />
          </button>
        </form>
      </div>

      {/* Memory Cards */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "4rem 0", color: "var(--accent-purple)" }}>
          <RefreshCw size={24} className="pulse-glow" style={{ margin: "0 auto 10px" }} />
          <div>Retrieving persistent memories from FalkorDB...</div>
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
            Could not retrieve memories
          </div>
          <div style={{ fontSize: "0.85rem", color: "#7F1D1D", marginTop: 4 }}>
            {error}. Start FalkorDB via Docker to load cross-session graph memory.
          </div>
        </div>
      ) : memories.length === 0 ? (
        <div className="white-card" style={{ padding: "3.5rem 2rem", textAlign: "center" }}>
          <Database size={36} color="var(--accent-purple)" style={{ margin: "0 auto 12px" }} />
          <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text-main)", marginBottom: 8 }}>
            No Persistent Memories Found
          </h3>
          <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", maxWidth: 450, margin: "0 auto 1.5rem" }}>
            Investigate any incident or question in the AI Agent workspace and click "Save Investigation" to persist findings into FalkorDB.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
          {memories.map((mem) => (
            <div
              key={mem.id}
              className="white-card"
              style={{
                padding: "1.6rem",
                display: "flex",
                flexDirection: "column",
                gap: 12
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{
                      padding: "3px 8px",
                      borderRadius: 6,
                      background: "#F5F0FF",
                      color: "var(--accent-purple)",
                      border: "1px solid #DDD6FE",
                      fontSize: "0.75rem",
                      fontWeight: 700
                    }}>
                      FalkorDB Memory: {mem.id}
                    </span>
                    {mem.linked_incident && (
                      <span style={{
                        padding: "3px 8px",
                        borderRadius: 6,
                        background: "#FFFBEB",
                        color: "#D97706",
                        border: "1px solid #FDE68A",
                        fontSize: "0.75rem",
                        fontWeight: 600
                      }}>
                        Ref: {mem.linked_incident}
                      </span>
                    )}
                    {mem.linked_system && (
                      <span style={{
                        padding: "3px 8px",
                        borderRadius: 6,
                        background: "#EFF6FF",
                        color: "#2563EB",
                        border: "1px solid #BFDBFE",
                        fontSize: "0.75rem",
                        fontWeight: 600
                      }}>
                        System: {mem.linked_system}
                      </span>
                    )}
                  </div>
                  <h3 style={{ fontSize: "1.18rem", fontWeight: 700, color: "var(--text-main)" }}>
                    {mem.title}
                  </h3>
                </div>

                <button
                  onClick={() => onContinueInvestigation(mem.question)}
                  className="btn-primary"
                  style={{ padding: "8px 16px", fontSize: "0.85rem", gap: 6 }}
                >
                  Continue Investigation <ArrowRight size={14} />
                </button>
              </div>

              {/* Summary */}
              <div style={{ fontSize: "0.92rem", color: "var(--text-main)", lineHeight: 1.55 }}>
                {mem.summary}
              </div>

              {/* Stored recommendations */}
              {mem.recommendations && mem.recommendations.length > 0 && (
                <div style={{
                  background: "#FAF8FF",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: 10,
                  padding: "12px 16px"
                }}>
                  <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--accent-purple)", marginBottom: 8, letterSpacing: "0.04em" }}>
                    PERSISTED MITIGATION PROTOCOL:
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {mem.recommendations.map((rec, i) => (
                      <div key={i} style={{ fontSize: "0.85rem", color: "var(--text-main)", display: "flex", gap: 8 }}>
                        <span style={{ color: "var(--accent-purple)", fontWeight: 700 }}>✓</span>
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Timestamp */}
              <div style={{
                fontSize: "0.78rem",
                color: "var(--text-muted)",
                display: "flex",
                alignItems: "center",
                gap: 6,
                borderTop: "1px solid var(--border-subtle)",
                paddingTop: 8
              }}>
                <Clock size={13} /> Stored in FalkorDB: {mem.timestamp?.replace("T", " ").slice(0, 19)} UTC
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
