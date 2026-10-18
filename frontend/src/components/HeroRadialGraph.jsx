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
    color: "#A855F7",
    glow: "rgba(168, 85, 247, 0.4)",
    icon: Users,
    angle: 270, // Top
    dist: 175
  },
  {
    id: "documents",
    title: "Documents",
    subtitle: "Guides, wikis, reports",
    color: "#10B981",
    glow: "rgba(16, 185, 129, 0.4)",
    icon: FileText,
    angle: 315, // Top-Right
    dist: 185
  },
  {
    id: "projects",
    title: "Projects",
    subtitle: "What's being built?",
    color: "#F59E0B",
    glow: "rgba(245, 158, 11, 0.4)",
    icon: Box,
    angle: 0, // Right-Top
    dist: 190
  },
  {
    id: "incidents",
    title: "Incidents",
    subtitle: "What happened before?",
    color: "#EF4444",
    glow: "rgba(239, 68, 68, 0.4)",
    icon: AlertTriangle,
    angle: 45, // Right-Bottom
    dist: 185
  },
  {
    id: "teams",
    title: "Teams",
    subtitle: "Who owns what?",
    color: "#3B82F6",
    glow: "rgba(59, 130, 246, 0.4)",
    icon: Users2,
    angle: 90, // Bottom-Right
    dist: 175
  },
  {
    id: "decisions",
    title: "Decisions",
    subtitle: "Why was this chosen?",
    color: "#EC4899",
    glow: "rgba(236, 72, 153, 0.4)",
    icon: ClipboardCheck,
    angle: 135, // Bottom
    dist: 185
  },
  {
    id: "conversations",
    title: "Conversations",
    subtitle: "Questions and answers",
    color: "#06B6D4",
    glow: "rgba(6, 182, 212, 0.4)",
    icon: MessageSquare,
    angle: 180, // Bottom-Left
    dist: 190
  },
  {
    id: "systems",
    title: "Systems",
    subtitle: "What depends on what?",
    color: "#2563EB",
    glow: "rgba(37, 99, 235, 0.4)",
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
        <defs>
          <radialGradient id="hubGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.4" />
            <stop offset="60%" stopColor="#3478FF" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#050B16" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient Ring */}
        <circle cx={cx} cy={cy} r="180" fill="none" stroke="rgba(52, 120, 255, 0.12)" strokeWidth="1" strokeDasharray="4 6" />
        <circle cx={cx} cy={cy} r="110" fill="none" stroke="rgba(34, 211, 238, 0.1)" strokeWidth="1" />

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
                stroke={isSelected ? n.color : "rgba(52, 120, 255, 0.28)"}
                strokeWidth={isSelected ? 2.5 : 1.2}
                strokeDasharray={isSelected ? "none" : "3 3"}
                style={{ transition: "stroke 0.3s, stroke-width 0.3s" }}
              />
              {/* Animated pulse dot along line */}
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
        style={{
          position: "absolute",
          width: 120,
          height: 120,
          borderRadius: 24,
          background: "linear-gradient(135deg, #0A1935 0%, #061124 100%)",
          border: "2px solid #22D3EE",
          boxShadow: "0 0 35px rgba(34, 211, 238, 0.35), inset 0 0 20px rgba(52, 120, 255, 0.3)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
          cursor: "pointer",
          transition: "transform 0.3s ease"
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.06)"}
        onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
      >
        <div style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: "linear-gradient(135deg, #3478FF 0%, #22D3EE 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 6,
          boxShadow: "0 0 15px rgba(34, 211, 238, 0.6)"
        }}>
          <Database size={24} color="#050B16" strokeWidth={2.5} />
        </div>
        <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "#FFFFFF", letterSpacing: "0.02em" }}>
          FalkorDB
        </span>
        <span style={{ fontSize: "0.62rem", color: "#22D3EE", fontWeight: 600, letterSpacing: "0.08em" }}>
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
              left: x - 40,
              top: y - 40,
              width: 80,
              height: 80,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              zIndex: 15,
              transition: "transform 0.25s ease"
            }}
          >
            {/* Circular Glowing Icon */}
            <div style={{
              width: 46,
              height: 46,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${n.color}22 0%, #0A1324 85%)`,
              border: `2px solid ${isHovered ? n.color : `${n.color}88`}`,
              boxShadow: isHovered 
                ? `0 0 25px ${n.color}, inset 0 0 10px ${n.color}66`
                : `0 0 12px ${n.glow}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 4,
              transform: isHovered ? "scale(1.15)" : "scale(1)",
              transition: "all 0.25s ease"
            }}>
              <IconComponent size={20} color={n.color} strokeWidth={2.2} />
            </div>

            {/* Title & Subtitle */}
            <span style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              color: isHovered ? "#FFFFFF" : "#E2E8F0",
              textAlign: "center",
              lineHeight: 1.1
            }}>
              {n.title}
            </span>
            <span style={{
              fontSize: "0.58rem",
              color: "var(--text-dim)",
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
