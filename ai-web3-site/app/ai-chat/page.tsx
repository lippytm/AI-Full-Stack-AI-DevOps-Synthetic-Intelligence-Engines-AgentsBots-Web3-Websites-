"use client";

import { useState, useRef, useEffect } from "react";
import { useAccount } from "wagmi";

interface Message {
  role: "user" | "assistant";
  content: string;
}

function MarkdownContent({ content }: { content: string }) {
  // Simple markdown renderer for bold and bullet points
  const lines = content.split("\n");
  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        if (line.startsWith("- ") || line.startsWith("* ")) {
          return (
            <div key={i} className="flex gap-2">
              <span className="text-purple-400 mt-0.5">•</span>
              <span dangerouslySetInnerHTML={{ __html: boldify(line.slice(2)) }} />
            </div>
          );
        }
        if (line.startsWith("**") && line.endsWith("**")) {
          return (
            <p key={i} className="font-bold text-white" dangerouslySetInnerHTML={{ __html: boldify(line) }} />
          );
        }
        return line ? (
          <p key={i} dangerouslySetInnerHTML={{ __html: boldify(line) }} />
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

const SUGGESTED_PROMPTS = [
  "What is DeFi and how does it work?",
  "Explain Ethereum gas fees",
  "How do NFTs work?",
  "What are the best practices for wallet security?",
  "What is a Layer 2 blockchain?",
];

export default function AIChatPage() {
  const { address, isConnected } = useAccount();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });
      const data = (await res.json()) as { reply?: string; error?: string };
      const reply = data.reply ?? data.error ?? "Something went wrong.";
      setMessages([...updatedMessages, { role: "assistant", content: reply }]);
    } catch {
      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content: "Sorry, there was an error connecting to the AI service.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            AI Web3 Assistant
          </span>
        </h1>
        <p className="text-gray-400 mt-1">
          Ask anything about DeFi, NFTs, blockchain, and Web3
          {isConnected && address && (
            <span className="ml-2 text-green-400 text-sm">
              · Connected: {address.slice(0, 6)}…{address.slice(-4)}
            </span>
          )}
        </p>
      </div>

      {/* Chat Window */}
      <div className="rounded-2xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm overflow-hidden flex flex-col h-[600px]">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="text-5xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Your Web3 AI Assistant
              </h3>
              <p className="text-gray-400 max-w-md mb-8">
                Ask me anything about blockchain, DeFi, NFTs, or Web3
                technology. I&apos;m here to help!
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => sendMessage(prompt)}
                    className="text-left text-sm px-4 py-2 rounded-lg border border-gray-700 hover:border-purple-500 bg-gray-800/50 hover:bg-gray-800 text-gray-300 hover:text-white transition-all"
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
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${
                  msg.role === "user"
                    ? "bg-purple-600"
                    : "bg-gradient-to-br from-cyan-500 to-purple-500"
                }`}
              >
                {msg.role === "user" ? "U" : "AI"}
              </div>
              <div
                className={`max-w-[80%] rounded-2xl px-5 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-purple-600/30 border border-purple-500/30 text-white"
                    : "bg-gray-800/80 border border-gray-700 text-gray-200"
                }`}
              >
                <MarkdownContent content={msg.content} />
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-sm flex-shrink-0">
                AI
              </div>
              <div className="bg-gray-800/80 border border-gray-700 rounded-2xl px-5 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-gray-500 animate-bounce [animation-delay:0ms]" />
                  <span className="w-2 h-2 rounded-full bg-gray-500 animate-bounce [animation-delay:150ms]" />
                  <span className="w-2 h-2 rounded-full bg-gray-500 animate-bounce [animation-delay:300ms]" />
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
              placeholder="Ask about DeFi, NFTs, wallets, gas fees..."
              className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm transition-all"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
