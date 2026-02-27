"""
Synthetic Intelligence Engine — rule-based AI agent framework.
"""

from __future__ import annotations

import re
import time
from dataclasses import dataclass, field
from typing import Callable, Dict, List, Optional


@dataclass
class AgentMessage:
    role: str  # "user" | "assistant" | "system"
    content: str
    timestamp: float = field(default_factory=time.time)


@dataclass
class AgentContext:
    session_id: str
    history: List[AgentMessage] = field(default_factory=list)
    metadata: Dict[str, str] = field(default_factory=dict)

    def add_message(self, role: str, content: str) -> AgentMessage:
        msg = AgentMessage(role=role, content=content)
        self.history.append(msg)
        return msg


Rule = Callable[[str, AgentContext], Optional[str]]


class SyntheticIntelligenceEngine:
    """
    A lightweight, rule-based AI engine that processes user messages and
    produces responses by matching registered intent handlers.
    """

    def __init__(self, name: str = "SIE-Agent") -> None:
        self.name = name
        self._rules: List[tuple[re.Pattern[str], Rule]] = []
        self._fallback: Rule = lambda msg, ctx: (
            f"I'm {self.name}. I received your message but have no specific "
            "handler for it. Please refine your query."
        )

    # ------------------------------------------------------------------
    # Registration helpers
    # ------------------------------------------------------------------

    def rule(self, pattern: str, flags: int = re.IGNORECASE) -> Callable[[Rule], Rule]:
        """Decorator that registers a handler for a regex *pattern*."""

        def decorator(fn: Rule) -> Rule:
            self._rules.append((re.compile(pattern, flags), fn))
            return fn

        return decorator

    def set_fallback(self, fn: Rule) -> Rule:
        self._fallback = fn
        return fn

    # ------------------------------------------------------------------
    # Core processing
    # ------------------------------------------------------------------

    def process(self, message: str, context: AgentContext) -> str:
        context.add_message("user", message)
        for pattern, handler in self._rules:
            if pattern.search(message):
                response = handler(message, context)
                if response is not None:
                    context.add_message("assistant", response)
                    return response
        response = self._fallback(message, context)
        if response is None:
            response = ""
        context.add_message("assistant", response)
        return response


# ---------------------------------------------------------------------------
# Default agent instance with built-in intents
# ---------------------------------------------------------------------------

default_agent = SyntheticIntelligenceEngine(name="SIE-Bot")


@default_agent.rule(r"\b(hello|hi|hey|greet)\b")
def _greet(_msg: str, ctx: AgentContext) -> str:
    return (
        f"Hello! I'm {default_agent.name}, your AI DevOps & Web3 assistant. "
        "How can I help you today?"
    )


@default_agent.rule(r"\b(help|what can you do|capabilities)\b")
def _help(_msg: str, _ctx: AgentContext) -> str:
    return (
        "I can help you with:\n"
        "• AI DevOps pipeline automation\n"
        "• Synthetic intelligence engine configuration\n"
        "• Web3 wallet & smart-contract queries\n"
        "• Agent/bot task orchestration\n"
        "Just ask me anything!"
    )


@default_agent.rule(r"\b(devops|pipeline|deploy|ci.?cd)\b")
def _devops(_msg: str, _ctx: AgentContext) -> str:
    return (
        "AI DevOps Engine: I can assist with CI/CD pipeline design, "
        "containerisation strategies (Docker/Kubernetes), infrastructure-as-code, "
        "and automated testing workflows."
    )


@default_agent.rule(r"\b(web3|blockchain|wallet|nft|defi|smart.?contract)\b")
def _web3(_msg: str, _ctx: AgentContext) -> str:
    return (
        "Web3 Module: I support wallet connectivity (EVM-compatible), "
        "smart-contract interaction via JSON-RPC, NFT metadata querying, "
        "and DeFi protocol integrations."
    )


@default_agent.rule(r"\b(agents?|bot|automate|task)\b")
def _agent(_msg: str, _ctx: AgentContext) -> str:
    return (
        "Agent Framework: You can register custom rule-based or LLM-backed agents, "
        "chain them together for multi-step task orchestration, and monitor "
        "execution via the /agents API."
    )


@default_agent.rule(r"\b(status|health|ping)\b")
def _status(_msg: str, _ctx: AgentContext) -> str:
    return "All systems operational. Synthetic Intelligence Engine is running. ✓"
