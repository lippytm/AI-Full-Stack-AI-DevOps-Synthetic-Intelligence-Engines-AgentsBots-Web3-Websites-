"""
Chat / Agent API routes.
"""

from __future__ import annotations

import uuid
from typing import Dict, List, Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.agents.engine import AgentContext, AgentMessage, SyntheticIntelligenceEngine, default_agent

router = APIRouter(prefix="/api/v1", tags=["agent"])

# In-process session store (replace with Redis for production)
_sessions: Dict[str, AgentContext] = {}


# ---------------------------------------------------------------------------
# Request / Response models
# ---------------------------------------------------------------------------


class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None


class ChatResponse(BaseModel):
    session_id: str
    reply: str
    history: List[AgentMessage]


class AgentInfo(BaseModel):
    name: str
    rules_count: int


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def _get_or_create_session(session_id: Optional[str]) -> AgentContext:
    sid = session_id or str(uuid.uuid4())
    if sid not in _sessions:
        _sessions[sid] = AgentContext(session_id=sid)
    return _sessions[sid]


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------


@router.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest) -> ChatResponse:
    """Send a message to the default AI agent and receive a reply."""
    if not req.message.strip():
        raise HTTPException(status_code=422, detail="Message must not be empty.")
    ctx = _get_or_create_session(req.session_id)
    reply = default_agent.process(req.message, ctx)
    return ChatResponse(session_id=ctx.session_id, reply=reply, history=ctx.history)


@router.get("/agents", response_model=List[AgentInfo])
def list_agents() -> List[AgentInfo]:
    """List registered AI agents."""
    return [
        AgentInfo(
            name=default_agent.name,
            rules_count=len(default_agent._rules),
        )
    ]


@router.get("/sessions/{session_id}", response_model=List[AgentMessage])
def get_session_history(session_id: str) -> List[AgentMessage]:
    """Return the full message history for a session."""
    if session_id not in _sessions:
        raise HTTPException(status_code=404, detail="Session not found.")
    return _sessions[session_id].history


@router.delete("/sessions/{session_id}", status_code=200)
def delete_session(session_id: str) -> dict:
    """Clear a session's history."""
    _sessions.pop(session_id, None)
    return {}
