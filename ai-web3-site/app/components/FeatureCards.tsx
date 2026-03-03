import Link from "next/link";

const features = [
  {
    icon: "🤖",
    title: "AI Assistant",
    description:
      "Chat with an AI that understands DeFi, NFTs, and blockchain concepts. Get real-time analysis and guidance.",
    href: "/ai-chat",
    gradient: "from-purple-500/20 to-purple-700/10",
    border: "border-purple-500/30",
    badge: "Powered by GPT-4o",
  },
  {
    icon: "📊",
    title: "Portfolio Tracker",
    description:
      "Connect your wallet to view your entire Web3 portfolio — tokens, NFTs, and DeFi positions across chains.",
    href: "/portfolio",
    gradient: "from-cyan-500/20 to-cyan-700/10",
    border: "border-cyan-500/30",
    badge: "Multi-chain",
  },
  {
    icon: "📈",
    title: "Token Analytics",
    description:
      "AI-powered market analysis with price predictions, sentiment analysis, and on-chain data insights.",
    href: "/analytics",
    gradient: "from-pink-500/20 to-pink-700/10",
    border: "border-pink-500/30",
    badge: "Real-time data",
  },
  {
    icon: "🔗",
    title: "Smart Contracts",
    description:
      "Interact with any smart contract using natural language. Our AI translates your intent into on-chain actions.",
    href: "/ai-chat",
    gradient: "from-amber-500/20 to-amber-700/10",
    border: "border-amber-500/30",
    badge: "Any EVM chain",
  },
  {
    icon: "🧠",
    title: "AI BrainKit",
    description:
      "Orchestrate a swarm of autonomous AI agents that collaborate to analyze markets, audit contracts, and discover DeFi opportunities.",
    href: "/brainkit",
    gradient: "from-indigo-500/20 to-indigo-700/10",
    border: "border-indigo-500/30",
    badge: "Agent Swarm",
  },
];

export function FeatureCards() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything you need for{" "}
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Web3 intelligence
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Our platform combines cutting-edge AI with deep blockchain
            integration to give you an unmatched edge in the decentralized
            economy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature) => (
            <Link
              key={feature.title}
              href={feature.href}
              className={`group relative rounded-2xl border ${feature.border} bg-gradient-to-br ${feature.gradient} p-6 hover:scale-[1.02] transition-all duration-200 backdrop-blur-sm`}
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-4xl">{feature.icon}</span>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-800 text-gray-400 border border-gray-700">
                  {feature.badge}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {feature.description}
              </p>
              <div className="mt-4 flex items-center gap-1 text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                Explore →
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
