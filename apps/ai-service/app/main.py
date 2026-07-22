from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from contextlib import asynccontextmanager
import os
from .api.v1.router import api_router
from .core.config import get_settings

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create data directories on startup
    os.makedirs(settings.CHROMA_PERSIST_DIR, exist_ok=True)
    os.makedirs(settings.FAISS_INDEX_DIR, exist_ok=True)
    yield


def create_app() -> FastAPI:
    app = FastAPI(
        title="ADYAPAN AI Service",
        description="AI-powered features for the ADYAPAN career development platform",
        version="1.0.0",
        docs_url="/docs" if settings.DEBUG else None,
        redoc_url="/redoc" if settings.DEBUG else None,
        lifespan=lifespan,
    )

    # CORS — only allow internal backend calls
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:5000", "https://api.adyapan.com"],
        allow_credentials=True,
        allow_methods=["POST", "GET"],
        allow_headers=["*"],
    )

    app.add_middleware(GZipMiddleware, minimum_size=1000)

    # Routes
    app.include_router(api_router)

    @app.get("/health")
    async def health():
        return {
            "status": "ok",
            "service": "adyapan-ai",
            "model": settings.OPENAI_MODEL if not settings.USE_LOCAL_LLM else settings.LOCAL_MODEL,
            "local_llm": settings.USE_LOCAL_LLM,
        }

    return app


app = create_app()
