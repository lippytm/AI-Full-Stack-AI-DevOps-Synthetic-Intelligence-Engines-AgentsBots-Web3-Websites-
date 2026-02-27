"""
Tests for the chat API routes.
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health():
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json()["status"] == "ok"


def test_chat_basic():
    res = client.post("/api/v1/chat", json={"message": "hello"})
    assert res.status_code == 200
    data = res.json()
    assert "session_id" in data
    assert "reply" in data
    assert len(data["reply"]) > 0
    assert len(data["history"]) == 2  # user + assistant


def test_chat_creates_session():
    res = client.post("/api/v1/chat", json={"message": "hi"})
    assert res.status_code == 200
    sid = res.json()["session_id"]
    assert sid  # non-empty


def test_chat_reuses_session():
    res1 = client.post("/api/v1/chat", json={"message": "hello"})
    sid = res1.json()["session_id"]
    res2 = client.post("/api/v1/chat", json={"message": "help", "session_id": sid})
    assert res2.json()["session_id"] == sid
    assert len(res2.json()["history"]) == 4  # 2 turns × 2 messages


def test_chat_empty_message():
    res = client.post("/api/v1/chat", json={"message": "   "})
    assert res.status_code == 422


def test_list_agents():
    res = client.get("/api/v1/agents")
    assert res.status_code == 200
    agents = res.json()
    assert isinstance(agents, list)
    assert len(agents) >= 1
    assert agents[0]["name"] == "SIE-Bot"
    assert agents[0]["rules_count"] >= 6


def test_session_history():
    res = client.post("/api/v1/chat", json={"message": "status"})
    sid = res.json()["session_id"]
    res2 = client.get(f"/api/v1/sessions/{sid}")
    assert res2.status_code == 200
    history = res2.json()
    assert len(history) == 2


def test_session_not_found():
    res = client.get("/api/v1/sessions/nonexistent-id")
    assert res.status_code == 404


def test_delete_session():
    res = client.post("/api/v1/chat", json={"message": "hello"})
    sid = res.json()["session_id"]
    del_res = client.delete(f"/api/v1/sessions/{sid}")
    assert del_res.status_code == 200
    # session gone
    res2 = client.get(f"/api/v1/sessions/{sid}")
    assert res2.status_code == 404
