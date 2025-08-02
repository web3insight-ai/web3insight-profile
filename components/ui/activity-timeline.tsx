"use client";

import { Calendar, Clock, TrendingUp, Zap, Activity } from "lucide-react";
import type { AIProfile } from "@/lib/types";

interface ActivityTimelineProps {
  aiProfile: AIProfile;
  className?: string;
}

export function ActivityTimeline({ aiProfile, className = "" }: ActivityTimelineProps) {
  if (!aiProfile.activityTimeline) return null;

  const {
    lastActivity,
    activityLevel,
    totalDaysActive,
    firstWeb3Activity
  } = aiProfile.activityTimeline;

  const startYear = new Date(firstWeb3Activity).getFullYear();
  const endYear = new Date(lastActivity).getFullYear();
  const yearsActive = endYear - startYear + 1;
  const avgDaysPerYear = Math.round(totalDaysActive / yearsActive);

  // Activity level colors and icons
  const activityConfig = {
    high: { color: "text-nes-green", bg: "nes-badge-green", icon: "🔥" },
    medium: { color: "text-nes-yellow", bg: "nes-badge-yellow", icon: "⚡" },
    low: { color: "text-nes-red", bg: "nes-badge-red", icon: "🌱" }
  };

  const config = activityConfig[activityLevel as keyof typeof activityConfig] || activityConfig.medium;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Activity Overview */}
      <div className="nes-window p-6">
        <div className="flex items-center gap-3 mb-4 pb-2 border-b-2 border-nes-white">
          <Activity className="text-nes-blue" size={16} />
          <h3 className="nes-title text-sm">ACTIVITY TIMELINE</h3>
          <div className="ml-auto">
            <div className={`${config.bg} px-2 py-1 text-xs`}>
              {config.icon} {activityLevel.toUpperCase()}
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Years Active */}
          <div className="bg-nes-gray-dark border-2 border-nes-gray-medium p-4 text-center">
            <Calendar className="mx-auto mb-2 text-nes-blue" size={20} />
            <div className="nes-title text-lg mb-1">{yearsActive}</div>
            <div className="nes-text text-xs text-nes-gray">YEARS ACTIVE</div>
          </div>

          {/* Total Days */}
          <div className="bg-nes-gray-dark border-2 border-nes-gray-medium p-4 text-center">
            <Clock className="mx-auto mb-2 text-nes-green" size={20} />
            <div className="nes-title text-lg mb-1">{totalDaysActive.toLocaleString()}</div>
            <div className="nes-text text-xs text-nes-gray">TOTAL DAYS</div>
          </div>

          {/* Avg Per Year */}
          <div className="bg-nes-gray-dark border-2 border-nes-gray-medium p-4 text-center">
            <TrendingUp className="mx-auto mb-2 text-nes-yellow" size={20} />
            <div className="nes-title text-lg mb-1">{avgDaysPerYear}</div>
            <div className="nes-text text-xs text-nes-gray">DAYS/YEAR</div>
          </div>

          {/* Activity Level */}
          <div className="bg-nes-gray-dark border-2 border-nes-gray-medium p-4 text-center">
            <Zap className={`mx-auto mb-2 ${config.color}`} size={20} />
            <div className="nes-title text-lg mb-1">{config.icon}</div>
            <div className="nes-text text-xs text-nes-gray">{activityLevel.toUpperCase()}</div>
          </div>
        </div>
      </div>

      {/* Timeline Visual */}
      <div className="nes-window p-6">
        <div className="flex items-center gap-3 mb-4 pb-2 border-b-2 border-nes-white">
          <Calendar className="text-nes-purple" size={16} />
          <h4 className="nes-title text-sm">WEB3 JOURNEY</h4>
        </div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-4 top-8 bottom-8 w-0.5 bg-nes-white"></div>

          <div className="space-y-6">
            {/* Start Point */}
            <div className="flex items-center gap-4">
              <div className="relative z-10 w-8 h-8 bg-nes-green border-2 border-nes-white flex items-center justify-center">
                <span className="text-xs">🚀</span>
              </div>
              <div className="flex-1">
                <div className="nes-subtitle text-xs mb-1">STARTED WEB3 JOURNEY</div>
                <div className="nes-text text-xs text-nes-gray">
                  {new Date(firstWeb3Activity).toLocaleDateString()} - {startYear}
                </div>
              </div>
            </div>

            {/* Activity Milestone */}
            <div className="flex items-center gap-4">
              <div className="relative z-10 w-8 h-8 bg-nes-yellow border-2 border-nes-white flex items-center justify-center">
                <span className="text-xs">⚡</span>
              </div>
              <div className="flex-1">
                <div className="nes-subtitle text-xs mb-1">ACCUMULATED {totalDaysActive.toLocaleString()} ACTIVE DAYS</div>
                <div className="nes-text text-xs text-nes-gray">
                  Average {avgDaysPerYear} days per year
                </div>
              </div>
            </div>

            {/* Latest Activity */}
            <div className="flex items-center gap-4">
              <div className="relative z-10 w-8 h-8 bg-nes-blue border-2 border-nes-white flex items-center justify-center">
                <span className="text-xs">📊</span>
              </div>
              <div className="flex-1">
                <div className="nes-subtitle text-xs mb-1">LATEST ACTIVITY</div>
                <div className="nes-text text-xs text-nes-gray">
                  {new Date(lastActivity).toLocaleDateString()} - {endYear}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}