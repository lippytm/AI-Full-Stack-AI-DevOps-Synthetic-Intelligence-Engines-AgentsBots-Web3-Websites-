"use client";

import { useAccount, useBalance, useChainId } from "wagmi";
import { mainnet, polygon, arbitrum, optimism, base } from "wagmi/chains";

const CHAIN_NAMES: Record<number, string> = {
  [mainnet.id]: "Ethereum",
  [polygon.id]: "Polygon",
  [arbitrum.id]: "Arbitrum",
  [optimism.id]: "Optimism",
  [base.id]: "Base",
};

const MOCK_TOKENS = [
  { symbol: "ETH", name: "Ethereum", balance: "1.245", value: "$4,231.50", change: "+2.4%", up: true },
  { symbol: "MATIC", name: "Polygon", balance: "542.3", value: "$432.10", change: "-1.2%", up: false },
  { symbol: "ARB", name: "Arbitrum", balance: "210.0", value: "$189.00", change: "+5.8%", up: true },
  { symbol: "OP", name: "Optimism", balance: "89.5", value: "$122.82", change: "+3.1%", up: true },
];

const MOCK_NFTS = [
  { name: "Bored Ape #4521", collection: "BAYC", floorPrice: "14.2 ETH", image: "🐒" },
  { name: "CryptoPunk #7823", collection: "CryptoPunks", floorPrice: "62.5 ETH", image: "👾" },
  { name: "Azuki #1029", collection: "Azuki", floorPrice: "8.4 ETH", image: "🌸" },
];

function WalletBalance({ address }: { address: `0x${string}` }) {
  const chainId = useChainId();
  const { data: balance } = useBalance({ address });

  return (
    <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-4">
      <div className="text-sm text-gray-400 mb-1">
        Native Balance — {CHAIN_NAMES[chainId] ?? `Chain ${chainId}`}
      </div>
      {balance ? (
        <div className="text-2xl font-bold text-white">
          {(Number(balance.value) / 1e18).toFixed(4)}{" "}
          <span className="text-gray-400 text-lg">{balance.symbol}</span>
        </div>
      ) : (
        <div className="text-gray-500 text-sm">Loading…</div>
      )}
    </div>
  );
}

export default function PortfolioPage() {
  const { address, isConnected } = useAccount();

  if (!isConnected) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="text-6xl mb-6">👛</div>
        <h1 className="text-3xl font-bold text-white mb-4">Connect Your Wallet</h1>
        <p className="text-gray-400 text-lg max-w-md mx-auto">
          Connect your Web3 wallet to view your portfolio — tokens, NFTs, and
          DeFi positions across all chains.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            My Portfolio
          </span>
        </h1>
        <p className="text-gray-400 mt-1 font-mono text-sm">
          {address}
        </p>
      </div>

      {/* Balance Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <WalletBalance address={address!} />
        <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-4">
          <div className="text-sm text-gray-400 mb-1">Total Portfolio Value</div>
          <div className="text-2xl font-bold text-white">$4,975.42</div>
          <div className="text-green-400 text-sm mt-1">+3.2% today</div>
        </div>
        <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-4">
          <div className="text-sm text-gray-400 mb-1">NFT Holdings</div>
          <div className="text-2xl font-bold text-white">3 NFTs</div>
          <div className="text-gray-400 text-sm mt-1">Est. value: ~85.1 ETH</div>
        </div>
      </div>

      {/* Tokens Table */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white mb-4">Token Holdings</h2>
        <div className="rounded-xl border border-gray-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-900/50">
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Token</th>
                <th className="text-right px-4 py-3 text-gray-400 font-medium">Balance</th>
                <th className="text-right px-4 py-3 text-gray-400 font-medium">Value</th>
                <th className="text-right px-4 py-3 text-gray-400 font-medium">24h</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_TOKENS.map((token) => (
                <tr key={token.symbol} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-white">{token.symbol}</div>
                    <div className="text-gray-500 text-xs">{token.name}</div>
                  </td>
                  <td className="px-4 py-3 text-right text-gray-300">{token.balance}</td>
                  <td className="px-4 py-3 text-right text-white font-medium">{token.value}</td>
                  <td className={`px-4 py-3 text-right font-medium ${token.up ? "text-green-400" : "text-red-400"}`}>
                    {token.change}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-600 mt-2">* Sample data for demonstration purposes. Connect an indexing API for live balances.</p>
      </div>

      {/* NFT Grid */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">NFT Collection</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {MOCK_NFTS.map((nft) => (
            <div key={nft.name} className="rounded-xl border border-gray-800 bg-gray-900/50 overflow-hidden hover:border-purple-500/50 transition-colors">
              <div className="h-40 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-6xl">
                {nft.image}
              </div>
              <div className="p-4">
                <div className="font-semibold text-white text-sm">{nft.name}</div>
                <div className="text-gray-400 text-xs mt-0.5">{nft.collection}</div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-gray-500">Floor</span>
                  <span className="text-sm font-medium text-cyan-400">{nft.floorPrice}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-600 mt-2">* Sample NFTs for demonstration. Connect an NFT API for your real holdings.</p>
      </div>
    </div>
  );
}
