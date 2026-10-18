import React, { useEffect, useState } from "react";
import { 
  Brain, 
  Search, 
  Bookmark, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
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
            <Brain size={22} color="var(--accent-green)" />
            <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#FFFFFF" }}>
              FalkorDB Persistent Memories
            </h1>
          </div>
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
            Cross-session investigations, solutions, and architectural learnings stored persistently as Memory nodes.
          </p>
        </div>

        <form onSubmit={handleSearch} style={{ display: "flex", alignItems: "center", gap: 8 }}>
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
              placeholder="Search memories..."
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                color: "#FFFFFF",
                fontSize: "0.82rem",
                width: 180
              }}
            />
          </div>
          <button type="submit" className="btn-secondary" style={{ padding: "6px 12px", fontSize: "0.82rem" }}>
            Search
          </button>
          <button type="button" onClick={loadMemories} className="btn-secondary" style={{ padding: "6px 10px" }}>
            <RefreshCw size={14} className={loading ? "pulse-glow" : ""} />
          </button>
        </form>
      </div>

      {/* Memory Cards */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "4rem 0", color: "var(--accent-cyan)" }}>
          <RefreshCw size={24} className="pulse-glow" style={{ margin: "0 auto 10px" }} />
          <div>Retrieving persistent memories from FalkorDB...</div>
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
            Could not retrieve memories
          </div>
          <div style={{ fontSize: "0.82rem", color: "#E2E8F0", marginTop: 4 }}>
            {error}. Start FalkorDB via Docker to load cross-session graph memory.
          </div>
        </div>
      ) : memories.length === 0 ? (
        <div style={{
          background: "rgba(13, 25, 48, 0.6)",
          border: "1px solid var(--border-subtle)",
          borderRadius: 14,
          padding: "3rem",
          textAlign: "center"
        }}>
          <Database size={32} color="var(--accent-blue)" style={{ margin: "0 auto 10px" }} />
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#FFFFFF", marginBottom: 6 }}>
            No Persistent Memories Found
          </h3>
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", maxWidth: 450, margin: "0 auto 1.5rem" }}>
            Investigate any incident or question in the AI Agent workspace and click "Save Investigation" to persist findings into FalkorDB.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
          {memories.map((mem) => (
            <div
              key={mem.id}
              className="glow-card"
              style={{
                background: "rgba(13, 25, 48, 0.8)",
                border: "1px solid var(--border-subtle)",
                borderRadius: 14,
                padding: "1.4rem",
                display: "flex",
                flexDirection: "column",
                gap: 12
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{
                      padding: "2px 8px",
                      borderRadius: 4,
                      background: "rgba(16, 185, 129, 0.15)",
                      color: "#34D399",
                      fontSize: "0.72rem",
                      fontWeight: 700
                    }}>
                      FalkorDB Memory: {mem.id}
                    </span>
                    {mem.linked_incident && (
                      <span style={{
                        padding: "2px 8px",
                        borderRadius: 4,
                        background: "rgba(245, 158, 11, 0.15)",
                        color: "#FCD34D",
                        fontSize: "0.72rem",
                        fontWeight: 600
                      }}>
                        Ref: {mem.linked_incident}
                      </span>
                    )}
                    {mem.linked_system && (
                      <span style={{
                        padding: "2px 8px",
                        borderRadius: 4,
                        background: "rgba(52, 120, 255, 0.15)",
                        color: "#93C5FD",
                        fontSize: "0.72rem",
                        fontWeight: 600
                      }}>
                        System: {mem.linked_system}
                      </span>
                    )}
                  </div>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#FFFFFF" }}>
                    {mem.title}
                  </h3>
                </div>

                <button
                  onClick={() => onContinueInvestigation(mem.question)}
                  className="btn-primary"
                  style={{ padding: "7px 14px", fontSize: "0.82rem", gap: 6 }}
                >
                  Continue Investigation <ArrowRight size={13} />
                </button>
              </div>

              {/* Summary */}
              <div style={{ fontSize: "0.88rem", color: "#CBD5E1", lineHeight: 1.5 }}>
                {mem.summary}
              </div>

              {/* Stored recommendations */}
              {mem.recommendations && mem.recommendations.length > 0 && (
                <div style={{
                  background: "rgba(5, 11, 22, 0.5)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: 8,
                  padding: "10px 14px"
                }}>
                  <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "#94A3B8", marginBottom: 6 }}>
                    PERSISTED MITIGATION PROTOCOL:
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {mem.recommendations.map((rec, i) => (
                      <div key={i} style={{ fontSize: "0.8rem", color: "#E2E8F0", display: "flex", gap: 6 }}>
                        <span style={{ color: "var(--accent-cyan)" }}>✓</span>
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Timestamp */}
              <div style={{
                fontSize: "0.75rem",
                color: "var(--text-dim)",
                display: "flex",
                alignItems: "center",
                gap: 6,
                borderTop: "1px solid var(--border-subtle)",
                paddingTop: 8
              }}>
                <Clock size={12} /> Stored: {mem.timestamp?.replace("T", " ").slice(0, 19)} UTC
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
