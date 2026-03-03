"use client";

import { useState } from "react";

interface Agent {
  id: string;
  name: string;
  role: string;
  icon: string;
  status: "idle" | "running" | "complete";
  color: string;
}

interface SwarmLog {
  agentId: string;
  agentName: string;
  message: string;
  timestamp: string;
}

const AGENTS: Agent[] = [
  {
    id: "analyst",
    name: "Market Analyst",
    role: "Analyzes on-chain data and market signals for DeFi opportunities",
    icon: "📊",
    status: "idle",
    color: "purple",
  },
  {
    id: "sentinel",
    name: "Risk Sentinel",
    role: "Monitors wallets and protocols for anomalies and rug-pull patterns",
    icon: "🛡️",
    status: "idle",
    color: "cyan",
  },
  {
    id: "scribe",
    name: "Code Scribe",
    role: "Reviews smart contracts and generates security audit summaries",
    icon: "📝",
    status: "idle",
    color: "pink",
  },
  {
    id: "navigator",
    name: "DeFi Navigator",
    role: "Discovers yield opportunities across lending, staking, and LP pools",
    icon: "🧭",
    status: "idle",
    color: "amber",
  },
  {
    id: "oracle",
    name: "Data Oracle",
    role: "Aggregates and cross-references price feeds and sentiment signals",
    icon: "🔮",
    status: "idle",
    color: "green",
  },
  {
    id: "trainer",
    name: "Model Trainer",
    role: "Continuously refines AI models on latest blockchain activity",
    icon: "🧠",
    status: "idle",
    color: "indigo",
  },
];

const SWARM_SCENARIOS = [
  { label: "Scan DeFi Opportunities", description: "Agents sweep lending, staking, and LP pools for best yields" },
  { label: "Audit Smart Contract", description: "Scribe and Sentinel collaborate to review contract code" },
  { label: "Portfolio Risk Assessment", description: "Full swarm evaluates wallet exposure and recommends rebalancing" },
  { label: "Market Sentiment Analysis", description: "Oracle and Analyst combine on-chain data with social signals" },
];

function simulateLogs(agents: Agent[], scenarioLabel: string): SwarmLog[] {
  const now = new Date();
  const fmt = (offset: number) =>
    new Date(now.getTime() + offset * 1000).toLocaleTimeString();

  const logs: SwarmLog[] = [
    { agentId: "trainer", agentName: "Model Trainer", message: `Initializing BrainKit swarm for: "${scenarioLabel}"`, timestamp: fmt(0) },
    { agentId: "oracle", agentName: "Data Oracle", message: "Fetching latest on-chain data feeds...", timestamp: fmt(1) },
    { agentId: "analyst", agentName: "Market Analyst", message: "Cross-referencing price signals with volume anomalies", timestamp: fmt(2) },
    { agentId: "sentinel", agentName: "Risk Sentinel", message: "Scanning for protocol vulnerabilities and blacklisted addresses", timestamp: fmt(3) },
    { agentId: "navigator", agentName: "DeFi Navigator", message: "Mapping yield routes across 12 protocols", timestamp: fmt(4) },
    { agentId: "scribe", agentName: "Code Scribe", message: "Generating structured summary report", timestamp: fmt(5) },
    { agentId: "trainer", agentName: "Model Trainer", message: "✅ Swarm task complete. All agents synchronized.", timestamp: fmt(6) },
  ];

  return logs.filter((l) => agents.some((a) => a.id === l.agentId));
}

const colorMap: Record<string, string> = {
  purple: "border-purple-500/40 bg-purple-500/10 text-purple-300",
  cyan: "border-cyan-500/40 bg-cyan-500/10 text-cyan-300",
  pink: "border-pink-500/40 bg-pink-500/10 text-pink-300",
  amber: "border-amber-500/40 bg-amber-500/10 text-amber-300",
  green: "border-green-500/40 bg-green-500/10 text-green-300",
  indigo: "border-indigo-500/40 bg-indigo-500/10 text-indigo-300",
};

const dotMap: Record<string, string> = {
  purple: "bg-purple-400",
  cyan: "bg-cyan-400",
  pink: "bg-pink-400",
  amber: "bg-amber-400",
  green: "bg-green-400",
  indigo: "bg-indigo-400",
};

export default function BrainKitPage() {
  const [agents, setAgents] = useState<Agent[]>(AGENTS);
  const [selectedScenario, setSelectedScenario] = useState(SWARM_SCENARIOS[0]);
  const [logs, setLogs] = useState<SwarmLog[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  function toggleAgent(id: string) {
    if (isRunning) return;
    setAgents((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, status: a.status === "idle" ? ("running" as const) : ("idle" as const) }
          : a
      )
    );
  }

  async function runSwarm() {
    const active = agents.filter((a) => a.status === "running" || a.status === "complete");
    const targets = agents.map((a) => ({ ...a, status: "idle" as const }));
    const activeIds = new Set(active.length > 0 ? active.map((a) => a.id) : agents.map((a) => a.id));

    setIsRunning(true);
    setIsComplete(false);
    setLogs([]);

    // Activate all selected agents
    setAgents(targets.map((a) => ({ ...a, status: activeIds.has(a.id) ? ("running" as const) : ("idle" as const) })));

    const generated = simulateLogs(
      agents.filter((a) => activeIds.has(a.id)),
      selectedScenario.label
    );

    // Stream logs one by one
    for (let i = 0; i < generated.length; i++) {
      await new Promise((r) => setTimeout(r, 800));
      setLogs((prev) => [...prev, generated[i]]);
    }

    setAgents((prev) =>
      prev.map((a) =>
        activeIds.has(a.id) ? { ...a, status: "complete" as const } : a
      )
    );
    setIsRunning(false);
    setIsComplete(true);
  }

  function resetSwarm() {
    setAgents(AGENTS);
    setLogs([]);
    setIsComplete(false);
  }

  const activeCount = agents.filter((a) => a.status !== "idle").length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-medium mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          Autonomous Agent Swarm
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            AI BrainKit
          </span>
        </h1>
        <p className="text-gray-400 max-w-2xl">
          Orchestrate a swarm of specialized AI agents that collaborate autonomously
          to analyze markets, audit contracts, assess risk, and discover DeFi
          opportunities across the entire Web3 ecosystem.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Agent Grid */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">
              Agent Roster{" "}
              <span className="text-sm text-gray-500 font-normal ml-1">
                (click to activate)
              </span>
            </h2>
            <span className="text-xs text-gray-500">
              {activeCount} / {agents.length} active
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {agents.map((agent) => (
              <button
                key={agent.id}
                onClick={() => toggleAgent(agent.id)}
                disabled={isRunning}
                className={`text-left rounded-xl border p-4 transition-all duration-200 ${
                  agent.status !== "idle"
                    ? colorMap[agent.color] + " scale-[1.01]"
                    : "border-gray-700 bg-gray-800/40 text-gray-400 hover:border-gray-600 hover:bg-gray-800/60"
                } ${isRunning ? "cursor-not-allowed opacity-80" : "cursor-pointer"}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{agent.icon}</span>
                  <div className="flex items-center gap-1.5">
                    {agent.status === "running" && (
                      <span
                        className={`w-2 h-2 rounded-full ${dotMap[agent.color]} animate-pulse`}
                      />
                    )}
                    {agent.status === "complete" && (
                      <span className="text-green-400 text-xs font-medium">✓ done</span>
                    )}
                    {agent.status === "idle" && (
                      <span className="text-xs text-gray-600">offline</span>
                    )}
                  </div>
                </div>
                <div className="font-semibold text-sm text-white mb-1">
                  {agent.name}
                </div>
                <div className="text-xs leading-relaxed opacity-70">
                  {agent.role}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Control Panel */}
        <div className="space-y-4">
          {/* Scenario Selector */}
          <div className="rounded-xl border border-gray-700 bg-gray-900/60 p-4">
            <h3 className="text-sm font-semibold text-white mb-3">
              🎯 Swarm Scenario
            </h3>
            <div className="space-y-2">
              {SWARM_SCENARIOS.map((scenario) => (
                <button
                  key={scenario.label}
                  disabled={isRunning}
                  onClick={() => setSelectedScenario(scenario)}
                  className={`w-full text-left rounded-lg px-3 py-2.5 text-sm transition-all ${
                    selectedScenario.label === scenario.label
                      ? "bg-purple-600/30 border border-purple-500/50 text-white"
                      : "bg-gray-800/40 border border-gray-700/50 text-gray-400 hover:bg-gray-800 hover:text-gray-300"
                  } ${isRunning ? "cursor-not-allowed" : ""}`}
                >
                  <div className="font-medium">{scenario.label}</div>
                  <div className="text-xs opacity-70 mt-0.5">{scenario.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Run Button */}
          <button
            onClick={isComplete ? resetSwarm : runSwarm}
            disabled={isRunning}
            className={`w-full py-3 rounded-xl font-semibold text-sm transition-all shadow-lg ${
              isComplete
                ? "bg-gray-700 hover:bg-gray-600 text-white border border-gray-600"
                : isRunning
                ? "bg-gradient-to-r from-purple-800 to-cyan-800 text-white/70 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white shadow-purple-900/30"
            }`}
          >
            {isRunning
              ? "⚡ Swarm Running..."
              : isComplete
              ? "↺ Reset Swarm"
              : "🚀 Launch Swarm"}
          </button>

          {/* Stats */}
          <div className="rounded-xl border border-gray-700 bg-gray-900/60 p-4 space-y-3">
            <h3 className="text-sm font-semibold text-white">📈 BrainKit Stats</h3>
            {[
              { label: "Agents Available", value: AGENTS.length.toString() },
              { label: "Active Now", value: activeCount.toString() },
              { label: "Tasks Run", value: isComplete ? "1" : "0" },
              { label: "Logs Generated", value: logs.length.toString() },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center justify-between text-sm">
                <span className="text-gray-500">{stat.label}</span>
                <span className="font-semibold text-white">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Swarm Log */}
      {(logs.length > 0 || isRunning) && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-white mb-3">
            🖥️ Swarm Activity Log
          </h2>
          <div className="rounded-xl border border-gray-800 bg-gray-950/80 p-4 font-mono text-sm space-y-2 min-h-[160px]">
            {logs.map((log, i) => {
              const agent = agents.find((a) => a.id === log.agentId);
              const color = agent ? dotMap[agent.color] : "bg-gray-400";
              return (
                <div key={i} className="flex items-start gap-3 text-gray-300">
                  <span className="text-gray-600 text-xs mt-0.5 whitespace-nowrap">
                    {log.timestamp}
                  </span>
                  <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${color}`} />
                  <span>
                    <span className="text-gray-500">[{log.agentName}]</span>{" "}
                    {log.message}
                  </span>
                </div>
              );
            })}
            {isRunning && (
              <div className="flex gap-1 pl-28">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce [animation-delay:0ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce [animation-delay:300ms]" />
              </div>
            )}
          </div>
        </div>
      )}

      {isComplete && (
        <div className="mt-4 rounded-xl border border-green-500/30 bg-green-500/10 px-5 py-4 text-green-300 text-sm">
          ✅ <span className="font-semibold">Swarm complete.</span> All agents
          finished the &ldquo;{selectedScenario.label}&rdquo; task successfully. Results
          have been synthesized and are ready for review.
        </div>
      )}
    </div>
  );
}
