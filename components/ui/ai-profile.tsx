"use client";

import { Brain, Code } from "lucide-react";
import type { AIProfile } from "@/lib/types";
import { SkillRadarChart } from "./skill-radar-chart";
import { EcosystemChart } from "./ecosystem-chart";
import { StatsDashboard } from "./stats-dashboard";
import { ActivityHeatmap } from "./activity-heatmap";

interface AIProfileProps {
  aiProfile: AIProfile;
  className?: string;
}

export function AIProfileDisplay({ aiProfile, className = "" }: AIProfileProps) {
  return (
    <div className={`space-y-6 ${className}`}>


      {/* Visual Analytics Dashboard */}
      <div className="space-y-6">
        {/* Primary Visualizations Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Stats Dashboard */}
          <StatsDashboard aiProfile={aiProfile} />

          {/* Skill Radar Chart */}
          <SkillRadarChart aiProfile={aiProfile} />
        </div>

        {/* Secondary Visualizations */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Ecosystem Impact Chart */}
          <EcosystemChart aiProfile={aiProfile} />

          {/* Activity Heatmap */}
          <ActivityHeatmap aiProfile={aiProfile} />
        </div>



        {/* AI Summary - Minimized */}
        {aiProfile.summary && (
          <div className="nes-window p-4 bg-nes-blue/10">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="text-nes-blue" size={14} />
              <h4 className="nes-subtitle text-xs">AI SUMMARY</h4>
            </div>
            <p className="nes-text text-xs chinese-content leading-relaxed">
              {aiProfile.summary.length > 200 ? `${aiProfile.summary.slice(0, 200)}...` : aiProfile.summary}
            </p>
          </div>
        )}

        {/* Quick Skills */}
        {aiProfile.skills && aiProfile.skills.length > 0 && (
          <div className="nes-window p-4">
            <div className="flex items-center gap-2 mb-3">
              <Code className="text-nes-red" size={14} />
              <h4 className="nes-subtitle text-xs">KEY SKILLS</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {aiProfile.skills.slice(0, 6).map((skill, index) => (
                <div key={index} className="nes-badge-red px-2 py-1 text-xs">
                  {skill.toUpperCase()}
                </div>
              ))}
              {aiProfile.skills.length > 6 && (
                <div className="nes-badge px-2 py-1 text-xs">
                  +{aiProfile.skills.length - 6} MORE
                </div>
              )}
            </div>
          </div>
        )}
      </div>



      {/* AI Roast Report Section */}
      {aiProfile.roast_report && (
        <div className="space-y-6">
          {/* Roast Title */}
          <div className="nes-window p-6 bg-nes-red/20">
            <div className="flex items-center gap-3 mb-4 pb-2 border-b-2 border-nes-white">
              <div className="text-lg">🔥</div>
              <h3 className="nes-title text-sm">AI 毒舌吐槽报告</h3>
              <div className="ml-auto flex gap-2">
                <div className="nes-badge-red px-2 py-1 text-xs">
                  🌶️ {aiProfile.roast_report.roast_score.spicyLevel}/10
                </div>
                <div className="nes-badge-yellow px-2 py-1 text-xs">
                  💯 {aiProfile.roast_report.roast_score.truthLevel}/10
                </div>
              </div>
            </div>
            <div className="bg-nes-yellow/10 border-2 border-nes-yellow nes-border p-4">
              <h4 className="nes-subtitle chinese-content text-sm mb-2 text-nes-red">
                {aiProfile.roast_report.title}
              </h4>
            </div>
          </div>

          {/* Main Roast Content */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Overall Roast */}
            <div className="nes-window p-4">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-nes-gray-medium">
                <div className="text-sm">😈</div>
                <h5 className="nes-subtitle text-xs">整体吐槽</h5>
              </div>
              <div className="bg-nes-gray-dark border border-nes-gray-medium nes-border-inset p-3">
                <p className="nes-text chinese-content text-xs">
                  {aiProfile.roast_report.overall_roast}
                </p>
              </div>
            </div>

            {/* Activity Roast */}
            <div className="nes-window p-4">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-nes-gray-medium">
                <div className="text-sm">📊</div>
                <h5 className="nes-subtitle text-xs">活跃度吐槽</h5>
              </div>
              <div className="bg-nes-gray-dark border border-nes-gray-medium nes-border-inset p-3">
                <p className="nes-text chinese-content text-xs">
                  {aiProfile.roast_report.activity_roast}
                </p>
              </div>
            </div>

            {/* Ecosystem Roast */}
            <div className="nes-window p-4">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-nes-gray-medium">
                <div className="text-sm">🌐</div>
                <h5 className="nes-subtitle text-xs">生态选择吐槽</h5>
              </div>
              <div className="bg-nes-gray-dark border border-nes-gray-medium nes-border-inset p-3">
                <p className="nes-text chinese-content text-xs">
                  {aiProfile.roast_report.ecosystem_roast}
                </p>
              </div>
            </div>

            {/* Technical Roast */}
            <div className="nes-window p-4">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-nes-gray-medium">
                <div className="text-sm">💻</div>
                <h5 className="nes-subtitle text-xs">技术栈吐槽</h5>
              </div>
              <div className="bg-nes-gray-dark border border-nes-gray-medium nes-border-inset p-3">
                <p className="nes-text chinese-content text-xs">
                  {aiProfile.roast_report.technical_roast}
                </p>
              </div>
            </div>
          </div>

          {/* Constructive Sarcasm */}
          <div className="nes-window p-6 bg-nes-green/20">
            <div className="flex items-center gap-3 mb-4 pb-2 border-b-2 border-nes-white">
              <div className="text-lg">💡</div>
              <h4 className="nes-title text-sm">建设性吐槽建议</h4>
            </div>
            <div className="space-y-3">
              {aiProfile.roast_report.constructive_sarcasm.map((suggestion, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="nes-badge-green px-2 py-1 text-xs mt-1">
                    {index + 1}
                  </div>
                  <div className="bg-nes-green/10 border border-nes-green nes-border-inset p-3 flex-1">
                    <p className="nes-text chinese-content text-xs">
                      {suggestion}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Final Verdict */}
          <div className="nes-window p-6 bg-nes-purple/20">
            <div className="flex items-center gap-3 mb-4 pb-2 border-b-2 border-nes-white">
              <div className="text-lg">⚖️</div>
              <h4 className="nes-title text-sm">最终裁决</h4>
            </div>
            <div className="bg-nes-purple/10 border-2 border-nes-purple nes-border p-4 text-center">
              <p className="nes-text chinese-content text-sm font-bold">
                {aiProfile.roast_report.final_verdict}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Analysis Date Footer */}
      {aiProfile.analysis_date && (
        <div className="text-center mt-6">
          <div className="nes-window p-3 inline-block">
            <div className="nes-text text-xs text-nes-gray-light">
              📅 ANALYSIS COMPLETED: {new Date(aiProfile.analysis_date).toLocaleDateString()} 📅
            </div>
          </div>
        </div>
      )}
    </div>
  );
}