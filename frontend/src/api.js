const getApiBase = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl && typeof envUrl === "string" && envUrl.trim()) {
    const clean = envUrl.trim().replace(/\/+$/, "");
    return clean.endsWith("/api") ? clean : `${clean}/api`;
  }
  return "http://localhost:8000/api";
};

const API_BASE = getApiBase();

export async function fetchHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    return await res.json();
  } catch (err) {
    return {
      status: "unreachable",
      service: "Connected Intelligence API",
      database: { connected: false, error: err.message }
    };
  }
}

export async function fetchDashboard() {
  const res = await fetch(`${API_BASE}/dashboard`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Dashboard API error (${res.status})`);
  }
  return await res.json();
}

export async function fetchGraph(limit = 80) {
  const res = await fetch(`${API_BASE}/graph?limit=${limit}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Graph API error (${res.status})`);
  }
  return await res.json();
}

export async function fetchNodeDetails(nodeId) {
  const res = await fetch(`${API_BASE}/graph/node/${encodeURIComponent(nodeId)}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to load node details");
  }
  return await res.json();
}

export async function fetchIncidents() {
  const res = await fetch(`${API_BASE}/incidents`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to load incidents");
  }
  return await res.json();
}

export async function runInvestigation(question, incidentId = null) {
  const res = await fetch(`${API_BASE}/investigations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, incident_id: incidentId, save_to_memory: true })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Investigation failed");
  }
  return await res.json();
}

export async function fetchMemories(search = "") {
  const url = search ? `${API_BASE}/memory?search=${encodeURIComponent(search)}` : `${API_BASE}/memory`;
  const res = await fetch(url);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to load memories");
  }
  return await res.json();
}

export async function saveMemory(payload) {
  const res = await fetch(`${API_BASE}/memory`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to persist memory");
  }
  return await res.json();
}

export async function triggerSeed() {
  const res = await fetch(`${API_BASE}/seed`, { method: "POST" });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to seed FalkorDB");
  }
  return await res.json();
}
