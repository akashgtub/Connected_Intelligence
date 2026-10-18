from fastapi import APIRouter, HTTPException
from typing import List
from app.database import db_manager
from app.schema import InvestigationRequest, InvestigationResponse
from app.agent_engine import agent_engine

router = APIRouter(tags=["Investigations"])

@router.post("/investigations", response_model=InvestigationResponse)
def run_investigation(req: InvestigationRequest):
    """Executes a graph-powered investigation using FalkorDB multi-hop traversal and memory."""
    if not db_manager.is_connected:
        raise HTTPException(
            status_code=503,
            detail=(
                "FalkorDB is unreachable. Please start the FalkorDB Docker container "
                "(`docker run -p 6379:6379 -it --rm falkordb/falkordb`) or configure FALKORDB_URL."
            )
        )

    try:
        return agent_engine.investigate(req)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Investigation failed: {e}")

@router.get("/investigations")
def list_investigations():
    """Lists saved investigations stored as Memory nodes in FalkorDB."""
    if not db_manager.is_connected:
        raise HTTPException(status_code=503, detail="FalkorDB is unreachable.")

    try:
        memories = agent_engine.find_memories("")
        return memories
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
