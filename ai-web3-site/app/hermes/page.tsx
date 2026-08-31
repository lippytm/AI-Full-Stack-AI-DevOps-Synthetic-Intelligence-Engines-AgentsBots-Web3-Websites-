"use client";

import { useState, useRef, useEffect } from "react";
import { useAccount } from "wagmi";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface SwarmAgent {
  id: string;
  name: string;
  icon: string;
  description: string;
}

function MarkdownContent({ content }: { content: string }) {
  const lines = content.split("\n");
  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        if (line.startsWith("- ") || line.startsWith("* ")) {
          return (
            <div key={i} className="flex gap-2">
              <span className="text-emerald-400 mt-0.5">•</span>
              <span
                dangerouslySetInnerHTML={{ __html: boldify(line.slice(2)) }}
              />
            </div>
          );
        }
        if (line.match(/^\d+\.\s/)) {
          return (
            <div key={i} className="flex gap-2">
              <span className="text-emerald-400 text-xs mt-0.5 min-w-[1.5rem]">
                {line.match(/^(\d+)\./)?.[1]}.
              </span>
              <span
                dangerouslySetInnerHTML={{
                  __html: boldify(line.replace(/^\d+\.\s/, "")),
                }}
              />
            </div>
          );
        }
        if (line.startsWith("[AGENT:")) {
          return (
            <p
              key={i}
              className="text-emerald-300 font-mono text-xs font-semibold"
              dangerouslySetInnerHTML={{ __html: line }}
            />
          );
        }
        if (line.startsWith("**") && line.endsWith("**")) {
          return (
            <p
              key={i}
              className="font-bold text-white"
              dangerouslySetInnerHTML={{ __html: boldify(line) }}
            />
          );
        }
        return line ? (
          <p
            key={i}
            dangerouslySetInnerHTML={{ __html: boldify(line) }}
          />
        ) : (
          <br key={i} />
        );
      })}
    </div>
  );
}

function boldify(text: string): string {
  return text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}

const HERMES_PROMPTS = [
  "Audit this contract for security risks",
  "Build a DeFi yield strategy for me",
  "What is the current market sentiment?",
  "Simulate an ERC-20 token deployment",
  "Run a Guardian risk assessment on my wallet",
];

const AGENTS: SwarmAgent[] = [
  { id: "", name: "All Agents", icon: "🧬", description: "Full swarm routing" },
  { id: "analyst", name: "Analyst", icon: "🔬", description: "On-chain data & market intel" },
  { id: "executor", name: "Executor", icon: "⚡", description: "Transaction & contract execution" },
  { id: "guardian", name: "Guardian", icon: "🛡️", description: "Security & risk assessment" },
  { id: "oracle", name: "Oracle", icon: "🔮", description: "Price feeds & predictions" },
  { id: "synthesizer", name: "Synthesizer", icon: "🧬", description: "Strategy synthesis" },
];

export default function HermesPage() {
  const { address, isConnected } = useAccount();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeAgent, setActiveAgent] = useState<SwarmAgent>(AGENTS[0]);
  const [agentActivity, setAgentActivity] = useState<Record<string, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(text: string) {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: text };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    // Simulate agent activity pulses
    const agentIds = ["analyst", "executor", "guardian", "oracle", "synthesizer"];
    const activating: Record<string, boolean> = {};
    agentIds.forEach((id) => { activating[id] = Math.random() > 0.4; });
    setAgentActivity(activating);

    try {
      const res = await fetch("/api/hermes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages,
          agentFilter: activeAgent.id || undefined,
        }),
      });
      const data = (await res.json()) as { reply?: string; error?: string };
      const reply = data.reply ?? data.error ?? "Something went wrong.";
      setMessages([...updatedMessages, { role: "assistant", content: reply }]);
    } catch {
      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content: "Sorry, the Hermes Fabric engine encountered an error.",
        },
      ]);
    } finally {
      setIsLoading(false);
      setAgentActivity({});
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">🪐</span>
          <h1 className="text-3xl font-bold">
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
              Hermes Fabric Engine
            </span>
          </h1>
          <span className="text-xs font-mono px-2 py-1 rounded-full bg-emerald-900/40 border border-emerald-500/30 text-emerald-400">
            SWARMS v1
          </span>
        </div>
        <p className="text-gray-400">
          AI Clone Copilot · Multi-agent swarm orchestration across the Hermes Fabric network
          {isConnected && address && (
            <span className="ml-2 text-green-400 text-sm">
              · Wallet: {address.slice(0, 6)}…{address.slice(-4)}
            </span>
          )}
        </p>
      </div>

      <div className="flex gap-6">
        {/* Swarm Agent Panel */}
        <aside className="hidden lg:flex flex-col gap-3 w-56 flex-shrink-0">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">
            Swarm Agents
          </h2>
          {AGENTS.map((agent) => (
            <button
              key={agent.id}
              onClick={() => setActiveAgent(agent)}
              className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                activeAgent.id === agent.id
                  ? "bg-emerald-900/30 border-emerald-500/50 text-white"
                  : "bg-gray-900/40 border-gray-800 text-gray-400 hover:border-gray-600 hover:text-gray-300"
              }`}
            >
              <span className="text-lg leading-none mt-0.5">{agent.icon}</span>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold">{agent.name}</span>
                  {agentActivity[agent.id] && isLoading && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  )}
                </div>
                <span className="text-xs text-gray-500 leading-tight">
                  {agent.description}
                </span>
              </div>
            </button>
          ))}

          {/* Fabric Status */}
          <div className="mt-4 p-3 rounded-xl border border-gray-800 bg-gray-900/30">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
              Fabric Status
            </div>
            <div className="space-y-1.5">
              {["analyst", "executor", "guardian", "oracle", "synthesizer"].map((id) => (
                <div key={id} className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 capitalize">{id}</span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      agentActivity[id] && isLoading
                        ? "bg-emerald-400 animate-pulse"
                        : "bg-gray-700"
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Chat Interface */}
        <div className="flex-1 rounded-2xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm overflow-hidden flex flex-col h-[620px]">
          {/* Agent context bar */}
          <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-800 bg-gray-900/60">
            <span className="text-base">{activeAgent.icon}</span>
            <span className="text-xs font-mono text-emerald-400">
              HERMES::{activeAgent.name.toUpperCase()}
            </span>
            <span className="text-xs text-gray-600">·</span>
            <span className="text-xs text-gray-500">{activeAgent.description}</span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="text-5xl mb-4">🪐</div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Hermes Fabric Swarm Ready
                </h3>
                <p className="text-gray-400 max-w-md mb-8 text-sm">
                  I am Hermes, your AI Clone Copilot. I orchestrate a distributed swarm of
                  specialized agents across the Fabric network. Select an agent or let the
                  Synthesizer route your request.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
                  {HERMES_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => sendMessage(prompt)}
                      className="text-left text-sm px-4 py-2 rounded-lg border border-gray-700 hover:border-emerald-500 bg-gray-800/50 hover:bg-gray-800 text-gray-300 hover:text-white transition-all"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 font-bold ${
                    msg.role === "user"
                      ? "bg-teal-700"
                      : "bg-gradient-to-br from-emerald-500 to-teal-700"
                  }`}
                >
                  {msg.role === "user" ? "U" : "H"}
                </div>
                <div
                  className={`max-w-[80%] rounded-2xl px-5 py-3 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-teal-700/30 border border-teal-500/30 text-white"
                      : "bg-gray-800/80 border border-gray-700 text-gray-200"
                  }`}
                >
                  <MarkdownContent content={msg.content} />
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
                  H
                </div>
                <div className="bg-gray-800/80 border border-gray-700 rounded-2xl px-5 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0ms]" />
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:150ms]" />
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:300ms]" />
                    </div>
                    <span className="text-xs text-emerald-400 font-mono">
                      Fabric routing…
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-800 p-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage(input);
              }}
              className="flex gap-3"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Direct a swarm agent, audit a contract, build a strategy…"
                className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm transition-all"
              >
                Deploy
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
