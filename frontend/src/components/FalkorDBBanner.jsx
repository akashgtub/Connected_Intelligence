import React, { useState } from "react";
import { AlertTriangle, CheckCircle, RefreshCw, Copy, Check, Sparkles } from "lucide-react";
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
        background: "#ECFDF5",
        border: "1px solid #A7F3D0",
        borderRadius: 14,
        padding: "10px 18px",
        marginBottom: "1.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 12,
        boxShadow: "0 2px 8px rgba(5, 150, 105, 0.05)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <CheckCircle size={18} color="#059669" />
          <span style={{ fontSize: "0.85rem", color: "#065F46" }}>
            <strong style={{ color: "#047857" }}>FalkorDB Connected:</strong> Graph <code style={{ color: "#6D28D9", background: "#FAF8FF", padding: "2px 6px", borderRadius: 4, fontWeight: 700 }}>{dbStatus.graph_name}</code> {dbStatus.port ? `on port ${dbStatus.port}` : "(Remote Instance)"} ({dbStatus.node_count || 0} nodes, {dbStatus.relationship_count || 0} edges)
          </span>
          {seedResult && (
            <span style={{ fontSize: "0.8rem", color: "#92400E", background: "#FEF3C7", padding: "2px 8px", borderRadius: 6, fontWeight: 600 }}>
              {seedResult}
            </span>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            type="button"
            onClick={handleSeed}
            disabled={seeding}
            style={{
              background: "#FFFFFF",
              border: "1px solid #A7F3D0",
              color: "#059669",
              padding: "4px 12px",
              borderRadius: 8,
              fontSize: "0.8rem",
              fontWeight: 600,
              cursor: seeding ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: 5,
              boxShadow: "0 1px 3px rgba(5, 150, 105, 0.1)"
            }}
          >
            <Sparkles size={13} /> {seeding ? "Seeding..." : "Re-Seed Graph"}
          </button>
          <button
            type="button"
            onClick={onRefresh}
            style={{
              background: "transparent",
              border: "none",
              color: "#059669",
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
      background: "#FFF5F5",
      border: "1px solid #FECACA",
      borderRadius: 14,
      padding: "1.2rem 1.4rem",
      marginBottom: "2rem",
      boxShadow: "0 2px 10px rgba(220, 38, 38, 0.05)"
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
        <AlertTriangle size={22} color="#DC2626" style={{ flexShrink: 0, marginTop: 2 }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#991B1B", marginBottom: 4 }}>
            FalkorDB is Not Reachable {dbStatus?.url_configured ? "(Remote FalkorDB Instance)" : `on ${dbStatus?.host || "localhost"}:${dbStatus?.port || 6379}`}
          </div>
          <div style={{ fontSize: "0.84rem", color: "#7F1D1D", lineHeight: 1.5 }}>
            Connected Intelligence requires an active FalkorDB instance for genuine Cypher queries and persistent memory.
            {dbStatus?.url_configured 
              ? " Please verify your remote FALKORDB_URL configuration and database status."
              : " For local development, run the official Docker container below; for production, configure FALKORDB_URL in your Render Web Service environment variables."}
          </div>
        </div>
      </div>

      {/* Terminal Command Snippet */}
      <div style={{
        background: "#FFFFFF",
        border: "1px solid #E9E3F5",
        borderRadius: 8,
        padding: "8px 12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontFamily: "var(--font-mono)",
        fontSize: "0.82rem",
        color: "#6D28D9",
        marginBottom: 10,
        boxShadow: "0 1px 3px rgba(109, 40, 217, 0.05)"
      }}>
        <code style={{ fontWeight: 600 }}>{dockerCmd}</code>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            onClick={handleCopy}
            style={{
              background: "#F5F0FF",
              border: "1px solid #DDD6FE",
              color: "#6D28D9",
              padding: "4px 10px",
              borderRadius: 6,
              fontSize: "0.75rem",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 4
            }}
          >
            {copied ? <Check size={12} color="#059669" /> : <Copy size={12} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
        <span style={{ fontSize: "0.78rem", color: "#6B647A" }}>
          Tip: Alternatively configure <code style={{ color: "#6D28D9", fontWeight: 600 }}>FALKORDB_URL</code> or <code style={{ color: "#6D28D9", fontWeight: 600 }}>FALKORDB_HOST</code> in <code style={{ color: "#21183B" }}>backend/.env</code> for FalkorDB Cloud.
        </span>
        <button
          onClick={onRefresh}
          className="btn-secondary"
          style={{ padding: "6px 14px", fontSize: "0.8rem", gap: 5 }}
        >
          <RefreshCw size={12} /> Retry Connection
        </button>
      </div>
    </div>
  );
}
