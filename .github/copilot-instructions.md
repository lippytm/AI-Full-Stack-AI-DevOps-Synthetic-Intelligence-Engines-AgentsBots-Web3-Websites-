# Copilot Instructions for AI Web3 Platform

## Project Overview
This is an AI-powered Web3 platform built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS**, **wagmi v3**, and **OpenAI GPT-4o**. It features an AI chat assistant, portfolio tracker, token analytics, and the **AI BrainKit** — an autonomous agent swarm system.

## Code Style & Conventions

- Use **TypeScript** with strict types everywhere. Avoid `any`.
- Use **functional React components** with hooks. No class components.
- Mark client components with `"use client"` at the top of the file.
- Use **Tailwind CSS** utility classes for all styling. No inline styles or CSS modules.
- Keep component files co-located with their page in `app/`, shared components go in `app/components/`.
- API routes live in `app/api/<route>/route.ts`.

## AI & Agent Patterns (BrainKit)

- All swarm agent logic should be simulated client-side with realistic async delays.
- Agent types: `"idle" | "running" | "complete"` — always use this union.
- New agents added to the BrainKit should follow the `Agent` interface in `app/brainkit/page.tsx`.
- Keep agent roles focused and single-responsibility.

## Web3 Patterns

- Use `wagmi` hooks (`useAccount`, `useConnect`, `useDisconnect`) for wallet state.
- Chain config lives in `lib/wagmi.ts` — add new chains there.
- Never store private keys or wallet secrets in code. Use environment variables.

## Environment Variables

- `OPENAI_API_KEY` — required for full AI chat; falls back to demo responses.
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` — required for WalletConnect.
- All new secrets must be documented in `.env.example`.

## Best Practices

- Validate all AI/API responses before rendering. Handle errors gracefully.
- Use `dangerouslySetInnerHTML` only for trusted, sanitized content (e.g., the `boldify` helper).
- Write demo-friendly fallbacks so features work without API keys.
- Keep pages focused: one primary feature per route.
- Add new routes to the Navbar and FeatureCards so they are discoverable.
