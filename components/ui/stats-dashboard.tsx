"use client";

import { BarChart3, Users, GitBranch, Calendar, TrendingUp, Zap } from "lucide-react";
import type { AIProfile } from "@/lib/types";

interface StatsDashboardProps {
  aiProfile: AIProfile;
  className?: string;
}

export function StatsDashboard({ aiProfile, className = "" }: StatsDashboardProps) {
  if (!aiProfile.profileCard && !aiProfile.activityTimeline && !aiProfile.web3_involvement) return null;

  const stats = [
    {
      icon: TrendingUp,
      label: "WEB3 SCORE",
      value: aiProfile.web3_involvement?.score || 0,
      max: 100,
      color: "#22c55e",
      badge: "nes-badge-green"
    },
    {
      icon: GitBranch,
      label: "TOTAL SCORE",
      value: aiProfile.profileCard?.stats?.totalScore || 0,
      max: 400,
      color: "#3b82f6",
      badge: "nes-badge-blue"
    },
    {
      icon: Users,
      label: "FOLLOWERS",
      value: aiProfile.profileCard?.stats?.followers || 0,
      max: Math.max(aiProfile.profileCard?.stats?.followers || 0, 100),
      color: "#f59e0b",
      badge: "nes-badge-yellow"
    },
    {
      icon: Calendar,
      label: "ACTIVE DAYS",
      value: aiProfile.activityTimeline?.totalDaysActive || 0,
      max: Math.max(aiProfile.activityTimeline?.totalDaysActive || 0, 1000),
      color: "#8b5cf6",
      badge: "nes-badge-purple"
    },
    {
      icon: GitBranch,
      label: "REPOSITORIES",
      value: aiProfile.profileCard?.stats?.publicRepos || 0,
      max: Math.max(aiProfile.profileCard?.stats?.publicRepos || 0, 50),
      color: "#ef4444",
      badge: "nes-badge-red"
    },
    {
      icon: Zap,
      label: "ECOSYSTEMS",
      value: aiProfile.web3Ecosystems?.top3?.length || 0,
      max: 10,
      color: "#06b6d4",
      badge: "nes-badge-blue"
    }
  ];

  return (
    <div className={`nes-window p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-4 pb-2 border-b-2 border-nes-white">
        <BarChart3 className="text-nes-blue" size={16} />
        <h3 className="nes-title text-sm">KEY METRICS</h3>
        <div className="ml-auto">
          <div className="nes-badge-blue px-2 py-1 text-xs">DASHBOARD</div>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const percentage = Math.min((stat.value / stat.max) * 100, 100);

          return (
            <div key={stat.label} className="bg-nes-black border-2 border-nes-gray-medium p-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <stat.icon size={16} style={{ color: stat.color }} />
                <div className={`${stat.badge} px-2 py-1`}>
                  <span className="nes-text text-xs font-bold">
                    {stat.value >= 1000 ? `${(stat.value / 1000).toFixed(1)}K` : stat.value}
                  </span>
                </div>
              </div>

              {/* Progress Circle */}
              <div className="relative w-16 h-16 mx-auto mb-2">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                  {/* Background circle */}
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    fill="none"
                    stroke="#374151"
                    strokeWidth="4"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    fill="none"
                    stroke={stat.color}
                    strokeWidth="4"
                    strokeDasharray={`${2 * Math.PI * 28}`}
                    strokeDashoffset={`${2 * Math.PI * 28 * (1 - percentage / 100)}`}
                    className="transition-all duration-1000 ease-out"
                    strokeLinecap="round"
                  />
                </svg>
                {/* Center text */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="nes-text text-xs font-bold">
                    {percentage.toFixed(0)}%
                  </span>
                </div>
              </div>

              {/* Label */}
              <div className="nes-text text-xs text-center text-nes-gray">
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}