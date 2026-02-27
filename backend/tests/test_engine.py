"""
Tests for the Synthetic Intelligence Engine agent.
"""

import pytest
from app.agents.engine import AgentContext, SyntheticIntelligenceEngine, default_agent


def make_ctx() -> AgentContext:
    import uuid
    return AgentContext(session_id=str(uuid.uuid4()))


class TestSyntheticIntelligenceEngine:
    def test_custom_rule_matches(self):
        engine = SyntheticIntelligenceEngine(name="TestBot")

        @engine.rule(r"foo")
        def _foo(msg, ctx):
            return "bar"

        ctx = make_ctx()
        assert engine.process("say foo please", ctx) == "bar"

    def test_fallback_used_when_no_rule_matches(self):
        engine = SyntheticIntelligenceEngine(name="TestBot")
        ctx = make_ctx()
        reply = engine.process("unrecognized xyzzy input", ctx)
        assert "TestBot" in reply

    def test_custom_fallback(self):
        engine = SyntheticIntelligenceEngine()

        @engine.set_fallback
        def _fb(msg, ctx):
            return "custom fallback"

        ctx = make_ctx()
        assert engine.process("something random", ctx) == "custom fallback"

    def test_history_recorded(self):
        engine = SyntheticIntelligenceEngine(name="HistBot")
        ctx = make_ctx()
        engine.process("hello there", ctx)
        assert len(ctx.history) == 2
        assert ctx.history[0].role == "user"
        assert ctx.history[1].role == "assistant"

    def test_session_id_preserved(self):
        ctx = make_ctx()
        sid = ctx.session_id
        default_agent.process("hello", ctx)
        assert ctx.session_id == sid

    def test_rules_count(self):
        assert len(default_agent._rules) >= 6


class TestDefaultAgentIntents:
    @pytest.mark.parametrize("msg", ["hello", "hi there", "hey bot"])
    def test_greet(self, msg):
        ctx = make_ctx()
        reply = default_agent.process(msg, ctx)
        assert "SIE-Bot" in reply

    def test_help(self):
        ctx = make_ctx()
        reply = default_agent.process("help me", ctx)
        assert "DevOps" in reply

    def test_devops(self):
        ctx = make_ctx()
        reply = default_agent.process("tell me about devops", ctx)
        assert "DevOps" in reply or "pipeline" in reply.lower()

    def test_web3(self):
        ctx = make_ctx()
        reply = default_agent.process("web3 wallet", ctx)
        assert "wallet" in reply.lower() or "Web3" in reply

    def test_agent(self):
        ctx = make_ctx()
        reply = default_agent.process("how do agents work", ctx)
        assert "agent" in reply.lower() or "Agent" in reply

    def test_status(self):
        ctx = make_ctx()
        reply = default_agent.process("status", ctx)
        assert "operational" in reply.lower() or "running" in reply.lower()
