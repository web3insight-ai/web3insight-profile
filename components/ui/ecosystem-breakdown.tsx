"use client";

import { Trophy, TrendingUp, Calendar, Users2 } from "lucide-react";
import type { AIProfile } from "@/lib/types";

interface EcosystemBreakdownProps {
  aiProfile: AIProfile;
  className?: string;
}

export function EcosystemBreakdown({ aiProfile, className = "" }: EcosystemBreakdownProps) {
  if (!aiProfile.web3Ecosystems) return null;

  const { top3, otherEcosystems } = aiProfile.web3Ecosystems;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Top 3 Ecosystems */}
      <div className="nes-window p-6">
        <div className="flex items-center gap-3 mb-4 pb-2 border-b-2 border-nes-white">
          <Trophy className="text-nes-yellow" size={16} />
          <h3 className="nes-title text-sm">TOP 3 ECOSYSTEMS</h3>
          <div className="ml-auto">
            <div className="nes-badge-yellow px-2 py-1 text-xs">RANKED</div>
          </div>
        </div>

        <div className="space-y-4">
          {top3.map((ecosystem, index) => {
            const bgColors = ["nes-badge-yellow", "nes-badge", "nes-badge-red"];

            return (
              <div key={ecosystem.name} className="nes-window p-4 bg-nes-black/30">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`${bgColors[index]} px-2 py-1`}>
                      <span className="nes-text text-xs font-bold">#{ecosystem.rank}</span>
                    </div>
                    <h4 className="nes-subtitle text-xs">{ecosystem.name.toUpperCase()}</h4>
                  </div>
                  <div className="nes-badge-blue px-3 py-1">
                    <span className="nes-text text-xs font-bold">{ecosystem.score}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="nes-progress mb-3">
                  <div
                    className="nes-progress-bar transition-all duration-1000 ease-out"
                    style={{ width: `${ecosystem.percentage}%` }}
                  ></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="nes-text text-xs font-bold text-nes-white mix-blend-difference">
                      {ecosystem.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* Activity Dates */}
                <div className="flex items-center justify-between text-nes-gray">
                  <div className="flex items-center gap-1">
                    <Calendar size={10} />
                    <span className="nes-text text-xs">
                      FIRST: {new Date(ecosystem.firstActivityAt).getFullYear()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp size={10} />
                    <span className="nes-text text-xs">
                      LAST: {new Date(ecosystem.lastActivityAt).getFullYear()}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Other Ecosystems */}
      {otherEcosystems && otherEcosystems.length > 0 && (
        <div className="nes-window p-6">
          <div className="flex items-center gap-3 mb-4 pb-2 border-b-2 border-nes-white">
            <Users2 className="text-nes-blue" size={16} />
            <h3 className="nes-title text-sm">OTHER ECOSYSTEMS</h3>
            <div className="ml-auto">
              <div className="nes-badge-blue px-2 py-1 text-xs">{otherEcosystems.length}</div>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {otherEcosystems.slice(0, 6).map((ecosystem) => (
              <div key={ecosystem.name} className="bg-nes-gray-dark border-2 border-nes-gray-medium p-3">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="nes-subtitle text-xs truncate flex-1">{ecosystem.name}</h5>
                  <div className="nes-badge-green px-2 py-1 ml-2">
                    <span className="nes-text text-xs">{ecosystem.score}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-nes-gray">
                  <span className="nes-text text-xs">{ecosystem.repoCount} REPOS</span>
                  <span className="nes-text text-xs">
                    {new Date(ecosystem.lastActivityAt).getFullYear()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}