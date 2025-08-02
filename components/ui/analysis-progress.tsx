"use client";

// Progress component not currently used
import { Clock, CheckCircle, AlertCircle, Zap, Target, X } from "lucide-react";
import type { AnalysisStatus } from "@/lib/types";

interface AnalysisProgressProps {
  status: AnalysisStatus;
  progress?: number;
  estimatedTime?: string;
  message?: string;
  className?: string;
}

export function AnalysisProgress({
  status,
  progress = 0,
  estimatedTime,
  message,
  className = "",
}: AnalysisProgressProps) {
  const getStatusConfig = () => {
    switch (status) {
    case "pending":
      return {
        icon: <Clock size={14} className="text-nes-gray-light" />,
        text: "QUEUED FOR ANALYSIS",
        color: "bg-nes-gray-medium",
        borderColor: "border-nes-gray-light",
        showProgress: false,
        badge: "PENDING",
        badgeClass: "nes-badge",
      };
    case "analyzing":
      return {
        icon: <div className="nes-loading"></div>,
        text: message?.toUpperCase() || "ANALYZING GITHUB PROFILE AND CONTRIBUTIONS...",
        color: "bg-nes-blue",
        borderColor: "border-nes-blue",
        showProgress: true,
        badge: "ANALYZING",
        badgeClass: "nes-badge-blue",
      };
    case "completed":
      return {
        icon: <CheckCircle size={14} className="text-nes-green" />,
        text: "ANALYSIS COMPLETED SUCCESSFULLY",
        color: "bg-nes-green",
        borderColor: "border-nes-green",
        showProgress: false,
        badge: "COMPLETE",
        badgeClass: "nes-badge-green",
      };
    case "failed":
      return {
        icon: <AlertCircle size={14} className="text-nes-red" />,
        text: "ANALYSIS FAILED",
        color: "bg-nes-red",
        borderColor: "border-nes-red",
        showProgress: false,
        badge: "ERROR",
        badgeClass: "nes-badge-red",
      };
    default:
      return {
        icon: <Clock size={14} className="text-nes-gray-light" />,
        text: "UNKNOWN STATUS",
        color: "bg-nes-gray-medium",
        borderColor: "border-nes-gray-light",
        showProgress: false,
        badge: "UNKNOWN",
        badgeClass: "nes-badge",
      };
    }
  };

  const config = getStatusConfig();

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Status Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {config.icon}
          <span className="nes-text text-xs font-bold">
            {config.text}
          </span>
        </div>

        <div className={`${config.badgeClass} px-2 py-1`}>
          <span className="text-xs font-bold">{config.badge}</span>
        </div>
      </div>

      {/* Progress Section */}
      {config.showProgress && (
        <div className="space-y-3">
          {/* NES-Style Progress Bar */}
          <div className="nes-progress relative">
            <div
              className="nes-progress-bar transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="nes-text text-xs font-bold text-nes-white mix-blend-difference">
                {progress > 0 ? `${Math.round(progress)}%` : ""}
              </span>
            </div>
          </div>

          {/* Progress Details */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="text-nes-yellow" size={12} />
              <span className="nes-text text-xs">PROGRESS:</span>
              <span className="nes-text text-xs font-bold">{Math.round(progress)}%</span>
            </div>

            {estimatedTime && (
              <div className="flex items-center gap-2">
                <Target className="text-nes-blue" size={12} />
                <span className="nes-text text-xs">ETA: {estimatedTime}</span>
              </div>
            )}
          </div>

          {/* Status Message */}
          {message && (
            <div className="bg-nes-gray-dark border-2 border-nes-gray-medium nes-border-inset p-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-nes-yellow border border-nes-white animate-pulse"></div>
                <span className="nes-text text-xs">
                  {message.toUpperCase()}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Success State */}
      {status === "completed" && (
        <div className="bg-nes-green/20 border-2 border-nes-green nes-border p-3 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <CheckCircle className="text-nes-green" size={16} />
            <span className="nes-text text-xs font-bold">MISSION ACCOMPLISHED!</span>
          </div>
          <div className="nes-text text-xs">
            🎉 YOUR WEB3 PROFILE ANALYSIS IS READY! 🎉
          </div>
        </div>
      )}

      {/* Error State */}
      {status === "failed" && (
        <div className="bg-nes-red/20 border-2 border-nes-red nes-border p-3 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <X className="text-nes-red" size={16} />
            <span className="nes-text text-xs font-bold">GAME OVER!</span>
          </div>
          <div className="nes-text text-xs">
            ⚠️ ANALYSIS PROCESS ENCOUNTERED AN ERROR ⚠️
          </div>
        </div>
      )}

      {/* Loading Animation for Analyzing State */}
      {status === "analyzing" && (
        <div className="bg-nes-blue/20 border-2 border-nes-blue nes-border p-3">
          <div className="flex items-center gap-3">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-nes-white border border-nes-blue animate-pulse" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-nes-white border border-nes-blue animate-pulse" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-nes-white border border-nes-blue animate-pulse" style={{ animationDelay: '300ms' }}></div>
            </div>
            <span className="nes-text text-xs">
              SCANNING REPOSITORIES AND CONTRIBUTIONS...
            </span>
          </div>
        </div>
      )}
    </div>
  );
}