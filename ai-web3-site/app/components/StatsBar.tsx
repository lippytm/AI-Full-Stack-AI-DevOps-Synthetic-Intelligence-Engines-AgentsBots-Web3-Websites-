const stats = [
  { label: "Chains Supported", value: "5+" },
  { label: "AI Models", value: "GPT-4o" },
  { label: "Tokens Tracked", value: "10K+" },
  { label: "Smart Contracts", value: "∞" },
];

export function StatsBar() {
  return (
    <section className="border-y border-gray-800 bg-gray-900/50 py-8 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              {stat.value}
            </div>
            <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
