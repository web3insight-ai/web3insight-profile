import type { Address } from 'viem'

export interface ProfileData {
  githubUsername: string
  name: string
  bio: string
  web3Score: bigint
  skills: readonly string[]
  ecosystems: readonly string[]
  mintTimestamp: bigint
}

export interface NFTMetadata {
  name: string
  description: string
  image: string
  attributes: NFTAttribute[]
  external_url?: string
  background_color?: string
  animation_url?: string
  profile_data: {
    github: {
      username: string
      name: string
      bio: string
      avatar_url: string
      html_url: string
      company?: string
      location?: string
      blog?: string
      email?: string
      public_repos: number
      followers: number
      following: number
      created_at: string
    }
    web3_analysis: {
      summary: string
      web3_score: number
      level: string
      skills: string[]
      expertise_areas: string[]
      ecosystems: Array<{
        ecosystem: string
        score: number
        rank?: number
      }>
      highlights: string[]
      recommendation: string
      analysis_date: string
    }
    mint_info: {
      minter_address: string
      mint_timestamp: string
      token_id: number
      contract_address: string
      network: string
    }
  }
}

export interface NFTAttribute {
  trait_type: string
  value: string | number
  display_type?: 'number' | 'boost_number' | 'boost_percentage' | 'date'
  max_value?: number
}

export interface MintParams {
  githubUsername: string
  name: string
  bio: string
  web3Score: number
  skills: string[]
  ecosystems: string[]
  metadataURI: string
}

export interface ContractError {
  code: string
  message: string
  shortMessage: string
}

export interface MintTransaction {
  hash: `0x${string}`
  status: 'pending' | 'success' | 'failed'
  tokenId?: number
  blockNumber?: bigint
  gasUsed?: bigint
  effectiveGasPrice?: bigint
}

export interface WalletState {
  isConnected: boolean
  address?: Address
  chainId?: number
  isCorrectNetwork: boolean
}

// GitHub user data from API (compatible with existing types)
export interface GitHubUser {
  login: string
  id: number
  avatar_url: string
  html_url: string
  name?: string | null
  company?: string | null
  blog?: string | null
  location?: string | null
  email?: string | null
  bio?: string | null
  public_repos: number
  followers: number
  following: number
  created_at: string
  updated_at?: string
  public_gists?: number
  ai?: AIProfile
  ecosystem_scores?: EcosystemScore[]
}

export interface AIProfile {
  summary?: string
  web3_involvement?: {
    score: number
    level: string
    evidence: string[]
  }
  skills?: string[]
  expertise_areas?: string[]
  recommendation?: string
  analysis_date?: string
  
  // Rich visualization data
  highlights?: string[]
  profileCard?: {
    stats?: {
      totalScore: number
    }
  }
  technicalStack?: {
    skills: string[]
    mainFocus?: string
  }
  web3Ecosystems?: {
    top3: EcosystemItem[]
  }
}

export interface EcosystemScore {
  ecosystem: string
  score: number
  rank?: number
}

export interface EcosystemItem {
  name: string
  score: number
  rank?: number
}