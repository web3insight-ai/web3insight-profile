"use client";

import { Code2, Wrench, Target, Layers } from "lucide-react";
import type { AIProfile } from "@/lib/types";

interface TechnicalBreakdownProps {
  aiProfile: AIProfile;
  className?: string;
}

export function TechnicalBreakdown({ aiProfile, className = "" }: TechnicalBreakdownProps) {
  if (!aiProfile.technicalStack) return null;

  const { skills, languages, frameworks, mainFocus } = aiProfile.technicalStack;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Main Focus */}
      {mainFocus && (
        <div className="nes-window p-6 bg-nes-purple/20">
          <div className="flex items-center gap-3 mb-4 pb-2 border-b-2 border-nes-white">
            <Target className="text-nes-purple" size={16} />
            <h3 className="nes-title text-sm">MAIN FOCUS</h3>
          </div>
          <div className="bg-nes-gray-dark border-2 border-nes-gray-medium nes-border-inset p-4">
            <p className="nes-text text-xs leading-relaxed chinese-content">
              {mainFocus}
            </p>
          </div>
        </div>
      )}

      {/* Languages & Skills Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Programming Languages */}
        {languages && languages.length > 0 && (
          <div className="nes-window p-6">
            <div className="flex items-center gap-3 mb-4 pb-2 border-b-2 border-nes-white">
              <Code2 className="text-nes-green" size={16} />
              <h4 className="nes-title text-sm">LANGUAGES</h4>
              <div className="ml-auto">
                <div className="nes-badge-green px-2 py-1 text-xs">{languages.length}</div>
              </div>
            </div>

            <div className="space-y-3">
              {languages.map((language, index) => {
                // Simulate proficiency based on position (first = most proficient)
                const proficiency = Math.max(60, 100 - (index * 15));

                return (
                  <div key={language} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="nes-subtitle text-xs">{language.toUpperCase()}</span>
                      <span className="nes-text text-xs text-nes-gray">{proficiency}%</span>
                    </div>
                    <div className="nes-progress">
                      <div
                        className="nes-progress-bar transition-all duration-1000 ease-out"
                        style={{
                          width: `${proficiency}%`,
                          background: index === 0 ? '#22c55e' :
                                    index === 1 ? '#3b82f6' :
                                    index === 2 ? '#f59e0b' : '#8b5cf6'
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Core Skills */}
        {skills && skills.length > 0 && (
          <div className="nes-window p-6">
            <div className="flex items-center gap-3 mb-4 pb-2 border-b-2 border-nes-white">
              <Layers className="text-nes-blue" size={16} />
              <h4 className="nes-title text-sm">CORE SKILLS</h4>
              <div className="ml-auto">
                <div className="nes-badge-blue px-2 py-1 text-xs">{skills.length}</div>
              </div>
            </div>

            <div className="space-y-3">
              {skills.map((skill, index) => {
                const skillLevel = Math.max(50, 90 - (index * 10));

                return (
                  <div key={skill} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="nes-subtitle text-xs">{skill.toUpperCase()}</span>
                      <span className="nes-text text-xs text-nes-gray">{skillLevel}%</span>
                    </div>
                    <div className="nes-progress">
                      <div
                        className="nes-progress-bar transition-all duration-1000 ease-out"
                        style={{
                          width: `${skillLevel}%`,
                          background: skillLevel >= 80 ? '#22c55e' :
                                    skillLevel >= 60 ? '#3b82f6' : '#f59e0b'
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Frameworks & Tools */}
      {frameworks && frameworks.length > 0 && (
        <div className="nes-window p-6">
          <div className="flex items-center gap-3 mb-4 pb-2 border-b-2 border-nes-white">
            <Wrench className="text-nes-orange" size={16} />
            <h4 className="nes-title text-sm">FRAMEWORKS & TOOLS</h4>
            <div className="ml-auto">
              <div className="nes-badge-orange px-2 py-1 text-xs">{frameworks.length}</div>
            </div>
          </div>

          <div className="bg-nes-gray-dark border-2 border-nes-gray-medium nes-border-inset p-4">
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {frameworks.map((framework) => (
                <div
                  key={framework}
                  className="nes-badge-orange px-3 py-2 text-center"
                >
                  <span className="nes-text text-xs font-bold">
                    {framework.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}