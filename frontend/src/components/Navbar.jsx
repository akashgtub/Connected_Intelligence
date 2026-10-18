import React from "react";
import { Network, Database, Sparkles, Terminal, Activity, Brain } from "lucide-react";

export default function Navbar({ activeTab, setActiveTab, dbStatus, onOpenWorkspace }) {
  const isConnected = dbStatus?.connected;

  return (
    <header style={{
      position: "sticky",
      top: 0,
      zIndex: 50,
      background: "rgba(5, 11, 22, 0.85)",
      backdropFilter: "blur(16px)",
      borderBottom: "1px solid var(--border-subtle)",
      padding: "0 2rem"
    }}>
      <div style={{
        maxWidth: 1300,
        margin: "0 auto",
        height: 72,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        {/* Brand */}
        <div 
          onClick={() => setActiveTab("landing")}
          style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
        >
          <div style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            background: "linear-gradient(135deg, #3478FF 0%, #1D4ED8 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 15px rgba(52, 120, 255, 0.4)"
          }}>
            <Network size={22} color="#FFFFFF" />
          </div>
          <span style={{ fontSize: "1.15rem", fontWeight: 700, letterSpacing: "-0.02em", color: "#FFFFFF" }}>
            Connected <span style={{ color: "var(--accent-blue)" }}>Intelligence</span>
          </span>
        </div>

        {/* Navigation items */}
        <nav style={{ display: "flex", alignItems: "center", gap: "1.75rem" }}>
          <button 
            onClick={() => setActiveTab("landing")}
            style={{
              background: "none",
              border: "none",
              color: activeTab === "landing" ? "#FFFFFF" : "var(--text-muted)",
              fontWeight: activeTab === "landing" ? 600 : 500,
              fontSize: "0.95rem",
              cursor: "pointer",
              transition: "color 0.2s ease"
            }}
          >
            Home
          </button>
          <button 
            onClick={() => { setActiveTab("dashboard"); onOpenWorkspace?.(); }}
            style={{
              background: "none",
              border: "none",
              color: activeTab === "dashboard" ? "var(--accent-cyan)" : "var(--text-muted)",
              fontWeight: 500,
              fontSize: "0.95rem",
              cursor: "pointer"
            }}
          >
            Dashboard
          </button>
          <button 
            onClick={() => { setActiveTab("investigate"); onOpenWorkspace?.(); }}
            style={{
              background: "none",
              border: "none",
              color: activeTab === "investigate" ? "var(--accent-cyan)" : "var(--text-muted)",
              fontWeight: 500,
              fontSize: "0.95rem",
              cursor: "pointer"
            }}
          >
            AI Agent
          </button>
          <button 
            onClick={() => { setActiveTab("graph"); onOpenWorkspace?.(); }}
            style={{
              background: "none",
              border: "none",
              color: activeTab === "graph" ? "var(--accent-cyan)" : "var(--text-muted)",
              fontWeight: 500,
              fontSize: "0.95rem",
              cursor: "pointer"
            }}
          >
            Knowledge Graph
          </button>
          <button 
            onClick={() => { setActiveTab("incidents"); onOpenWorkspace?.(); }}
            style={{
              background: "none",
              border: "none",
              color: activeTab === "incidents" ? "var(--accent-cyan)" : "var(--text-muted)",
              fontWeight: 500,
              fontSize: "0.95rem",
              cursor: "pointer"
            }}
          >
            Incidents
          </button>
          <button 
            onClick={() => { setActiveTab("memory"); onOpenWorkspace?.(); }}
            style={{
              background: "none",
              border: "none",
              color: activeTab === "memory" ? "var(--accent-cyan)" : "var(--text-muted)",
              fontWeight: 500,
              fontSize: "0.95rem",
              cursor: "pointer"
            }}
          >
            Memory
          </button>
        </nav>

        {/* Right CTA & FalkorDB Status */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {/* Status Indicator */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "5px 12px",
            borderRadius: 20,
            background: isConnected ? "rgba(16, 185, 129, 0.12)" : "rgba(239, 68, 68, 0.12)",
            border: `1px solid ${isConnected ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)"}`,
            fontSize: "0.8rem",
            fontWeight: 500
          }}>
            <span style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: isConnected ? "var(--accent-green)" : "var(--accent-red)",
              boxShadow: isConnected ? "0 0 8px var(--accent-green)" : "0 0 8px var(--accent-red)"
            }} />
            <span style={{ color: isConnected ? "#34D399" : "#F87171" }}>
              {isConnected ? "FalkorDB Active" : "FalkorDB Offline"}
            </span>
          </div>

          <button
            onClick={() => {
              setActiveTab("investigate");
              onOpenWorkspace?.();
            }}
            className="btn-primary"
            style={{ padding: "8px 18px", fontSize: "0.9rem" }}
          >
            Get Started →
          </button>
        </div>
      </div>
    </header>
  );
}
