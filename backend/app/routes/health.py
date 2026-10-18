from fastapi import APIRouter
from app.database import db_manager

router = APIRouter(tags=["Health"])

@router.get("/health")
def get_health():
    status = db_manager.get_status()
    return {
        "status": "healthy" if status["connected"] else "falkordb_disconnected",
        "service": "Connected Intelligence API",
        "version": "1.0.0",
        "database": status
    }
