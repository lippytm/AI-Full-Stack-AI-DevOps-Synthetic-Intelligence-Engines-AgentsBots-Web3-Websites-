"use client";

import { useState } from "react";

const TOKENS = [
  { symbol: "ETH", name: "Ethereum", price: "$3,398.45", change24h: "+2.4%", change7d: "+8.1%", volume: "$18.2B", marketCap: "$408B", up: true },
  { symbol: "BTC", name: "Bitcoin", price: "$67,234.12", change24h: "-0.8%", change7d: "+4.2%", volume: "$32.1B", marketCap: "$1.32T", up: false },
  { symbol: "SOL", name: "Solana", price: "$172.30", change24h: "+5.2%", change7d: "+12.3%", volume: "$3.8B", marketCap: "$78B", up: true },
  { symbol: "MATIC", name: "Polygon", price: "$0.795", change24h: "-1.2%", change7d: "-2.8%", volume: "$412M", marketCap: "$7.8B", up: false },
  { symbol: "ARB", name: "Arbitrum", price: "$0.899", change24h: "+5.8%", change7d: "+15.2%", volume: "$289M", marketCap: "$3.6B", up: true },
  { symbol: "OP", name: "Optimism", price: "$1.37", change24h: "+3.1%", change7d: "+9.4%", volume: "$198M", marketCap: "$2.1B", up: true },
  { symbol: "UNI", name: "Uniswap", price: "$8.42", change24h: "+1.9%", change7d: "+6.7%", volume: "$167M", marketCap: "$6.3B", up: true },
  { symbol: "AAVE", name: "Aave", price: "$174.20", change24h: "+4.3%", change7d: "+11.2%", volume: "$312M", marketCap: "$2.5B", up: true },
];

const AI_INSIGHTS = [
  {
    title: "ETH Bullish Signal",
    description: "On-chain data shows increasing accumulation by large holders. Network activity at 3-month high.",
    sentiment: "bullish",
    confidence: 78,
  },
  {
    title: "L2 Ecosystem Growing",
    description: "Arbitrum and Optimism TVL combined surpassed $10B. ARB and OP showing strong momentum.",
    sentiment: "bullish",
    confidence: 85,
  },
  {
    title: "DeFi TVL Recovery",
    description: "Total Value Locked across DeFi protocols recovering after recent market volatility.",
    sentiment: "neutral",
    confidence: 62,
  },
];

export default function AnalyticsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTokens = TOKENS.filter(
    (t) =>
      t.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Token Analytics
          </span>
        </h1>
        <p className="text-gray-400 mt-1">
          AI-powered market analysis and on-chain insights
        </p>
      </div>

      {/* AI Insights */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span>🤖</span> AI Market Insights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {AI_INSIGHTS.map((insight) => (
            <div
              key={insight.title}
              className={`rounded-xl border p-4 ${
                insight.sentiment === "bullish"
                  ? "border-green-500/30 bg-green-500/10"
                  : "border-yellow-500/30 bg-yellow-500/10"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    insight.sentiment === "bullish"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-yellow-500/20 text-yellow-400"
                  }`}
                >
                  {insight.sentiment}
                </span>
                <span className="text-xs text-gray-500">
                  {insight.confidence}% confidence
                </span>
              </div>
              <h3 className="font-semibold text-white text-sm mb-1">
                {insight.title}
              </h3>
              <p className="text-gray-400 text-xs leading-relaxed">
                {insight.description}
              </p>
              {/* Confidence bar */}
              <div className="mt-3 h-1 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    insight.sentiment === "bullish"
                      ? "bg-green-500"
                      : "bg-yellow-500"
                  }`}
                  style={{ width: `${insight.confidence}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-600 mt-2">* AI insights are for informational purposes only. Not financial advice. DYOR.</p>
      </div>

      {/* Market Table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Market Overview</h2>
          <input
            type="text"
            placeholder="Search tokens..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors w-48"
          />
        </div>
        <div className="rounded-xl border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[700px]">
              <thead>
                <tr className="border-b border-gray-800 bg-gray-900/50">
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">Token</th>
                  <th className="text-right px-4 py-3 text-gray-400 font-medium">Price</th>
                  <th className="text-right px-4 py-3 text-gray-400 font-medium">24h</th>
                  <th className="text-right px-4 py-3 text-gray-400 font-medium">7d</th>
                  <th className="text-right px-4 py-3 text-gray-400 font-medium">Volume</th>
                  <th className="text-right px-4 py-3 text-gray-400 font-medium">Mkt Cap</th>
                </tr>
              </thead>
              <tbody>
                {filteredTokens.map((token) => (
                  <tr key={token.symbol} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-white">{token.symbol}</div>
                      <div className="text-gray-500 text-xs">{token.name}</div>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-white">{token.price}</td>
                    <td className={`px-4 py-3 text-right font-medium ${token.up ? "text-green-400" : "text-red-400"}`}>
                      {token.change24h}
                    </td>
                    <td className={`px-4 py-3 text-right ${parseFloat(token.change7d) >= 0 ? "text-green-400" : "text-red-400"}`}>
                      {token.change7d}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-300">{token.volume}</td>
                    <td className="px-4 py-3 text-right text-gray-300">{token.marketCap}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <p className="text-xs text-gray-600 mt-2">* Sample market data for demonstration. Connect a price API (CoinGecko, etc.) for live data.</p>
      </div>
    </div>
  );
}
