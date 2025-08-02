import { defineChain } from 'viem'

// Monad testnet configuration
export const monadTestnet = defineChain({
  id: 10143,
  name: 'Monad Testnet',
  nativeCurrency: { name: 'MON', symbol: 'MON', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://testnet-rpc.monad.xyz/'] },
  },
  blockExplorers: {
    default: {
      name: 'Monad Explorer',
      url: 'https://testnet.monadexplorer.com/',
      apiUrl: 'https://testnet.monadexplorer.com/api',
    },
  },
  testnet: true,
})

// Contract addresses
export const contractAddresses = {
  [monadTestnet.id]: {
    web3Insight: '0xa612d24c7d67745C5f16f8e2461256D1598dB8e2' as `0x${string}`,
  }
} as const

// Import the deployed contract ABI
import { web3insightAbi } from './abi'

// Contract configuration
export const contractConfig = {
  address: contractAddresses[monadTestnet.id].web3Insight,
  abi: web3insightAbi,
} as const

// Mint price in MON (Monad native token)
export const MINT_PRICE = BigInt('1000000000000000') // 0.001 MON in wei

// Contract deployment info
export const CONTRACT_INFO = {
  name: 'Web3Insight',
  symbol: 'W3I',
  maxSupply: 10000,
  mintPrice: MINT_PRICE,
  network: monadTestnet,
  deployedAddress: contractAddresses[monadTestnet.id].web3Insight,
  owner: '0xa612d24c7d67745C5f16f8e2461256D1598dB8e2' as `0x${string}`,
} as const