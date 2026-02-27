import Link from "next/link";
import { HeroSection } from "./components/HeroSection";
import { FeatureCards } from "./components/FeatureCards";
import { StatsBar } from "./components/StatsBar";

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <StatsBar />
      <FeatureCards />

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to experience{" "}
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              AI + Web3?
            </span>
          </h2>
          <p className="text-gray-400 mb-8 text-lg">
            Connect your wallet and let our AI assistant guide you through the
            decentralized web.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/ai-chat"
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-semibold transition-all shadow-lg shadow-purple-900/30"
            >
              Launch AI Chat
            </Link>
            <Link
              href="/portfolio"
              className="px-8 py-3 rounded-xl border border-gray-700 hover:border-purple-500 text-gray-300 hover:text-white font-semibold transition-all"
            >
              View Portfolio
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
