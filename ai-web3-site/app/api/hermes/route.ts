import { NextRequest, NextResponse } from "next/server";

// Hermes Fabric Engine — swarm agent definitions
const HERMES_SYSTEM_PROMPT = `You are Hermes, the AI Clone Copilot powering the Hermes Fabric Engines Swarms Systems platform. You orchestrate a distributed swarm of specialized AI agents across Web3 infrastructure. Your role is to:

- Coordinate multi-agent task execution across the Hermes Fabric network
- Route user intent to the appropriate swarm agent (Analyst, Executor, Guardian, Oracle, Synthesizer)
- Provide transparent reasoning about which agents are activated and why
- Deliver synthesized intelligence from across the swarm pipeline
- Support DeFi strategy, smart contract auditing, on-chain analytics, risk assessment, and Web3 automation

You represent the lippytmai AI brand and the Hermes Fabric Engine identity. Be direct, intelligent, and action-oriented. Always indicate which swarm agent(s) you are invoking in your response using the format [AGENT: AgentName].`;

const HERMES_AGENTS = [
  {
    id: "analyst",
    name: "Analyst",
    icon: "🔬",
    description: "On-chain data analysis & market intelligence",
  },
  {
    id: "executor",
    name: "Executor",
    icon: "⚡",
    description: "Transaction planning & smart contract execution",
  },
  {
    id: "guardian",
    name: "Guardian",
    icon: "🛡️",
    description: "Security auditing & risk assessment",
  },
  {
    id: "oracle",
    name: "Oracle",
    icon: "🔮",
    description: "Price feeds, predictions & external data",
  },
  {
    id: "synthesizer",
    name: "Synthesizer",
    icon: "🧬",
    description: "Multi-agent output synthesis & strategy generation",
  },
];

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

export async function GET() {
  return NextResponse.json({ agents: HERMES_AGENTS });
}

export async function POST(req: NextRequest) {
  try {
    const { messages, agentFilter } = (await req.json()) as {
      messages: Message[];
      agentFilter?: string;
    };

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid request: messages array required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      const lastUserMessage =
        messages.filter((m) => m.role === "user").pop()?.content ?? "";
      const demoReply = getHermesDemoReply(lastUserMessage, agentFilter);
      return NextResponse.json({ reply: demoReply, agents: HERMES_AGENTS });
    }

    const systemContent = agentFilter
      ? `${HERMES_SYSTEM_PROMPT}\n\nFor this request, focus on the ${agentFilter} agent's domain.`
      : HERMES_SYSTEM_PROMPT;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{ role: "system", content: systemContent }, ...messages],
        temperature: 0.6,
        max_tokens: 1200,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("OpenAI API error (Hermes):", error);
      return NextResponse.json(
        { error: "Hermes Fabric engine error" },
        { status: 500 }
      );
    }

    const data = (await response.json()) as {
      choices: { message: { content: string } }[];
    };
    const reply =
      data.choices[0]?.message?.content ?? "No response generated.";

    return NextResponse.json({ reply, agents: HERMES_AGENTS });
  } catch (err) {
    console.error("Hermes API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function getHermesDemoReply(message: string, agentFilter?: string): string {
  const lower = message.toLowerCase();

  const agentName = agentFilter
    ? agentFilter.charAt(0).toUpperCase() + agentFilter.slice(1)
    : "Synthesizer";
  const agentTag = "[AGENT: " + agentName + "]";

  const demo = "\n\n*Demo mode — connect an OpenAI API key for live Hermes Fabric intelligence.*";

  if (lower.includes("audit") || lower.includes("security") || lower.includes("risk")) {
    return agentTag + " → [AGENT: Guardian]\n\n**Security Swarm Activated**\n\nThe Guardian agent has initiated a security sweep across the Hermes Fabric network.\n\n**Risk Assessment Pipeline:**\n- **Smart Contract Analysis** — Scanning for reentrancy, overflow, and access control vulnerabilities\n- **Wallet Exposure Check** — Evaluating approval patterns and token allowances\n- **Protocol Risk Score** — Aggregating TVL history, audit trail, and team reputation signals\n- **On-chain Anomaly Detection** — Monitoring unusual transaction patterns\n\n**Guardian Recommendation:** Always verify contract addresses on Etherscan, revoke unused approvals via revoke.cash, and test with small amounts before committing larger positions." + demo;
  }

  if (lower.includes("strategy") || lower.includes("yield") || lower.includes("defi")) {
    return agentTag + " → [AGENT: Analyst] → [AGENT: Oracle]\n\n**DeFi Strategy Swarm Activated**\n\nThe Analyst and Oracle agents are synthesizing market conditions across the Hermes Fabric.\n\n**Strategy Matrix:**\n- **Stable Yield** — Curve/Convex stablecoin pools (3–8% APR, low IL)\n- **ETH Maximalist** — Lido stETH + Aave collateralized borrowing loop\n- **Delta-Neutral** — Paired long spot / short perps on GMX\n- **L2 Farming** — Bridging to Base or Arbitrum for incentivized pools\n\n**Oracle Feed:** Current gas: ~12 gwei | ETH/USDC sentiment: Bullish | Fear & Greed: 62" + demo;
  }

  if (lower.includes("contract") || lower.includes("execute") || lower.includes("deploy")) {
    return agentTag + " → [AGENT: Executor]\n\n**Execution Swarm Activated**\n\nThe Executor agent is preparing your transaction pipeline across the Hermes Fabric.\n\n**Execution Checklist:**\n1. ✅ Simulate transaction on Tenderly fork\n2. ✅ Estimate gas with 20% buffer for safety\n3. ✅ Validate contract ABI and function signatures\n4. ⏳ Await wallet signature confirmation\n5. ⏳ Submit to mempool with optimal priority fee\n6. ⏳ Monitor inclusion and confirm finality\n\n**Executor Note:** Always use a hardware wallet (Ledger/Trezor) for high-value executions." + demo;
  }

  if (lower.includes("price") || lower.includes("predict") || lower.includes("market")) {
    return agentTag + " → [AGENT: Oracle]\n\n**Oracle Swarm Activated**\n\nThe Oracle agent is querying price feeds and predictive models across the Hermes Fabric.\n\n**Market Intelligence Feed:**\n- **ETH** — Consolidating above $3,200 key support; RSI neutral (52)\n- **BTC Dominance** — 54.2% — altcoin rotation potential building\n- **L2 TVL Trend** — Base surging +18% MoM; Arbitrum stable\n- **Sentiment Signal** — Social volume spike detected on AI-related tokens\n\n**Predictive Model Output:** Short-term (7d) range-bound; medium-term (30d) upward bias conditional on macro catalysts.\n\n⚠️ *Oracle outputs are not financial advice. DYOR before acting on any signal.*" + demo;
  }

  return "[AGENT: Synthesizer]\n\n**Hermes Fabric Swarm Initialized** 🧬\n\nI am **Hermes**, your AI Clone Copilot. I orchestrate a distributed swarm of 5 specialized agents across the Hermes Fabric Engine:\n\n- 🔬 **Analyst** — On-chain data & market intelligence\n- ⚡ **Executor** — Transaction planning & contract execution\n- 🛡️ **Guardian** — Security auditing & risk assessment\n- 🔮 **Oracle** — Price feeds, predictions & external data\n- 🧬 **Synthesizer** — Multi-agent synthesis & strategy generation\n\n**You asked:** \"" + message + "\"\n\nTo activate a specific agent, filter by role using the panel on the left — or ask me anything and the swarm will self-route.\n\n*Demo mode — connect an OpenAI API key in .env.local for live Hermes Fabric GPT-4o intelligence.*";
}
