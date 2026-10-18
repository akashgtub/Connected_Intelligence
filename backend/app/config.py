import os
from typing import Optional, List
from pydantic_settings import BaseSettings
from pydantic import Field

class Settings(BaseSettings):
    # FalkorDB Connection Settings
    # Option A: Remote Cloud instance (Recommended for Production on Render)
    falkordb_url: Optional[str] = None

    # Option B: Host & Port (Local Docker or discrete credentials)
    falkordb_host: str = "localhost"
    falkordb_port: int = 6379
    falkordb_password: Optional[str] = None
    falkordb_username: Optional[str] = None
    falkordb_ssl: bool = False
    falkordb_graph: str = "company_brain"

    @property
    def clean_falkordb_url(self) -> Optional[str]:
        """Returns stripped and normalized FALKORDB_URL, removing accidental quotes/spaces."""
        if not self.falkordb_url:
            return None
        cleaned = self.falkordb_url.strip().strip("'\"")
        # Normalize falkordbs:// -> falkors:// and falkordb:// -> falkor://
        if cleaned.startswith("falkordbs://"):
            cleaned = "falkors://" + cleaned[len("falkordbs://"):]
        elif cleaned.startswith("falkordb://"):
            cleaned = "falkor://" + cleaned[len("falkordb://"):]
        return cleaned if cleaned else None

    # AI Model API Keys (optional; deterministic graph engine used if omitted)
    openai_api_key: Optional[str] = None
    gemini_api_key: Optional[str] = None

    # Server Configuration (Render injects PORT)
    backend_host: str = "0.0.0.0"
    backend_port: int = 8000
    port: Optional[int] = Field(default=None, alias="PORT")

    # CORS Configuration
    # In production, set to your Render frontend URL (e.g. https://connected-intelligence-ui.onrender.com)
    frontend_origins: str = "http://localhost:5173,http://127.0.0.1:5173"

    @property
    def effective_port(self) -> int:
        return self.port if self.port is not None else self.backend_port

    @property
    def allowed_origins(self) -> List[str]:
        if not self.frontend_origins:
            return ["*"]
        origins = [o.strip() for o in self.frontend_origins.split(",") if o.strip()]
        # Always include local development origins for ease of testing
        for dev in ["http://localhost:5173", "http://127.0.0.1:5173"]:
            if dev not in origins:
                origins.append(dev)
        return origins

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"

settings = Settings()
