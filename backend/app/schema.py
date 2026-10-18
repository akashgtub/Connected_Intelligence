from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class NodeModel(BaseModel):
    id: str
    label: str
    type: str
    properties: Dict[str, Any] = Field(default_factory=dict)
    degree: int = 0

class EdgeModel(BaseModel):
    id: str
    source: str
    target: str
    type: str
    properties: Dict[str, Any] = Field(default_factory=dict)

class GraphData(BaseModel):
    nodes: List[NodeModel]
    edges: List[EdgeModel]
    total_nodes: int
    total_edges: int

class EvidenceStep(BaseModel):
    step: int
    entity_type: str
    entity_name: str
    relation: str
    detail: str
    target: Optional[str] = None

class InvestigationRequest(BaseModel):
    question: str
    incident_id: Optional[str] = None
    save_to_memory: bool = True

class InvestigationResponse(BaseModel):
    investigation_id: str
    question: str
    answer: str
    recommendations: List[str]
    evidence_path: List[EvidenceStep]
    graph_entities: List[NodeModel] = Field(default_factory=list)
    cypher_queries_executed: List[str] = Field(default_factory=list)
    used_memory: bool = False
    saved_as_memory: bool = False
    timestamp: str

class MemoryCreateRequest(BaseModel):
    title: str
    summary: str
    question: str
    recommendations: List[str]
    linked_incident: Optional[str] = None
    linked_system: Optional[str] = None

class MemoryItem(BaseModel):
    id: str
    title: str
    summary: str
    question: str
    recommendations: List[str] = Field(default_factory=list)
    timestamp: str
    linked_incident: Optional[str] = None
    linked_system: Optional[str] = None

class IncidentItem(BaseModel):
    id: str
    title: str
    severity: str
    status: str
    affected_system: str
    created_at: str
    resolved_at: Optional[str] = None
    description: str
    resolution: Optional[str] = None
    assigned_engineer: Optional[str] = None

class DashboardStats(BaseModel):
    total_nodes: int
    total_relationships: int
    total_incidents: int
    total_investigations: int
    falkordb_connected: bool
    falkordb_details: Dict[str, Any] = Field(default_factory=dict)
    recent_investigations: List[Dict[str, Any]] = Field(default_factory=list)
    recent_incidents: List[IncidentItem] = Field(default_factory=list)
