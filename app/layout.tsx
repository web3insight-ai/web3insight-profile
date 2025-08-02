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
        <style dangerouslySetInnerHTML={{
          __html: `
            /* 12像素 Fusion Pixel Font Variables */
            :root {
              --font-fusion-pixel: "FusionPixel12", "DotGothic16", "Press Start 2P", "SimHei", "Hiragino Sans GB", "Microsoft YaHei", "Source Han Sans SC", "WenQuanYi Micro Hei", monospace;
              --font-pixel: var(--font-fusion-pixel);
              --font-pixel-mono: var(--font-fusion-pixel);
              --font-pixel-large: var(--font-fusion-pixel);
            }
            /* Optimize pixel font rendering */
            * {
              font-synthesis: none;
              text-rendering: optimizeSpeed;
              -webkit-font-feature-settings: normal;
              font-feature-settings: normal;
            }
            /* Ensure CJK and Latin characters render consistently */
            html, body {
              font-variant-ligatures: none;
              font-kerning: none;
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
