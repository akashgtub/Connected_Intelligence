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
      background: "rgba(10, 19, 36, 0.9)",
      backdropFilter: "blur(20px)",
      borderRadius: 18,
      border: "1px solid rgba(52, 120, 255, 0.3)",
      boxShadow: "0 20px 45px rgba(0, 0, 0, 0.6), 0 0 30px rgba(52, 120, 255, 0.15)",
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
        background: "rgba(255, 255, 255, 0.04)",
        padding: "10px 14px",
        borderRadius: 12,
        border: "1px solid rgba(255, 255, 255, 0.06)"
      }}>
        <div style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #4F46E5, #9333EA)",
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
          <div style={{ fontSize: "0.85rem", color: "#F1F5F9", fontWeight: 500 }}>
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
          background: "linear-gradient(135deg, #0284C7, #22D3EE)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          boxShadow: "0 0 10px rgba(34, 211, 238, 0.4)"
        }}>
          <Sparkles size={16} color="#050B16" strokeWidth={2.5} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "0.85rem", color: "#E2E8F0", lineHeight: 1.4, marginBottom: 8 }}>
            I found a similar incident from 3 months ago. Here's what I recommend:
          </div>
          <ol style={{
            fontSize: "0.8rem",
            color: "#94A3B8",
            paddingLeft: "1.1rem",
            display: "flex",
            flexDirection: "column",
            gap: 4
          }}>
            <li>Check the database connection pool</li>
            <li>Verify the payment service logs</li>
            <li>Contact <strong style={{ color: "#F1F5F9" }}>Alex</strong> (fixed this previously)</li>
            <li>Review the incident report (<strong style={{ color: "var(--accent-cyan)" }}>INC-1042</strong>)</li>
          </ol>
        </div>
      </div>

      {/* Evidence Path Box */}
      <div style={{
        background: "rgba(5, 11, 22, 0.75)",
        borderRadius: 14,
        padding: "1rem",
        border: "1px solid rgba(52, 120, 255, 0.2)"
      }}>
        <div style={{
          fontSize: "0.75rem",
          fontWeight: 700,
          color: "#94A3B8",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          marginBottom: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          <span>Evidence Path (FalkorDB Traversal)</span>
          <span style={{ color: "var(--accent-blue)", fontSize: "0.7rem", fontWeight: 600 }}>5 Hops</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {/* Step 1 */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 24,
              height: 24,
              borderRadius: 6,
              background: "rgba(239, 68, 68, 0.15)",
              border: "1px solid rgba(239, 68, 68, 0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0
            }}>
              <AlertCircle size={13} color="#EF4444" />
            </div>
            <div style={{ flex: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "#F8FAFC" }}>Current Incident</span>
              <span style={{ fontSize: "0.72rem", color: "#94A3B8" }}>Payment service down</span>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-start", paddingLeft: 11 }}>
            <ArrowDown size={12} color="#475569" />
          </div>

          {/* Step 2 */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 24,
              height: 24,
              borderRadius: 6,
              background: "rgba(37, 99, 235, 0.15)",
              border: "1px solid rgba(37, 99, 235, 0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0
            }}>
              <Database size={13} color="#3B82F6" />
            </div>
            <div style={{ flex: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "#F8FAFC" }}>Related System</span>
              <span style={{ fontSize: "0.72rem", color: "#94A3B8" }}>PostgreSQL Cluster</span>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-start", paddingLeft: 11 }}>
            <ArrowDown size={12} color="#475569" />
          </div>

          {/* Step 3 */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 24,
              height: 24,
              borderRadius: 6,
              background: "rgba(245, 158, 11, 0.15)",
              border: "1px solid rgba(245, 158, 11, 0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0
            }}>
              <Server size={13} color="#F59E0B" />
            </div>
            <div style={{ flex: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "#F8FAFC" }}>Similar Past Incident</span>
              <span style={{ fontSize: "0.72rem", color: "#FCD34D" }}>INC-1042 (resolved)</span>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-start", paddingLeft: 11 }}>
            <ArrowDown size={12} color="#475569" />
          </div>

          {/* Step 4 */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 24,
              height: 24,
              borderRadius: 6,
              background: "rgba(168, 85, 247, 0.15)",
              border: "1px solid rgba(168, 85, 247, 0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0
            }}>
              <UserCheck size={13} color="#A855F7" />
            </div>
            <div style={{ flex: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "#F8FAFC" }}>Engineer</span>
              <span style={{ fontSize: "0.72rem", color: "#E9D5FF" }}>Alex Chen (fixed previously)</span>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-start", paddingLeft: 11 }}>
            <ArrowDown size={12} color="#475569" />
          </div>

          {/* Step 5 */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 24,
              height: 24,
              borderRadius: 6,
              background: "rgba(16, 185, 129, 0.15)",
              border: "1px solid rgba(16, 185, 129, 0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0
            }}>
              <CheckCircle2 size={13} color="#10B981" />
            </div>
            <div style={{ flex: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "#F8FAFC" }}>Solution</span>
              <span style={{ fontSize: "0.72rem", color: "#6EE7B7" }}>DB connection pool tuning</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button 
        onClick={onLaunchFullAgent}
        className="btn-primary" 
        style={{ width: "100%", padding: "10px", fontSize: "0.85rem", gap: 6 }}
      >
        <Play size={14} fill="#FFF" /> Run Live Investigation in Workspace
      </button>
    </div>
  );
}
