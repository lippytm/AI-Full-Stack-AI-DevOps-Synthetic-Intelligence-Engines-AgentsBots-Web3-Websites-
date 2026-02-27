"use client";

import Link from "next/link";
import { useAccount } from "wagmi";

export function HeroSection() {
  const { isConnected } = useAccount();

  return (
    <section className="relative overflow-hidden py-24 px-4">
      {/* Background gradient blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-900/30 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-900/30 rounded-full blur-3xl translate-y-1/2" />

      <div className="relative max-w-5xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-sm font-medium mb-8">
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
          Powered by AI & Blockchain
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            Synthetic Intelligence
          </span>
          <br />
          <span className="text-white">meets Web3</span>
        </h1>

        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
          Harness the power of AI to navigate decentralized finance, analyze
          blockchain assets, and interact with smart contracts through natural
          language.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {isConnected ? (
            <>
              <Link
                href="/ai-chat"
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-semibold text-lg transition-all shadow-lg shadow-purple-900/40"
              >
                Open AI Assistant
              </Link>
              <Link
                href="/portfolio"
                className="px-8 py-4 rounded-xl border border-gray-700 hover:border-purple-500 text-gray-300 hover:text-white font-semibold text-lg transition-all"
              >
                My Portfolio
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/ai-chat"
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-semibold text-lg transition-all shadow-lg shadow-purple-900/40"
              >
                Try AI Chat
              </Link>
              <Link
                href="/analytics"
                className="px-8 py-4 rounded-xl border border-gray-700 hover:border-purple-500 text-gray-300 hover:text-white font-semibold text-lg transition-all"
              >
                View Analytics
              </Link>
            </>
          )}
        </div>

        {/* Chain logos */}
        <div className="mt-16 flex items-center justify-center gap-8 opacity-50">
          {["Ethereum", "Polygon", "Arbitrum", "Optimism", "Base"].map(
            (chain) => (
              <span key={chain} className="text-sm text-gray-500 font-medium">
                {chain}
              </span>
            )
          )}
        </div>
      </div>
    </section>
  );
}
