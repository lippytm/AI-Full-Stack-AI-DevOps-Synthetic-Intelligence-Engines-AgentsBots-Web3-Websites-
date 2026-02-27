"""
FastAPI application entry point.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

from app.routes.chat import router as chat_router

app = FastAPI(
    title="AI DevOps Synthetic Intelligence Engine",
    description=(
        "Full-stack AI platform providing agent/bot orchestration, "
        "DevOps automation APIs, and Web3 integrations."
    ),
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router)

# Serve the frontend if the static directory exists
_STATIC_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "frontend")
if os.path.isdir(_STATIC_DIR):
    app.mount("/static", StaticFiles(directory=os.path.join(_STATIC_DIR, "static")), name="static")

    @app.get("/", include_in_schema=False)
    def serve_index() -> FileResponse:
        return FileResponse(os.path.join(_STATIC_DIR, "templates", "index.html"))


@app.get("/health", tags=["health"])
def health() -> dict:
    return {"status": "ok", "service": "AI DevOps Synthetic Intelligence Engine"}
