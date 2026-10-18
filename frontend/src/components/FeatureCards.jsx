import React from "react";
import { Search, Brain, Users, ShieldCheck } from "lucide-react";

const FEATURES = [
  {
    icon: Search,
    color: "#A855F7",
    bg: "rgba(168, 85, 247, 0.15)",
    border: "rgba(168, 85, 247, 0.35)",
    title: "Find Connected Insights",
    desc: "Follow relationships across people, projects, systems and documents."
  },
  {
    icon: Brain,
    color: "#10B981",
    bg: "rgba(16, 185, 129, 0.15)",
    border: "rgba(16, 185, 129, 0.35)",
    title: "Remember Across Sessions",
    desc: "Persistent memory that grows with every interaction in FalkorDB."
  },
  {
    icon: Users,
    color: "#3B82F6",
    bg: "rgba(59, 130, 246, 0.15)",
    border: "rgba(59, 130, 246, 0.35)",
    title: "Take Action with Context",
    desc: "Make informed decisions using real multi-hop graph relationships."
  },
  {
    icon: ShieldCheck,
    color: "#F59E0B",
    bg: "rgba(245, 158, 11, 0.15)",
    border: "rgba(245, 158, 11, 0.35)",
    title: "Explain Every Answer",
    desc: "See the exact path and evidence behind each recommendation."
  }
];

export default function FeatureCards() {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
      gap: "1.5rem",
      marginTop: "3rem",
      marginBottom: "4rem"
    }}>
      {FEATURES.map((f, i) => {
        const IconComponent = f.icon;
        return (
          <div
            key={i}
            className="glow-card"
            style={{
              background: "rgba(13, 25, 48, 0.7)",
              backdropFilter: "blur(14px)",
              border: "1px solid var(--border-subtle)",
              borderRadius: 16,
              padding: "1.6rem 1.4rem",
              display: "flex",
              flexDirection: "column",
              gap: "1rem"
            }}
          >
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: f.bg,
              border: `1px solid ${f.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 0 16px ${f.bg}`
            }}>
              <IconComponent size={22} color={f.color} strokeWidth={2.2} />
            </div>

            <div>
              <h3 style={{
                fontSize: "1.05rem",
                fontWeight: 700,
                color: "#FFFFFF",
                marginBottom: 6
              }}>
                {f.title}
              </h3>
              <p style={{
                fontSize: "0.85rem",
                color: "var(--text-muted)",
                lineHeight: 1.5
              }}>
                {f.desc}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
