"use client";

import { Activity, Calendar, TrendingUp } from "lucide-react";
import type { AIProfile } from "@/lib/types";

interface ActivityHeatmapProps {
  aiProfile: AIProfile;
  className?: string;
}

export function ActivityHeatmap({ aiProfile, className = "" }: ActivityHeatmapProps) {
  if (!aiProfile.activityTimeline || !aiProfile.web3Ecosystems?.top3) return null;

  const { activityTimeline } = aiProfile;
  const ecosystems = aiProfile.web3Ecosystems.top3;

  // Generate simulated activity data for visualization
  const startYear = new Date(activityTimeline.firstWeb3Activity).getFullYear();
  const endYear = new Date(activityTimeline.lastActivity).getFullYear();
  const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);

  // Create activity intensity data
  const activityData = years.map(year => {
    const yearActivity = ecosystems.reduce((acc, eco) => {
      const ecoStartYear = new Date(eco.firstActivityAt).getFullYear();
      const ecoEndYear = new Date(eco.lastActivityAt).getFullYear();
      if (year >= ecoStartYear && year <= ecoEndYear) {
        return acc + eco.score;
      }
      return acc;
    }, 0);

    return {
      year,
      intensity: Math.min(yearActivity / 100, 1), // Normalize to 0-1
      score: yearActivity
    };
  });

  const maxIntensity = Math.max(...activityData.map(d => d.intensity));

  return (
    <div className={`nes-window p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-4 pb-2 border-b-2 border-nes-white">
        <Activity className="text-nes-green" size={16} />
        <h3 className="nes-title text-sm">ACTIVITY HEATMAP</h3>
        <div className="ml-auto">
          <div className="nes-badge-green px-2 py-1 text-xs">
            {years.length}Y SPAN
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Activity Timeline */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
          {activityData.map((data) => {
            const intensity = data.intensity / maxIntensity;
            const height = Math.max(intensity * 40, 4); // Min height 4px, max 40px

            return (
              <div key={data.year} className="flex flex-col items-center gap-1 min-w-0 flex-1">
                {/* Activity Bar */}
                <div className="w-full max-w-8 flex flex-col justify-end" style={{ height: '50px' }}>
                  <div
                    className="w-full border-2 border-nes-white transition-all duration-500 ease-out"
                    style={{
                      height: `${height}px`,
                      backgroundColor: intensity > 0.7 ? '#22c55e' :
                                     intensity > 0.4 ? '#f59e0b' :
                                     intensity > 0.1 ? '#3b82f6' : '#6b7280'
                    }}
                  />
                </div>

                {/* Year Label */}
                <span className="nes-text text-xs text-nes-gray transform -rotate-45 origin-center whitespace-nowrap">
                  {data.year}
                </span>

                {/* Score */}
                {data.score > 0 && (
                  <span className="nes-text text-xs font-bold">
                    {data.score}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Activity Summary */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-nes-gray-medium">
          <div className="text-center">
            <Calendar className="mx-auto mb-1 text-nes-blue" size={16} />
            <div className="nes-title text-sm">{years.length}</div>
            <div className="nes-text text-xs text-nes-gray">YEARS</div>
          </div>

          <div className="text-center">
            <TrendingUp className="mx-auto mb-1 text-nes-green" size={16} />
            <div className="nes-title text-sm">
              {Math.round(activityTimeline.totalDaysActive / years.length)}
            </div>
            <div className="nes-text text-xs text-nes-gray">DAYS/YEAR</div>
          </div>

          <div className="text-center">
            <Activity className="mx-auto mb-1 text-nes-yellow" size={16} />
            <div className="nes-title text-sm">
              {activityTimeline.activityLevel.toUpperCase()}
            </div>
            <div className="nes-text text-xs text-nes-gray">INTENSITY</div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 pt-2">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-gray-500 border border-nes-white"></div>
            <span className="nes-text text-xs">LOW</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-500 border border-nes-white"></div>
            <span className="nes-text text-xs">MED</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-yellow-500 border border-nes-white"></div>
            <span className="nes-text text-xs">HIGH</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 border border-nes-white"></div>
            <span className="nes-text text-xs">PEAK</span>
          </div>
        </div>
      </div>
    </div>
  );
}