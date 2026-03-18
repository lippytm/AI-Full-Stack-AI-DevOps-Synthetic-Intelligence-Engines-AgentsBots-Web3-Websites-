# AI Web3 Websites

[![CI](https://github.com/lippytm/AI-Full-Stack-AI-DevOps-Synthetic-Intelligence-Engines-AgentsBots-Web3-Websites-/actions/workflows/ci.yml/badge.svg)](https://github.com/lippytm/AI-Full-Stack-AI-DevOps-Synthetic-Intelligence-Engines-AgentsBots-Web3-Websites-/actions/workflows/ci.yml)

A full-stack **AI-powered Web3 platform** built with Next.js, wagmi, and GPT-4o. It combines blockchain connectivity with advanced AI features for navigating the decentralized web.

## Features

- 🤖 **AI Chat Assistant** — Powered by GPT-4o (with built-in demo responses when no API key is set). Ask anything about DeFi, NFTs, wallets, gas fees, and more.
- 👛 **Wallet Connectivity** — Connect MetaMask or any WalletConnect-compatible wallet across 5 EVM chains (Ethereum, Polygon, Arbitrum, Optimism, Base).
- 📊 **Portfolio Tracker** — View your token balances, NFT holdings, and portfolio value across chains.
- 📈 **Token Analytics** — AI-powered market insights, sentiment analysis, and token price data.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Web3 | wagmi v3 + viem v2 |
| AI | OpenAI GPT-4o |
| State | TanStack Query |

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
cd ai-web3-site
npm install
```

### Configuration

Copy the example environment file and fill in your API keys:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# OpenAI API Key (required for full AI chat capabilities)
OPENAI_API_KEY=your_openai_api_key_here

# WalletConnect Project ID (required for WalletConnect support)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id_here
```

> **Note:** The AI chat works in demo mode without an API key, providing pre-written responses about common Web3 topics.

### Development

```bash
cd ai-web3-site
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm run start
```

## Project Structure

```
ai-web3-site/
├── app/
│   ├── api/
│   │   ├── chat/route.ts      # AI chat API endpoint
│   │   └── health/route.ts    # Health-check endpoint
│   ├── ai-chat/page.tsx       # AI Chat interface
│   ├── analytics/page.tsx     # Token analytics dashboard
│   ├── portfolio/page.tsx     # Wallet portfolio tracker
│   ├── components/
│   │   ├── FeatureCards.tsx   # Homepage feature grid
│   │   ├── HeroSection.tsx    # Landing page hero
│   │   ├── Navbar.tsx         # Navigation with wallet connect
│   │   └── StatsBar.tsx       # Platform stats bar
│   ├── layout.tsx             # Root layout with providers
│   ├── page.tsx               # Homepage
│   └── providers.tsx          # Wagmi + React Query providers
└── lib/
    └── wagmi.ts               # Wagmi chain/connector config
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage with hero, stats, and feature cards |
| `/ai-chat` | AI chat assistant with suggested prompts |
| `/portfolio` | Web3 portfolio dashboard (requires wallet) |
| `/analytics` | Token market analytics with AI insights |
| `/api/health` | Health-check endpoint (JSON) for integrations |
| `/api/chat` | POST endpoint — AI chat completions |

## Integration

This service exposes a JSON health-check endpoint that any other service can poll to verify availability:

```bash
curl https://<your-domain>/api/health
```

Example response:

```json
{
  "status": "ok",
  "service": "ai-web3-site",
  "version": "0.1.0",
  "timestamp": "2026-01-01T00:00:00.000Z",
  "features": {
    "aiChat": true,
    "portfolio": true,
    "analytics": true,
    "walletConnect": true
  },
  "chains": ["mainnet", "polygon", "arbitrum", "optimism", "base"]
}
```

### AI Chat API

Other services can call the AI chat endpoint directly:

```bash
curl -X POST https://<your-domain>/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "What is DeFi?"}]}'
```

## Deployment

Deploy easily on [Vercel](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

Set the environment variables in your Vercel project settings.
