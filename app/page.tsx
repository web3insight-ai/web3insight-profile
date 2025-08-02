"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Link
} from "@nextui-org/react";
import { Search, User, ExternalLink, Calendar, MapPin, Building, Globe, Star, Zap } from "lucide-react";
import { AnalysisProgress } from "@/components/ui/analysis-progress";
import { AIProfileDisplay } from "@/components/ui/ai-profile";
import { analyzeGitHubUser } from "@/lib/api/analysis";
import type { AnalysisStatus, AnalysisResult, GitHubUser, BasicAnalysisResult, EcosystemItem } from "@/lib/types";

export default function Home() {
  const [githubHandle, setGithubHandle] = useState("pseudoyu");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStatus, setAnalysisStatus] = useState<AnalysisStatus>("pending");
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const [basicInfo, setBasicInfo] = useState<BasicAnalysisResult | null>(null);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");
  const [showDebugData, setShowDebugData] = useState(false);

  const handleAnalyze = async () => {
    if (!githubHandle.trim()) {
      setError("PLEASE ENTER A GITHUB HANDLE");
      return;
    }

    setError("");
    setIsAnalyzing(true);
    setAnalysisStatus("analyzing");
    setProgress(0);
    setBasicInfo(null);
    setResults(null);

    try {
      const response = await analyzeGitHubUser(
        githubHandle.trim(),
        (status, progressValue, data) => {
          setStatusMessage(status);
          if (progressValue) setProgress(progressValue);
          if (data) {
            console.log("🔄 Progress data:", data);
            console.log("🤖 AI field present:", !!(data.ai));
            console.log("🤖 AI success:", data.ai?.success);
          }
        },
        (basicData) => {
          setBasicInfo(basicData);
          console.log("📋 Basic info received:", basicData);
        }
      );

      if (response.success) {
        console.log("🎉 Analysis completed successfully!");
        console.log("📊 Full response data:", response.data);

                // Process AI data and attach to users
        if (response.data.ai && response.data.ai.success && response.data.ai.data) {
          console.log("🤖 Processing AI data...");
          const aiData = response.data.ai.data;
          const aiProfile = aiData.profile?.output;
          const roastData = aiData.roastReport?.output;

          if (aiProfile && response.data.data.users.length > 0) {
            // Calculate Web3 involvement score from total score or top ecosystem
            const totalScore = aiProfile.profileCard?.stats?.totalScore || 0;
            const web3Score = Math.min(Math.round((totalScore / 400) * 100), 100); // Normalize to 0-100

            // Determine involvement level
            let level = "Beginner";
            if (web3Score >= 80) level = "Expert";
            else if (web3Score >= 60) level = "Advanced";
            else if (web3Score >= 30) level = "Intermediate";

            // Map AI data to expected format including rich visualization data
            response.data.data.users[0].ai = {
              summary: aiProfile.highlights?.join('. ') || "AI analysis completed successfully.",
              web3_involvement: {
                score: web3Score,
                level: level,
                evidence: aiProfile.highlights || []
              },
              skills: aiProfile.technicalStack?.skills || [],
              expertise_areas: aiProfile.web3Ecosystems?.top3?.map((eco: EcosystemItem) => eco.name) || [],
              recommendation: aiProfile.technicalStack?.mainFocus ?
                `Focus on ${aiProfile.technicalStack.mainFocus} to maximize your impact in the Web3 ecosystem.` :
                "Continue developing your Web3 skills across multiple ecosystems.",
              analysis_date: response.data.ai?.timestamp,

              // Rich visualization data
              highlights: aiProfile.highlights,
              profileCard: aiProfile.profileCard,
              technicalStack: aiProfile.technicalStack,
              web3Ecosystems: aiProfile.web3Ecosystems,
              activityTimeline: aiProfile.activityTimeline,

              // Add roast data
              roast_report: roastData ? {
                title: roastData.title,
                overall_roast: roastData.overallRoast,
                activity_roast: roastData.activityRoast,
                ecosystem_roast: roastData.ecosystemRoast,
                technical_roast: roastData.technicalRoast,
                final_verdict: roastData.finalVerdict,
                constructive_sarcasm: roastData.constructiveSarcasm,
                roast_score: roastData.roastScore
              } : undefined
            };

            console.log("✅ AI data mapped to user:", {
              totalScore,
              web3Score,
              level,
              hasHighlights: !!aiProfile.highlights?.length,
              hasSkills: !!aiProfile.technicalStack?.skills?.length,
              hasEcosystems: !!aiProfile.web3Ecosystems?.top3?.length,
              hasRoast: !!roastData
            });
          } else {
            console.log("⚠️ AI profile data incomplete or no users found");
          }
        } else {
          console.log("⚠️ No AI data found in response");
        }

        setAnalysisStatus("completed");
        setResults(response.data);
        setProgress(100);
      } else {
        console.log("❌ Analysis failed:", response.message);
        setAnalysisStatus("failed");
        setError(response.message);
      }
    } catch (err) {
      console.log("💥 Analysis error:", err);
      console.log("💥 Error details:", {
        message: err instanceof Error ? err.message : "Unknown error",
        stack: err instanceof Error ? err.stack : undefined,
        type: typeof err
      });
      setAnalysisStatus("failed");
      setError(err instanceof Error ? err.message : "ANALYSIS FAILED");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderNESUserCard = (user: GitHubUser, showAILoading = false) => (
    <div key={user.login} className="nes-window p-6 mb-6">
      {/* Title Bar */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-nes-white">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-nes-red border border-nes-white"></div>
          <div className="w-3 h-3 bg-nes-yellow border border-nes-white"></div>
          <div className="w-3 h-3 bg-nes-green border border-nes-white"></div>
        </div>
        <div className="nes-text text-xs">DEVELOPER.EXE</div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Avatar Section */}
        <div className="flex flex-col items-center gap-3">
          <div className="nes-avatar relative">
            <Image
              src={user.avatar_url}
              alt={user.name || user.login}
              width={96}
              height={96}
              className="w-24 h-24 pixel-perfect"
            />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-nes-green border border-nes-white"></div>
          </div>
          <div className="nes-badge-green px-2 py-1">
            ONLINE
          </div>
        </div>

        {/* Profile Info */}
        <div className="flex-1">
          {/* Name and Username */}
          <div className="mb-4">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="nes-title text-lg">{user.name || user.login}</h3>
              <Link
                href={user.html_url}
                isExternal
                className="nes-btn-secondary px-2 py-1 text-xs inline-flex items-center gap-1"
              >
                <ExternalLink size={12} />
                GITHUB
              </Link>
            </div>
            <div className="nes-subtitle text-sm">@{user.login}</div>
          </div>

          {/* Bio */}
          {user.bio && (
            <div className="mb-4 p-3 bg-nes-gray-dark border-2 border-nes-gray-medium nes-border-inset">
              <div className="nes-text text-xs leading-relaxed">{user.bio}</div>
            </div>
          )}

          {/* User Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {user.company && (
              <div className="flex items-center gap-2 nes-text text-xs">
                <Building size={12} className="text-nes-blue" />
                <span>{user.company}</span>
              </div>
            )}
            {user.location && (
              <div className="flex items-center gap-2 nes-text text-xs">
                <MapPin size={12} className="text-nes-red" />
                <span>{user.location}</span>
              </div>
            )}
            {user.blog && (
              <div className="flex items-center gap-2 nes-text text-xs">
                <Globe size={12} className="text-nes-green" />
                <Link href={user.blog} isExternal className="text-nes-yellow underline">
                  {user.blog}
                </Link>
              </div>
            )}
            {user.created_at && (
              <div className="flex items-center gap-2 nes-text text-xs">
                <Calendar size={12} className="text-nes-purple" />
                <span>JOINED {new Date(user.created_at).getFullYear()}</span>
              </div>
            )}
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
            <div className="nes-badge-red text-center py-2">
              <div className="text-xs">REPOS</div>
              <div className="font-bold">{user.public_repos}</div>
            </div>
            <div className="nes-badge-blue text-center py-2">
              <div className="text-xs">FOLLOWERS</div>
              <div className="font-bold">{user.followers}</div>
            </div>
            <div className="nes-badge-green text-center py-2">
              <div className="text-xs">FOLLOWING</div>
              <div className="font-bold">{user.following}</div>
            </div>
            {user.public_gists && (
              <div className="nes-badge-yellow text-center py-2">
                <div className="text-xs">GISTS</div>
                <div className="font-bold">{user.public_gists}</div>
              </div>
            )}
          </div>

          {/* Ecosystem Scores */}
          {user.ecosystem_scores && user.ecosystem_scores.length > 0 && (
            <div className="mb-4">
              <div className="nes-subtitle text-xs mb-2">ECOSYSTEM SCORES:</div>
              <div className="flex flex-wrap gap-2">
                {user.ecosystem_scores.map((score, index) => (
                  <div
                    key={index}
                    className="nes-badge-blue px-2 py-1 text-xs"
                  >
                    {score.ecosystem.toUpperCase()}: {score.score}
                    {score.rank && ` (#${score.rank})`}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Loading */}
          {showAILoading && (
            <div className="mt-4 p-3 bg-nes-blue border-2 border-nes-white nes-border">
              <div className="flex items-center gap-2">
                <div className="nes-loading"></div>
                <span className="nes-text text-xs">GENERATING AI INSIGHTS...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-nes-black p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="profile-header mb-8">
          <div className="nes-window p-8 text-center relative">
            {/* Decorative elements */}
            <div className="absolute top-2 left-2 w-4 h-4 bg-nes-red border border-nes-white"></div>
            <div className="absolute top-2 right-2 w-4 h-4 bg-nes-blue border border-nes-white"></div>

            <h1 className="profile-title mb-4">
              🎮 WEB3 INSIGHT PROFILE 🎮
            </h1>
            <p className="profile-subtitle">
              ⚡ ANALYZE GITHUB PROFILES FOR WEB3 ECOSYSTEM INSIGHTS ⚡
            </p>

            {/* Subtitle decoration */}
            <div className="flex justify-center gap-4 mt-4">
              <Star className="text-nes-yellow" size={16} />
              <Zap className="text-nes-blue" size={16} />
              <Star className="text-nes-yellow" size={16} />
            </div>
          </div>
        </div>

        {/* Input Section */}
        <div className="input-section mb-8">
          <div className="nes-window p-6">
            <div className="flex flex-col gap-4">
              <div className="nes-subtitle text-center">ENTER GITHUB USERNAME</div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="ENTER GITHUB HANDLE (E.G., PSEUDOYU)"
                    value={githubHandle}
                    onChange={(e) => setGithubHandle(e.target.value.toLowerCase())}
                    className="nes-input w-full text-sm"
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !isAnalyzing) {
                        handleAnalyze();
                      }
                    }}
                  />
                </div>

                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className={`nes-btn px-6 py-2 flex items-center gap-2 ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isAnalyzing ? (
                    <>
                      <div className="nes-loading"></div>
                      ANALYZING...
                    </>
                  ) : (
                    <>
                      <Search size={14} />
                      ANALYZE
                    </>
                  )}
                </button>
              </div>

              {error && (
                <div className="nes-window bg-nes-red p-3 text-center">
                  <div className="nes-text text-xs text-nes-white">
                    ⚠️ ERROR: {error} ⚠️
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Analysis Progress */}
        {(isAnalyzing || analysisStatus !== "pending") && (
          <div className="analysis-section mb-8">
            <div className="nes-window p-6">
              <AnalysisProgress
                status={analysisStatus}
                progress={progress}
                message={statusMessage}
                estimatedTime={isAnalyzing ? "3-5 MINUTES" : undefined}
              />
            </div>
          </div>
        )}

        {/* Basic Profile Info */}
        {basicInfo && basicInfo.users.length > 0 && (
          <div className="analysis-section mb-8">
            <div className="nes-window p-4 mb-4">
              <div className="flex items-center gap-3 mb-4">
                <User size={16} className="text-nes-blue" />
                <h3 className="nes-title text-sm">DEVELOPER PROFILE</h3>
              </div>
            </div>

            <div className="space-y-6">
              {basicInfo.users.map(user =>
                renderNESUserCard(user, isAnalyzing && !results)
              )}
            </div>
          </div>
        )}

                {/* AI Analysis Results */}
        {results && results.data.users.length > 0 && (
          <div className="analysis-section mb-8">
            {results.data.users.map(user => {
              console.log("🎨 Rendering user:", {
                login: user.login,
                hasAI: !!user.ai,
                aiData: user.ai ? {
                  summary: !!user.ai.summary,
                  skills: user.ai.skills?.length || 0,
                  expertise: user.ai.expertise_areas?.length || 0,
                  web3Score: user.ai.web3_involvement?.score
                } : null
              });

              return user.ai && (
                <div key={`ai-${user.login}`} className="space-y-6">
                  <div className="nes-window p-4">
                    <div className="flex items-center gap-3">
                      <div className="text-lg">🤖</div>
                      <h3 className="nes-title text-sm">AI ANALYSIS RESULTS</h3>
                    </div>
                  </div>

                  <AIProfileDisplay aiProfile={user.ai} />
                </div>
              );
            })}

            {/* Collapsible Debug Info */}
            <div className="nes-window p-6 mt-8">
              <div className="flex items-center justify-between mb-4">
                <div className="nes-subtitle text-xs">RAW API RESPONSE (DEBUG)</div>
                <button
                  onClick={() => setShowDebugData(!showDebugData)}
                  className="nes-btn-secondary px-3 py-1 text-xs flex items-center gap-2"
                >
                  {showDebugData ? '📁 COLLAPSE' : '📂 EXPAND'}
                </button>
              </div>

              {showDebugData && (
                <div className="bg-nes-black border-2 border-nes-gray-medium nes-border-inset p-4 h-64 overflow-auto">
                  <pre className="nes-text text-xs text-nes-green leading-tight">
                    {JSON.stringify(results, null, 2)}
                  </pre>
                </div>
              )}

              {!showDebugData && (
                <div className="bg-nes-gray-dark border-2 border-nes-gray-medium nes-border-inset p-4 text-center">
                  <div className="nes-text text-xs text-nes-gray-light">
                    🔒 DEBUG DATA COLLAPSED - CLICK EXPAND TO VIEW
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8 mb-4">
          <div className="nes-text text-xs text-nes-gray-light">
            🎮 POWERED BY WEB3INSIGHT.AI 🎮
          </div>
        </div>
      </div>
    </div>
  );
}