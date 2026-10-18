import React, { useState, useEffect, useRef, useCallback } from "react";
import { 
  Send, 
  Database, 
  AlertCircle, 
  CheckCircle2, 
  Code, 
  Bookmark, 
  BookmarkCheck,
  Brain,
  Terminal,
  RefreshCw
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

export default function InvestigationView({ dbStatus, initialQuestion = "", incidentId = null, onNavigateToMemory }) {
  const [question, setQuestion] = useState(initialQuestion);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [showQueries, setShowQueries] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const lastInvestigatedRef = useRef("");

  const handleSend = useCallback(async (qText, incId = null) => {
    const q = (typeof qText === "string" ? qText : question).trim();
    if (!q) return;

    try {
      setLoading(true);
      setError(null);
      setSavedSuccess(false);
      setSaveError(null);
      const targetIncId = incId || incidentId;
      const res = await runInvestigation(q, targetIncId);
      setResult(res);
      setQuestion(q);
      lastInvestigatedRef.current = q;
    } catch (err) {
      setError(err.message || "Failed to run investigation");
    } finally {
      setLoading(false);
    }
  }, [question, incidentId]);

  // Automatically run investigation when navigating with an initial question
  useEffect(() => {
    if (initialQuestion && initialQuestion !== lastInvestigatedRef.current) {
      setQuestion(initialQuestion);
      handleSend(initialQuestion, incidentId);
    }
  }, [initialQuestion, incidentId, handleSend]);

  const handleManualSave = async () => {
    if (!result || saving) return;
    try {
      setSaving(true);
      setSaveError(null);
      const linkedInc = result.evidence_path?.find(e => e.entity_type === "Incident")?.entity_name || "INC-1042";
      const linkedSys = result.evidence_path?.find(e => e.entity_type === "System")?.entity_name || "Payment Service";
      
      await saveMemory({
        title: `Investigation: ${result.question.slice(0, 45)}`,
        summary: (result.answer || "").slice(0, 200),
        question: result.question,
        recommendations: result.recommendations || [],
        linked_incident: linkedInc,
        linked_system: linkedSys
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err) {
      setSaveError(err.message || "Error saving memory to FalkorDB");
      setTimeout(() => setSaveError(null), 5000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "1rem 0" }}>
      {/* Header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: "linear-gradient(135deg, #6D28D9 0%, #8B5CF6 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px rgba(109, 40, 217, 0.25)"
          }}>
            <Brain size={20} color="#FFFFFF" />
          </div>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--text-main)" }}>
            FalkorDB Graph Agent Investigation
          </h1>
        </div>
        <p style={{ fontSize: "0.92rem", color: "var(--text-muted)" }}>
          Ask any incident or architectural question. The agent discovers relationships, traverses multi-hop graph paths, and retrieves persistent memories.
        </p>
      </div>

      {/* Example Chips */}
      <div style={{ marginBottom: "1.2rem" }}>
        <div style={{ fontSize: "0.76rem", color: "var(--text-muted)", marginBottom: 8, fontWeight: 700, letterSpacing: "0.05em" }}>
          SUGGESTED INVESTIGATIONS:
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {EXAMPLE_QUESTIONS.map((ex, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setQuestion(ex);
                handleSend(ex, incidentId);
              }}
              style={{
                background: "#FFFFFF",
                border: "1px solid var(--border-subtle)",
                color: "var(--text-main)",
                padding: "7px 14px",
                borderRadius: 20,
                fontSize: "0.82rem",
                fontWeight: 500,
                cursor: "pointer",
                boxShadow: "0 1px 3px rgba(33, 24, 59, 0.03)",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#C4B5FD";
                e.currentTarget.style.color = "var(--accent-purple)";
                e.currentTarget.style.background = "#F5F0FF";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border-subtle)";
                e.currentTarget.style.color = "var(--text-main)";
                e.currentTarget.style.background = "#FFFFFF";
              }}
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <div style={{
        background: "#FFFFFF",
        border: "1px solid var(--border-subtle)",
        borderRadius: 14,
        padding: "8px 12px",
        display: "flex",
        alignItems: "center",
        gap: 10,
        boxShadow: "0 4px 18px rgba(109, 40, 217, 0.06)",
        marginBottom: "2rem"
      }}>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !loading && handleSend(question, incidentId)}
          placeholder="Ask about systems, past incidents, owners, decisions, or recommendations..."
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            color: "var(--text-main)",
            fontSize: "0.95rem",
            padding: "8px 8px"
          }}
        />
        <button
          type="button"
          onClick={() => handleSend(question, incidentId)}
          disabled={loading || !question.trim()}
          className="btn-primary"
          style={{
            padding: "9px 20px",
            fontSize: "0.9rem",
            opacity: loading || !question.trim() ? 0.6 : 1,
            cursor: loading || !question.trim() ? "not-allowed" : "pointer"
          }}
        >
          {loading ? (
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <RefreshCw size={15} className="pulse-glow" /> Traversing Graph...
            </span>
          ) : (
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              Investigate <Send size={15} />
            </span>
          )}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div style={{
          background: "#FEF2F2",
          border: "1px solid #FECACA",
          borderRadius: 12,
          padding: "1rem 1.4rem",
          marginBottom: "2rem",
          display: "flex",
          alignItems: "flex-start",
          gap: 12
        }}>
          <AlertCircle size={20} color="#DC2626" style={{ flexShrink: 0, marginTop: 2 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "0.92rem", fontWeight: 700, color: "#991B1B", marginBottom: 4 }}>
              Investigation Error
            </div>
            <div style={{ fontSize: "0.85rem", color: "#7F1D1D", lineHeight: 1.5 }}>{error}</div>
            {!dbStatus?.connected && (
              <div style={{ fontSize: "0.8rem", color: "#6B647A", marginTop: 8 }}>
                To resolve, start FalkorDB with: <code style={{ color: "#6D28D9", fontWeight: 600 }}>docker run -p 6379:6379 -it --rm falkordb/falkordb</code>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Save Error */}
      {saveError && (
        <div style={{
          background: "#FEF2F2",
          border: "1px solid #FECACA",
          borderRadius: 10,
          padding: "0.8rem 1.2rem",
          marginBottom: "1.5rem",
          fontSize: "0.85rem",
          color: "#991B1B",
          display: "flex",
          alignItems: "center",
          gap: 8
        }}>
          <AlertCircle size={16} color="#DC2626" />
          <span>{saveError}</span>
        </div>
      )}

      {/* Investigation Results */}
      {result && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Top Result Card */}
          <div className="white-card" style={{ padding: "1.8rem" }}>
            {/* Badges bar */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.2rem", flexWrap: "wrap", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <span style={{
                  background: "#F5F0FF",
                  border: "1px solid #DDD6FE",
                  color: "var(--accent-purple)",
                  padding: "4px 12px",
                  borderRadius: 20,
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 5
                }}>
                  <Database size={13} /> Real FalkorDB Traversal
                </span>

                {result.used_memory && (
                  <span 
                    onClick={() => onNavigateToMemory?.()}
                    style={{
                      background: "#ECFDF5",
                      border: "1px solid #A7F3D0",
                      color: "#059669",
                      padding: "4px 12px",
                      borderRadius: 20,
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      cursor: onNavigateToMemory ? "pointer" : "default"
                    }}
                  >
                    <Brain size={13} /> Recalled Past Memory {onNavigateToMemory ? "→" : ""}
                  </span>
                )}

                {result.saved_as_memory && (
                  <span style={{
                    background: "#FFFBEB",
                    border: "1px solid #FDE68A",
                    color: "#D97706",
                    padding: "4px 12px",
                    borderRadius: 20,
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: 5
                  }}>
                    <BookmarkCheck size={13} /> Auto-Saved to FalkorDB Memory
                  </span>
                )}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button
                  type="button"
                  onClick={() => setShowQueries(!showQueries)}
                  style={{
                    background: "#FAF8FF",
                    border: "1px solid var(--border-subtle)",
                    color: "var(--text-muted)",
                    padding: "6px 12px",
                    borderRadius: 8,
                    fontSize: "0.78rem",
                    fontWeight: 500,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 5
                  }}
                >
                  <Code size={13} /> {showQueries ? "Hide Cypher" : "View Cypher Queries"}
                </button>
                <button
                  type="button"
                  onClick={handleManualSave}
                  disabled={saving}
                  style={{
                    background: savedSuccess ? "#ECFDF5" : "#F5F0FF",
                    border: `1px solid ${savedSuccess ? "#A7F3D0" : "#DDD6FE"}`,
                    color: savedSuccess ? "#059669" : "var(--accent-purple)",
                    padding: "6px 14px",
                    borderRadius: 8,
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    cursor: saving ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    transition: "all 0.2s ease"
                  }}
                >
                  {savedSuccess ? <BookmarkCheck size={13} color="#059669" /> : <Bookmark size={13} />}
                  {savedSuccess ? "Saved to Memory!" : saving ? "Saving..." : "Save Investigation"}
                </button>
              </div>
            </div>

            {/* Answer body */}
            <div style={{
              fontSize: "0.98rem",
              color: "var(--text-main)",
              lineHeight: 1.65,
              whiteSpace: "pre-line",
              marginBottom: "1.5rem"
            }}>
              {result.answer}
            </div>

            {/* Recommendations List */}
            {result.recommendations && result.recommendations.length > 0 && (
              <div style={{
                background: "#FAF8FF",
                border: "1px solid var(--border-subtle)",
                borderRadius: 12,
                padding: "1.4rem",
                marginBottom: "1.5rem"
              }}>
                <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-main)", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                  <CheckCircle2 size={18} color="var(--accent-green)" />
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
                        fontSize: "0.88rem",
                        color: "var(--text-main)",
                        background: "#FFFFFF",
                        padding: "10px 14px",
                        borderRadius: 8,
                        border: "1px solid var(--border-subtle)"
                      }}
                    >
                      <span style={{ color: "var(--accent-purple)", fontWeight: 700 }}>•</span>
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cypher Queries Box */}
            {showQueries && (
              <div style={{
                background: "#FAF8FF",
                border: "1px solid #DDD6FE",
                borderRadius: 10,
                padding: "1.2rem",
                marginBottom: "1.5rem",
                fontFamily: "var(--font-mono)",
                fontSize: "0.82rem"
              }}>
                <div style={{ color: "var(--accent-purple)", fontWeight: 700, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                  <Terminal size={15} /> Cypher Queries Executed Against FalkorDB:
                </div>
                {result.cypher_queries_executed?.map((q, i) => (
                  <div key={i} style={{ color: "var(--text-main)", marginBottom: 6, lineHeight: 1.4 }}>
                    &gt; {q}
                  </div>
                ))}
              </div>
            )}

            {/* Traversed Graph Entities Pill Cloud */}
            {result.graph_entities && result.graph_entities.length > 0 && (
              <div>
                <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 700, display: "block", marginBottom: 8, letterSpacing: "0.05em" }}>
                  TRAVERSED ENTITIES:
                </span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {result.graph_entities.map((ent, i) => (
                    <span 
                      key={i}
                      style={{
                        padding: "5px 12px",
                        borderRadius: 8,
                        background: "#F5F0FF",
                        border: "1px solid #DDD6FE",
                        color: "var(--text-main)",
                        fontSize: "0.8rem",
                        fontWeight: 500
                      }}
                    >
                      <strong style={{ color: "var(--accent-purple)" }}>{ent.type}:</strong> {ent.label}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Evidence Path (Step-by-Step Traversal Visualizer) */}
          {result.evidence_path && result.evidence_path.length > 0 && (
            <div className="white-card" style={{ padding: "1.8rem" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-main)", marginBottom: "1.2rem" }}>
                Graph Reasoning & Evidence Path
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {result.evidence_path.map((step, idx) => (
                  <div 
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      padding: "12px 16px",
                      borderRadius: 10,
                      background: "#FAF8FF",
                      border: "1px solid var(--border-subtle)"
                    }}
                  >
                    <div style={{
                      width: 30,
                      height: 30,
                      borderRadius: 8,
                      background: "#F5F0FF",
                      border: "1px solid #DDD6FE",
                      color: "var(--accent-purple)",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0
                    }}>
                      {step.step}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <span style={{ fontSize: "0.92rem", fontWeight: 700, color: "var(--text-main)" }}>
                          {step.entity_name}
                        </span>
                        <span style={{
                          fontSize: "0.72rem",
                          color: "var(--accent-purple)",
                          background: "#F5F0FF",
                          border: "1px solid #DDD6FE",
                          padding: "2px 8px",
                          borderRadius: 6,
                          fontWeight: 600
                        }}>
                          {step.entity_type}
                        </span>
                        <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                          [{step.relation}]
                        </span>
                      </div>
                      <div style={{ fontSize: "0.84rem", color: "var(--text-muted)", marginTop: 2 }}>
                        {step.detail}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
