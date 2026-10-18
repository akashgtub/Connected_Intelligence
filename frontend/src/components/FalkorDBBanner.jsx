import React, { useState } from "react";
import { Database, AlertTriangle, CheckCircle, RefreshCw, Copy, Check, Sparkles } from "lucide-react";
import { triggerSeed } from "../api";

export default function FalkorDBBanner({ dbStatus, onRefresh }) {
  const [copied, setCopied] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState(null);

  const isConnected = dbStatus?.connected;
  const dockerCmd = "docker run -p 6379:6379 -it --rm falkordb/falkordb";

  const handleCopy = () => {
    navigator.clipboard.writeText(dockerCmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSeed = async () => {
    try {
      setSeeding(true);
      const res = await triggerSeed();
      setSeedResult(`Seeded ${res.total_nodes} nodes & ${res.total_relationships} relationships!`);
      onRefresh?.();
      setTimeout(() => setSeedResult(null), 4000);
    } catch (err) {
      setSeedResult(`Seed error: ${err.message}`);
      setTimeout(() => setSeedResult(null), 4000);
    } finally {
      setSeeding(false);
    }
  };

  if (isConnected) {
    return (
      <div style={{
        background: "rgba(16, 185, 129, 0.08)",
        border: "1px solid rgba(16, 185, 129, 0.25)",
        borderRadius: 12,
        padding: "10px 18px",
        marginBottom: "1.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 12
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <CheckCircle size={18} color="#10B981" />
          <span style={{ fontSize: "0.85rem", color: "#E2E8F0" }}>
            <strong style={{ color: "#34D399" }}>FalkorDB Connected:</strong> Graph <code style={{ color: "#22D3EE" }}>{dbStatus.graph_name}</code> on port {dbStatus.port} ({dbStatus.node_count || 0} nodes, {dbStatus.relationship_count || 0} edges)
          </span>
          {seedResult && (
            <span style={{ fontSize: "0.8rem", color: "#FCD34D", background: "rgba(245, 158, 11, 0.15)", padding: "2px 8px", borderRadius: 6 }}>
              {seedResult}
            </span>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            onClick={handleSeed}
            disabled={seeding}
            style={{
              background: "rgba(16, 185, 129, 0.2)",
              border: "1px solid rgba(16, 185, 129, 0.4)",
              color: "#34D399",
              padding: "4px 12px",
              borderRadius: 6,
              fontSize: "0.8rem",
              fontWeight: 600,
              cursor: seeding ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: 5
            }}
          >
            <Sparkles size={13} /> {seeding ? "Seeding..." : "Re-Seed Graph"}
          </button>
          <button
            onClick={onRefresh}
            style={{
              background: "transparent",
              border: "none",
              color: "#94A3B8",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontSize: "0.8rem"
            }}
          >
            <RefreshCw size={13} />
          </button>
        </div>
      </div>
    );
  }

  // Disconnected Banner
  return (
    <div style={{
      background: "rgba(239, 68, 68, 0.08)",
      border: "1px solid rgba(239, 68, 68, 0.3)",
      borderRadius: 14,
      padding: "1rem 1.4rem",
      marginBottom: "2rem"
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
        <AlertTriangle size={22} color="#EF4444" style={{ flexShrink: 0, marginTop: 2 }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "0.92rem", fontWeight: 700, color: "#FCA5A5", marginBottom: 4 }}>
            FalkorDB is Not Reachable on {dbStatus?.host || "localhost"}:{dbStatus?.port || 6379}
          </div>
          <div style={{ fontSize: "0.82rem", color: "#CBD5E1", lineHeight: 1.5 }}>
            Connected Intelligence requires an active FalkorDB instance for genuine Cypher queries and persistent memory.
            Run the official Docker container locally:
          </div>
        </div>
      </div>

      {/* Terminal Command Snippet */}
      <div style={{
        background: "rgba(5, 11, 22, 0.85)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: 8,
        padding: "8px 12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontFamily: "var(--font-mono)",
        fontSize: "0.82rem",
        color: "#22D3EE",
        marginBottom: 10
      }}>
        <code>{dockerCmd}</code>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            onClick={handleCopy}
            style={{
              background: "rgba(52, 120, 255, 0.2)",
              border: "1px solid rgba(52, 120, 255, 0.4)",
              color: "#93C5FD",
              padding: "4px 8px",
              borderRadius: 5,
              fontSize: "0.75rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 4
            }}
          >
            {copied ? <Check size={12} color="#34D399" /> : <Copy size={12} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
        <span style={{ fontSize: "0.75rem", color: "#94A3B8" }}>
          Tip: Alternatively configure <code style={{ color: "#38BDF8" }}>FALKORDB_URL</code> or <code style={{ color: "#38BDF8" }}>FALKORDB_HOST</code> in <code style={{ color: "#CBD5E1" }}>backend/.env</code> for FalkorDB Cloud.
        </span>
        <button
          onClick={onRefresh}
          className="btn-secondary"
          style={{ padding: "5px 12px", fontSize: "0.78rem", gap: 5 }}
        >
          <RefreshCw size={12} /> Retry Connection
        </button>
      </div>
    </div>
  );
}
