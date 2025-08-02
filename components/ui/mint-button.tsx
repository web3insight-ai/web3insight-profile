"use client";

import React, { useState, useMemo } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { formatEther } from 'viem';
import { monadTestnet, contractConfig, MINT_PRICE } from '@/lib/contracts/config';
import type { GitHubUser, NFTMetadata, MintParams } from '@/lib/contracts/types';

interface MintButtonProps {
  userData: GitHubUser;
  className?: string;
}

export function MintButton({ userData, className = '' }: MintButtonProps) {
  const [isMinting, setIsMinting] = useState(false);
  const [mintError, setMintError] = useState<string | null>(null);
  
  const { address, isConnected, chainId } = useAccount();
  const { writeContract, data: hash, error, isPending } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // Allow multiple mints - removed isGithubMinted check

  // Check mint price
  const { data: currentMintPrice } = useReadContract({
    ...contractConfig,
    functionName: 'mintPrice',
  });

  const isCorrectNetwork = chainId === monadTestnet.id;

  // Generate NFT metadata
  const generateMetadata = useMemo((): NFTMetadata => {
    const web3Score = userData.ai?.web3_involvement?.score || 0;
    const level = userData.ai?.web3_involvement?.level || 'Beginner';
    
    return {
      name: `Web3Insight Profile: ${userData.name || userData?.login || 'Developer'}`,
      description: `Web3 developer profile analysis for ${userData?.login || 'Developer'}. Web3 Score: ${web3Score}/100 (${level}). This NFT represents a comprehensive analysis of the developer's Web3 ecosystem involvement, skills, and contributions.`,
      image: `https://api.web3insight.ai/v1/profile/${userData?.login || 'default'}/avatar`, // Placeholder image URL
      external_url: userData.html_url,
      background_color: "1a1a1a",
      attributes: [
        {
          trait_type: "Web3 Score",
          value: web3Score,
          display_type: "number",
          max_value: 100
        },
        {
          trait_type: "Web3 Level",
          value: level
        },
        {
          trait_type: "GitHub Username",
          value: userData?.login || 'Unknown'
        },
        {
          trait_type: "Public Repos",
          value: userData.public_repos,
          display_type: "number"
        },
        {
          trait_type: "Followers",
          value: userData.followers,
          display_type: "number"
        },
        {
          trait_type: "Following",
          value: userData.following,
          display_type: "number"
        },
        {
          trait_type: "Account Created",
          value: new Date(userData.created_at).getFullYear(),
          display_type: "number" as const
        },
        ...((userData?.ai?.skills || []).slice(0, 5).map((skill, _index) => ({
          trait_type: `Skill ${_index + 1}`,
          value: skill
        }))),
        ...((userData?.ai?.expertise_areas || []).slice(0, 3).map((area, _index) => ({
          trait_type: `Expertise ${_index + 1}`,
          value: area
        }))),
        ...((userData?.ecosystem_scores || []).slice(0, 3).map((eco, _index) => ({
          trait_type: `${eco.ecosystem} Score`,
          value: eco.score,
          display_type: "number" as const
        })))
      ],
      profile_data: {
        github: {
          username: userData?.login || '',
          name: userData.name || '',
          bio: userData.bio || '',
          avatar_url: userData.avatar_url,
          html_url: userData.html_url,
          company: userData.company || undefined,
          location: userData.location || undefined,
          blog: userData.blog || undefined,
          email: userData.email || undefined,
          public_repos: userData.public_repos,
          followers: userData.followers,
          following: userData.following,
          created_at: userData.created_at
        },
        web3_analysis: {
          summary: userData.ai?.summary || 'No AI analysis available',
          web3_score: web3Score,
          level: level,
          skills: userData.ai?.skills || [],
          expertise_areas: userData.ai?.expertise_areas || [],
          ecosystems: userData.ecosystem_scores || [],
          highlights: userData.ai?.highlights || [],
          recommendation: userData.ai?.recommendation || '',
          analysis_date: userData.ai?.analysis_date || new Date().toISOString()
        },
        mint_info: {
          minter_address: address || '',
          mint_timestamp: new Date().toISOString(),
          token_id: 0, // Will be updated after minting
          contract_address: contractConfig.address,
          network: 'Monad Testnet'
        }
      }
    };
  }, [userData, address]);

  // Upload metadata to IPFS (placeholder - in real implementation, use Pinata or similar)
  const uploadMetadata = async (metadata: NFTMetadata): Promise<string> => {
    // For demo purposes, return a placeholder IPFS hash
    // In production, upload to IPFS and return the actual hash
    const jsonString = JSON.stringify(metadata, null, 2);
    console.log('Metadata to upload:', jsonString);
    
    // Use a shorter, more standard format for testing
    const loginHash = userData?.login ? userData.login.slice(0, 8) : 'unknown';
    const hash = `QmWeb3Insight${loginHash}${Date.now().toString().slice(-6)}`;
    return `https://ipfs.io/ipfs/${hash}`;
  };

  const handleMint = async () => {
    if (!address || !isConnected || !isCorrectNetwork) return;
    
    setIsMinting(true);
    setMintError(null);

    try {
      // Upload metadata
      const metadataURI = await uploadMetadata(generateMetadata);
      
      // Prepare mint parameters
      const mintParams: MintParams = {
        githubUsername: userData.login || '',
        name: userData.name || userData.login || '',
        bio: userData.bio || '',
        web3Score: Math.min(userData.ai?.web3_involvement?.score || 0, 100),
        skills: userData.ai?.skills || [],
        ecosystems: userData.ai?.expertise_areas || [],
        metadataURI
      };

      // Allow multiple mints - removed already minted check

      // Execute mint transaction
      writeContract({
        ...contractConfig,
        functionName: 'mintProfile',
        args: [
          mintParams.githubUsername,
          mintParams.name,
          mintParams.bio,
          BigInt(mintParams.web3Score),
          mintParams.skills,
          mintParams.ecosystems,
          mintParams.metadataURI
        ],
        value: (currentMintPrice as bigint) || MINT_PRICE,
      });

    } catch (err) {
      console.error('Mint error:', err);
      setMintError(err instanceof Error ? err.message : 'Minting failed');
      setIsMinting(false);
    }
  };

  // Reset states when transaction is confirmed or fails
  React.useEffect(() => {
    if (isConfirmed || error) {
      setIsMinting(false);
    }
    if (error) {
      setMintError(error.message || 'Transaction failed');
    }
  }, [isConfirmed, error]);

  // Don't show mint button if no AI analysis
  if (!userData.ai) {
    return null;
  }

  // Allow multiple mints - removed already minted UI block

  return (
    <div className={`nes-window p-6 ${className}`}>
      <div className="text-center">
        {/* Header */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="text-lg">🎨</div>
          <h3 className="nes-title text-sm">MINT WEB3INSIGHT NFT</h3>
        </div>

        {/* NFT Preview Info */}
        <div className="nes-container p-3 mb-4 text-left">
          <div className="nes-subtitle text-xs mb-2">NFT PREVIEW:</div>
          <div className="space-y-1 nes-text text-xs">
            <div>👤 PROFILE: {userData.name || userData?.login || 'Developer'}</div>
            <div>⚡ WEB3 SCORE: {userData.ai?.web3_involvement?.score || 0}/100</div>
            <div>🏆 LEVEL: {userData.ai?.web3_involvement?.level || 'Beginner'}</div>
            <div>💰 PRICE: {formatEther((currentMintPrice as bigint) || MINT_PRICE)} MON</div>
          </div>
        </div>

        {/* Connection Status */}
        {!isConnected ? (
          <div className="space-y-3">
            <div className="nes-text text-xs text-nes-yellow mb-2">
              🔗 CONNECT WALLET TO MINT NFT
            </div>
            <ConnectButton.Custom>
              {({ account, chain, openConnectModal, mounted }) => {
                const ready = mounted;
                const connected = ready && account && chain;

                return (
                  <div
                    {...(!ready && {
                      'aria-hidden': true,
                      style: {
                        opacity: 0,
                        pointerEvents: 'none',
                        userSelect: 'none',
                      },
                    })}
                  >
                    {(() => {
                      if (!connected) {
                        return (
                          <button 
                            onClick={openConnectModal} 
                            className="nes-btn-success px-6 py-2 w-full"
                          >
                            🔗 CONNECT WALLET
                          </button>
                        );
                      }
                      return null;
                    })()}
                  </div>
                );
              }}
            </ConnectButton.Custom>
          </div>
        ) : !isCorrectNetwork ? (
          <div className="space-y-3">
            <div className="nes-text text-xs text-nes-red mb-2">
              ⚠️ WRONG NETWORK - SWITCH TO MONAD TESTNET
            </div>
            <ConnectButton.Custom>
              {({ openChainModal }) => (
                <button 
                  onClick={openChainModal} 
                  className="nes-btn-warning px-6 py-2 w-full"
                >
                  🔄 SWITCH NETWORK
                </button>
              )}
            </ConnectButton.Custom>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Mint Button */}
            <button
              onClick={handleMint}
              disabled={isMinting || isPending || isConfirming}
              className={`nes-btn px-6 py-2 w-full flex items-center justify-center gap-2 ${
                isMinting || isPending || isConfirming ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isMinting || isPending || isConfirming ? (
                <>
                  <div className="nes-loading"></div>
                  {isPending ? 'CONFIRMING...' : isConfirming ? 'MINTING...' : 'PREPARING...'}
                </>
              ) : (
                <>
                  🎨 MINT NFT
                </>
              )}
            </button>

            {/* Status Messages */}
            {hash && (
              <div className="nes-text text-xs text-nes-blue">
                📝 TX HASH: 
                <a 
                  href={`https://testnet.monadexplorer.com/tx/${hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-nes-blue-light ml-1"
                >
                  {hash.slice(0, 10)}...{hash.slice(-8)}
                </a>
              </div>
            )}

            {isConfirmed && (
              <div className="nes-window bg-nes-green p-3">
                <div className="nes-text text-xs text-nes-white text-center">
                  🎉 NFT MINTED SUCCESSFULLY! 🎉
                </div>
              </div>
            )}

            {mintError && (
              <div className="nes-window bg-nes-red p-3">
                <div className="nes-text text-xs text-nes-white text-center">
                  ❌ ERROR: {mintError}
                </div>
              </div>
            )}

            {/* Connected Wallet Info */}
            <div className="nes-text text-xs text-nes-gray-light">
              🔗 CONNECTED: {address?.slice(0, 6)}...{address?.slice(-4)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}