import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are an expert AI assistant specializing in Web3, blockchain technology, DeFi (Decentralized Finance), NFTs, and cryptocurrency. You help users understand:

- Blockchain concepts (Ethereum, Polygon, Arbitrum, Optimism, Base, etc.)
- DeFi protocols (Uniswap, Aave, Compound, Curve, etc.)
- NFT markets and collections
- Wallet management and security best practices
- Smart contract interactions
- Token analysis and market trends
- Gas optimization strategies
- Cross-chain bridging

Always provide clear, accurate, and helpful information. When discussing financial matters, remind users that this is not financial advice and they should do their own research (DYOR). Be concise but thorough.`;

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = (await req.json()) as { messages: Message[] };

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid request: messages array required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;

    // If no API key, use a built-in response system for demo purposes
    if (!apiKey) {
      const lastUserMessage = messages
        .filter((m) => m.role === "user")
        .pop()?.content ?? "";
      const demoReply = getDemoReply(lastUserMessage);
      return NextResponse.json({ reply: demoReply });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("OpenAI API error:", error);
      return NextResponse.json(
        { error: "AI service error" },
        { status: 500 }
      );
    }

    const data = (await response.json()) as {
      choices: { message: { content: string } }[];
    };
    const reply = data.choices[0]?.message?.content ?? "No response generated.";

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

function getDemoReply(message: string): string {
  const lower = message.toLowerCase();

  if (lower.includes("ethereum") || lower.includes("eth")) {
    return "**Ethereum (ETH)** is the second-largest cryptocurrency by market cap and the leading smart contract platform. It transitioned to Proof-of-Stake with 'The Merge' in September 2022, dramatically reducing its energy consumption. Ethereum supports a vast ecosystem of DeFi protocols, NFT marketplaces, and dApps.\n\n*Note: This is a demo response. Connect an OpenAI API key for full AI capabilities.*";
  }
  if (lower.includes("defi")) {
    return "**DeFi (Decentralized Finance)** refers to financial services built on blockchain networks that operate without central intermediaries. Key DeFi categories include:\n\n- **DEXes**: Uniswap, Curve, Balancer\n- **Lending**: Aave, Compound, MakerDAO\n- **Yield**: Yearn Finance, Convex\n- **Derivatives**: dYdX, GMX\n\nDeFi enables permissionless, transparent, and composable financial services. Always DYOR before investing.\n\n*Note: This is a demo response. Connect an OpenAI API key for full AI capabilities.*";
  }
  if (lower.includes("nft")) {
    return "**NFTs (Non-Fungible Tokens)** are unique digital assets verified using blockchain technology. Each NFT has a distinct identifier that differentiates it from other tokens.\n\n**Key concepts:**\n- NFTs can represent art, music, gaming items, virtual real estate, and more\n- Major marketplaces: OpenSea, Blur, Magic Eden\n- Standards: ERC-721 (single), ERC-1155 (multi)\n- Gas costs vary by network — Ethereum is most secure, L2s are cheaper\n\n*Note: This is a demo response. Connect an OpenAI API key for full AI capabilities.*";
  }
  if (lower.includes("wallet") || lower.includes("metamask")) {
    return "**Crypto Wallets** store your private keys and allow you to interact with blockchains. Key tips:\n\n🔐 **Security Best Practices:**\n- Never share your seed phrase with anyone\n- Use hardware wallets (Ledger, Trezor) for large holdings\n- Enable 2FA on exchange accounts\n- Be cautious of phishing sites\n\n**Popular Wallets:**\n- MetaMask (browser extension)\n- Coinbase Wallet\n- Rainbow (mobile)\n- WalletConnect compatible wallets\n\n*Note: This is a demo response. Connect an OpenAI API key for full AI capabilities.*";
  }
  if (lower.includes("gas") || lower.includes("fee")) {
    return "**Gas fees** are payments made to compensate for the computing energy required to process transactions on the blockchain.\n\n**Tips to reduce gas costs:**\n- Transact during off-peak hours (weekends, late night UTC)\n- Use L2 networks (Arbitrum, Optimism, Base, Polygon) for 10-100x lower fees\n- Set custom gas limits in MetaMask\n- Batch transactions when possible\n\n**Gas tracking tools:** Etherscan Gas Tracker, Gas Now, DeFiLlama\n\n*Note: This is a demo response. Connect an OpenAI API key for full AI capabilities.*";
  }

  return `Thanks for your question about "${message}"!\n\nI'm an AI assistant specialized in Web3 and blockchain technology. I can help you with:\n\n- 🔗 **Blockchain concepts** — Ethereum, L2s, consensus mechanisms\n- 💰 **DeFi protocols** — DEXes, lending, yield farming\n- 🎨 **NFTs** — minting, trading, collections\n- 👛 **Wallet security** — best practices, hardware wallets\n- ⛽ **Gas optimization** — saving on transaction fees\n\nWhat would you like to know more about?\n\n*Note: This is a demo response. Connect an OpenAI API key in your .env.local file for full GPT-4o AI capabilities.*`;
}
