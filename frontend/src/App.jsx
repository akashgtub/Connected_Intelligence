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
  Sparkles, 
  ArrowRight, 
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

  const checkDb = async () => {
    const health = await fetchHealth();
    setDbStatus(health.database || { connected: false });
  };

  useEffect(() => {
    checkDb();
    const interval = setInterval(checkDb, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleStartInvestigation = (question = "Our payment system is down. What should we do?") => {
    setInitialQuestion(question);
    setActiveTab("investigate");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleInvestigateIncident = (question, incidentId) => {
    setInitialQuestion(question);
    setActiveTab("investigate");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Navigation */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        dbStatus={dbStatus}
        onOpenWorkspace={() => window.scrollTo({ top: 0, behavior: "smooth" })}
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
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              alignItems: "center",
              gap: "2.5rem",
              paddingTop: "1.5rem",
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
                  padding: "5px 14px",
                  borderRadius: 20,
                  background: "rgba(52, 120, 255, 0.12)",
                  border: "1px solid rgba(52, 120, 255, 0.35)",
                  color: "#93C5FD",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  marginBottom: "1.2rem",
                  boxShadow: "0 0 15px rgba(52, 120, 255, 0.15)"
                }}>
                  <span style={{ color: "#38BDF8" }}>⚡</span> Powered by FalkorDB
                </div>

                {/* Main Heading */}
                <h1 style={{
                  fontSize: "3.8rem",
                  fontWeight: 800,
                  lineHeight: 1.05,
                  letterSpacing: "-0.03em",
                  marginBottom: "0.8rem",
                  color: "#FFFFFF"
                }}>
                  Connected <br />
                  <span className="gradient-title-accent">Intelligence</span>
                </h1>

                {/* Tagline */}
                <h2 style={{
                  fontSize: "1.35rem",
                  fontWeight: 600,
                  color: "#E2E8F0",
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
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: "2.5rem" }}>
                  <button
                    onClick={() => handleStartInvestigation()}
                    className="btn-primary"
                    style={{ padding: "12px 24px", fontSize: "0.98rem" }}
                  >
                    Get Started →
                  </button>
                  <button
                    onClick={() => handleStartInvestigation("What happened during the previous payment API outage?")}
                    className="btn-secondary"
                    style={{ padding: "12px 22px", fontSize: "0.98rem", gap: 6 }}
                  >
                    <Play size={15} fill="#FFF" /> Explore Demo
                  </button>
                </div>

                {/* 4 Trust Badges */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                  maxWidth: 480
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.82rem", color: "#CBD5E1" }}>
                    <Share2 size={16} color="var(--accent-blue)" /> Graph-Powered AI Agent
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.82rem", color: "#CBD5E1" }}>
                    <Brain size={16} color="var(--accent-green)" /> Persistent Memory
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.82rem", color: "#CBD5E1" }}>
                    <ShieldCheck size={16} color="var(--accent-cyan)" /> Explainable Answers
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.82rem", color: "#CBD5E1" }}>
                    <FileText size={16} color="var(--accent-amber)" /> Works with Your Data
                  </div>
                </div>
              </div>

              {/* Right Column: Hero Radial Graph + Live Investigation Preview Card */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2rem" }}>
                <HeroRadialGraph onNodeClick={(type) => {
                  setActiveTab("graph");
                }} />
                <HeroInvestigationPreview onLaunchFullAgent={() => handleStartInvestigation()} />
              </div>
            </div>

            {/* Feature Cards Section */}
            <FeatureCards />

            {/* How It Works Section */}
            <HowItWorks />

            {/* Architecture Section */}
            <ArchitectureSection />

            {/* Final CTA Strip */}
            <div style={{
              background: "linear-gradient(135deg, rgba(52, 120, 255, 0.15) 0%, rgba(13, 25, 48, 0.9) 100%)",
              border: "1px solid rgba(52, 120, 255, 0.35)",
              borderRadius: 20,
              padding: "3.5rem 2rem",
              textAlign: "center",
              margin: "3rem 0 4rem",
              boxShadow: "0 10px 40px rgba(0,0,0,0.5)"
            }}>
              <h2 style={{ fontSize: "2.2rem", fontWeight: 800, color: "#FFFFFF", marginBottom: 12 }}>
                Connected Knowledge. Smarter Decisions.
              </h2>
              <p style={{ fontSize: "1rem", color: "#CBD5E1", maxWidth: 600, margin: "0 auto 2rem", lineHeight: 1.6 }}>
                Stop investigating in the dark. Discover historical resolutions, connect upstream dependencies, and leverage company brain intelligence today.
              </p>
              <button
                onClick={() => handleStartInvestigation()}
                className="btn-primary"
                style={{ padding: "12px 30px", fontSize: "1.05rem" }}
              >
                Launch Connected Intelligence →
              </button>
            </div>
          </div>
        )}

        {/* WORKSPACE VIEWS */}
        {activeTab === "dashboard" && (
          <DashboardView onNavigate={(tab) => setActiveTab(tab)} dbStatus={dbStatus} />
        )}

        {activeTab === "investigate" && (
          <InvestigationView 
            dbStatus={dbStatus} 
            onNavigateToMemory={() => setActiveTab("memory")} 
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
              setInitialQuestion(q);
              setActiveTab("investigate");
            }} 
          />
        )}
      </main>

      {/* Footer */}
      <Footer onOpenWorkspace={() => setActiveTab("investigate")} />
    </div>
  );
}
