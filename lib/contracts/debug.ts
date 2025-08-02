import { useReadContract } from 'wagmi'
import { contractConfig } from './config'

// Debug hooks to check contract state before minting
export function useContractDebugInfo(githubUsername: string) {
  // Check if already minted
  const { data: isAlreadyMinted } = useReadContract({
    ...contractConfig,
    functionName: 'isGithubMinted',
    args: [githubUsername],
  })

  // Check current mint price
  const { data: currentMintPrice } = useReadContract({
    ...contractConfig,
    functionName: 'mintPrice',
  })

  // Check current total supply
  const { data: totalSupply } = useReadContract({
    ...contractConfig,
    functionName: 'totalSupply',
  })

  // Check max supply
  const { data: maxSupply } = useReadContract({
    ...contractConfig,
    functionName: 'MAX_SUPPLY',
  })

  return {
    isAlreadyMinted,
    currentMintPrice,
    totalSupply,
    maxSupply,
    debugInfo: {
      githubUsername,
      isValidUsername: githubUsername.length > 0,
      canMint: !isAlreadyMinted && githubUsername.length > 0,
    }
  }
}