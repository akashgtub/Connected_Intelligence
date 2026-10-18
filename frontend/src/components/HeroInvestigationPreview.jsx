import React from "react";
import { 
  Sparkles, 
  ArrowDown, 
  Database, 
  Server, 
  UserCheck, 
  CheckCircle2, 
  AlertCircle,
  Play
} from "lucide-react";

export default function HeroInvestigationPreview({ onLaunchFullAgent }) {
  return (
    <div style={{
      width: "100%",
      maxWidth: 440,
      background: "#FFFFFF",
      borderRadius: 18,
      border: "1px solid var(--border-subtle)",
      boxShadow: "0 12px 35px rgba(109, 40, 217, 0.08), 0 2px 6px rgba(33, 24, 59, 0.04)",
      padding: "1.4rem",
      display: "flex",
      flexDirection: "column",
      gap: "1.1rem"
    }}>
      {/* User Bubble */}
      <div style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
        background: "#F5F0FF",
        padding: "10px 14px",
        borderRadius: 12,
        border: "1px solid #E9E3F5"
      }}>
        <div style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #6D28D9, #8B5CF6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "0.75rem",
          fontWeight: 700,
          color: "#FFF",
          flexShrink: 0
        }}>
          U
        </div>
        <div>
          <div style={{ fontSize: "0.86rem", color: "var(--text-main)", fontWeight: 600 }}>
            Our payment system is down. What should we do?
          </div>
        </div>
      </div>

      {/* AI Recommendation Header */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
        <div style={{
          width: 28,
          height: 28,
          borderRadius: 8,
          background: "linear-gradient(135deg, #6D28D9, #8B5CF6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          boxShadow: "0 2px 8px rgba(109, 40, 217, 0.25)"
        }}>
          <Sparkles size={16} color="#FFFFFF" strokeWidth={2.2} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "0.85rem", color: "var(--text-main)", lineHeight: 1.4, marginBottom: 8, fontWeight: 500 }}>
            I found a similar incident from 3 months ago. Here's what I recommend:
          </div>
          <ol style={{
            fontSize: "0.82rem",
            color: "var(--text-muted)",
            paddingLeft: "1.1rem",
            display: "flex",
            flexDirection: "column",
            gap: 4
          }}>
            <li>Check the database connection pool</li>
            <li>Verify the payment service logs</li>
            <li>Contact <strong style={{ color: "var(--text-main)" }}>Alex</strong> (fixed this previously)</li>
            <li>Review the incident report (<strong style={{ color: "var(--accent-purple)" }}>INC-1042</strong>)</li>
          </ol>
        </div>
      </div>

      {/* Evidence Path Box */}
      <div style={{
        background: "#FAF8FF",
        borderRadius: 14,
        padding: "1rem",
        border: "1px solid var(--border-subtle)"
      }}>
        <div style={{
          fontSize: "0.72rem",
          fontWeight: 700,
          color: "var(--accent-purple)",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          marginBottom: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          <span>Evidence Path (FalkorDB Traversal)</span>
          <span style={{ color: "var(--text-muted)", fontSize: "0.7rem", fontWeight: 600 }}>5 Hops</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {/* Step 1 */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 24,
              height: 24,
              borderRadius: 6,
              background: "#FEF2F2",
              border: "1px solid #FECACA",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0
            }}>
              <AlertCircle size={13} color="#DC2626" />
            </div>
            <div style={{ flex: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-main)" }}>Current Incident</span>
              <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Payment service down</span>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-start", paddingLeft: 11 }}>
            <ArrowDown size={12} color="#C4B5FD" />
          </div>

          {/* Step 2 */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 24,
              height: 24,
              borderRadius: 6,
              background: "#EFF6FF",
              border: "1px solid #BFDBFE",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0
            }}>
              <Database size={13} color="#2563EB" />
            </div>
            <div style={{ flex: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-main)" }}>Related System</span>
              <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>PostgreSQL Cluster</span>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-start", paddingLeft: 11 }}>
            <ArrowDown size={12} color="#C4B5FD" />
          </div>

          {/* Step 3 */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 24,
              height: 24,
              borderRadius: 6,
              background: "#FFFBEB",
              border: "1px solid #FDE68A",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0
            }}>
              <Server size={13} color="#D97706" />
            </div>
            <div style={{ flex: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-main)" }}>Similar Past Incident</span>
              <span style={{ fontSize: "0.72rem", color: "#B45309", fontWeight: 600 }}>INC-1042 (resolved)</span>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-start", paddingLeft: 11 }}>
            <ArrowDown size={12} color="#C4B5FD" />
          </div>

          {/* Step 4 */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 24,
              height: 24,
              borderRadius: 6,
              background: "#F5F0FF",
              border: "1px solid #DDD6FE",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0
            }}>
              <UserCheck size={13} color="#6D28D9" />
            </div>
            <div style={{ flex: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-main)" }}>Engineer</span>
              <span style={{ fontSize: "0.72rem", color: "#6D28D9", fontWeight: 600 }}>Alex Chen (fixed previously)</span>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-start", paddingLeft: 11 }}>
            <ArrowDown size={12} color="#C4B5FD" />
          </div>

          {/* Step 5 */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 24,
              height: 24,
              borderRadius: 6,
              background: "#ECFDF5",
              border: "1px solid #A7F3D0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0
            }}>
              <CheckCircle2 size={13} color="#059669" />
            </div>
            <div style={{ flex: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-main)" }}>Solution</span>
              <span style={{ fontSize: "0.72rem", color: "#047857", fontWeight: 600 }}>DB connection pool tuning</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button 
        onClick={onLaunchFullAgent}
        className="btn-primary" 
        style={{ width: "100%", padding: "10px", fontSize: "0.88rem", gap: 6 }}
      >
        <Play size={14} fill="#FFF" /> Run Live Investigation in Workspace
      </button>
    </div>
  );
}
