from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from app.database import db_manager
from app.schema import MemoryItem, MemoryCreateRequest
from app.agent_engine import agent_engine
from app.seed_data import seed_database

router = APIRouter(tags=["Memory & Seeding"])

@router.get("/memory", response_model=List[MemoryItem])
def get_memories(search: Optional[str] = Query(None)):
    """Retrieves saved investigation memories persisted in FalkorDB."""
    if not db_manager.is_connected:
        raise HTTPException(status_code=503, detail="FalkorDB is unreachable.")

    try:
        return agent_engine.find_memories(search or "")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/memory")
def create_memory(req: MemoryCreateRequest):
    """Persists a new investigation memory into FalkorDB graph."""
    if not db_manager.is_connected:
        raise HTTPException(status_code=503, detail="FalkorDB is unreachable.")

    try:
        mem_id = agent_engine.save_memory(
            title=req.title,
            summary=req.summary,
            question=req.question,
            recommendations=req.recommendations,
            linked_incident=req.linked_incident,
            linked_system=req.linked_system
        )
        return {"success": True, "memory_id": mem_id, "message": "Memory persisted into FalkorDB."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/memory/{memory_id}")
def get_single_memory(memory_id: str):
    """Retrieves a single memory and its connected incident/system in FalkorDB."""
    if not db_manager.is_connected:
        raise HTTPException(status_code=503, detail="FalkorDB is unreachable.")

    try:
        res = db_manager.query("""
        MATCH (m:Memory {id: $id})
        OPTIONAL MATCH (m)-[:REFERENCES]->(i:Incident)
        OPTIONAL MATCH (m)-[:ABOUT]->(s:System)
        RETURN m.id, m.title, m.summary, m.question, m.recommendations, m.timestamp,
               i.id AS inc_id, i.title AS inc_title, s.name AS sys_name
        """, {"id": memory_id})

        if not res or not res.result_set:
            raise HTTPException(status_code=404, detail=f"Memory '{memory_id}' not found.")

        row = res.result_set[0]
        import json
        raw_recs = row[4]
        recs = []
        if isinstance(raw_recs, str):
            try:
                recs = json.loads(raw_recs)
            except Exception:
                recs = [raw_recs]
        elif isinstance(raw_recs, list):
            recs = raw_recs

        return {
            "id": row[0],
            "title": row[1],
            "summary": row[2],
            "question": row[3],
            "recommendations": recs,
            "timestamp": row[5],
            "linked_incident": {"id": row[6], "title": row[7]} if row[6] else None,
            "linked_system": row[8]
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/seed")
def trigger_seed():
    """Triggers repeatable synthetic company data seeding into FalkorDB."""
    if not db_manager.is_connected:
        raise HTTPException(
            status_code=503,
            detail="FalkorDB is unreachable. Please verify database connection or FALKORDB_URL."
        )
    return seed_database()
