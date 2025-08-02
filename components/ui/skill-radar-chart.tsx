"use client";

import { Code, Database, Wrench, Globe, Zap } from "lucide-react";
import type { AIProfile } from "@/lib/types";

interface SkillRadarChartProps {
  aiProfile: AIProfile;
  className?: string;
}

export function SkillRadarChart({ aiProfile, className = "" }: SkillRadarChartProps) {
  if (!aiProfile.technicalStack) return null;

  const { skills, languages } = aiProfile.technicalStack;

    // Create skill categories with proper scores based on actual data
  const skillCategories = [
    {
      name: "BLOCKCHAIN",
      icon: Database,
      score: Math.min(85, 60 + (skills?.length || 0) * 5), // Base 60 + skills bonus
      color: "#22c55e"
    },
    {
      name: "LANGUAGES",
      icon: Code,
      score: Math.min(100, Math.max(40, (languages?.length || 0) * 20)), // 20 points per language, min 40
      color: "#3b82f6"
    },
    {
      name: "FRAMEWORKS",
      icon: Wrench,
      score: Math.min(90, 50 + (skills?.filter(s =>
        s.toLowerCase().includes('development') ||
        s.toLowerCase().includes('infrastructure') ||
        s.toLowerCase().includes('node') ||
        s.toLowerCase().includes('data')
      ).length || 0) * 15), // Base 50 + framework bonus
      color: "#f59e0b"
    },
    {
      name: "WEB3",
      icon: Globe,
      score: Math.max(50, aiProfile.web3_involvement?.score || 0),
      color: "#8b5cf6"
    },
    {
      name: "DEFI",
      icon: Zap,
      score: Math.min(80, 45 + (skills?.filter(s =>
        s.toLowerCase().includes('cross-chain') ||
        s.toLowerCase().includes('oracle') ||
        s.toLowerCase().includes('indexing') ||
        s.toLowerCase().includes('smart')
      ).length || 0) * 10), // Base 45 + DeFi-related skills
      color: "#ef4444"
    }
  ];

  return (
    <div className={`nes-window p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-4 pb-2 border-b-2 border-nes-white">
        <Code className="text-nes-blue" size={16} />
        <h3 className="nes-title text-sm">SKILL RADAR</h3>
        <div className="ml-auto">
          <div className="nes-badge-blue px-2 py-1 text-xs">ANALYSIS</div>
        </div>
      </div>

      <div className="relative">
        {/* Radar Chart Container */}
        <div className="relative w-full h-64 flex items-center justify-center">
          {/* Background Grid */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              {/* Concentric circles */}
              {[1, 2, 3, 4, 5].map((ring) => (
                <div
                  key={ring}
                  className="absolute border border-nes-gray-medium"
                  style={{
                    width: `${ring * 20}px`,
                    height: `${ring * 20}px`,
                    left: `${-ring * 10}px`,
                    top: `${-ring * 10}px`,
                    borderRadius: '50%'
                  }}
                />
              ))}
            </div>
          </div>

          {/* Skill Points */}
          {skillCategories.map((skill, index) => {
            const angle = (index * 72) - 90; // 360/5 = 72 degrees between points
            const radian = (angle * Math.PI) / 180;
            const radius = (skill.score / 100) * 90; // Max radius 90px
            const x = Math.cos(radian) * radius;
            const y = Math.sin(radian) * radius;

            return (
              <div
                key={skill.name}
                className="absolute flex flex-col items-center"
                style={{
                  transform: `translate(${x}px, ${y}px)`,
                  left: '50%',
                  top: '50%',
                  marginLeft: '-25px',
                  marginTop: '-25px'
                }}
              >
                <div
                  className="w-6 h-6 border-2 border-nes-white flex items-center justify-center"
                  style={{ backgroundColor: skill.color }}
                >
                  <skill.icon size={12} className="text-white" />
                </div>
                <div
                  className="nes-text text-xs mt-1 text-center min-w-16"
                  style={{ color: skill.color }}
                >
                  {skill.name}
                </div>
                <div className="nes-text text-xs font-bold">{skill.score}</div>
              </div>
            );
          })}

          {/* Center point */}
          <div className="absolute w-4 h-4 bg-nes-white border-2 border-nes-black left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
      </div>
    </div>
  );
}