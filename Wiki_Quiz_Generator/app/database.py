"""
Database connection and session management.
Supports both local SQLite (development) and async PostgreSQL (production/Neon).
"""
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
from app.config import settings
import ssl

database_url = settings.database_url

if database_url.startswith("sqlite+aiosqlite"):
    # Local development database
    engine = create_async_engine(
        database_url,
        echo=settings.debug,
        future=True,
    )
else:
    # Remove query params and configure SSL explicitly for Postgres/Neon
    clean_url = database_url.split("?")[0]
    engine = create_async_engine(
        clean_url,
        echo=settings.debug,
        future=True,
        pool_pre_ping=True,
        pool_size=10,
        max_overflow=20,
        connect_args={
            "ssl": ssl.create_default_context(),
            "server_settings": {
                "application_name": "ai_wiki_quiz_generator"
            }
        }
    )

# Create async session factory
AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False
)

# Base class for models
Base = declarative_base()


async def get_db() -> AsyncSession:
    """
    Dependency function to get database session.
    Yields a database session and ensures proper cleanup.
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


async def init_db():
    """Initialize database tables."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
