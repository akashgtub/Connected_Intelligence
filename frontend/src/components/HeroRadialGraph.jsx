import React, { useState } from "react";
import { 
  Users, 
  FileText, 
  Box, 
  AlertTriangle, 
  Users2, 
  ClipboardCheck, 
  MessageSquare, 
  Code2, 
  Database 
} from "lucide-react";

const NODES = [
  {
    id: "people",
    title: "People",
    subtitle: "Who knows what?",
    color: "#7C3AED",
    bg: "#F5F0FF",
    icon: Users,
    angle: 270, // Top
    dist: 175
  },
  {
    id: "documents",
    title: "Documents",
    subtitle: "Guides, wikis, reports",
    color: "#059669",
    bg: "#ECFDF5",
    icon: FileText,
    angle: 315, // Top-Right
    dist: 185
  },
  {
    id: "projects",
    title: "Projects",
    subtitle: "What's being built?",
    color: "#D97706",
    bg: "#FFFBEB",
    icon: Box,
    angle: 0, // Right-Top
    dist: 190
  },
  {
    id: "incidents",
    title: "Incidents",
    subtitle: "What happened before?",
    color: "#DC2626",
    bg: "#FEF2F2",
    icon: AlertTriangle,
    angle: 45, // Right-Bottom
    dist: 185
  },
  {
    id: "teams",
    title: "Teams",
    subtitle: "Who owns what?",
    color: "#2563EB",
    bg: "#EFF6FF",
    icon: Users2,
    angle: 90, // Bottom-Right
    dist: 175
  },
  {
    id: "decisions",
    title: "Decisions",
    subtitle: "Why was this chosen?",
    color: "#DB2777",
    bg: "#FDF2F8",
    icon: ClipboardCheck,
    angle: 135, // Bottom
    dist: 185
  },
  {
    id: "conversations",
    title: "Conversations",
    subtitle: "Questions and answers",
    color: "#0891B2",
    bg: "#ECFEFF",
    icon: MessageSquare,
    angle: 180, // Bottom-Left
    dist: 190
  },
  {
    id: "systems",
    title: "Systems",
    subtitle: "What depends on what?",
    color: "#6D28D9",
    bg: "#F5F0FF",
    icon: Code2,
    angle: 225, // Left
    dist: 185
  }
];

export default function HeroRadialGraph({ onNodeClick }) {
  const [activeNode, setActiveNode] = useState(null);
  const cx = 250;
  const cy = 250;

  return (
    <div style={{
      position: "relative",
      width: 500,
      height: 500,
      margin: "0 auto",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      userSelect: "none"
    }}>
      {/* SVG Connecting Ray Lines & Grid */}
      <svg 
        width="500" 
        height="500" 
        style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
      >
        {/* Subtle Ambient Rings */}
        <circle cx={cx} cy={cy} r="180" fill="none" stroke="#E9E3F5" strokeWidth="1" strokeDasharray="4 6" />
        <circle cx={cx} cy={cy} r="115" fill="none" stroke="#DDD6FE" strokeWidth="1.2" />

        {/* Connecting Lines */}
        {NODES.map((n) => {
          const rad = (n.angle * Math.PI) / 180;
          const x = cx + n.dist * Math.cos(rad);
          const y = cy + n.dist * Math.sin(rad);
          const isSelected = activeNode?.id === n.id;

          return (
            <g key={n.id}>
              <line 
                x1={cx} 
                y1={cy} 
                x2={x} 
                y2={y} 
                stroke={isSelected ? n.color : "#DDD6FE"}
                strokeWidth={isSelected ? 2.5 : 1.2}
                strokeDasharray={isSelected ? "none" : "3 3"}
                style={{ transition: "stroke 0.25s, stroke-width 0.25s" }}
              />
              {/* Pulse dot */}
              <circle 
                cx={(cx + x) / 2} 
                cy={(cy + y) / 2} 
                r={isSelected ? 3.5 : 2} 
                fill={n.color} 
                opacity={0.8}
              />
            </g>
          );
        })}
      </svg>

      {/* Central FalkorDB Hub */}
      <div 
        onClick={() => onNodeClick?.("graph")}
        style={{
          position: "absolute",
          width: 120,
          height: 120,
          borderRadius: 24,
          background: "#FFFFFF",
          border: "2px solid #6D28D9",
          boxShadow: "0 10px 30px rgba(109, 40, 217, 0.16), 0 2px 8px rgba(109, 40, 217, 0.08)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
          cursor: "pointer",
          transition: "transform 0.25s ease"
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.06)"}
        onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
      >
        <div style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: "linear-gradient(135deg, #6D28D9 0%, #8B5CF6 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 6,
          boxShadow: "0 4px 14px rgba(109, 40, 217, 0.35)"
        }}>
          <Database size={24} color="#FFFFFF" strokeWidth={2.2} />
        </div>
        <span style={{ fontSize: "0.88rem", fontWeight: 800, color: "var(--text-main)", letterSpacing: "-0.01em" }}>
          FalkorDB
        </span>
        <span style={{ fontSize: "0.62rem", color: "var(--accent-purple)", fontWeight: 700, letterSpacing: "0.08em" }}>
          GRAPH BRAIN
        </span>
      </div>

      {/* 8 Outer Nodes */}
      {NODES.map((n) => {
        const rad = (n.angle * Math.PI) / 180;
        const x = cx + n.dist * Math.cos(rad);
        const y = cy + n.dist * Math.sin(rad);
        const IconComponent = n.icon;
        const isHovered = activeNode?.id === n.id;

        return (
          <div
            key={n.id}
            onMouseEnter={() => setActiveNode(n)}
            onMouseLeave={() => setActiveNode(null)}
            onClick={() => onNodeClick?.(n.id)}
            style={{
              position: "absolute",
              left: x - 42,
              top: y - 42,
              width: 84,
              height: 84,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              zIndex: 15,
              transition: "transform 0.25s ease"
            }}
          >
            {/* Glowing Icon Circle */}
            <div style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: isHovered ? n.color : n.bg,
              border: `2px solid ${isHovered ? n.color : "#E9E3F5"}`,
              boxShadow: isHovered 
                ? `0 6px 20px ${n.color}55` 
                : "0 2px 8px rgba(33, 24, 59, 0.06)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 4,
              transform: isHovered ? "scale(1.15)" : "scale(1)",
              transition: "all 0.25s ease"
            }}>
              <IconComponent size={22} color={isHovered ? "#FFFFFF" : n.color} strokeWidth={2.2} />
            </div>

            {/* Title & Subtitle */}
            <span style={{
              fontSize: "0.78rem",
              fontWeight: 700,
              color: isHovered ? "var(--accent-purple)" : "var(--text-main)",
              textAlign: "center",
              lineHeight: 1.1
            }}>
              {n.title}
            </span>
            <span style={{
              fontSize: "0.6rem",
              color: "var(--text-muted)",
              textAlign: "center",
              whiteSpace: "nowrap"
            }}>
              {n.subtitle}
            </span>
          </div>
        );
      })}
    </div>
  );
}
