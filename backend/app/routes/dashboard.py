from fastapi import APIRouter
from app.database import db_manager
from app.schema import DashboardStats, IncidentItem

router = APIRouter(tags=["Dashboard"])

@router.get("/dashboard")
def get_dashboard():
    status = db_manager.get_status()
    if not status["connected"]:
        return {
            "total_nodes": 0,
            "total_relationships": 0,
            "total_incidents": 0,
            "total_investigations": 0,
            "falkordb_connected": False,
            "falkordb_details": status,
            "recent_investigations": [],
            "recent_incidents": []
        }

    # Real FalkorDB queries
    try:
        n_res = db_manager.query("MATCH (n) RETURN count(n) AS c")
        total_nodes = n_res.result_set[0][0] if n_res.result_set else 0

        r_res = db_manager.query("MATCH ()-[r]->() RETURN count(r) AS c")
        total_rels = r_res.result_set[0][0] if r_res.result_set else 0

        i_res = db_manager.query("MATCH (i:Incident) RETURN count(i) AS c")
        total_incidents = i_res.result_set[0][0] if i_res.result_set else 0

        m_res = db_manager.query("MATCH (m:Memory) RETURN count(m) AS c")
        total_investigations = m_res.result_set[0][0] if m_res.result_set else 0

        # Recent investigations (memories)
        rec_inv_res = db_manager.query("""
        MATCH (m:Memory)
        RETURN m.id, m.title, m.question, m.timestamp, m.linked_incident, m.linked_system
        ORDER BY m.timestamp DESC
        LIMIT 5
        """)
        recent_invs = []
        if rec_inv_res and rec_inv_res.result_set:
            for row in rec_inv_res.result_set:
                recent_invs.append({
                    "id": str(row[0]),
                    "title": str(row[1]),
                    "question": str(row[2]),
                    "timestamp": str(row[3]),
                    "linked_incident": str(row[4]) if row[4] else None,
                    "linked_system": str(row[5]) if row[5] else None
                })

        # Recent incidents
        inc_res = db_manager.query("""
        MATCH (i:Incident)
        RETURN i.id, i.title, i.severity, i.status, i.affected_system, i.created_at, i.description
        ORDER BY i.created_at DESC
        LIMIT 5
        """)
        recent_incs = []
        if inc_res and inc_res.result_set:
            for row in inc_res.result_set:
                recent_incs.append({
                    "id": str(row[0]),
                    "title": str(row[1]),
                    "severity": str(row[2]),
                    "status": str(row[3]),
                    "affected_system": str(row[4]),
                    "created_at": str(row[5]),
                    "description": str(row[6])
                })

        return {
            "total_nodes": total_nodes,
            "total_relationships": total_rels,
            "total_incidents": total_incidents,
            "total_investigations": total_investigations,
            "falkordb_connected": True,
            "falkordb_details": status,
            "recent_investigations": recent_invs,
            "recent_incidents": recent_incs
        }
    except Exception as e:
        return {
            "total_nodes": 0,
            "total_relationships": 0,
            "total_incidents": 0,
            "total_investigations": 0,
            "falkordb_connected": False,
            "falkordb_details": {"error": str(e), **status},
            "recent_investigations": [],
            "recent_incidents": []
        }
