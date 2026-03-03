"use client";

import Link from "next/link";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";

export function Navbar() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  const shortAddress = address
    ? `${address.slice(0, 6)}…${address.slice(-4)}`
    : "";

  return (
    <nav className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <span className="text-purple-400">⬡</span>
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              AI Web3
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6 text-sm text-gray-400">
            <Link
              href="/"
              className="hover:text-white transition-colors"
            >
              Home
            </Link>
            <Link
              href="/portfolio"
              className="hover:text-white transition-colors"
            >
              Portfolio
            </Link>
            <Link
              href="/ai-chat"
              className="hover:text-white transition-colors"
            >
              AI Chat
            </Link>
            <Link
              href="/analytics"
              className="hover:text-white transition-colors"
            >
              Analytics
            </Link>
            <Link
              href="/brainkit"
              className="flex items-center gap-1 hover:text-white transition-colors text-purple-400 hover:text-purple-300 font-medium"
            >
              🧠 BrainKit
            </Link>
          </div>

          {/* Wallet Connect Button */}
          <div>
            {isConnected ? (
              <button
                onClick={() => disconnect()}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 text-sm font-medium transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-green-400 inline-block"></span>
                {shortAddress}
              </button>
            ) : (
              <button
                onClick={() => connect({ connector: injected() })}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white text-sm font-medium transition-all shadow-lg shadow-purple-900/30"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
