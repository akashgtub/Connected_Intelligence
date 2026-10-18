from fastapi import APIRouter, HTTPException
from typing import List
from app.database import db_manager
from app.schema import IncidentItem

router = APIRouter(tags=["Incidents"])

@router.get("/incidents", response_model=List[IncidentItem])
def get_incidents():
    """Returns all seeded incidents with status, severity, and resolution."""
    if not db_manager.is_connected:
        raise HTTPException(status_code=503, detail="FalkorDB is unreachable. Please start FalkorDB.")

    try:
        res = db_manager.query("""
        MATCH (i:Incident)
        OPTIONAL MATCH (i)-[:RESOLVED_BY]->(p:Person)
        RETURN i.id, i.title, i.severity, i.status, i.affected_system,
               i.created_at, i.resolved_at, i.description, i.resolution, p.name
        ORDER BY i.created_at DESC
        """)
        incidents = []
        if res and res.result_set:
            for row in res.result_set:
                incidents.append(IncidentItem(
                    id=str(row[0]),
                    title=str(row[1]),
                    severity=str(row[2]) if row[2] else "P1",
                    status=str(row[3]) if row[3] else "Open",
                    affected_system=str(row[4]) if row[4] else "System",
                    created_at=str(row[5]) if row[5] else "",
                    resolved_at=str(row[6]) if row[6] else None,
                    description=str(row[7]) if row[7] else "",
                    resolution=str(row[8]) if row[8] else None,
                    assigned_engineer=str(row[9]) if row[9] else None
                ))
        return incidents
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to query incidents: {e}")
