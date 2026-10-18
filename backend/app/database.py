import logging
import socket
import time
from typing import Dict, Any, List, Optional, Tuple
from falkordb import FalkorDB
from app.config import settings
from app.schema import NodeModel, EdgeModel

logger = logging.getLogger("connected_intelligence.db")

class FalkorDBManager:
    def __init__(self):
        self.client: Optional[FalkorDB] = None
        self.graph = None
        self._is_connected = False
        self._last_error = ""
        self._last_check_time = 0.0
        self._check_interval = 2.0  # cache connection check for 2 seconds

    def _is_port_open(self, host: str, port: int, timeout: float = 0.5) -> bool:
        """Fast pre-check to avoid long socket connect timeouts when FalkorDB is down."""
        try:
            with socket.create_connection((host, port), timeout=timeout):
                return True
        except Exception:
            return False

    def connect(self) -> bool:
        """Attempts to connect to FalkorDB via URL or host/port."""
        now = time.time()
        self._last_check_time = now

        try:
            if settings.falkordb_url:
                logger.info(f"Connecting to FalkorDB via URL: {settings.falkordb_url[:15]}...")
                self.client = FalkorDB.from_url(settings.falkordb_url)
            else:
                # Fast socket pre-check on host/port
                if not self._is_port_open(settings.falkordb_host, settings.falkordb_port, timeout=0.4):
                    self._is_connected = False
                    self._last_error = f"Cannot open socket connection to {settings.falkordb_host}:{settings.falkordb_port}. Target port is not listening."
                    self.client = None
                    self.graph = None
                    return False

                logger.info(f"Connecting to FalkorDB at {settings.falkordb_host}:{settings.falkordb_port}")
                kwargs = {
                    "host": settings.falkordb_host,
                    "port": settings.falkordb_port,
                    "socket_connect_timeout": 1.0,
                    "socket_timeout": 3.0
                }
                if settings.falkordb_password:
                    kwargs["password"] = settings.falkordb_password
                if settings.falkordb_username:
                    kwargs["username"] = settings.falkordb_username
                
                self.client = FalkorDB(**kwargs)

            # Select graph and test reachability
            self.graph = self.client.select_graph(settings.falkordb_graph)
            self.graph.query("RETURN 1 AS ping")
            self._is_connected = True
            self._last_error = ""
            logger.info(f"Successfully connected to FalkorDB graph '{settings.falkordb_graph}'")
            return True
        except Exception as e:
            self._is_connected = False
            self._last_error = str(e)
            self.client = None
            self.graph = None
            logger.warning(f"FalkorDB connection failed: {e}")
            return False

    @property
    def is_connected(self) -> bool:
        now = time.time()
        # If checked recently and failed, return False quickly
        if not self._is_connected and (now - self._last_check_time) < self._check_interval:
            return False
        if not self._is_connected or not self.graph:
            return self.connect()
        try:
            self.graph.query("RETURN 1 AS ping")
            return True
        except Exception:
            self._is_connected = False
            return False

    @property
    def last_error(self) -> str:
        return self._last_error

    def query(self, cypher: str, params: Optional[Dict[str, Any]] = None) -> Any:
        """Executes a Cypher query against FalkorDB. Raises ConnectionError if FalkorDB is unreachable."""
        if not self.is_connected:
            raise ConnectionError(
                f"FalkorDB is unreachable at {settings.falkordb_host}:{settings.falkordb_port}. "
                f"Ensure the FalkorDB Docker container is running (`docker run -p 6379:6379 -it --rm falkordb/falkordb`) "
                f"or configure FALKORDB_URL / FALKORDB_HOST in .env. Details: {self._last_error}"
            )
        try:
            if params:
                return self.graph.query(cypher, params)
            return self.graph.query(cypher)
        except Exception as e:
            logger.error(f"Cypher query execution error: {e}\nQuery: {cypher}")
            raise e

    def get_status(self) -> Dict[str, Any]:
        """Returns health and connection details for FalkorDB."""
        connected = self.is_connected
        stats = {
            "connected": connected,
            "host": settings.falkordb_host,
            "port": settings.falkordb_port,
            "graph_name": settings.falkordb_graph,
            "url_configured": bool(settings.falkordb_url),
            "last_error": self._last_error if not connected else None,
            "docker_guidance": (
                "To start FalkorDB locally with Docker:\n"
                "docker run -p 6379:6379 -it --rm falkordb/falkordb\n"
                "Or using docker-compose:\n"
                "docker-compose up -d falkordb\n\n"
                "Alternatively, configure FALKORDB_URL / FALKORDB_HOST in .env for FalkorDB Cloud."
            ) if not connected else None
        }
        if connected:
            try:
                node_res = self.graph.query("MATCH (n) RETURN count(n) AS node_count")
                rel_res = self.graph.query("MATCH ()-[r]->() RETURN count(r) AS rel_count")
                stats["node_count"] = node_res.result_set[0][0] if node_res.result_set else 0
                stats["relationship_count"] = rel_res.result_set[0][0] if rel_res.result_set else 0
            except Exception:
                stats["node_count"] = 0
                stats["relationship_count"] = 0
        return stats

db_manager = FalkorDBManager()
