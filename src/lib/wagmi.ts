// Location: src/lib/wagmi.ts
import { createConfig, http } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { walletConnect, injected } from 'wagmi/connectors'

// 1. Get projectID
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!
if (!projectId) {
  throw new Error("NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set")
}

// 2. Create wagmi config
const metadata = {
  name: 'DeFi Intelligence Hub',
  description: 'Track wallets and get on-chain alpha.',
  url: 'https://my-defi-hub.com', // origin must match your domain & subdomain
  icons: ['https://avatars.my-defi-hub.com/']
}

export const config = createConfig({
  chains: [mainnet, sepolia], // Add chains you want to support
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
  connectors: [
    walletConnect({ projectId, metadata, showQrModal: false }),
    injected({ shimDisconnect: true }), // For MetaMask
  ],
  ssr: true, // Enable SSR for Next.js
})