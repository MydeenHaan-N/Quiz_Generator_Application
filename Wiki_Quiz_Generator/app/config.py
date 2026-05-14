"""
Configuration settings for the AI Wiki Quiz Generator API.
Loads environment variables and provides application settings.
"""
from pydantic_settings import BaseSettings
from typing import List, Optional
import json
import os


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # Database
    database_url: str
    
    # Gemini API
    gemini_api_key: Optional[str] = None

    # LLM provider options
    llm_provider: str = "gemini"
    groq_api_key: Optional[str] = None
    groq_model: str = "llama-3.1-8b-instant"
    
    # Application
    app_name: str = "AI Wiki Quiz Generator"
    debug: bool = True
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    
    # CORS - Parse from environment variable if exists
    cors_origins: List[str] = None
    
    # Quiz Settings
    default_num_questions: int = 10
    max_num_questions: int = 20
    
    class Config:
        env_file = ".env"
        case_sensitive = False
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Parse CORS_ORIGINS from environment if it exists
        if self.cors_origins is None:
            cors_env = os.getenv("CORS_ORIGINS")
            if cors_env:
                try:
                    # Try to parse as JSON array
                    self.cors_origins = json.loads(cors_env)
                except json.JSONDecodeError:
                    # Fallback to default
                    self.cors_origins = ["http://localhost:5173", "http://localhost:3000"]
            else:
                self.cors_origins = ["http://localhost:5173", "http://localhost:3000"]


settings = Settings()
