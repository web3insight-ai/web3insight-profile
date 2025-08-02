"use client";

import { Trophy, TrendingUp, Target } from "lucide-react";
import type { AIProfile } from "@/lib/types";

interface EcosystemChartProps {
  aiProfile: AIProfile;
  className?: string;
}

export function EcosystemChart({ aiProfile, className = "" }: EcosystemChartProps) {
  if (!aiProfile.web3Ecosystems?.top3) return null;

  const { top3 } = aiProfile.web3Ecosystems;
  const maxScore = Math.max(...top3.map(eco => eco.score));

  return (
    <div className={`nes-window p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-4 pb-2 border-b-2 border-nes-white">
        <Trophy className="text-nes-yellow" size={16} />
        <h3 className="nes-title text-sm">ECOSYSTEM IMPACT</h3>
        <div className="ml-auto">
          <div className="nes-badge-yellow px-2 py-1 text-xs">TOP 3</div>
        </div>
      </div>

      <div className="space-y-4">
        {top3.map((ecosystem, index) => {
          const barWidth = (ecosystem.score / maxScore) * 100;
          const colors = ["#ffdd00", "#3b82f6", "#22c55e"];
          const bgColors = ["nes-badge-yellow", "nes-badge-blue", "nes-badge-green"];

          return (
            <div key={ecosystem.name} className="space-y-2">
              {/* Ecosystem Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`${bgColors[index]} px-2 py-1`}>
                    <span className="nes-text text-xs font-bold">#{ecosystem.rank}</span>
                  </div>
                  <span className="nes-subtitle text-xs">{ecosystem.name}</span>
                </div>
                <div className="nes-text text-xs font-bold">{ecosystem.score}</div>
              </div>

              {/* Visual Bar Chart */}
              <div className="relative h-8 bg-nes-black border-2 border-nes-gray-medium">
                <div
                  className="h-full transition-all duration-1000 ease-out flex items-center justify-center relative"
                  style={{
                    width: `${barWidth}%`,
                    backgroundColor: colors[index],
                    minWidth: barWidth > 0 ? '20px' : '0px'
                  }}
                >
                  {/* Pixel pattern overlay */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="w-full h-full" style={{
                      backgroundImage: `repeating-linear-gradient(
                        0deg,
                        transparent,
                        transparent 1px,
                        rgba(0,0,0,0.1) 1px,
                        rgba(0,0,0,0.1) 2px
                      )`
                    }}></div>
                  </div>
                  <span className="nes-text text-xs font-bold text-black relative z-10">
                    {ecosystem.percentage.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Activity Indicator */}
              <div className="flex items-center justify-between text-nes-gray">
                <div className="flex items-center gap-1">
                  <Target size={10} />
                  <span className="nes-text text-xs">
                    {new Date().getFullYear() - new Date(ecosystem.firstActivityAt).getFullYear()}Y EXP
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp size={10} />
                  <span className="nes-text text-xs">
                    {Math.floor((Date.now() - new Date(ecosystem.lastActivityAt).getTime()) / (1000 * 60 * 60 * 24 * 30))}M AGO
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}