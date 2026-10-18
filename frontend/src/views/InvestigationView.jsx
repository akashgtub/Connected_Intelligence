import React, { useState } from "react";
import { 
  Send, 
  Sparkles, 
  Database, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Code, 
  Bookmark, 
  BookmarkCheck,
  Brain,
  Terminal,
  Server,
  UserCheck
} from "lucide-react";
import { runInvestigation, saveMemory } from "../api";

const EXAMPLE_QUESTIONS = [
  "Our payment system is down. What should we do?",
  "Who has worked on the payment service before?",
  "What happened during the previous payment API outage?",
  "Which systems are connected to this incident?",
  "What decisions were made about database reliability?",
  "What did we learn from our last investigation?"
];

export default function InvestigationView({ dbStatus, onNavigateToMemory }) {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [showQueries, setShowQueries] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSend = async (qText) => {
    const q = (qText || question).trim();
    if (!q) return;

    try {
      setLoading(true);
      setError(null);
      setSavedSuccess(false);
      const res = await runInvestigation(q);
      setResult(res);
      setQuestion(q);
    } catch (err) {
      setError(err.message || "Failed to run investigation");
    } finally {
      setLoading(false);
    }
  };

  const handleManualSave = async () => {
    if (!result) return;
    try {
      await saveMemory({
        title: `Investigation: ${result.question.slice(0, 40)}`,
        summary: result.answer.slice(0, 200),
        question: result.question,
        recommendations: result.recommendations,
        linked_incident: "INC-1042",
        linked_system: "Payment Service"
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      alert("Error saving memory: " + err.message);
    }
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "1rem 0" }}>
      {/* Header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: "linear-gradient(135deg, #3478FF 0%, #22D3EE 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <Brain size={18} color="#050B16" />
          </div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#FFFFFF" }}>
            FalkorDB Graph Agent Investigation
          </h1>
        </div>
        <p style={{ fontSize: "0.88rem", color: "var(--text-muted)" }}>
          Ask any incident or architectural question. The agent discovers relationships, traverses multi-hop graph paths, and retrieves persistent memories.
        </p>
      </div>

      {/* Example Chips */}
      <div style={{ marginBottom: "1.2rem" }}>
        <div style={{ fontSize: "0.76rem", color: "var(--text-dim)", marginBottom: 8, fontWeight: 600 }}>
          EXAMPLE QUERIES:
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {EXAMPLE_QUESTIONS.map((ex, i) => (
            <button
              key={i}
              onClick={() => {
                setQuestion(ex);
                handleSend(ex);
              }}
              style={{
                background: "rgba(13, 25, 48, 0.7)",
                border: "1px solid var(--border-subtle)",
                color: "#94A3B8",
                padding: "6px 12px",
                borderRadius: 20,
                fontSize: "0.78rem",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--accent-blue)";
                e.currentTarget.style.color = "#FFFFFF";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border-subtle)";
                e.currentTarget.style.color = "#94A3B8";
              }}
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <div style={{
        background: "rgba(13, 25, 48, 0.9)",
        border: "1px solid rgba(52, 120, 255, 0.3)",
        borderRadius: 14,
        padding: "8px 12px",
        display: "flex",
        alignItems: "center",
        gap: 10,
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.4)",
        marginBottom: "2rem"
      }}>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !loading && handleSend()}
          placeholder="Ask about systems, past incidents, owners, decisions, or recommendations..."
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            color: "#FFFFFF",
            fontSize: "0.95rem",
            padding: "8px 6px"
          }}
        />
        <button
          onClick={() => handleSend()}
          disabled={loading || !question.trim()}
          className="btn-primary"
          style={{
            padding: "8px 18px",
            fontSize: "0.88rem",
            opacity: loading || !question.trim() ? 0.6 : 1,
            cursor: loading || !question.trim() ? "not-allowed" : "pointer"
          }}
        >
          {loading ? (
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Sparkles size={14} className="pulse-glow" /> Traversing Graph...
            </span>
          ) : (
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              Investigate <Send size={14} />
            </span>
          )}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div style={{
          background: "rgba(239, 68, 68, 0.1)",
          border: "1px solid rgba(239, 68, 68, 0.3)",
          borderRadius: 12,
          padding: "1rem 1.4rem",
          marginBottom: "2rem",
          display: "flex",
          alignItems: "flex-start",
          gap: 12
        }}>
          <AlertCircle size={20} color="#EF4444" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#FCA5A5", marginBottom: 4 }}>
              Investigation Error
            </div>
            <div style={{ fontSize: "0.82rem", color: "#E2E8F0" }}>{error}</div>
            {!dbStatus?.connected && (
              <div style={{ fontSize: "0.78rem", color: "#CBD5E1", marginTop: 8 }}>
                To resolve, start FalkorDB with: <code style={{ color: "#22D3EE" }}>docker run -p 6379:6379 -it --rm falkordb/falkordb</code>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Investigation Results */}
      {result && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Top Result Card */}
          <div style={{
            background: "rgba(13, 25, 48, 0.8)",
            backdropFilter: "blur(14px)",
            border: "1px solid rgba(52, 120, 255, 0.25)",
            borderRadius: 16,
            padding: "1.6rem"
          }}>
            {/* Badges bar */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.2rem", flexWrap: "wrap", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{
                  background: "rgba(52, 120, 255, 0.15)",
                  border: "1px solid rgba(52, 120, 255, 0.3)",
                  color: "#93C5FD",
                  padding: "4px 10px",
                  borderRadius: 20,
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 5
                }}>
                  <Database size={12} /> Real FalkorDB Traversal
                </span>

                {result.used_memory && (
                  <span style={{
                    background: "rgba(16, 185, 129, 0.15)",
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                    color: "#34D399",
                    padding: "4px 10px",
                    borderRadius: 20,
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: 5
                  }}>
                    <Brain size={12} /> Recalled Past Memory
                  </span>
                )}

                {result.saved_as_memory && (
                  <span style={{
                    background: "rgba(245, 158, 11, 0.15)",
                    border: "1px solid rgba(245, 158, 11, 0.3)",
                    color: "#FCD34D",
                    padding: "4px 10px",
                    borderRadius: 20,
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: 5
                  }}>
                    <BookmarkCheck size={12} /> Saved to FalkorDB Memory
                  </span>
                )}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button
                  onClick={() => setShowQueries(!showQueries)}
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid var(--border-subtle)",
                    color: "var(--text-muted)",
                    padding: "5px 10px",
                    borderRadius: 6,
                    fontSize: "0.75rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 5
                  }}
                >
                  <Code size={13} /> {showQueries ? "Hide Cypher" : "View Cypher Queries"}
                </button>
                <button
                  onClick={handleManualSave}
                  style={{
                    background: savedSuccess ? "rgba(16, 185, 129, 0.2)" : "rgba(52, 120, 255, 0.15)",
                    border: `1px solid ${savedSuccess ? "#10B981" : "rgba(52, 120, 255, 0.3)"}`,
                    color: savedSuccess ? "#34D399" : "#93C5FD",
                    padding: "5px 12px",
                    borderRadius: 6,
                    fontSize: "0.75rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 5
                  }}
                >
                  {savedSuccess ? <BookmarkCheck size={13} /> : <Bookmark size={13} />}
                  {savedSuccess ? "Saved!" : "Save Investigation"}
                </button>
              </div>
            </div>

            {/* Answer body */}
            <div style={{
              fontSize: "0.95rem",
              color: "#E2E8F0",
              lineHeight: 1.6,
              whiteSpace: "pre-line",
              marginBottom: "1.5rem"
            }}>
              {result.answer}
            </div>

            {/* Recommendations List */}
            <div style={{
              background: "rgba(5, 11, 22, 0.6)",
              border: "1px solid var(--border-subtle)",
              borderRadius: 12,
              padding: "1.2rem",
              marginBottom: "1.5rem"
            }}>
              <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: "#FFFFFF", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                <CheckCircle2 size={16} color="var(--accent-green)" />
                Actionable Recommendations Grounded in Graph Evidence
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {result.recommendations.map((rec, i) => (
                  <div 
                    key={i} 
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 8,
                      fontSize: "0.85rem",
                      color: "#CBD5E1",
                      background: "rgba(255, 255, 255, 0.02)",
                      padding: "8px 12px",
                      borderRadius: 8
                    }}
                  >
                    <span style={{ color: "var(--accent-cyan)", fontWeight: 700 }}>•</span>
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cypher Queries Box */}
            {showQueries && (
              <div style={{
                background: "#050B16",
                border: "1px solid rgba(52, 120, 255, 0.3)",
                borderRadius: 10,
                padding: "1rem",
                marginBottom: "1.5rem",
                fontFamily: "var(--font-mono)",
                fontSize: "0.78rem"
              }}>
                <div style={{ color: "var(--accent-cyan)", fontWeight: 700, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                  <Terminal size={14} /> Cypher Queries Executed Against FalkorDB:
                </div>
                {result.cypher_queries_executed.map((q, i) => (
                  <div key={i} style={{ color: "#93C5FD", marginBottom: 4 }}>
                    &gt; {q}
                  </div>
                ))}
              </div>
            )}

            {/* Traversed Graph Entities Pill Cloud */}
            {result.graph_entities && result.graph_entities.length > 0 && (
              <div>
                <span style={{ fontSize: "0.78rem", color: "var(--text-dim)", fontWeight: 600, display: "block", marginBottom: 8 }}>
                  TRAVERSED ENTITIES:
                </span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {result.graph_entities.map((ent, i) => (
                    <span 
                      key={i}
                      style={{
                        padding: "4px 10px",
                        borderRadius: 6,
                        background: "rgba(52, 120, 255, 0.1)",
                        border: "1px solid rgba(52, 120, 255, 0.2)",
                        color: "#E2E8F0",
                        fontSize: "0.78rem"
                      }}
                    >
                      <strong style={{ color: "var(--accent-cyan)" }}>{ent.type}:</strong> {ent.label}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Evidence Path (Step-by-Step Traversal Visualizer) */}
          <div style={{
            background: "rgba(13, 25, 48, 0.8)",
            border: "1px solid rgba(52, 120, 255, 0.25)",
            borderRadius: 16,
            padding: "1.6rem"
          }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#FFFFFF", marginBottom: "1rem" }}>
              Graph Reasoning & Evidence Path
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {result.evidence_path.map((step, idx) => (
                <div 
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 16px",
                    borderRadius: 10,
                    background: "rgba(5, 11, 22, 0.7)",
                    border: "1px solid var(--border-subtle)"
                  }}
                >
                  <div style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: "rgba(52, 120, 255, 0.2)",
                    border: "1px solid rgba(52, 120, 255, 0.4)",
                    color: "var(--accent-cyan)",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0
                  }}>
                    {step.step}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "#FFFFFF" }}>
                        {step.entity_name}
                      </span>
                      <span style={{
                        fontSize: "0.7rem",
                        color: "var(--accent-cyan)",
                        background: "rgba(34, 211, 238, 0.12)",
                        padding: "2px 6px",
                        borderRadius: 4,
                        fontWeight: 600
                      }}>
                        {step.entity_type}
                      </span>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>
                        [{step.relation}]
                      </span>
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: 2 }}>
                      {step.detail}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
