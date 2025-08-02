"use client";

import { GitBranch, Activity, Calendar, TrendingUp } from "lucide-react";
import type { AIProfile } from "@/lib/types";

interface RepositoryContributionsProps {
  aiProfile: AIProfile;
  className?: string;
}

export function RepositoryContributions({ aiProfile, className = "" }: RepositoryContributionsProps) {
  if (!aiProfile.web3Ecosystems?.detailed) return null;

  // Get all repos from detailed ecosystems and sort by score
  const allRepos = aiProfile.web3Ecosystems.detailed
    .flatMap(ecosystem => ecosystem.repos.map(repo => ({
      ...repo,
      ecosystem: ecosystem.ecosystem
    })))
    .sort((a, b) => b.score - a.score)
    .slice(0, 8); // Show top 8 repos

  const maxScore = Math.max(...allRepos.map(repo => repo.score));

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Repository Contributions */}
      <div className="nes-window p-6">
        <div className="flex items-center gap-3 mb-4 pb-2 border-b-2 border-nes-white">
          <GitBranch className="text-nes-green" size={16} />
          <h3 className="nes-title text-sm">TOP REPOSITORY CONTRIBUTIONS</h3>
          <div className="ml-auto">
            <div className="nes-badge-green px-2 py-1 text-xs">{allRepos.length}</div>
          </div>
        </div>

        <div className="space-y-4">
          {allRepos.map((repo, index) => {
            const scorePercentage = (repo.score / maxScore) * 100;
            const isRecent = new Date(repo.lastActivityAt) > new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);

            return (
              <div key={`${repo.ecosystem}-${repo.name}`} className="nes-window p-4 bg-nes-black/30">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`px-2 py-1 text-xs ${
                        index === 0 ? "nes-badge-yellow" :
                        index === 1 ? "nes-badge-blue" :
                        index === 2 ? "nes-badge-green" : "nes-badge"
                      }`}>
                        #{index + 1}
                      </div>
                      {isRecent && (
                        <div className="nes-badge-red px-2 py-1 text-xs">
                          🔥 ACTIVE
                        </div>
                      )}
                    </div>
                    <h4 className="nes-subtitle text-xs truncate mb-1">
                      {repo.name.split('/').pop()?.toUpperCase()}
                    </h4>
                    <p className="nes-text text-xs text-nes-gray truncate">
                      {repo.name}
                    </p>
                  </div>

                  <div className="ml-4 text-right">
                    <div className="nes-badge-blue px-3 py-1 mb-2">
                      <span className="nes-text text-xs font-bold">{repo.score}</span>
                    </div>
                    <div className="nes-badge px-2 py-1">
                      <span className="nes-text text-xs">{repo.ecosystem}</span>
                    </div>
                  </div>
                </div>

                {/* Score Progress Bar */}
                <div className="nes-progress mb-3">
                  <div
                    className="nes-progress-bar transition-all duration-1000 ease-out"
                    style={{
                      width: `${scorePercentage}%`,
                      background: scorePercentage > 80 ? '#22c55e' :
                                scorePercentage > 60 ? '#3b82f6' :
                                scorePercentage > 40 ? '#f59e0b' : '#8b5cf6'
                    }}
                  ></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="nes-text text-xs font-bold text-nes-white mix-blend-difference">
                      {scorePercentage.toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* Activity Period */}
                <div className="flex items-center justify-between text-nes-gray">
                  <div className="flex items-center gap-1">
                    <Calendar size={10} />
                    <span className="nes-text text-xs">
                      {new Date(repo.firstActivityAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Activity size={10} />
                    <span className="nes-text text-xs">
                      {new Date(repo.lastActivityAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Ecosystem Distribution */}
      <div className="nes-window p-6">
        <div className="flex items-center gap-3 mb-4 pb-2 border-b-2 border-nes-white">
          <TrendingUp className="text-nes-purple" size={16} />
          <h4 className="nes-title text-sm">ECOSYSTEM DISTRIBUTION</h4>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {aiProfile.web3Ecosystems.detailed.map((ecosystem) => (
            <div key={ecosystem.ecosystem} className="bg-nes-gray-dark border-2 border-nes-gray-medium p-4">
              <div className="flex items-center justify-between mb-3">
                <h5 className="nes-subtitle text-xs">{ecosystem.ecosystem}</h5>
                <div className="nes-badge-purple px-2 py-1">
                  <span className="nes-text text-xs">{ecosystem.score}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="nes-text text-xs text-nes-gray">REPOSITORIES:</span>
                  <span className="nes-text text-xs">{ecosystem.repos.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="nes-text text-xs text-nes-gray">TOP REPO:</span>
                  <span className="nes-text text-xs">{Math.max(...ecosystem.repos.map(r => r.score))}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}