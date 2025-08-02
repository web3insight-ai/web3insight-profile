"use client";

import Image from "next/image";
import { MapPin, Calendar, ExternalLink, Twitter } from "lucide-react";
import type { AIProfile } from "@/lib/types";

interface ProfileSummaryProps {
  aiProfile: AIProfile;
  className?: string;
}

export function ProfileSummary({ aiProfile, className = "" }: ProfileSummaryProps) {
  if (!aiProfile.profileCard) return null;

  const { profileCard, highlights } = aiProfile;
  const joinedYear = new Date(profileCard.created_at).getFullYear();
  const yearsOnGitHub = new Date().getFullYear() - joinedYear;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Profile Header */}
      <div className="nes-window p-6 bg-nes-green/20">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-16 h-16 border-4 border-nes-white bg-nes-gray-dark overflow-hidden">
              <Image
                src={profileCard.avatar_url}
                alt={profileCard.name || profileCard.username}
                width={64}
                height={64}
                className="w-full h-full object-cover pixel-perfect"
              />
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="nes-title text-base">{profileCard.name || profileCard.username}</h2>
              <div className="nes-badge-green px-2 py-1">
                <span className="nes-text text-xs">@{profileCard.username}</span>
              </div>
            </div>

            {profileCard.bio && (
              <p className="nes-text text-xs mb-3 chinese-content">
                {profileCard.bio}
              </p>
            )}

            <div className="flex flex-wrap gap-4 text-nes-gray">
              {profileCard.location && (
                <div className="flex items-center gap-1">
                  <MapPin size={12} />
                  <span className="nes-text text-xs">{profileCard.location}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Calendar size={12} />
                <span className="nes-text text-xs">
                  JOINED {joinedYear} ({yearsOnGitHub} YEARS)
                </span>
              </div>
              {profileCard.blog && (
                <div className="flex items-center gap-1">
                  <ExternalLink size={12} />
                  <a
                    href={profileCard.blog}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="nes-text text-xs text-nes-blue hover:text-nes-yellow transition-colors"
                  >
                    BLOG
                  </a>
                </div>
              )}
              {profileCard.twitter && (
                <div className="flex items-center gap-1">
                  <Twitter size={12} />
                  <span className="nes-text text-xs">@{profileCard.twitter}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Highlights */}
      {highlights && highlights.length > 0 && (
        <div className="nes-window p-6">
          <div className="flex items-center gap-3 mb-4 pb-2 border-b-2 border-nes-white">
            <div className="text-lg">🎯</div>
            <h3 className="nes-title text-sm">KEY HIGHLIGHTS</h3>
            <div className="ml-auto">
              <div className="nes-badge-yellow px-2 py-1 text-xs">{highlights.length}</div>
            </div>
          </div>

          <div className="space-y-3">
            {highlights.map((highlight, index) => (
              <div key={index} className="bg-nes-gray-dark border-2 border-nes-gray-medium nes-border-inset p-4">
                <div className="flex items-start gap-3">
                  <div className={`px-2 py-1 text-xs ${
                    index === 0 ? "nes-badge-yellow" :
                    index === 1 ? "nes-badge-blue" :
                    index === 2 ? "nes-badge-green" : "nes-badge"
                  }`}>
                    #{index + 1}
                  </div>
                  <p className="nes-text text-xs leading-relaxed chinese-content flex-1">
                    {highlight}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}