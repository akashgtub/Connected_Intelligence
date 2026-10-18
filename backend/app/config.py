import os
from typing import Optional
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    falkordb_host: str = "localhost"
    falkordb_port: int = 6379
    falkordb_password: Optional[str] = None
    falkordb_username: Optional[str] = None
    falkordb_url: Optional[str] = None
    falkordb_graph: str = "company_brain"

    openai_api_key: Optional[str] = None
    gemini_api_key: Optional[str] = None

    backend_host: str = "0.0.0.0"
    backend_port: int = 8000

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"

settings = Settings()
