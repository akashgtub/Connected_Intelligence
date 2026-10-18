import React, { useEffect, useState, useRef } from "react";
import { 
  Network, 
  Search, 
  Filter, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Layers, 
  RefreshCw, 
  Info, 
  ArrowRight,
  Database
} from "lucide-react";
import { fetchGraph, fetchNodeDetails } from "../api";

const TYPE_COLORS = {
  Person: "#A855F7",
  System: "#2563EB",
  Incident: "#EF4444",
  Decision: "#EC4899",
  Document: "#10B981",
  Memory: "#14B8A6",
  Project: "#F59E0B",
  Team: "#3B82F6",
  Entity: "#94A3B8"
};

export default function GraphExplorerView({ dbStatus }) {
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("ALL");
  const [selectedNode, setSelectedNode] = useState(null);
  const [nodeDetails, setNodeDetails] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const containerRef = useRef(null);

  const loadGraph = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchGraph(100);
      setGraphData(res);
      if (res.nodes.length > 0) {
        handleSelectNode(res.nodes[0]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGraph();
  }, [dbStatus?.connected]);

  const handleSelectNode = async (node) => {
    setSelectedNode(node);
    try {
      const details = await fetchNodeDetails(node.id);
      setNodeDetails(details);
    } catch {
      setNodeDetails(null);
    }
  };

  const filteredNodes = graphData.nodes.filter((n) => {
    const matchesSearch = !search || n.label.toLowerCase().includes(search.toLowerCase()) || n.type.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterType === "ALL" || n.type === filterType;
    return matchesSearch && matchesFilter;
  });

  // Calculate layout coordinates for nodes in a multi-orbit layout
  const positionedNodes = filteredNodes.map((n, i) => {
    const total = filteredNodes.length || 1;
    const ring = i % 3; // 3 concentric orbits
    const radius = 130 + ring * 110;
    const angle = (i / total) * 2 * Math.PI;
    return {
      ...n,
      x: 450 + radius * Math.cos(angle),
      y: 350 + radius * Math.sin(angle)
    };
  });

  const nodeMap = new Map(positionedNodes.map(n => [n.id, n]));

  // Mouse pan handlers
  const handleMouseDown = (e) => {
    if (e.target.tagName === "svg" || e.target.tagName === "line") {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <div style={{ maxWidth: 1300, margin: "0 auto", padding: "1rem 0" }}>
      {/* Header & Controls */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "1.2rem",
        flexWrap: "wrap",
        gap: 12
      }}>
        <div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#FFFFFF" }}>
            FalkorDB Knowledge Graph Explorer
          </h1>
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
            Real-time interactive canvas showing live graph nodes, relationships, and multi-hop paths.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Search */}
          <div style={{
            background: "rgba(13, 25, 48, 0.8)",
            border: "1px solid var(--border-subtle)",
            borderRadius: 8,
            padding: "6px 10px",
            display: "flex",
            alignItems: "center",
            gap: 6
          }}>
            <Search size={14} color="var(--text-dim)" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search nodes or labels..."
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                color: "#FFFFFF",
                fontSize: "0.82rem",
                width: 170
              }}
            />
          </div>

          {/* Filter dropdown */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={{
              background: "rgba(13, 25, 48, 0.8)",
              border: "1px solid var(--border-subtle)",
              color: "#E2E8F0",
              borderRadius: 8,
              padding: "6px 10px",
              fontSize: "0.82rem",
              outline: "none",
              cursor: "pointer"
            }}
          >
            <option value="ALL">All Entity Types</option>
            <option value="System">Systems</option>
            <option value="Incident">Incidents</option>
            <option value="Person">People</option>
            <option value="Decision">Decisions</option>
            <option value="Document">Documents</option>
            <option value="Memory">Memories</option>
            <option value="Team">Teams</option>
            <option value="Project">Projects</option>
          </select>

          {/* Zoom buttons */}
          <button
            onClick={() => setZoom(z => Math.min(z + 0.2, 2.2))}
            className="btn-secondary"
            style={{ padding: "6px 10px" }}
            title="Zoom In"
          >
            <ZoomIn size={14} />
          </button>
          <button
            onClick={() => setZoom(z => Math.max(z - 0.2, 0.5))}
            className="btn-secondary"
            style={{ padding: "6px 10px" }}
            title="Zoom Out"
          >
            <ZoomOut size={14} />
          </button>
          <button
            onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
            className="btn-secondary"
            style={{ padding: "6px 10px" }}
            title="Reset View"
          >
            <Maximize2 size={14} />
          </button>
          <button
            onClick={loadGraph}
            className="btn-secondary"
            style={{ padding: "6px 10px" }}
            title="Reload from FalkorDB"
          >
            <RefreshCw size={14} className={loading ? "pulse-glow" : ""} />
          </button>
        </div>
      </div>

      {/* Main Graph Canvas + Details Panel Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "1.5rem" }}>
        {/* SVG Graph Viewport */}
        <div 
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          style={{
            height: 600,
            background: "radial-gradient(circle at center, #0B172E 0%, #050B16 85%)",
            border: "1px solid rgba(52, 120, 255, 0.25)",
            borderRadius: 16,
            overflow: "hidden",
            position: "relative",
            cursor: isDragging ? "grabbing" : "grab",
            boxShadow: "inset 0 0 30px rgba(0,0,0,0.6)"
          }}
        >
          {loading && (
            <div style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(5, 11, 22, 0.7)",
              zIndex: 30,
              color: "var(--accent-cyan)",
              fontSize: "0.9rem",
              gap: 8
            }}>
              <RefreshCw size={18} className="pulse-glow" /> Querying FalkorDB graph...
            </div>
          )}

          {error && (
            <div style={{
              position: "absolute",
              top: "40%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
              color: "#FCA5A5",
              zIndex: 20
            }}>
              <Database size={32} color="#EF4444" style={{ margin: "0 auto 10px" }} />
              <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>FalkorDB is Offline</div>
              <div style={{ fontSize: "0.8rem", color: "#94A3B8", marginTop: 4 }}>
                Start FalkorDB with Docker to explore live nodes.
              </div>
            </div>
          )}

          <svg 
            width="100%" 
            height="100%" 
            style={{ width: "100%", height: "100%" }}
          >
            <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
              {/* Edges */}
              {graphData.edges.map((e, idx) => {
                const s = nodeMap.get(e.source);
                const t = nodeMap.get(e.target);
                if (!s || !t) return null;
                const isConnectedToSelected = selectedNode && (selectedNode.id === s.id || selectedNode.id === t.id);

                return (
                  <g key={idx}>
                    <line
                      x1={s.x}
                      y1={s.y}
                      x2={t.x}
                      y2={t.y}
                      stroke={isConnectedToSelected ? "#22D3EE" : "rgba(52, 120, 255, 0.22)"}
                      strokeWidth={isConnectedToSelected ? 2 : 1}
                      strokeDasharray={isConnectedToSelected ? "none" : "2 2"}
                    />
                    {/* Relationship label */}
                    <text
                      x={(s.x + t.x) / 2}
                      y={(s.y + t.y) / 2 - 4}
                      fill={isConnectedToSelected ? "#93C5FD" : "#475569"}
                      fontSize={isConnectedToSelected ? "8" : "7"}
                      textAnchor="middle"
                      fontFamily="var(--font-mono)"
                    >
                      {e.type}
                    </text>
                  </g>
                );
              })}

              {/* Nodes */}
              {positionedNodes.map((n) => {
                const isSelected = selectedNode?.id === n.id;
                const color = TYPE_COLORS[n.type] || "#94A3B8";

                return (
                  <g 
                    key={n.id}
                    onClick={() => handleSelectNode(n)}
                    style={{ cursor: "pointer" }}
                  >
                    {/* Glow ring if selected */}
                    {isSelected && (
                      <circle
                        cx={n.x}
                        cy={n.y}
                        r={28}
                        fill="none"
                        stroke={color}
                        strokeWidth={2}
                        opacity={0.6}
                      />
                    )}
                    {/* Node circle */}
                    <circle
                      cx={n.x}
                      cy={n.y}
                      r={isSelected ? 18 : 14}
                      fill={color}
                      stroke="#050B16"
                      strokeWidth={2}
                      opacity={isSelected ? 1 : 0.85}
                    />
                    {/* Node Label */}
                    <text
                      x={n.x}
                      y={n.y + 28}
                      fill={isSelected ? "#FFFFFF" : "#CBD5E1"}
                      fontSize={isSelected ? "10" : "8"}
                      fontWeight={isSelected ? 700 : 500}
                      textAnchor="middle"
                      fontFamily="var(--font-sans)"
                    >
                      {n.label.length > 18 ? n.label.slice(0, 16) + "…" : n.label}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>

          {/* Canvas legend */}
          <div style={{
            position: "absolute",
            bottom: 12,
            left: 14,
            background: "rgba(5, 11, 22, 0.85)",
            backdropFilter: "blur(8px)",
            padding: "8px 12px",
            borderRadius: 8,
            border: "1px solid var(--border-subtle)",
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            fontSize: "0.72rem"
          }}>
            {Object.entries(TYPE_COLORS).map(([type, color]) => (
              <div key={type} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
                <span style={{ color: "#94A3B8" }}>{type}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Node Inspector Panel */}
        <div style={{
          background: "rgba(13, 25, 48, 0.85)",
          backdropFilter: "blur(14px)",
          border: "1px solid rgba(52, 120, 255, 0.25)",
          borderRadius: 16,
          padding: "1.4rem",
          display: "flex",
          flexDirection: "column",
          gap: 14,
          maxHeight: 600,
          overflowY: "auto"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, borderBottom: "1px solid var(--border-subtle)", paddingBottom: 10 }}>
            <Info size={16} color="var(--accent-cyan)" />
            <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#FFFFFF" }}>
              Entity Inspector
            </h3>
          </div>

          {selectedNode ? (
            <>
              <div>
                <span style={{
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  padding: "3px 8px",
                  borderRadius: 4,
                  background: `${TYPE_COLORS[selectedNode.type] || "#94A3B8"}22`,
                  color: TYPE_COLORS[selectedNode.type] || "#94A3B8",
                  border: `1px solid ${TYPE_COLORS[selectedNode.type] || "#94A3B8"}44`
                }}>
                  {selectedNode.type}
                </span>
                <h4 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#FFFFFF", marginTop: 8 }}>
                  {selectedNode.label}
                </h4>
                <div style={{ fontSize: "0.75rem", color: "var(--text-dim)", fontFamily: "var(--font-mono)" }}>
                  ID: {selectedNode.id}
                </div>
              </div>

              {/* Properties list */}
              <div>
                <span style={{ fontSize: "0.76rem", color: "var(--text-muted)", fontWeight: 600, display: "block", marginBottom: 6 }}>
                  NODE PROPERTIES:
                </span>
                <div style={{
                  background: "rgba(5, 11, 22, 0.6)",
                  borderRadius: 8,
                  padding: "8px 10px",
                  fontSize: "0.78rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: 4
                }}>
                  {Object.entries(selectedNode.properties || {}).map(([k, v]) => (
                    <div key={k} style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#94A3B8" }}>{k}:</span>
                      <span style={{ color: "#F1F5F9", fontWeight: 500, maxWidth: 170, textAlign: "right", wordBreak: "break-word" }}>
                        {String(v)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Connected Neighbors */}
              <div>
                <span style={{ fontSize: "0.76rem", color: "var(--text-muted)", fontWeight: 600, display: "block", marginBottom: 6 }}>
                  CONNECTED NEIGHBORS ({nodeDetails?.connected_neighbors?.length || 0}):
                </span>
                {nodeDetails?.connected_neighbors && nodeDetails.connected_neighbors.length > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {nodeDetails.connected_neighbors.map((nb, i) => (
                      <div
                        key={i}
                        onClick={() => {
                          const target = graphData.nodes.find(n => n.id === nb.id);
                          if (target) handleSelectNode(target);
                        }}
                        style={{
                          background: "rgba(5, 11, 22, 0.6)",
                          border: "1px solid var(--border-subtle)",
                          padding: "6px 10px",
                          borderRadius: 6,
                          fontSize: "0.76rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          cursor: "pointer",
                          transition: "border 0.2s"
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--accent-blue)"}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--border-subtle)"}
                      >
                        <div>
                          <div style={{ color: "#FFFFFF", fontWeight: 600 }}>{nb.label || nb.id}</div>
                          <div style={{ color: "var(--text-dim)", fontSize: "0.68rem" }}>
                            [{nb.relationship}] {nb.type}
                          </div>
                        </div>
                        <ArrowRight size={12} color="var(--accent-cyan)" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ fontSize: "0.76rem", color: "var(--text-dim)" }}>
                    No 1-hop relationships discovered.
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", textAlign: "center", padding: "2rem 0" }}>
              Click any node in the graph to inspect its properties and connected relationships.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
