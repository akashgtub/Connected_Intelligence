import React from "react";
import { Search, Brain, Users, ShieldCheck, ArrowRight } from "lucide-react";

const FEATURES = [
  {
    icon: Search,
    color: "#6D28D9",
    bg: "#F5F0FF",
    border: "#DDD6FE",
    title: "Find Connected Insights",
    desc: "Follow multi-hop relationships across people, projects, systems and documents.",
    action: "Explore Graph"
  },
  {
    icon: Brain,
    color: "#059669",
    bg: "#ECFDF5",
    border: "#A7F3D0",
    title: "Remember Across Sessions",
    desc: "Persistent memory that grows with every interaction directly inside FalkorDB.",
    action: "View Memories"
  },
  {
    icon: Users,
    color: "#2563EB",
    bg: "#EFF6FF",
    border: "#BFDBFE",
    title: "Take Action with Context",
    desc: "Make informed decisions grounded in verified organizational graph data.",
    action: "Launch Agent"
  },
  {
    icon: ShieldCheck,
    color: "#D97706",
    bg: "#FFFBEB",
    border: "#FDE68A",
    title: "Explain Every Answer",
    desc: "See the exact path, node attributes, and Cypher evidence behind each recommendation.",
    action: "Test Investigation"
  }
];

export default function FeatureCards({ onSelectFeature }) {
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
            onClick={() => onSelectFeature?.(i)}
            style={{
              padding: "1.6rem 1.4rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: "1rem",
              cursor: onSelectFeature ? "pointer" : "default"
            }}
          >
            <div>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: f.bg,
                border: `1px solid ${f.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 8px rgba(33, 24, 59, 0.04)",
                marginBottom: "1rem"
              }}>
                <IconComponent size={22} color={f.color} strokeWidth={2.2} />
              </div>

              <h3 style={{
                fontSize: "1.05rem",
                fontWeight: 700,
                color: "var(--text-main)",
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

            {onSelectFeature && (
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: "0.82rem",
                fontWeight: 600,
                color: f.color,
                marginTop: 4
              }}>
                <span>{f.action}</span>
                <ArrowRight size={13} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
