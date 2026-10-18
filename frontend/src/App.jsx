import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import HeroRadialGraph from "./components/HeroRadialGraph";
import HeroInvestigationPreview from "./components/HeroInvestigationPreview";
import FeatureCards from "./components/FeatureCards";
import FalkorDBBanner from "./components/FalkorDBBanner";
import { HowItWorks, ArchitectureSection, Footer } from "./components/LandingSections";

import DashboardView from "./views/DashboardView";
import InvestigationView from "./views/InvestigationView";
import GraphExplorerView from "./views/GraphExplorerView";
import IncidentsView from "./views/IncidentsView";
import MemoryView from "./views/MemoryView";

import { fetchHealth } from "./api";
import { 
  Play, 
  Share2, 
  Brain, 
  ShieldCheck, 
  FileText 
} from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState("landing");
  const [dbStatus, setDbStatus] = useState(null);
  const [initialQuestion, setInitialQuestion] = useState("");
  const [selectedIncidentId, setSelectedIncidentId] = useState(null);

  const checkDb = async () => {
    const health = await fetchHealth();
    setDbStatus(health.database || { connected: false });
  };

  useEffect(() => {
    checkDb();
    const interval = setInterval(checkDb, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleStartInvestigation = (question = "Our payment system is down. What should we do?", incId = null) => {
    setInitialQuestion(question);
    setSelectedIncidentId(incId);
    setActiveTab("investigate");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleInvestigateIncident = (question, incidentId) => {
    setInitialQuestion(question);
    setSelectedIncidentId(incidentId);
    setActiveTab("investigate");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRadialNodeClick = (nodeId) => {
    if (nodeId === "incidents") {
      setActiveTab("incidents");
    } else if (nodeId === "conversations") {
      handleStartInvestigation("What happened during the previous payment API outage?");
      return;
    } else {
      setActiveTab("graph");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFeatureClick = (featureIndex) => {
    switch (featureIndex) {
      case 0: // Find Connected Insights
        setActiveTab("graph");
        break;
      case 1: // Remember Across Sessions
        setActiveTab("memory");
        break;
      case 2: // Take Action with Context
      case 3: // Explain Every Answer
        handleStartInvestigation();
        return;
      default:
        setActiveTab("dashboard");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg-primary)" }}>
      {/* Navigation */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }} 
        dbStatus={dbStatus}
        onOpenWorkspace={() => {
          setActiveTab("investigate");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />

      {/* Main Container */}
      <main style={{ flex: 1, padding: "1.5rem 2rem", maxWidth: 1320, width: "100%", margin: "0 auto" }}>
        {/* FalkorDB Connection Banner */}
        <FalkorDBBanner dbStatus={dbStatus} onRefresh={checkDb} />

        {/* LANDING PAGE VIEW */}
        {activeTab === "landing" && (
          <div>
            {/* Ambient Center Glow */}
            <div className="ambient-glow-center" />

            {/* HERO SECTION */}
            <div className="hero-grid" style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              alignItems: "center",
              gap: "2.5rem",
              paddingTop: "2rem",
              paddingBottom: "3.5rem",
              position: "relative",
              zIndex: 1
            }}>
              {/* Left Column: Heading, Tagline, CTAs */}
              <div>
                {/* Powered by FalkorDB Pill */}
                <div style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 16px",
                  borderRadius: 20,
                  background: "#F5F0FF",
                  border: "1px solid #DDD6FE",
                  color: "var(--accent-purple)",
                  fontSize: "0.84rem",
                  fontWeight: 700,
                  marginBottom: "1.2rem",
                  boxShadow: "0 2px 8px rgba(109, 40, 217, 0.08)"
                }}>
                  <span style={{ color: "var(--accent-purple)" }}>⚡</span> Powered by FalkorDB
                </div>

                {/* Main Heading */}
                <h1 style={{
                  fontSize: "3.8rem",
                  fontWeight: 800,
                  lineHeight: 1.05,
                  letterSpacing: "-0.03em",
                  marginBottom: "0.8rem",
                  color: "var(--text-main)"
                }}>
                  Connected <br />
                  <span className="gradient-title-accent">Intelligence</span>
                </h1>

                {/* Tagline */}
                <h2 style={{
                  fontSize: "1.35rem",
                  fontWeight: 700,
                  color: "var(--text-main)",
                  marginBottom: "1rem",
                  letterSpacing: "-0.01em"
                }}>
                  Connected Knowledge. Smarter Decisions.
                </h2>

                {/* Description */}
                <p style={{
                  fontSize: "1.05rem",
                  color: "var(--text-muted)",
                  lineHeight: 1.6,
                  maxWidth: 500,
                  marginBottom: "2rem"
                }}>
                  An AI agent that understands your company’s data, remembers past experiences, and takes action using real connections — powered by FalkorDB.
                </p>

                {/* CTAs */}
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: "2.5rem", flexWrap: "wrap" }}>
                  <button
                    type="button"
                    onClick={() => handleStartInvestigation("Our payment system is down. What should we do?")}
                    className="btn-primary"
                    style={{ padding: "12px 26px", fontSize: "1rem" }}
                  >
                    Get Started →
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStartInvestigation("What happened during the previous payment API outage?", "INC-1042")}
                    className="btn-secondary"
                    style={{ padding: "12px 22px", fontSize: "0.98rem", gap: 6 }}
                  >
                    <Play size={15} fill="var(--accent-purple)" color="var(--accent-purple)" /> Explore Demo
                  </button>
                </div>

                {/* 4 Trust Badges */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                  maxWidth: 480
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.85rem", color: "var(--text-main)", fontWeight: 500 }}>
                    <Share2 size={16} color="var(--accent-purple)" /> Graph-Powered AI Agent
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.85rem", color: "var(--text-main)", fontWeight: 500 }}>
                    <Brain size={16} color="var(--accent-green)" /> Persistent Memory
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.85rem", color: "var(--text-main)", fontWeight: 500 }}>
                    <ShieldCheck size={16} color="#2563EB" /> Explainable Answers
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.85rem", color: "var(--text-main)", fontWeight: 500 }}>
                    <FileText size={16} color="var(--accent-amber)" /> Works with Your Data
                  </div>
                </div>
              </div>

              {/* Right Column: Hero Radial Graph + Live Investigation Preview Card */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2rem", width: "100%" }}>
                <HeroRadialGraph onNodeClick={handleRadialNodeClick} />
                <HeroInvestigationPreview onLaunchFullAgent={() => handleStartInvestigation("Our payment system is down. What should we do?", "INC-1140")} />
              </div>
            </div>

            {/* Feature Cards Section */}
            <FeatureCards onSelectFeature={handleFeatureClick} />

            {/* How It Works Section */}
            <HowItWorks />

            {/* Architecture Section */}
            <ArchitectureSection />

            {/* Final CTA Strip */}
            <div style={{
              background: "linear-gradient(135deg, #F5F0FF 0%, #FFFFFF 100%)",
              border: "1px solid #DDD6FE",
              borderRadius: 20,
              padding: "3.5rem 2rem",
              textAlign: "center",
              margin: "3rem 0 4rem",
              boxShadow: "var(--shadow-md)"
            }}>
              <h2 style={{ fontSize: "2.2rem", fontWeight: 800, color: "var(--text-main)", marginBottom: 12 }}>
                Connected Knowledge. Smarter Decisions.
              </h2>
              <p style={{ fontSize: "1.05rem", color: "var(--text-muted)", maxWidth: 600, margin: "0 auto 2rem", lineHeight: 1.6 }}>
                Stop investigating in the dark. Discover historical resolutions, connect upstream dependencies, and leverage company brain intelligence today.
              </p>
              <button
                type="button"
                onClick={() => handleStartInvestigation("Our payment system is down. What should we do?")}
                className="btn-primary"
                style={{ padding: "13px 32px", fontSize: "1.05rem" }}
              >
                Launch Connected Intelligence →
              </button>
            </div>
          </div>
        )}

        {/* WORKSPACE VIEWS */}
        {activeTab === "dashboard" && (
          <DashboardView 
            onNavigate={(tab, question, incidentId) => {
              if (question) {
                setInitialQuestion(question);
                setSelectedIncidentId(incidentId || null);
              }
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }} 
            dbStatus={dbStatus} 
          />
        )}

        {activeTab === "investigate" && (
          <InvestigationView 
            dbStatus={dbStatus} 
            initialQuestion={initialQuestion}
            incidentId={selectedIncidentId}
            onNavigateToMemory={() => {
              setActiveTab("memory");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }} 
          />
        )}

        {activeTab === "graph" && (
          <GraphExplorerView dbStatus={dbStatus} />
        )}

        {activeTab === "incidents" && (
          <IncidentsView 
            dbStatus={dbStatus} 
            onInvestigateIncident={handleInvestigateIncident} 
          />
        )}

        {activeTab === "memory" && (
          <MemoryView 
            dbStatus={dbStatus} 
            onContinueInvestigation={(q) => {
              handleStartInvestigation(q);
            }} 
          />
        )}
      </main>

      {/* Footer */}
      <Footer onOpenWorkspace={() => {
        setActiveTab("investigate");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }} />
    </div>
  );
}
