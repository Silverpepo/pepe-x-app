import { getDefaultWallets, connectorsForWallets } from '@rainbow-me/rainbowkit'
import { createConfig, configureChains } from 'wagmi'
import { baseSepolia } from 'wagmi/chains'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'


// Configure Base Sepolia chain with custom RPC URL
const baseSepoliaChain = baseSepolia ? {
  ...baseSepolia,
  rpcUrls: {
    ...(baseSepolia.rpcUrls || {}),
    default: {
      http: [`https://base-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || 'demo'}`],
    },
    public: {
      http: [`https://base-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || 'demo'}`],
    },
  },
} : {
  id: 84532,
  name: 'Base Sepolia',
  network: 'base-sepolia',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [`https://base-sepolia.g.alchemy.com/v2/demo`],
    },
    public: {
      http: [`https://base-sepolia.g.alchemy.com/v2/demo`],
    },
  },
}

// Configure chains using only Alchemy provider
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [baseSepoliaChain],
  [
    alchemyProvider({
      apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY!,
    }),
  ],
  {
    pollingInterval: 120000, // 2 minutes
    stallTimeout: 5000,
  }
)

const { wallets } = getDefaultWallets({
  appName: 'Pepe-x',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
  chains,
})

const connectors = connectorsForWallets(wallets)

// Configure wagmi client
const config = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
})

export { chains, config }
