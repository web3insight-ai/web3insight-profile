import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

// Using Inter as fallback while we load pixel fonts
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "🎮 Web3 Insight Profile - NES Style",
  description: "⚡ Analyze GitHub profiles for Web3 ecosystem insights - Nintendo NES Style Interface ⚡",
  keywords: "web3, github, analysis, profile, nintendo, nes, retro, pixel",
  authors: [{ name: "Web3 Insight Team" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=DotGothic16&display=swap"
          rel="stylesheet"
        />
        {/* Preload critical custom fonts */}
        <link
          rel="preload"
          href="https://cdn.jsdelivr.net/gh/TakWolf/fusion-pixel-font@2025.07.30/build/fusion-pixel-12px-proportional-latin.woff2"
          as="font"
          type="font/woff2"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="https://cdn.jsdelivr.net/gh/TakWolf/fusion-pixel-font@2025.07.30/build/fusion-pixel-12px-proportional-zh_hans.woff2"
          as="font"
          type="font/woff2"
          crossOrigin=""
        />
        <style dangerouslySetInnerHTML={{
          __html: `
            /* 12像素 Fusion Pixel Font Variables with improved fallbacks */
            :root {
              --font-fusion-pixel: "FusionPixel12", "DotGothic16", "Press Start 2P", "SF Mono", "Monaco", "Inconsolata", "Roboto Mono", "Consolas", "Courier New", monospace;
              --font-pixel: var(--font-fusion-pixel);
              --font-pixel-mono: var(--font-fusion-pixel);
              --font-pixel-large: var(--font-fusion-pixel);
            }

            /* Font loading optimization */
            @supports (font-display: swap) {
              * {
                font-display: swap;
              }
            }

            /* Optimize pixel font rendering */
            * {
              font-synthesis: none;
              text-rendering: optimizeSpeed;
              -webkit-font-feature-settings: normal;
              font-feature-settings: normal;
            }

            /* Ensure consistent font rendering across browsers */
            html, body {
              font-variant-ligatures: none;
              font-kerning: none;
              -webkit-text-size-adjust: 100%;
              -moz-text-size-adjust: 100%;
              text-size-adjust: 100%;
            }

            /* Fallback font styles for when custom fonts fail to load */
            .font-pixel {
              font-family: var(--font-fusion-pixel);
              font-size: 12px;
              line-height: 1.6;
              letter-spacing: 0.3px;
            }
          `
        }} />
      </head>
      <body
        className={`${inter.variable} font-pixel antialiased bg-nes-black text-nes-white pixel-perfect`}
      >
        <div className="nes-container min-h-screen">
          <Providers>
            {children}
          </Providers>
        </div>
      </body>
    </html>
  );
}
