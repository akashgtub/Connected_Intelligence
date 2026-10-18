import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import db_manager
from app.seed_data import seed_database
from app.routes import health, dashboard, graph, incidents, investigations, memory

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("connected_intelligence")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup sequence
    logger.info("Initializing Connected Intelligence API...")
    connected = db_manager.connect()
    if connected:
        logger.info(f"FalkorDB connected successfully to graph '{settings.falkordb_graph}'. Checking graph state...")
        try:
            res = db_manager.query("MATCH (n) RETURN count(n) AS c")
            count = res.result_set[0][0] if res.result_set else 0
            if count == 0:
                logger.info("FalkorDB graph is empty. Auto-seeding synthetic company knowledge graph...")
                seed_res = seed_database()
                logger.info(f"Auto-seed completed: {seed_res.get('total_nodes')} nodes created.")
            else:
                logger.info(f"FalkorDB graph already populated with {count} nodes.")
        except Exception as e:
            logger.warning(f"Error checking or seeding graph: {e}")
    else:
        logger.warning(
            "====================================================================\n"
            "FalkorDB is NOT currently connected at %s:%s.\n"
            "To start FalkorDB with Docker, run:\n"
            "  docker run -p 6379:6379 -it --rm falkordb/falkordb\n"
            "Or configure FALKORDB_URL / FALKORDB_HOST in .env for FalkorDB Cloud.\n"
            "The API server is running and will connect automatically once FalkorDB is started.\n"
            "====================================================================",
            settings.falkordb_host, settings.falkordb_port
        )
    yield
    # Shutdown sequence
    if db_manager.client:
        try:
            db_manager.client.close()
        except Exception:
            pass
    logger.info("Connected Intelligence API shut down.")

app = FastAPI(
    title="Connected Intelligence API",
    description="Graph-Powered AI Agent for Enterprise Knowledge & Incident Investigation using FalkorDB",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes under /api
app.include_router(health.router, prefix="/api")
app.include_router(dashboard.router, prefix="/api")
app.include_router(graph.router, prefix="/api")
app.include_router(incidents.router, prefix="/api")
app.include_router(investigations.router, prefix="/api")
app.include_router(memory.router, prefix="/api")

@app.get("/")
def root():
    return {
        "service": "Connected Intelligence API",
        "tagline": "Connected Knowledge. Smarter Decisions.",
        "hackathon": "Graph Hacks 2026",
        "database": "FalkorDB",
        "docs_url": "/docs",
        "falkordb_status": db_manager.get_status()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.backend_host, port=settings.effective_port, reload=True)
