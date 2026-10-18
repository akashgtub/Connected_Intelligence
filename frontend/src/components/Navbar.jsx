import React from "react";
import { Network } from "lucide-react";

export default function Navbar({ activeTab, setActiveTab, dbStatus, onOpenWorkspace }) {
  const isConnected = dbStatus?.connected;

  const navItems = [
    { id: "landing", label: "Home" },
    { id: "dashboard", label: "Dashboard" },
    { id: "investigate", label: "AI Agent" },
    { id: "graph", label: "Knowledge Graph" },
    { id: "incidents", label: "Incidents" },
    { id: "memory", label: "Memory" },
  ];

  return (
    <header style={{
      position: "sticky",
      top: 0,
      zIndex: 50,
      background: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(16px)",
      borderBottom: "1px solid var(--border-subtle)",
      boxShadow: "0 2px 12px rgba(109, 40, 217, 0.03)",
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
            width: 40,
            height: 40,
            borderRadius: 12,
            background: "linear-gradient(135deg, #6D28D9 0%, #8B5CF6 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(109, 40, 217, 0.25)"
          }}>
            <Network size={22} color="#FFFFFF" strokeWidth={2.2} />
          </div>
          <span style={{ fontSize: "1.2rem", fontWeight: 800, letterSpacing: "-0.02em", color: "var(--text-main)" }}>
            Connected <span style={{ color: "var(--accent-purple)" }}>Intelligence</span>
          </span>
        </div>

        {/* Navigation items as clean enterprise pills */}
        <nav style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          background: "#FAF8FF",
          padding: "5px 6px",
          borderRadius: 12,
          border: "1px solid var(--border-subtle)"
        }}>
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                style={{
                  background: isActive ? "#6D28D9" : "transparent",
                  color: isActive ? "#FFFFFF" : "var(--text-muted)",
                  fontWeight: isActive ? 600 : 500,
                  fontSize: "0.88rem",
                  padding: "7px 16px",
                  borderRadius: 8,
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  boxShadow: isActive ? "0 2px 8px rgba(109, 40, 217, 0.25)" : "none"
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = "var(--accent-purple)";
                    e.currentTarget.style.background = "#F5F0FF";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = "var(--text-muted)";
                    e.currentTarget.style.background = "transparent";
                  }
                }}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right CTA & FalkorDB Status */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {/* Status Indicator */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 12px",
            borderRadius: 20,
            background: isConnected ? "#ECFDF5" : "#FEF2F2",
            border: `1px solid ${isConnected ? "#A7F3D0" : "#FECACA"}`,
            fontSize: "0.8rem",
            fontWeight: 600
          }}>
            <span style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: isConnected ? "var(--accent-green)" : "var(--accent-red)",
              boxShadow: isConnected ? "0 0 6px var(--accent-green)" : "0 0 6px var(--accent-red)"
            }} />
            <span style={{ color: isConnected ? "#059669" : "#DC2626" }}>
              {isConnected ? "FalkorDB Active" : "FalkorDB Offline"}
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              setActiveTab("investigate");
              onOpenWorkspace?.();
            }}
            className="btn-primary"
            style={{ padding: "9px 18px", fontSize: "0.9rem" }}
          >
            Launch Workspace →
          </button>
        </div>
      </div>
    </header>
  );
}
