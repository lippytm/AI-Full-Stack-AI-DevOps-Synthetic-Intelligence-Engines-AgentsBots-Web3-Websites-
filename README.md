# AI DevOps Synthetic Intelligence Engine

A full-stack AI platform combining **DevOps automation**, a **Synthetic Intelligence Engine** (rule-based agent framework), **AgentBot orchestration**, and **Web3 wallet connectivity** — all in a single deployable application.

---

## Project structure

```
.
├── backend/                  # Python FastAPI backend
│   ├── app/
│   │   ├── agents/
│   │   │   └── engine.py     # Synthetic Intelligence Engine (rule-based AI)
│   │   ├── routes/
│   │   │   └── chat.py       # REST API: /api/v1/chat, /agents, /sessions
│   │   └── main.py           # FastAPI app entry point
│   ├── tests/
│   │   ├── test_engine.py    # Agent engine unit tests
│   │   └── test_routes.py    # API integration tests
│   ├── requirements.txt
│   └── requirements-dev.txt
├── frontend/
│   ├── static/
│   │   ├── style.css         # Dark-mode UI styles
│   │   └── app.js            # Chat UI, Agents panel, Web3 wallet connect
│   └── templates/
│       └── index.html        # Single-page application
├── devops/
│   └── ci.yml                # GitHub Actions CI workflow
├── Dockerfile
└── docker-compose.yml
```

---

## Features

| Area | Description |
|---|---|
| **AI Chat** | Rule-based intent engine with greeting, help, DevOps, Web3, agent, and status handlers |
| **Agent API** | `POST /api/v1/chat` — stateful multi-turn conversations with session management |
| **Agents list** | `GET /api/v1/agents` — discover registered AI agents and their capabilities |
| **Session management** | `GET/DELETE /api/v1/sessions/{id}` — inspect or clear conversation history |
| **Web3** | EVM-compatible wallet connect (`eth_requestAccounts`) with chain ID display |
| **DevOps** | Dockerfile, docker-compose, and GitHub Actions CI pipeline |

---

## Quick start

### With Docker (recommended)

```bash
docker compose up --build
```

Then open <http://localhost:8000>.

### Without Docker

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

API docs available at <http://localhost:8000/docs>.

---

## Running tests

```bash
cd backend
pip install -r requirements.txt -r requirements-dev.txt
pytest tests/ -v
```

---

## API reference

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/v1/chat` | Send a message; returns AI reply + session history |
| `GET` | `/api/v1/agents` | List registered agent instances |
| `GET` | `/api/v1/sessions/{id}` | Get conversation history |
| `DELETE` | `/api/v1/sessions/{id}` | Clear a session |
| `GET` | `/health` | Service health check |

### Chat request body

```json
{
  "message": "tell me about devops",
  "session_id": "optional-uuid-to-continue-a-session"
}
```

### Chat response

```json
{
  "session_id": "550e8400-e29b-41d4-a716-446655440000",
  "reply": "AI DevOps Engine: I can assist with CI/CD pipeline design…",
  "history": [
    {"role": "user", "content": "tell me about devops", "timestamp": 1234567890.0},
    {"role": "assistant", "content": "AI DevOps Engine: …", "timestamp": 1234567890.1}
  ]
}
```

---

## Extending the agent

Register new intent handlers by decorating a function with `@engine.rule(pattern)`:

```python
from app.agents.engine import default_agent

@default_agent.rule(r"\b(kubernetes|k8s)\b")
def k8s_handler(message, context):
    return "Kubernetes support: I can help with manifests, Helm charts, and cluster scaling."
```

---

## License

MIT
